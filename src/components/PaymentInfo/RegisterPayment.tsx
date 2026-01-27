import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { useState } from "react"

import CheckEnvironment from "@/CheckEnvironment/CheckEnvironment"
import { useSelector } from "react-redux"
import { Button } from "../ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { useLocation } from "react-router"

const formatIndianCurrency = (value: string) => {
    if (!value) return ""
    const numbers = value.replace(/,/g, "")
    return "₹ " + Number(numbers).toLocaleString("en-IN")
}

const extractNumber = (value: string) =>
    Number(value.replace(/[^0-9]/g, ""))


const RegisterPayment = () => {
    const { user } = useSelector(
        (state: {
            auth: {
                isAuthenticated: boolean;
                user: { token: string; _id: string };
            };
        }) => state.auth
    );

    const { base_url } = CheckEnvironment();
    const [amount, setAmount] = useState("")
    const [date, setDate] = useState("")

    const location = useLocation();

    const locationState = location.pathname.split("/")[2]


    const { mutate, isPending } = useMutation({


        mutationFn: async (payload: { Amount: number; date: string; companyBy: string }) => {
            const res = await axios.post(
                `${base_url}/api/payment/create`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${user?.token}`,
                    },
                }
            )
            return res.data
        },
        onSuccess: () => {
            setAmount("")
            setDate("")
            alert("Payment created successfully ✅")
        },
        onError: (error: { response?: { data?: { message?: string } } }) => {
            alert(error?.response?.data?.message || "Something went wrong ❌")
        },
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        mutate({
            Amount: extractNumber(amount),
            date,
            companyBy: locationState,
        })
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Payment</CardTitle>
                <CardDescription>Enter payment details</CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Amount */}
                        <div className="space-y-2">
                            <Label>Amount</Label>
                            <Input
                                className="font-semibold"
                                placeholder="Enter amount"
                                value={amount}
                                onChange={(e) => {
                                    const raw = e.target.value.replace(/[^0-9]/g, "")
                                    setAmount(formatIndianCurrency(raw))
                                }}
                            />
                        </div>

                        {/* Date */}
                        <div className="space-y-2">
                            <Label>Date</Label>
                            <Input
                                type="date"
                                className="font-semibold"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>
                      
                    </div>
                </CardContent>

                <CardFooter>
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="mt-4 rounded-4xl"
                    >
                        {isPending ? "Submitting..." : "Submit Payment"}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}

export default RegisterPayment
