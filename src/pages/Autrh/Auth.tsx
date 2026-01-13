import { useState } from "react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LoginForm from "./LoginForm"
import RegisterForm from "./RegisterForm"
import GhostIcon from "@/components/ui/ghost-icon"

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login")

  return (
    <div className="  flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Branding */}
        <div className="text-center mb-8 mt-10">
          <div className="inline-block bg-primary text-primary-foreground rounded-lg p-2 mb-4">
            <GhostIcon className="size-8" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Welcome</h1>
          <p className="text-muted-foreground mt-2">Secure authentication for your account</p>
        </div>

        {/* Auth Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted">
            <TabsTrigger
              value="login"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Sign In
            </TabsTrigger>
            <TabsTrigger
              value="register"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Sign Up
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-6">
            <LoginForm />
          </TabsContent>

          <TabsContent value="register" className="mt-6">
            <RegisterForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
