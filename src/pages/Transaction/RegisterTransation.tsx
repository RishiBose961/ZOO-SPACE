import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
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
const RegisterTransation = () => {
    return (
        <div> <Card className="w-full">
            <CardHeader>
                <CardTitle>Register Company</CardTitle>
                <CardDescription>
                    Enter company and user details
                </CardDescription>
            </CardHeader>

            <form>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">

                        {/* Company Name */}
                        <div className="space-y-1">
                            <Label>Company Name</Label>
                            <Input
                                className=" uppercase"
                                name="companyname"
                                placeholder="Enter company name"

                                required
                            />
                        </div>

                        {/* Name */}
                        <div className="space-y-1">
                            <Label>Name</Label>
                            <Input
                                name="name"
                                placeholder="Enter full name"

                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <Label>Amount</Label>
                            <Input
                                name="amount"
                                placeholder="Enter full amount"
                                type="number"
                                required
                            />
                        </div>

                        {/* Payment Plan Type */}
                        <div className="space-y-1">
                            <Label>Payment Plan Type</Label>
                            <Select
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a payment plan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Monthly">Monthly</SelectItem>
                                    <SelectItem value="Half-Yearly">Half-Yearly</SelectItem>
                                    <SelectItem value="Yearly">Yearly</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                    </div>
                </CardContent>

                <CardFooter>
                    <Button
                        type="submit"
                        className="w-full mt-5"
                    >
                        Register Company
                    </Button>
                </CardFooter>
            </form>
        </Card></div>
    )
}

export default RegisterTransation