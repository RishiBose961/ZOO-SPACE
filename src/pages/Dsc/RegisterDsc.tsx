/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChevronDownIcon } from "lucide-react"
import React, { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { useSelector } from "react-redux"

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
import CheckEnvironment from "@/CheckEnvironment/CheckEnvironment"

const RegisterDsc = () => {
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState<Date | undefined>(undefined)
  const { base_url } = CheckEnvironment();

  console.log(base_url);
  
  const [formData, setFormData] = useState({
    companyname: "",
    name: "",
    group: "",
  })

  const { user } = useSelector(
    (state: {
      auth: {
        user: { token: string }
      }
    }) => state.auth
  )

  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await fetch(`${base_url}/api/dsc/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data?.message || "Failed to register DSC")
      }

      return data
    },
    onSuccess: () => {
      alert("DSC Registered Successfully ✅")
      setFormData({
        companyname: "",
        name: "",
        group: "",
      })
      setDate(undefined)
    },
    onError: (error: any) => {
      alert(error.message || "Something went wrong ❌")
    },
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const payload = {
      companyname: formData.companyname,
      name: formData.name,
      group: formData.group,
      expirydate: date
        ? date.toLocaleDateString("en-IN").replaceAll("/", "-")
        : null,
    }

    mutation.mutate(payload)
  }

  return (
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

            {/* Company Name */}
            <div className="space-y-1">
              <Label>Company Name</Label>
              <Input
              className=" uppercase"
                name="companyname"
                placeholder="Enter company name"
                value={formData.companyname}
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
                required
              />
            </div>

            {/* Expiry Date */}
            <div className="space-y-1">
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
                value={formData.group}
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
          <Button
            type="submit"
            className="w-full mt-5"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Registering..." : "Register"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

export default RegisterDsc
