import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./ui/table";
import { Search } from "lucide-react";
import { mockActivityLogs } from "../data/mockData";

export function ActivityLogsManagement() {
    const [logs] = useState(mockActivityLogs);
    const [searchQuery, setSearchQuery] = useState("");
    const [userTypeFilter, setUserTypeFilter] = useState("");
    const [tableFilter, setTableFilter] = useState("");

    const userTypes = ["Staff", "Member", "System"];
    const tables = ["Users", "Books", "Loans", "Payments", "Members"];

    const filteredLogs = logs.filter((log) => {
        const matchesSearch =
            log.UserName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.Action.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.Description.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesUserType =
            !userTypeFilter || log.UserType === userTypeFilter;

        const matchesTable = !tableFilter || log.Table === tableFilter;

        return matchesSearch && matchesUserType && matchesTable;
    });

    const getUserTypeColor = (userType) => {
        switch (userType) {
            case "Staff":
                return "bg-purple-100 text-purple-700 hover:bg-purple-200";
            case "Member":
                return "bg-blue-100 text-blue-700 hover:bg-blue-200";
            case "System":
                return "bg-gray-100 text-gray-700 hover:bg-gray-200";
            default:
                return "bg-gray-100 text-gray-700 hover:bg-gray-200";
        }
    };

    const getActionColor = (action) => {
        if (action.includes("CREATE") || action.includes("ADD")) {
            return "bg-green-100 text-green-700 hover:bg-green-200";
        } else if (action.includes("DELETE") || action.includes("REMOVE")) {
            return "bg-red-100 text-red-700 hover:bg-red-200";
        } else if (action.includes("UPDATE") || action.includes("EDIT")) {
            return "bg-amber-100 text-amber-700 hover:bg-amber-200";
        }
        return "bg-blue-100 text-blue-700 hover:bg-blue-200";
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold">Activity Logs</h1>
                <p className="text-gray-500">Track all system activities</p>
            </div>

            <Card>
                <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                        {/* Search */}
                        <div className="relative w-1/3">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                            <Input
                                placeholder="Search logs..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-8"
                            />
                        </div>

                        {/* User type filter */}
                        <Select
                            value={userTypeFilter}
                            onValueChange={setUserTypeFilter}
                        >
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="User Type" />
                            </SelectTrigger>
                            <SelectContent>
                                {userTypes.map((type) => (
                                    <SelectItem key={type} value={type}>
                                        {type}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Table filter */}
                        <Select
                            value={tableFilter}
                            onValueChange={setTableFilter}
                        >
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Table" />
                            </SelectTrigger>
                            <SelectContent>
                                {tables.map((table) => (
                                    <SelectItem key={table} value={table}>
                                        {table}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-4">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Log ID</TableHead>
                                    <TableHead>User Type</TableHead>
                                    <TableHead>User Name</TableHead>
                                    <TableHead>Action</TableHead>
                                    <TableHead>Table</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>IP Address</TableHead>
                                    <TableHead>Created At</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {filteredLogs.map((log) => (
                                    <TableRow key={log.LogId}>
                                        <TableCell>#{log.LogId}</TableCell>

                                        <TableCell>
                                            <Badge
                                                className={getUserTypeColor(
                                                    log.UserType
                                                )}
                                            >
                                                {log.UserType}
                                            </Badge>
                                        </TableCell>

                                        <TableCell>{log.UserName}</TableCell>

                                        <TableCell>
                                            <Badge
                                                className={getActionColor(
                                                    log.Action
                                                )}
                                            >
                                                {log.Action}
                                            </Badge>
                                        </TableCell>

                                        <TableCell>{log.Table}</TableCell>
                                        <TableCell>{log.Description}</TableCell>
                                        <TableCell>{log.IpAddress}</TableCell>

                                        <TableCell>
                                            {new Date(
                                                log.CreatedAt
                                            ).toLocaleString()}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
