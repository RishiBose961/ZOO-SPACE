import { ChevronDownIcon } from "lucide-react"
import React, { useState } from "react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
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

const RegisterDsc = () => {
  const [formData, setFormData] = useState({
    company: "",
    name: "",
    expiry: null,
    group: "",
  })
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(undefined)


  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()

    const payload = {
      ...formData,
      expiry: date?.toLocaleDateString("en-IN").replaceAll("/", "-")
    }

    console.log("Registered Data:", payload)
  }

  return (
    <div>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Register DSC</CardTitle>
          <CardDescription>
            Enter company and user details
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">

              {/* Company */}
              <div className="space-y-1">
                <Label>Company Name</Label>
                <Input
                  name="company"
                  placeholder="Enter company name"
                  value={formData.company}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Name */}
              <div className="space-y-1">
                <Label>Name</Label>
                <Input
                  name="name"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              {/* Expiry Date */}
              <div className="space-y-1">
                <Label>Expiry Date</Label>

                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      id="date"
                      className="w-full justify-between font-normal"
                    >
                      {date ? date.toLocaleDateString() : "Select date"}
                      <ChevronDownIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      captionLayout="dropdown"
                      onSelect={(date) => {
                        setDate(date)
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
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, group: value }))
                  }
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

            </div>
          </CardContent>

          <CardFooter>
            <Button type="submit" className="w-full mt-4">
              Register
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default RegisterDsc
