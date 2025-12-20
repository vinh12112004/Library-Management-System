import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
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
import { Search, DollarSign, CheckCircle } from "lucide-react";
import { mockFines } from "../data/mockData";

export function FinesManagement() {
    const [fines, setFines] = useState(mockFines);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [typeFilter, setTypeFilter] = useState("All");

    const statuses = ["All", "Unpaid", "Paid", "Waived"];
    const types = ["All", "Late Return", "Lost Book", "Damage"];

    const filteredFines = fines.filter((fine) => {
        const matchesSearch =
            fine.MemberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            String(fine.FineId).includes(searchQuery);

        const matchesStatus =
            statusFilter === "All" || fine.Status === statusFilter;

        const matchesType = typeFilter === "All" || fine.Type === typeFilter;

        return matchesSearch && matchesStatus && matchesType;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case "Unpaid":
                return "bg-red-100 text-red-700 hover:bg-red-200";
            case "Paid":
                return "bg-green-100 text-green-700 hover:bg-green-200";
            case "Waived":
                return "bg-gray-100 text-gray-700 hover:bg-gray-200";
            default:
                return "bg-gray-100 text-gray-700 hover:bg-gray-200";
        }
    };

    const handleMarkAsPaid = (id) => {
        setFines(
            fines.map((fine) =>
                fine.FineId === id
                    ? {
                          ...fine,
                          PaidDate: new Date().toISOString().split("T")[0],
                          Status: "Paid",
                      }
                    : fine
            )
        );
    };

    const totalUnpaid = fines
        .filter((f) => f.Status === "Unpaid")
        .reduce((sum, f) => sum + f.Amount, 0);

    return (
        <div className="space-y-6 p-4">
            <div>
                <h1 className="text-2xl font-bold">Fines Management</h1>
                <p className="text-gray-600">
                    Manage fines, payments, and waivers
                </p>
            </div>

            {/* Summary Card */}
            <Card>
                <CardContent className="p-4 flex items-center justify-between">
                    <div>
                        <p className="text-gray-500">Total Unpaid</p>
                        <p className="text-2xl font-bold">${totalUnpaid}</p>
                    </div>
                    <DollarSign className="h-10 w-10 text-green-600" />
                </CardContent>
            </Card>

            {/* Filters */}
            <Card>
                <CardContent className="p-4 flex items-center space-x-4">
                    <div className="relative w-1/3">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                            placeholder="Search fines..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <Select
                        value={statusFilter}
                        onValueChange={setStatusFilter}
                    >
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            {statuses.map((status) => (
                                <SelectItem key={status} value={status}>
                                    {status}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                            {types.map((type) => (
                                <SelectItem key={type} value={type}>
                                    {type}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>

            {/* Table */}
            <Card>
                <CardContent className="p-4">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Fine ID</TableHead>
                                <TableHead>Member</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Issue Date</TableHead>
                                <TableHead>Paid Date</TableHead>
                                <TableHead>Issued By</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {filteredFines.map((fine) => (
                                <TableRow key={fine.FineId}>
                                    <TableCell>#{fine.FineId}</TableCell>
                                    <TableCell className="font-medium">
                                        {fine.MemberName}
                                    </TableCell>
                                    <TableCell>
                                        <Badge>{fine.Type}</Badge>
                                    </TableCell>
                                    <TableCell>${fine.Amount}</TableCell>
                                    <TableCell>{fine.IssueDate}</TableCell>
                                    <TableCell>
                                        {fine.PaidDate ?? "—"}
                                    </TableCell>
                                    <TableCell>{fine.IssuedBy}</TableCell>

                                    <TableCell>
                                        <Badge
                                            className={getStatusColor(
                                                fine.Status
                                            )}
                                        >
                                            {fine.Status}
                                        </Badge>
                                    </TableCell>

                                    <TableCell className="text-right">
                                        {fine.Status === "Unpaid" && (
                                            <Button
                                                onClick={() =>
                                                    handleMarkAsPaid(
                                                        fine.FineId
                                                    )
                                                }
                                                size="sm"
                                                className="flex items-center space-x-2"
                                            >
                                                <CheckCircle className="h-4 w-4" />
                                                Mark Paid
                                            </Button>
                                        )}
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
