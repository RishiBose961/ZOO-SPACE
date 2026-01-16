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
const UpdateDsc = () => {
    const [open, setOpen] = useState(false)
    const [date, setDate] = useState<Date | undefined>(undefined)

    return (
        <div className="space-y-3 bg-card p-2 rounded-2xl">
            <div className="space-y-3">
                <p className=" font-bold mt-4">Update</p>
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
                <Select
                >
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
            <Button className="rounded-full">Update</Button>
        </div>
    )
}

export default UpdateDsc