import type { FC, ReactNode } from "react";
import UseGetIdDsc from "@/components/hook/DscHook/UseGetIdDsc";
import { Building2, Calendar, User, Users } from "lucide-react"; // Optional icons for polish
import type { LucideIcon } from "lucide-react";
import { useParams } from "react-router";
import TakenCreate from "../Taken/TakenCreate";
import UpdateReturn from "../UpdateReturn/UpdateReturn";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

/**
 * Component to get a DSC by its id and display details with action forms.
 * Supports Dark/Light mode and responsive design.
 */
const GetDscById = () => {
    const { id } = useParams();
    const { isPending, getIdDsc, refetch, isFetching } = UseGetIdDsc(id) as {
        isPending: boolean;
        getIdDsc: {
            dsc: {
                _id: string;
                companyname: string;
                group: string;
                name: string;
                expirydate: string;
            };
        };
        refetch: () => void;
        isFetching: boolean;
    }

    // Helper to render detail items
    type DetailItemProps = {
        icon?: LucideIcon;
        label: string;
        value?: ReactNode;
    };

    const DetailItem: FC<DetailItemProps> = ({ icon: Icon, label, value }) => (
        <div className="flex flex-col space-y-1 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 text-sm font-medium">
                {Icon && <Icon size={16} />}
                <span>{label}</span>
            </div>
            <div className="text-gray-900 dark:text-white font-semibold text-lg truncate">
                {value || "N/A"}
            </div>
        </div>
    );

    return (
        <div className="  p-3 transition-colors duration-300">
            <div className="space-y-8">

                {/* Header Section */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        DSC Management
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                        View details and manage records for ID: {id}
                    </p>
                </div>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => refetch()}
                    disabled={isFetching}
                >
                    {isFetching ? <div className=" flex items-center gap-2"><Spinner/> Loading </div>: "Reload"}
                </Button>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="border-b border-gray-200 dark:border-gray-700 p-5 bg-gray-50/50 dark:bg-gray-800/50">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                            Certificate Details
                        </h2>
                    </div>

                    <div className="p-6">
                        {isPending ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <DetailItem
                                    icon={Building2}
                                    label="Company Name"
                                    value={getIdDsc?.dsc?.companyname}
                                />
                                <DetailItem
                                    icon={User}
                                    label="Holder Name"
                                    value={getIdDsc?.dsc?.name}
                                />
                                <DetailItem
                                    icon={Calendar}
                                    label="Expiry Date"
                                    value={getIdDsc?.dsc?.expirydate}
                                />
                                <DetailItem
                                    icon={Users}
                                    label="Group"
                                    value={getIdDsc?.dsc?.group}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Actions Section */}
                {!isPending && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Wrapper for TakenCreate */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">
                                Record Taken
                            </h3>
                            <TakenCreate dscid={id} />
                        </div>

                        {/* Wrapper for UpdateReturn */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">
                                Update Return
                            </h3>
                            <UpdateReturn dscid={id} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GetDscById;