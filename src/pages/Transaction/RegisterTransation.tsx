import CheckEnvironment from "@/CheckEnvironment/CheckEnvironment"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { Trash } from "lucide-react"
import { useState } from "react"
import { Helmet } from "react-helmet"
import { useSelector } from "react-redux"

type Transaction = {
    companyName: string
    name: string
    paymentPlanType: string
    dueDate: string
}

const emptyTransaction: Transaction = {
    companyName: "",
    name: "",
    paymentPlanType: "",
    dueDate: "",
}

const RegisterTransation = () => {
    const { user, isAuthenticated } = useSelector(
        (state: {
            auth: {
                isAuthenticated: boolean
                user: { token: string; _id: string }
            }
        }) => state.auth
    )

    const { base_url } = CheckEnvironment()

    const [transactions, setTransactions] = useState<Transaction[]>([
        { ...emptyTransaction },
    ])

    const { mutate, isPending } = useMutation({
        mutationFn: async () => {
            const { data } = await axios.post(
                `${base_url}/api/transaction/create`,
                { transactions },
                {
                    headers: {
                        Authorization: `Bearer ${user?.token}`,
                        "Content-Type": "application/json",
                    },
                }
            )
            return data
        },
        onSuccess: () => {
            alert("Transactions created successfully ✅")
            setTransactions([{ ...emptyTransaction }])
        },
        onError: (error: {
            response?: { data?: { message?: string } }
        }) => {
            alert(error?.response?.data?.message || "Something went wrong ❌")
        },
    })

    const handleChange = (
        index: number,
        field: keyof Transaction,
        value: string
    ) => {
        const updated = [...transactions]
        updated[index][field] = value
        setTransactions(updated)
    }

    const addTransaction = () => {
        setTransactions([...transactions, { ...emptyTransaction }])
    }

    const removeTransaction = (index: number) => {
        if (transactions.length === 1) return
        setTransactions(transactions.filter((_, i) => i !== index))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!isAuthenticated) {
            alert("Please login first ❌")
            return
        }

        mutate()
    }

    return (
        <div>
            <Helmet>
                <meta charSet="utf-8" />
                <title>ZOO SPACE | Company Transaction</title>
            </Helmet>

            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Company Transactions</CardTitle>
                    <CardDescription>
                        Add multiple company transactions
                    </CardDescription>
                </CardHeader>

                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-6">
                        {transactions.map((tx, index) => (
                            <div
                                key={index}
                                className="grid grid-cols-2 gap-4 border p-4 rounded-lg relative"
                            >
                                {transactions.length > 1 && (
                                    <Button
                                        variant="ghost"
                                        onClick={() =>
                                            removeTransaction(index)
                                        }
                                        className="absolute rounded-full right-2 text-red-500"
                                    >
                                        <Trash />
                                    </Button>
                                )}

                                <div className="space-y-1">
                                    <Label>Company Name</Label>
                                    <Input
                                        className="uppercase"
                                         placeholder="Enter your Company Name"
                                        value={tx.companyName}
                                        onChange={(e) =>
                                            handleChange(
                                                index,
                                                "companyName",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                </div>

                                <div className="space-y-1">
                                    <Label>Name</Label>
                                    <Input
                                        value={tx.name}
                                        placeholder="Enter your Name"
                                        onChange={(e) =>
                                            handleChange(
                                                index,
                                                "name",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                </div>

                                <div className="space-y-1">
                                    <Label>Payment Plan</Label>
                                    <Select
                                        value={tx.paymentPlanType}
                                        onValueChange={(value) =>
                                            handleChange(
                                                index,
                                                "paymentPlanType",
                                                value
                                            )
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select plan" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="monthly">
                                                Monthly
                                            </SelectItem>
                                            <SelectItem value="half-yearly">
                                                Half-Yearly
                                            </SelectItem>
                                            <SelectItem value="yearly">
                                                Yearly
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-1">
                                    <Label>Due Date</Label>
                                    <Input
                                        type="date"
                                        value={tx.dueDate}
                                        onChange={(e) =>
                                            handleChange(
                                                index,
                                                "dueDate",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                </div>
                            </div>
                        ))}
                        <div className="flex justify-center space-x-5">
                            {
                                transactions.length === 5 ? null : (<Button
                                    type="button"
                                    className="rounded-2xl cursor-pointer"
                                    variant="ghost"
                                    onClick={addTransaction}
                                >
                                    ➕ Add Another Company
                                </Button>)
                            }
                            <Button
                                type="submit"
                                className="rounded-2xl cursor-pointer"
                                disabled={isPending}
                            >
                                {isPending
                                    ? "Submitting..."
                                    : `Register ${transactions.length} Companies`}
                            </Button>
                        </div>


                    </CardContent>



                </form>
            </Card>
        </div>
    )
}

export default RegisterTransation
