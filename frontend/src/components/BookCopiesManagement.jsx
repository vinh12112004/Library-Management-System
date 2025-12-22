import { useState, useEffect } from "react";
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
import { Search, Plus, Edit, Trash2 } from "lucide-react";

import {
    getBookCopies,
    createBookCopy,
    updateBookCopy,
    deleteBookCopy,
} from "../services/bookCopyService";

export function BookCopiesManagement() {
    const [copies, setCopies] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCopy, setEditingCopy] = useState(null);

    const [formData, setFormData] = useState({
        bookId: "",
        barcode: "",
        status: 0,
        location: "",
        acquisitionDate: "",
        price: "",
        conditionNote: "",
    });

    const statusMap = {
        0: "Available",
        1: "Borrowed",
        2: "Maintenance",
        3: "Lost",
        4: "Damaged",
    };

    const statuses = [
        { value: 0, label: "Available" },
        { value: 1, label: "Borrowed" },
        { value: 2, label: "Maintenance" },
        { value: 3, label: "Lost" },
        { value: 4, label: "Damaged" },
    ];

    // Load data from API
    useEffect(() => {
        loadBookCopies();
    }, []);

    const loadBookCopies = async () => {
        try {
            const data = await getBookCopies();
            setCopies(data);
        } catch (error) {
            console.error("Error fetching book copies:", error);
        }
    };

    const filteredCopies = copies.filter((copy) => {
        const matchesSearch =
            copy.barcode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            copy.location?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus =
            statusFilter === "all" || copy.status === parseInt(statusFilter);

        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 0:
                return "bg-green-100 text-green-700";
            case 1:
                return "bg-amber-100 text-amber-700";
            case 2:
                return "bg-blue-100 text-blue-700";
            case 3:
                return "bg-red-100 text-red-700";
            case 4:
                return "bg-orange-100 text-orange-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const openAddDialog = () => {
        setFormData({
            bookId: "",
            barcode: "",
            status: 0,
            location: "",
            acquisitionDate: new Date().toISOString().split("T")[0],
            price: "",
            conditionNote: "",
        });
        setEditingCopy(null);
        setIsDialogOpen(true);
    };

    const openEditDialog = (copy) => {
        setFormData({
            bookId: copy.bookId,
            barcode: copy.barcode || "",
            status: copy.status,
            location: copy.location || "",
            acquisitionDate: copy.acquisitionDate
                ? new Date(copy.acquisitionDate).toISOString().split("T")[0]
                : "",
            price: copy.price || "",
            conditionNote: copy.conditionNote || "",
        });
        setEditingCopy(copy);
        setIsDialogOpen(true);
    };

    const handleSave = async () => {
        try {
            const payload = {
                bookId: parseInt(formData.bookId),
                barcode: formData.barcode,
                status: parseInt(formData.status),
                location: formData.location,
                acquisitionDate: formData.acquisitionDate || null,
                price: formData.price ? parseFloat(formData.price) : null,
                conditionNote: formData.conditionNote,
            };

            if (editingCopy) {
                // UPDATE
                await updateBookCopy(editingCopy.copyId, payload);
                await loadBookCopies();
            } else {
                // CREATE
                await createBookCopy(payload);
                await loadBookCopies();
            }

            setIsDialogOpen(false);
            setEditingCopy(null);
        } catch (error) {
            console.error("Error saving book copy:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteBookCopy(id);
            setCopies(copies.filter((c) => c.copyId !== id));
        } catch (error) {
            console.error("Error deleting book copy:", error);
        }
    };

    const handleStatusChange = async (copyId, newStatus) => {
        try {
            const copy = copies.find((c) => c.copyId === copyId);
            if (copy) {
                await updateBookCopy(copyId, {
                    ...copy,
                    status: parseInt(newStatus),
                });
                setCopies(
                    copies.map((c) =>
                        c.copyId === copyId
                            ? { ...c, status: parseInt(newStatus) }
                            : c
                    )
                );
            }
        } catch (error) {
            console.error("Error updating status:", error);
        }
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
                <Button onClick={openAddDialog}>
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
                                placeholder="Search by barcode or location…"
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
                                <SelectItem value="all">
                                    All Statuses
                                </SelectItem>
                                {statuses.map((status) => (
                                    <SelectItem
                                        key={status.value}
                                        value={status.value.toString()}
                                    >
                                        {status.label}
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
                                    <TableHead>Book ID</TableHead>
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
                                    <TableRow key={copy.copyId}>
                                        <TableCell>#{copy.copyId}</TableCell>
                                        <TableCell>#{copy.bookId}</TableCell>
                                        <TableCell>{copy.barcode}</TableCell>

                                        <TableCell>
                                            <Badge
                                                className={getStatusColor(
                                                    copy.status
                                                )}
                                            >
                                                {statusMap[copy.status]}
                                            </Badge>
                                        </TableCell>

                                        <TableCell>{copy.location}</TableCell>

                                        <TableCell>
                                            {copy.acquisitionDate
                                                ? new Date(
                                                      copy.acquisitionDate
                                                  ).toLocaleDateString()
                                                : "N/A"}
                                        </TableCell>

                                        <TableCell>
                                            ${copy.price?.toFixed(2) || "0.00"}
                                        </TableCell>

                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() =>
                                                        openEditDialog(copy)
                                                    }
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>

                                                <Button
                                                    variant="destructive"
                                                    size="icon"
                                                    onClick={() =>
                                                        handleDelete(
                                                            copy.copyId
                                                        )
                                                    }
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>

                                                <Select
                                                    value={copy.status.toString()}
                                                    onValueChange={(value) =>
                                                        handleStatusChange(
                                                            copy.copyId,
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
                                                                key={s.value}
                                                                value={s.value.toString()}
                                                            >
                                                                {s.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Add/Edit Dialog */}
            <Dialog
                open={isDialogOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        setIsDialogOpen(false);
                        setEditingCopy(null);
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editingCopy
                                ? "Edit Book Copy"
                                : "Add New Book Copy"}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                        <div>
                            <Label>Book ID</Label>
                            <Input
                                type="number"
                                value={formData.bookId}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        bookId: e.target.value,
                                    })
                                }
                                placeholder="Book ID"
                            />
                        </div>

                        <div>
                            <Label>Barcode</Label>
                            <Input
                                value={formData.barcode}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        barcode: e.target.value,
                                    })
                                }
                                placeholder="Barcode"
                            />
                        </div>

                        <div>
                            <Label>Status</Label>
                            <Select
                                value={formData.status.toString()}
                                onValueChange={(value) =>
                                    setFormData({
                                        ...formData,
                                        status: parseInt(value),
                                    })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {statuses.map((s) => (
                                        <SelectItem
                                            key={s.value}
                                            value={s.value.toString()}
                                        >
                                            {s.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label>Location</Label>
                            <Input
                                value={formData.location}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        location: e.target.value,
                                    })
                                }
                                placeholder="Location"
                            />
                        </div>

                        <div>
                            <Label>Acquisition Date</Label>
                            <Input
                                type="date"
                                value={formData.acquisitionDate}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        acquisitionDate: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div>
                            <Label>Price</Label>
                            <Input
                                type="number"
                                step="0.01"
                                value={formData.price}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        price: e.target.value,
                                    })
                                }
                                placeholder="Price"
                            />
                        </div>

                        <div className="col-span-2">
                            <Label>Condition Note</Label>
                            <Textarea
                                rows={3}
                                value={formData.conditionNote}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        conditionNote: e.target.value,
                                    })
                                }
                                placeholder="Condition notes..."
                            />
                        </div>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsDialogOpen(false);
                                setEditingCopy(null);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleSave}>
                            {editingCopy ? "Save Changes" : "Add Copy"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
