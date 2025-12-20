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
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./ui/table";
import { Search, Plus } from "lucide-react";
import { mockBookCopies, mockBooks } from "../data/mockData";

export function BookCopiesManagement() {
    const [copies, setCopies] = useState(mockBookCopies);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    const [formData, setFormData] = useState({
        BookId: "",
        Barcode: "",
        Location: "",
        Price: "",
        Notes: "",
    });

    const statuses = [
        "Available",
        "Borrowed",
        "Maintenance",
        "Lost",
        "Damaged",
    ];

    const filteredCopies = copies.filter((copy) => {
        const matchesSearch =
            copy.BookTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            copy.Barcode.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus =
            statusFilter === "" || copy.Status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case "Available":
                return "bg-green-100 text-green-700";
            case "Borrowed":
                return "bg-amber-100 text-amber-700";
            case "Maintenance":
                return "bg-blue-100 text-blue-700";
            case "Lost":
                return "bg-red-100 text-red-700";
            case "Damaged":
                return "bg-orange-100 text-orange-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const handleStatusChange = (copyId, newStatus) => {
        setCopies(
            copies.map((copy) =>
                copy.CopyId === copyId ? { ...copy, Status: newStatus } : copy
            )
        );
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Book Copies</h1>
                    <p className="text-gray-500 text-sm">
                        Manage library copy records
                    </p>
                </div>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Copy
                </Button>
            </div>

            {/* Search + Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex gap-4 items-center">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                placeholder="Search by title or barcode…"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <Select
                            value={statusFilter}
                            onValueChange={setStatusFilter}
                        >
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                {statuses.map((status) => (
                                    <SelectItem key={status} value={status}>
                                        {status}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Table */}
            <Card>
                <CardContent className="p-4">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Copy ID</TableHead>
                                    <TableHead>Book Title</TableHead>
                                    <TableHead>Barcode</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Acquisition Date</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead className="text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {filteredCopies.map((copy) => (
                                    <TableRow key={copy.CopyId}>
                                        <TableCell>#{copy.CopyId}</TableCell>

                                        <TableCell className="font-medium">
                                            {copy.BookTitle}
                                        </TableCell>

                                        <TableCell>{copy.Barcode}</TableCell>

                                        <TableCell>
                                            <Badge
                                                className={getStatusColor(
                                                    copy.Status
                                                )}
                                            >
                                                {copy.Status}
                                            </Badge>
                                        </TableCell>

                                        <TableCell>{copy.Location}</TableCell>

                                        <TableCell>
                                            {new Date(
                                                copy.AcquisitionDate
                                            ).toLocaleDateString()}
                                        </TableCell>

                                        <TableCell>${copy.Price}</TableCell>

                                        <TableCell className="text-right">
                                            <Select
                                                value={copy.Status}
                                                onValueChange={(value) =>
                                                    handleStatusChange(
                                                        copy.CopyId,
                                                        value
                                                    )
                                                }
                                            >
                                                <SelectTrigger className="w-32">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {statuses.map((s) => (
                                                        <SelectItem
                                                            key={s}
                                                            value={s}
                                                        >
                                                            {s}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
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
