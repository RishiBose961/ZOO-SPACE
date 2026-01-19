import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ChevronDownIcon } from "lucide-react"
import { useState } from "react"
import axios from "axios"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useSelector } from "react-redux"
import CheckEnvironment from "@/CheckEnvironment/CheckEnvironment"

const UpdateDsc = ({ dscid }: { dscid: string | undefined }) => {
    const queryClient = useQueryClient()

    const { user } = useSelector(
        (state: {
            auth: {
                isAuthenticated: boolean;
                user: { token: string; _id: string };
            };
        }) => state.auth
    );

    const { base_url } = CheckEnvironment();

    const [open, setOpen] = useState(false)
    const [date, setDate] = useState<Date | undefined>(undefined)
    const [group, setGroup] = useState<string>("")

    const updateMutation = useMutation({
        mutationFn: async () => {
            const res = await axios.patch(
                `${base_url}/api/dsc/update/${dscid}`,
                {
                    group,
                    expirydate: date
                        ? date.toLocaleDateString("en-IN").replaceAll("/", "-")
                        : null,
                },
                {
                    headers: {
                        Authorization: `Bearer ${user?.token}`,
                        "Content-Type": "application/json",
                    },
                }
            )
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] })
        },
    })

    const handleUpdate = () => {
        updateMutation.mutate()
    }

    return (
        <div className="space-y-3 bg-card p-3 rounded-2xl">
            <div className="space-y-3">
                <p className="font-bold mt-2">Update DSC</p>
                <hr/>

                {/* Expiry Date */}
                <Label>Expiry Date</Label>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className="w-full justify-between font-normal"
                        >
                            {date ? date.toLocaleDateString() : "Select date"}
                            <ChevronDownIcon />
                        </Button>
                    </PopoverTrigger>

                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={date}
                            captionLayout="dropdown"
                            onSelect={(d) => {
                                setDate(d)
                                setOpen(false)
                            }}
                            fromYear={2018}
                            toYear={new Date().getFullYear() + 11}
                        />
                    </PopoverContent>
                </Popover>
            </div>

            {/* Group */}
            <div className="space-y-1">
                <Label>Group</Label>
                <Select value={group} onValueChange={setGroup}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select group" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="A">Group A</SelectItem>
                        <SelectItem value="B">Group B</SelectItem>
                        <SelectItem value="C">Group C</SelectItem>
                        <SelectItem value="D">Group D</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Button
                className="rounded-full w-full"
                onClick={handleUpdate}
                disabled={updateMutation.isPending}
            >
                {updateMutation.isPending ? "Updating..." : "Update"}
            </Button>
        </div>
    )
}

export default UpdateDsc
