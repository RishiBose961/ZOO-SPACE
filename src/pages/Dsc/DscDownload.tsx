import CheckEnvironment from "@/CheckEnvironment/CheckEnvironment";
import UseCountHook from "@/components/hook/DscHook/UseCountHook";
import Example from "@/components/spinner-inline-4";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Calendar1, Download, FileSpreadsheet, Hash, Layers, Loader2 } from "lucide-react";
import { useState } from "react";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import type { JSX } from "react/jsx-runtime";

export default function DscDownload() {
    const [group, setGroup] = useState("");
    const [mode, setMode] = useState<"all" | "range">("all");
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");

    const companyName = "ZOO SPACE";
    const reportTitle = "DSC Download Report";

    const { user } = useSelector(
        (state: {
            auth: {
                isAuthenticated: boolean;
                user: { token: string; _id: string };
            };
        }) => state.auth
    );

    const { base_url } = CheckEnvironment();

    const { isPending, getCountData } = UseCountHook() as {
        isPending: boolean;
        getCountData: {
            map(arg0: (item: {
                group: string;
                count: number;
            }, index: number) => JSX.Element): import("react").ReactNode;
            all: number;
            group: number;
            range: number;
        }
    }


    const { refetch, isFetching } = useQuery({
        queryKey: ["dsc-pdf-download"],
        enabled: false,
        queryFn: async () => {
            const params: { group?: string; all?: boolean; from?: string; to?: string } = {};
            if (group) params.group = group;
            if (mode === "all") params.all = true;
            if (mode === "range" && from && to) {
                params.from = from;
                params.to = to;
            }

            const res = await axios.get(`${base_url}/api/dsc/dsc/download`, {
                params,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            });

            return res.data.data;
        },
    });



    const handleDownload = async () => {
        try {
            const result = await refetch();

            const rows = result.data;

            if (!rows || rows.length === 0) {
                alert("No data found for the selected criteria.");
                return;
            }

            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.width;

            doc.setFontSize(18);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(33, 37, 41); // Dark Gray
            doc.text(companyName, pageWidth / 2, 15, { align: "center" });

            // 2. Report Title
            doc.setFontSize(12);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(108, 117, 125); // Light Gray
            doc.text(reportTitle.toUpperCase(), pageWidth / 2, 22, { align: "center" });

            // 3. Metadata Line (Date & Filters)
            doc.setFontSize(9);
            const dateStr = `Generated: ${new Date().toLocaleDateString()}  |  Group Filter: ${group || "None"}`;
            doc.text(dateStr, pageWidth / 2, 29, { align: "center" });

            // 4. Divider Line
            doc.setDrawColor(220, 220, 220);
            doc.line(14, 34, pageWidth - 14, 34);

            const tableColumn = ["SNo", "Company Name", "Name", "Group", "expirydate", "Created At"];
            const tableRows = rows.map((item: {
                companyname: string;
                name: string;
                group: string;
                expirydate: string;
                createdAt: string;
            }, index: number) => [
                    index + 1.,
                    item.companyname || "-",
                    item.name || "-",
                    item.group || "-",
                    item.expirydate.replace(/-/g, "/") || "-",
                    item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "-",
                ]);

            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: 40,
                theme: "grid",
                headStyles: {
                    fillColor: [248, 249, 250],
                    textColor: [33, 37, 41],
                    fontStyle: "bold",
                    lineWidth: 0.1,
                    lineColor: [220, 220, 220]
                },
                bodyStyles: {
                    textColor: [50, 50, 50],
                },
                alternateRowStyles: {
                    fillColor: [255, 255, 255],
                },
                styles: {
                    fontSize: 10,
                    cellPadding: 4,
                    valign: "middle",
                    lineWidth: 0.1,
                    lineColor: [230, 230, 230]
                },
                columnStyles: {
                    0: { cellWidth: 15, halign: "center" },
                    3: { cellWidth: 40, halign: "right" },
                },
                // Footer: Page Numbers
                didDrawPage: function () {
                    doc.setFontSize(8);
                    doc.setTextColor(150);
                    const pageStr = "Page " + doc.getNumberOfPages();
                    doc.text(pageStr, pageWidth - 20, doc.internal.pageSize.height - 10);
                }
            });

            doc.save(`DSC_Report_${new Date().toISOString().slice(0, 10)}.pdf`);

        } catch (error) {
            console.error("Download failed", error);
            alert("Failed to download PDF");
        }
    };

    if (isPending) return <div className="flex justify-center mt-5"><Example data="Report Export" /></div>;
    return (
        <>
            <div className="flex items-center justify-center p-6 font-sans">
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>ZOO SPACE | Report Export</title>
                </Helmet>
                <div className="w-full max-w-lg bg-card rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

                    {/* Light Theme Header */}
                    <div className="px-8 pt-8 pb-4">
                        <div className="flex items-start justify-between">
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight">Report Export</h2>
                                <p className=" mt-1 text-sm">Download your DSC data as PDF</p>
                            </div>
                            <div className="p-3 bg-blue-50 rounded-xl">
                                <FileSpreadsheet className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    {/* Form Body */}
                    <div className="p-8 pt-2 space-y-6">

                        {/* Group Input */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold  uppercase tracking-wide flex items-center gap-2">
                                <Layers className="w-3.5 h-3.5" />
                                Filter by Group
                            </label>
                            <Select
                                value={group}
                                onValueChange={(val) => {
                                    if (val === "all") {
                                        setGroup("");
                                    } else {
                                        setGroup(val);
                                    }
                                }}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Group (optional)" />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    <SelectItem value="A">A</SelectItem>
                                    <SelectItem value="B">B</SelectItem>
                                    <SelectItem value="C">C</SelectItem>
                                </SelectContent>
                            </Select>

                            <label className="text-xs pt-3 font-semibold  uppercase tracking-wide flex items-center gap-2">
                                <Calendar1 className="w-3.5 h-3.5" />
                                Filter by Date Range
                            </label>
                            <div className="p-1.5  rounded-xl flex items-center border border-gray-100">
                                <button
                                    onClick={() => setMode("all")}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg
                     transition-all duration-200 ${mode === "all"
                                            ? " shadow-sm border border-gray-200/50"
                                            : " hover:text-red-400"
                                        }`}
                                >
                                    All Records
                                </button>
                                <button
                                    onClick={() => setMode("range")}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${mode === "range"
                                        ? "bg-white text-gray-900 shadow-sm border border-gray-200/50"
                                        : " hover:text-red-400"
                                        }`}
                                >
                                    Custom Range
                                </button>
                            </div>
                        </div>

                        {mode === "range" && (
                            <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-1 duration-200">
                                <div className="space-y-1.5">
                                    <label className="text-xs  font-medium ml-1">From ID</label>
                                    <div className="relative">
                                        <Hash className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                        <input
                                            type="number"
                                            placeholder="0"
                                            className="w-full pl-9 pr-4 py-2.5 text-black bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                                            value={from}
                                            onChange={(e) => setFrom(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs  font-medium ml-1">To ID</label>
                                    <div className="relative">
                                        <Hash className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                        <input
                                            type="number"
                                            placeholder="100"
                                            className="w-full pl-9 pr-4 py-2.5 text-black bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                                            value={to}
                                            onChange={(e) => setTo(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Download Button */}
                        <div className="pt-2">
                            <button
                                onClick={handleDownload}
                                disabled={isFetching}
                                className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold transition-all duration-200 shadow-sm ${isFetching
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-gray-900 text-white hover:bg-black hover:shadow-md active:transform active:scale-[0.99]'
                                    }`}
                            >
                                {isFetching ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Processing...</span>
                                    </>
                                ) : (
                                    <>
                                        <Download className="w-4 h-4" />
                                        <span>Download PDF</span>
                                    </>
                                )}
                            </button>
                        </div>


                    </div>

                </div>

            </div>
          <div className="p-6 ">
    {/* Grid Layout: 1 column on mobile, up to 4 on large screens */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {getCountData?.map((item :{
            group: string;
            count: number;
        }, index: number) => (
            <div 
                key={index} 
                className="bg-card p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
            >
          
                <h3 className="text-sm font-medium  uppercase tracking-wider mb-2">
                    BOX : {item.group}
                </h3>
                
                {/* Value */}
                <div className="flex items-baseline">
                    <span className="text-3xl font-bold ">
                        {item.count}
                    </span>
                    <span className="ml-2 text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                        DSC
                    </span>
                </div>
            </div>
        ))}
    </div>
</div>
        </>
    );
}