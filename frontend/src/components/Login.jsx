import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { BookOpen, User, UserCog } from "lucide-react";

export function Login({ onLogin }) {
    const [staffEmail, setStaffEmail] = useState("");
    const [staffPassword, setStaffPassword] = useState("");
    const [memberEmail, setMemberEmail] = useState("");
    const [memberPassword, setMemberPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);

    const handleStaffSubmit = (e) => {
        e.preventDefault();
        if (staffEmail && staffPassword) {
            onLogin("Staff");
        }
    };

    const handleMemberSubmit = (e) => {
        e.preventDefault();
        if (memberEmail && memberPassword) {
            onLogin("Member");
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
                    <Tabs defaultValue="staff" className="w-full">
                        <TabsList className="grid grid-cols-2 mb-4">
                            <TabsTrigger value="staff">
                                <UserCog className="h-4 w-4 mr-2" />
                                Staff Login
                            </TabsTrigger>
                            <TabsTrigger value="member">
                                <User className="h-4 w-4 mr-2" />
                                Member Login
                            </TabsTrigger>
                        </TabsList>

                        {/* Staff Login */}
                        <TabsContent value="staff">
                            <form
                                onSubmit={handleStaffSubmit}
                                className="space-y-4"
                            >
                                <div className="space-y-1">
                                    <Label htmlFor="staffEmail">Email</Label>
                                    <Input
                                        id="staffEmail"
                                        type="email"
                                        placeholder="staff@example.com"
                                        value={staffEmail}
                                        onChange={(e) =>
                                            setStaffEmail(e.target.value)
                                        }
                                        required
                                    />
                                </div>

                                <div className="space-y-1">
                                    <Label htmlFor="staffPassword">
                                        Password
                                    </Label>
                                    <Input
                                        id="staffPassword"
                                        type="password"
                                        placeholder="••••••••"
                                        value={staffPassword}
                                        onChange={(e) =>
                                            setStaffPassword(e.target.value)
                                        }
                                        required
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="rememberStaff"
                                        checked={rememberMe}
                                        onCheckedChange={setRememberMe}
                                    />
                                    <label
                                        htmlFor="rememberStaff"
                                        className="text-sm"
                                    >
                                        Remember me
                                    </label>
                                </div>

                                <Button type="submit" className="w-full">
                                    Sign In
                                </Button>
                            </form>
                        </TabsContent>

                        {/* Member Login */}
                        <TabsContent value="member">
                            <form
                                onSubmit={handleMemberSubmit}
                                className="space-y-4"
                            >
                                <div className="space-y-1">
                                    <Label htmlFor="memberEmail">Email</Label>
                                    <Input
                                        id="memberEmail"
                                        type="email"
                                        placeholder="member@example.com"
                                        value={memberEmail}
                                        onChange={(e) =>
                                            setMemberEmail(e.target.value)
                                        }
                                        required
                                    />
                                </div>

                                <div className="space-y-1">
                                    <Label htmlFor="memberPassword">
                                        Password
                                    </Label>
                                    <Input
                                        id="memberPassword"
                                        type="password"
                                        placeholder="••••••••"
                                        value={memberPassword}
                                        onChange={(e) =>
                                            setMemberPassword(e.target.value)
                                        }
                                        required
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="rememberMember"
                                        checked={rememberMe}
                                        onCheckedChange={setRememberMe}
                                    />
                                    <label
                                        htmlFor="rememberMember"
                                        className="text-sm"
                                    >
                                        Remember me
                                    </label>
                                </div>

                                <Button type="submit" className="w-full">
                                    Sign In
                                </Button>
                            </form>
                        </TabsContent>
                    </Tabs>

                    <div className="mt-6 text-center">
                        <button className="text-blue-600 hover:underline text-sm">
                            Forgot Password?
                        </button>
                        <p className="text-gray-400 text-xs mt-1">Demo</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
