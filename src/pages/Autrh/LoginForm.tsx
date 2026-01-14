
import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch } from "@/store"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { loadUser, loginUserAction } from "@/slice/authSlice"
import { Navigate } from "react-router"
import CheckEnvironment from "@/CheckEnvironment/CheckEnvironment"
export default function LoginForm() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
  const [error, setError] = useState("");

  const { base_url } = CheckEnvironment();
  // const { base_url } = CheckEnvironment();

  const dispatch = useDispatch<AppDispatch>();

  const { isAuthenticated, isLoading } = useSelector(
    (state: { auth: { isAuthenticated: boolean; isLoading: boolean } }) =>
      state.auth
  );

  const loginMutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const response = await axios.post(`${base_url}/api/users/login`, {
        email,
        password,
      });
      dispatch(loginUserAction(response.data));
      return response.data; // Return response data
    },
    onSuccess: () => {
      alert("Login successful!");
    },
    onError: (error: { response: { data: string } }) => {
      console.error(error?.response.data);
      setError(error?.response.data);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    // Basic validation
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    loginMutation.mutate({ email, password });
  };

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    return isAuthenticated ? (
      <Navigate to={`/`} replace />
    ) : (
      <Navigate to="/" replace />
    );
  }

    return (
        <Card className="p-6 border-border bg-card">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground font-medium">
                        Email Address
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-background border-input text-foreground placeholder:text-muted-foreground"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password" className="text-foreground font-medium">
                        Password
                    </Label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="bg-background border-input text-foreground placeholder:text-muted-foreground"
                    />
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Button
                    type="submit"
                    disabled={loginMutation.isPending}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                >
                    {loginMutation.isPending ? "Signing in..." : "Sign In"}
                </Button>
            </form>



        </Card>
    )
}
