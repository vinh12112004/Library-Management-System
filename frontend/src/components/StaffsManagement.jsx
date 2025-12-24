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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./ui/table";
import { Search, Plus, Eye, UserCog, Edit, Trash2 } from "lucide-react";

import { getStaffs, updateStaff, deleteStaff } from "../services/staffService";
import { registerStaff } from "../services/authService";

export function StaffsManagement({ onNavigate }) {
    const [staffs, setStaffs] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState(null);

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        role: 0,
        isActive: true,
    });

    const [addFormData, setAddFormData] = useState({
        staffCode: "",
        fullName: "",
        email: "",
        password: "",
        phone: "",
        role: 1,
    });

    // Role mapping - support both string and number
    const roleMap = {
        0: "Admin",
        1: "Librarian",
        2: "Assistant",
        Admin: "Admin",
        Librarian: "Librarian",
        Assistant: "Assistant",
    };

    const roleStringToNumber = {
        Admin: 0,
        Librarian: 1,
        Assistant: 2,
    };

    const roles = [
        { value: 0, label: "Admin" },
        { value: 1, label: "Librarian" },
        { value: 2, label: "Assistant" },
    ];

    // Load data from API
    useEffect(() => {
        loadStaffs();
    }, []);

    const loadStaffs = async () => {
        try {
            const data = await getStaffs();
            // Convert string role to number if needed
            const normalizedData = data.map((staff) => ({
                ...staff,
                roleNumber:
                    typeof staff.role === "string"
                        ? roleStringToNumber[staff.role]
                        : staff.role,
                roleString:
                    typeof staff.role === "string"
                        ? staff.role
                        : roleMap[staff.role],
            }));
            setStaffs(normalizedData);
        } catch (error) {
            console.error("Error fetching staffs:", error);
        }
    };

    const filteredStaffs = staffs.filter((staff) => {
        const matchesSearch =
            staff.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            staff.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            staff.staffCode?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesRole =
            roleFilter === "all" || staff.roleNumber === parseInt(roleFilter);

        const matchesStatus =
            statusFilter === "all" ||
            staff.isActive === (statusFilter === "true");

        return matchesSearch && matchesRole && matchesStatus;
    });

    const getRoleColor = (role) => {
        // Handle both number and string
        const roleNum =
            typeof role === "string" ? roleStringToNumber[role] : role;
        switch (roleNum) {
            case 0: // Admin
                return "bg-purple-100 text-purple-700";
            case 1: // Librarian
                return "bg-blue-100 text-blue-700";
            case 2: // Assistant
                return "bg-green-100 text-green-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const getStatusColor = (isActive) => {
        return isActive
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700";
    };

    const openAddDialog = () => {
        setAddFormData({
            staffCode: "",
            fullName: "",
            email: "",
            password: "",
            phone: "",
            role: 1,
        });
        setIsAddDialogOpen(true);
    };

    const openEditDialog = (staff) => {
        setFormData({
            fullName: staff.fullName || "",
            email: staff.email || "",
            phone: staff.phone || "",
            role: staff.roleNumber,
            isActive: staff.isActive,
        });
        setEditingStaff(staff);
        setIsDialogOpen(true);
    };

    const handleAdd = async () => {
        try {
            await registerStaff(addFormData);
            await loadStaffs();
            setIsAddDialogOpen(false);
        } catch (error) {
            console.error("Error registering staff:", error);
            alert(error.response?.data || "Failed to register staff");
        }
    };

    const handleSave = async () => {
        try {
            const payload = {
                fullName: formData.fullName,
                phone: formData.phone || null,
                position: null,
                role: parseInt(formData.role),
                isActive: formData.isActive,
            };

            await updateStaff(editingStaff.staffId, payload);
            await loadStaffs();
            setIsDialogOpen(false);
            setEditingStaff(null);
        } catch (error) {
            console.error("Error updating staff:", error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this staff?")) {
            return;
        }

        try {
            await deleteStaff(id);
            setStaffs(staffs.filter((s) => s.staffId !== id));
        } catch (error) {
            console.error("Error deleting staff:", error);
        }
    };

    return (
        <div className="space-y-6 p-4">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Staffs Management</h1>
                    <p className="text-gray-600 mt-1">
                        Manage library staff members
                    </p>
                </div>
                <Button
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={openAddDialog}
                >
                    <Plus className="h-4 w-4" />
                    Add Staff
                </Button>
            </div>

            {/* Search & Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex gap-4 items-center">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                placeholder="Search by name, email, or code..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <Select
                            value={roleFilter}
                            onValueChange={setRoleFilter}
                        >
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Filter by role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Roles</SelectItem>
                                {roles.map((role) => (
                                    <SelectItem
                                        key={role.value}
                                        value={role.value.toString()}
                                    >
                                        {role.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select
                            value={statusFilter}
                            onValueChange={setStatusFilter}
                        >
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="true">Active</SelectItem>
                                <SelectItem value="false">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Staffs Table */}
            <Card>
                <CardContent className="p-4">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Staff Code</TableHead>
                                <TableHead>Full Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredStaffs.map((staff) => (
                                <TableRow key={staff.staffId}>
                                    <TableCell>{staff.staffCode}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <UserCog className="h-5 w-5 text-gray-500" />
                                            <span>{staff.fullName}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{staff.email}</TableCell>
                                    <TableCell>
                                        {staff.phone || "N/A"}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            className={getRoleColor(staff.role)}
                                        >
                                            {staff.roleString}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            className={getStatusColor(
                                                staff.isActive
                                            )}
                                        >
                                            {staff.isActive
                                                ? "Active"
                                                : "Inactive"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    onNavigate(
                                                        "staff-detail",
                                                        staff.staffId
                                                    )
                                                }
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>

                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    openEditDialog(staff)
                                                }
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>

                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                onClick={() =>
                                                    handleDelete(staff.staffId)
                                                }
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Add Staff Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Add New Staff</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 pt-2">
                        <div>
                            <Label>Staff Code *</Label>
                            <Input
                                value={addFormData.staffCode}
                                onChange={(e) =>
                                    setAddFormData({
                                        ...addFormData,
                                        staffCode: e.target.value,
                                    })
                                }
                                placeholder="Staff code"
                                required
                                maxLength={20}
                            />
                        </div>

                        <div>
                            <Label>Full Name *</Label>
                            <Input
                                value={addFormData.fullName}
                                onChange={(e) =>
                                    setAddFormData({
                                        ...addFormData,
                                        fullName: e.target.value,
                                    })
                                }
                                placeholder="Full name"
                                required
                                maxLength={255}
                            />
                        </div>

                        <div>
                            <Label>Email *</Label>
                            <Input
                                type="email"
                                value={addFormData.email}
                                onChange={(e) =>
                                    setAddFormData({
                                        ...addFormData,
                                        email: e.target.value,
                                    })
                                }
                                placeholder="Email"
                                required
                                maxLength={100}
                            />
                        </div>

                        <div>
                            <Label>Phone</Label>
                            <Input
                                value={addFormData.phone}
                                onChange={(e) =>
                                    setAddFormData({
                                        ...addFormData,
                                        phone: e.target.value,
                                    })
                                }
                                placeholder="Phone number (optional)"
                                maxLength={20}
                            />
                        </div>

                        <div>
                            <Label>Role *</Label>
                            <Select
                                value={addFormData.role.toString()}
                                onValueChange={(value) =>
                                    setAddFormData({
                                        ...addFormData,
                                        role: parseInt(value),
                                    })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {roles.map((r) => (
                                        <SelectItem
                                            key={r.value}
                                            value={r.value.toString()}
                                        >
                                            {r.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label>Password *</Label>
                            <Input
                                type="password"
                                value={addFormData.password}
                                onChange={(e) =>
                                    setAddFormData({
                                        ...addFormData,
                                        password: e.target.value,
                                    })
                                }
                                placeholder="Minimum 6 characters"
                                required
                                minLength={6}
                            />
                        </div>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button
                            variant="outline"
                            onClick={() => setIsAddDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleAdd}>Register Staff</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog
                open={isDialogOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        setIsDialogOpen(false);
                        setEditingStaff(null);
                    }
                }}
            >
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit Staff</DialogTitle>
                    </DialogHeader>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                        <div>
                            <Label>Full Name</Label>
                            <Input
                                value={formData.fullName}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        fullName: e.target.value,
                                    })
                                }
                                placeholder="Full name"
                            />
                        </div>

                        <div>
                            <Label>Email (Read-only)</Label>
                            <Input
                                type="email"
                                value={formData.email}
                                disabled
                                className="bg-gray-100"
                            />
                        </div>

                        <div>
                            <Label>Phone</Label>
                            <Input
                                value={formData.phone}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        phone: e.target.value,
                                    })
                                }
                                placeholder="Phone"
                            />
                        </div>

                        <div>
                            <Label>Role</Label>
                            <Select
                                value={formData.role.toString()}
                                onValueChange={(value) =>
                                    setFormData({
                                        ...formData,
                                        role: parseInt(value),
                                    })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {roles.map((r) => (
                                        <SelectItem
                                            key={r.value}
                                            value={r.value.toString()}
                                        >
                                            {r.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label>Status</Label>
                            <Select
                                value={formData.isActive.toString()}
                                onValueChange={(value) =>
                                    setFormData({
                                        ...formData,
                                        isActive: value === "true",
                                    })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="true">Active</SelectItem>
                                    <SelectItem value="false">
                                        Inactive
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsDialogOpen(false);
                                setEditingStaff(null);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleSave}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
