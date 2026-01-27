import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import axios from "axios"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useSelector } from "react-redux"
import CheckEnvironment from "@/CheckEnvironment/CheckEnvironment"
import { Badge } from "@/components/ui/badge"
import Example from "@/components/spinner-inline-4"
import { Link } from "react-router"


type Transaction = {
    _id: string
    companyName: string
    name: string
    paymentPlanType: string
    updatedAt: Date
    fineAmount?: number
}

type ApiResponse = {
    data: Transaction[]
    pagination: {
        total: number
        page: number
        limit: number
        totalPages: number
    }
}



const fetchTransactions = async (page: number, limit: number, token: string, base_url: string) => {
    const res = await axios.get<ApiResponse>(
        `${base_url}/api/transaction/get?page=${page}&limit=${limit}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    )
    return res.data
}

const ViewTransaction = () => {
    const { user, isAuthenticated } = useSelector(
        (state: {
            auth: {
                isAuthenticated: boolean;
                user: { token: string; _id: string };
            };
        }) => state.auth
    );

    const { base_url } = CheckEnvironment();
    const [page, setPage] = useState(1)
    const limit = 10

    const { data, isLoading, isError, isFetching } = useQuery({
        queryKey: ["transactions", page],
        queryFn: () => fetchTransactions(page, limit, user?.token, base_url),
        placeholderData: keepPreviousData,
        enabled: isAuthenticated,
    })

    if (isLoading) return <div className="flex justify-center items-center">
        <Example data="Transactions" />
    </div>
    if (isError) return <p>Failed to load transactions</p>


    return (
        <>
            <Table>
                <TableCaption>A list of your recent transactions.</TableCaption>

                <TableHeader>
                    <TableRow>
                        <TableHead className="text-center">Sno</TableHead>
                        <TableHead className="text-center">Company Name</TableHead>
                        <TableHead className="text-center">Name</TableHead>
                        <TableHead className="text-center">Payment Plan</TableHead>
                        <TableHead className="text-center">Updated At</TableHead>
                        <TableHead className="text-center">Fine</TableHead>
                        <TableHead className="text-center">Action</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {data?.data.map((tx, index) => (
                        <TableRow key={tx._id}>
                            <TableCell className="font-medium text-center">{index + 1}.</TableCell>
                            <TableCell className="font-medium text-center">
                                {tx.companyName}
                            </TableCell>
                            <TableCell className="text-center">{tx.name}</TableCell>
                            <TableCell className=" capitalize text-center">
                                <Badge>{tx.paymentPlanType}</Badge>
                            </TableCell>
                            <TableCell className="text-center">
                                {tx.updatedAt.toString().slice(0, 10)}
                            </TableCell>
                            <TableCell className="text-center">
                                ₹ {tx.fineAmount?.toLocaleString("en-IN") || 0}
                            </TableCell>
                            <TableCell className="font-medium text-center ">
                                <Link to={`/company-transaction/${tx._id}`}>
                                    <Button className="cursor-pointer" variant="link" size="sm">
                                        View Details
                                    </Button>
                                </Link>

                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex items-center justify-end gap-2 mt-4">
                <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 1 || isFetching}
                    onClick={() => setPage((p) => p - 1)}
                >
                    Previous
                </Button>

                <span className="text-sm">
                    Page {data?.pagination.page} of {data?.pagination.totalPages}
                </span>

                <Button
                    variant="outline"
                    size="sm"
                    disabled={
                        page === data?.pagination.totalPages || isFetching
                    }
                    onClick={() => setPage((p) => p + 1)}
                >
                    Next
                </Button>
            </div>
        </>
    )
}

export default ViewTransaction
