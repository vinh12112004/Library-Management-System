import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { BookOpen } from "lucide-react";
import { login, decodeToken } from "../services/authService";
import { useAuth } from "../context/AuthContext";

export function Login() {
    const navigate = useNavigate();
    const { isAuthenticated, refresh } = useAuth();

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate("/dashboard", { replace: true });
        }
    }, [isAuthenticated, navigate]);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const response = await login({ email, password });

            // Decode token to get user role
            const decoded = decodeToken(response.token);

            if (!decoded) {
                setError("Invalid token received");
                setIsLoading(false);
                return;
            }

            // Store token if remember me is checked
            if (rememberMe) {
                localStorage.setItem("token", response.token);
                localStorage.setItem("expiresAt", response.expiresAt);
            } else {
                sessionStorage.setItem("token", response.token);
                sessionStorage.setItem("expiresAt", response.expiresAt);
            }

            // Trigger AuthContext refresh
            refresh();
            
            // Small delay to ensure context is updated
            setTimeout(() => {
                navigate("/dashboard", { replace: true });
            }, 100);
        } catch (error) {
            console.error("Login error:", error);
            setError(
                error.response?.data?.message ||
                    error.response?.data ||
                    "Invalid email or password"
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="text-center pb-2">
                    <div className="flex justify-center mb-2">
                        <div className="p-3 bg-blue-100 rounded-full">
                            <BookOpen className="h-8 w-8 text-blue-600" />
                        </div>
                    </div>
                    <div>
                        <CardTitle className="text-2xl font-bold">
                            Library System
                        </CardTitle>
                        <p className="text-gray-500 text-sm">
                            Sign in to continue
                        </p>
                    </div>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                                <p className="text-red-600 text-sm">{error}</p>
                            </div>
                        )}

                        <div className="space-y-1">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="your@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="remember"
                                checked={rememberMe}
                                onCheckedChange={setRememberMe}
                                disabled={isLoading}
                            />
                            <label htmlFor="remember" className="text-sm">
                                Remember me
                            </label>
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? "Signing in..." : "Sign In"}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <button className="text-blue-600 hover:underline text-sm">
                            Forgot Password?
                        </button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
