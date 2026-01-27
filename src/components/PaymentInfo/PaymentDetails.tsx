import CheckEnvironment from "@/CheckEnvironment/CheckEnvironment"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Trash2 } from "lucide-react"
import { useState } from "react"
import { useSelector } from "react-redux"
import { useLocation } from "react-router"
import ExampleUnderstand from "./ExampleUnderstand"
import UpdateDetails from "./UpdateDetails"

const PaymentDetails = () => {
    const location = useLocation();
    const { user } = useSelector(
        (state: {
            auth: {
                isAuthenticated: boolean;
                user: { token: string; _id: string };
            };
        }) => state.auth
    );

    const { base_url } = CheckEnvironment();
    const locationState = location.pathname.split("/")[2]
    const [page, setPage] = useState(1)
    const limit = 5

    const fetchPayments = async () => {
        const { data } = await axios.get(
            `${base_url}/api/payment/get/${locationState}?page=${page}&limit=${limit}`,
            {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                },
            }
        )
        return data
    }

    const { data, isLoading, isError } = useQuery({
        queryKey: ["payments", locationState, page],
        queryFn: fetchPayments,
        placeholderData: keepPreviousData
    })

    if (isLoading) return <p className="text-center">Loading payments...</p>
    if (isError) return <p className="text-center text-red-500">Failed to load payments</p>

    const payments = data?.data || []
    const pagination = data?.pagination

    return (
        <div className="space-y-4">
            <ExampleUnderstand />
            <Table>
                <TableCaption>A list of your recent payments.</TableCaption>

                <TableHeader>
                    <TableRow>
                        <TableHead className="text-center">Status</TableHead>
                        <TableHead className="text-center">Due Date</TableHead>
                        <TableHead className="text-center">Amount</TableHead>
                        <TableHead className="text-center">Fine Taken</TableHead>
                        <TableHead className="text-center">Days Late</TableHead>
                        <TableHead className="text-center">Fine Calculated</TableHead>
                        <TableHead className="text-center">Final Amount</TableHead>
                        <TableHead className="text-center">Action</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {payments.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center">
                                No payments found
                            </TableCell>
                        </TableRow>
                    ) : (
                        payments.map((payment: {
                            _id: string;
                            paid: boolean;
                            dueDate: string;
                            Amount: number;
                            daysLate: number;
                            fineCalculated: number;
                            finalAmount: number;
                            fine: number;
                        }) => (
                            <TableRow key={payment._id}>


                                <TableCell className="text-center">
                                    {payment.paid ? (
                                        <span className="text-green-600 font-semibold">Paid</span>
                                    ) : (
                                        <span className="text-red-600 font-semibold">Unpaid</span>
                                    )}
                                </TableCell>

                                <TableCell className="text-center">
                                    {payment.dueDate
                                        ? new Date(payment.dueDate).toLocaleDateString()
                                        : "—"}
                                </TableCell>
                                <TableCell className="font-medium text-center">
                                    ₹ {Number(payment.Amount).toLocaleString("en-IN")}
                                </TableCell>
                                <TableCell className="text-center">
                                    ₹ {Number(payment.fine).toLocaleString("en-IN")}
                                </TableCell>
                                <TableCell className="text-center">
                                    {payment.daysLate > 0 ? payment.daysLate : "0"}
                                </TableCell>
                                <TableCell className="text-center">
                                    ₹{Number(payment.fineCalculated).toLocaleString("en-IN")}
                                </TableCell>


                                <TableCell className="text-center">
                                    ₹{Number(payment.finalAmount).toLocaleString("en-IN")}
                                </TableCell>
                                <TableCell className="text-center flex gap-2 justify-center">

                                    <Button>
                                        Pay
                                    </Button>
                                    <UpdateDetails />
                                    <Button variant="outline" className="text-red-600">
                                        <Trash2 />
                                    </Button>

                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            {/* Pagination */}
            {pagination && (
                <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                        Page {pagination.currentPage} of {pagination.totalPages}
                    </p>

                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page === 1}
                            onClick={() => setPage((p) => p - 1)}
                        >
                            Previous
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page === pagination.totalPages}
                            onClick={() => setPage((p) => p + 1)}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default PaymentDetails
