import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./ui/table";
import { Search, Plus, User } from "lucide-react";
import { mockStaff } from "../data/mockData";

export function StaffManagement() {
    const [staff] = useState(mockStaff);
    const [searchQuery, setSearchQuery] = useState("");

    // Filter staff based on the search query
    const filteredStaff = staff.filter(
        (s) =>
            s.FullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.Email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.StaffCode.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getRoleColor = (role) => {
        switch (role) {
            case "Admin":
                return "bg-red-100 text-red-700 hover:bg-red-200";
            case "Manager":
                return "bg-purple-100 text-purple-700 hover:bg-purple-200";
            case "Librarian":
                return "bg-blue-100 text-blue-700 hover:bg-blue-200";
            case "Assistant":
                return "bg-green-100 text-green-700 hover:bg-green-200";
            default:
                return "bg-gray-100 text-gray-700 hover:bg-gray-200";
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Staff Management</h1>
                    <p className="text-gray-600 mt-1">
                        Manage library staff members and their roles
                    </p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Staff
                </Button>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            placeholder="Search by name, email, or staff code..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Staff Code</TableHead>
                                <TableHead>Full Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Hire Date</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredStaff.map((s) => (
                                <TableRow key={s.StaffId}>
                                    <TableCell className="font-mono text-sm">
                                        {s.StaffCode}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                <User className="h-4 w-4 text-blue-600" />
                                            </div>
                                            <span className="font-medium">
                                                {s.FullName}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-gray-600">
                                        {s.Email}
                                    </TableCell>
                                    <TableCell className="text-gray-600">
                                        {s.Phone}
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={getRoleColor(s.Role)}>
                                            {s.Role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-gray-600">
                                        {s.HireDate}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                s.IsActive
                                                    ? "default"
                                                    : "secondary"
                                            }
                                        >
                                            {s.IsActive ? "Active" : "Inactive"}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
