/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from "@tanstack/react-query"
import axios, { AxiosError } from "axios"
import type React from "react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface RegisterPayload {
  fullName: string
  email: string
  password: string
}

export default function RegisterForm() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string>("")

  const registerMutation = useMutation({
    mutationFn: async ({ fullName, email, password }: RegisterPayload) => {
      const res = await axios.post(
        `http://localhost:5000/api/users/signup`,
        {
          name: fullName,
          email,
          password,
        }
      )
      return res.data
    },
    onSuccess: () => {
      setError("")
      alert("Registration successful!")
 
      setFullName("")
      setEmail("")
      setPassword("")
    },
    onError: (err: AxiosError<any>) => {
      const message =
        err.response?.data?.msg ||
        err.response?.data ||
        "Something went wrong"
      setError(message)
    },
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")

    if (!fullName || !email || !password) {
      setError("Please fill in all fields")
      return
    }

    registerMutation.mutate({ fullName, email, password })
  }

  return (
    <Card className="p-6 border-border bg-card">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullname">Full Name</Label>
          <Input
            id="fullname"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="John Doe"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button
          type="submit"
          disabled={registerMutation.isPending}
          className="w-full"
        >
          {registerMutation.isPending ? "Creating account..." : "Create Account"}
        </Button>
      </form>
    </Card>
  )
}
