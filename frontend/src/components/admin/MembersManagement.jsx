import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "../ui/dialog";
import { Label } from "../ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";
import { Search, Plus, Eye, User, Edit, Trash2, KeyRound } from "lucide-react";

import {
    getMembers,
    updateMember,
    deleteMember,
} from "../../services/memberService";
import {
    registerMember,
    resetPasswordMember,
} from "../../services/authService";

export function MembersManagement() {
    const navigate = useNavigate();
    const [members, setMembers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [membershipFilter, setMembershipFilter] = useState("all");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [editingMember, setEditingMember] = useState(null);

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        dateOfBirth: "",
        idCard: "",
        membershipType: 0,
        expiryDate: "",
        status: 0,
    });

    const [addFormData, setAddFormData] = useState({
        memberCode: "",
        fullName: "",
        email: "",
        phone: "",
        address: "",
        dateOfBirth: "",
        idCard: "",
        password: "",
    });

    // Status mapping - support both string and number
    const statusMap = {
        0: "Active",
        1: "Suspended",
        2: "Expired",
        Active: "Active",
        Suspended: "Suspended",
        Expired: "Expired",
    };

    const statusStringToNumber = {
        Active: 0,
        Suspended: 1,
        Expired: 2,
    };

    const membershipMap = {
        0: "Student",
        1: "Teacher",
        2: "Community",
        Student: "Student",
        Teacher: "Teacher",
        Community: "Community",
    };

    const membershipStringToNumber = {
        Student: 0,
        Teacher: 1,
        Community: 2,
    };

    const statuses = [
        { value: 0, label: "Active" },
        { value: 1, label: "Suspended" },
        { value: 2, label: "Expired" },
    ];

    const memberships = [
        { value: 0, label: "Student" },
        { value: 1, label: "Teacher" },
        { value: 2, label: "Community" },
    ];

    // Load data from API
    useEffect(() => {
        loadMembers();
    }, []);

    const loadMembers = async () => {
        try {
            const data = await getMembers();
            // Normalize data - convert string to number and add both formats
            const normalizedData = data.map((member) => ({
                ...member,
                statusNumber:
                    typeof member.status === "string"
                        ? statusStringToNumber[member.status]
                        : member.status,
                statusString:
                    typeof member.status === "string"
                        ? member.status
                        : statusMap[member.status],
                membershipTypeNumber:
                    typeof member.membershipType === "string"
                        ? membershipStringToNumber[member.membershipType]
                        : member.membershipType,
                membershipTypeString:
                    typeof member.membershipType === "string"
                        ? member.membershipType
                        : membershipMap[member.membershipType],
            }));
            setMembers(normalizedData);
        } catch (error) {
            console.error("Error fetching members:", error);
        }
    };

    const filteredMembers = members.filter((member) => {
        const matchesSearch =
            member.fullName
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            member.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.memberCode
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase());

        const matchesStatus =
            statusFilter === "all" ||
            member.statusNumber === parseInt(statusFilter);

        const matchesMembership =
            membershipFilter === "all" ||
            member.membershipTypeNumber === parseInt(membershipFilter);

        return matchesSearch && matchesStatus && matchesMembership;
    });

    const getStatusColor = (status) => {
        // Handle both number and string
        const statusNum =
            typeof status === "string" ? statusStringToNumber[status] : status;
        switch (statusNum) {
            case 0:
                return "bg-green-100 text-green-700";
            case 1:
                return "bg-red-100 text-red-700";
            case 2:
                return "bg-gray-100 text-gray-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const getMembershipColor = (type) => {
        // Handle both number and string
        const typeNum =
            typeof type === "string" ? membershipStringToNumber[type] : type;
        switch (typeNum) {
            case 0: // Student
                return "bg-blue-100 text-blue-700";
            case 1: // Teacher
                return "bg-purple-100 text-purple-700";
            case 2: // Community
                return "bg-gray-100 text-gray-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const convertDateToISO = (dateStr) => {
        if (!dateStr) return "";
        const [day, month, year] = dateStr.split("-");
        return `${year}-${month}-${day}`;
    };

    const openAddDialog = () => {
        setAddFormData({
            memberCode: "",
            fullName: "",
            email: "",
            phone: "",
            address: "",
            dateOfBirth: "",
            idCard: "",
            password: "",
        });
        setIsAddDialogOpen(true);
    };

    const openEditDialog = (member) => {
        setFormData({
            fullName: member.fullName || "",
            email: member.email || "",
            phone: member.phone || "",
            address: member.address || "",
            dateOfBirth: convertDateToISO(member.dateOfBirth) || "",
            idCard: member.idCard || "",
            membershipType: member.membershipTypeNumber,
            expiryDate: member.expiryDate
                ? new Date(member.expiryDate).toISOString().split("T")[0]
                : "",
            status: member.statusNumber,
        });
        setEditingMember(member);
        setIsDialogOpen(true);
    };

    const handleAdd = async () => {
        try {
            await registerMember(addFormData);
            await loadMembers();
            setIsAddDialogOpen(false);
        } catch (error) {
            console.error("Error registering member:", error);
            alert(error.response?.data || "Failed to register member");
        }
    };

    const handleSave = async () => {
        try {
            const payload = {
                fullName: formData.fullName,
                email: formData.email || null,
                phone: formData.phone || null,
                address: formData.address || null,
                dateOfBirth: formData.dateOfBirth || null,
                idCard: formData.idCard || null,
                membershipType: parseInt(formData.membershipType),
                expiryDate: formData.expiryDate || null,
                status: parseInt(formData.status),
            };

            await updateMember(editingMember.memberId, payload);
            await loadMembers();
            setIsDialogOpen(false);
            setEditingMember(null);
        } catch (error) {
            console.error("Error updating member:", error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this member?")) {
            return;
        }

        try {
            await deleteMember(id);
            setMembers(members.filter((m) => m.memberId !== id));
        } catch (error) {
            console.error("Error deleting member:", error);
        }
    };

    const handleResetPassword = async (memberId, memberName) => {
        if (
            !window.confirm(
                `Bạn có chắc muốn reset mật khẩu của ${memberName}? Mật khẩu mới sẽ là: 123123`
            )
        ) {
            return;
        }

        try {
            await resetPasswordMember(memberId);
            alert(
                `Đặt lại mật khẩu thành công cho ${memberName}. Mật khẩu mới: 123123`
            );
        } catch (error) {
            console.error("Error resetting password:", error);
            alert(
                "Lỗi khi đặt lại mật khẩu: " +
                    (error.response?.data || error.message)
            );
        }
    };

    return (
        <div className="space-y-6 p-4">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Members Management</h1>
                    <p className="text-gray-600 mt-1">Manage library members</p>
                </div>
                <Button
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={openAddDialog}
                >
                    <Plus className="h-4 w-4" />
                    Add Member
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
                            value={statusFilter}
                            onValueChange={setStatusFilter}
                        >
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
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

                        <Select
                            value={membershipFilter}
                            onValueChange={setMembershipFilter}
                        >
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Filter by membership" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    All Membership
                                </SelectItem>
                                {memberships.map((type) => (
                                    <SelectItem
                                        key={type.value}
                                        value={type.value.toString()}
                                    >
                                        {type.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Members Table */}
            <Card>
                <CardContent className="p-4">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Member Code</TableHead>
                                <TableHead>Full Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Membership Type</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredMembers.map((member) => (
                                <TableRow key={member.memberId}>
                                    <TableCell>{member.memberCode}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <User className="h-5 w-5 text-gray-500" />
                                            <span>{member.fullName}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {member.email || "N/A"}
                                    </TableCell>
                                    <TableCell>
                                        {member.phone || "N/A"}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            className={getStatusColor(
                                                member.status
                                            )}
                                        >
                                            {member.statusString}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            className={getMembershipColor(
                                                member.membershipType
                                            )}
                                        >
                                            {member.membershipTypeString}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    navigate(
                                                        `/members/${member.memberId}`
                                                    )
                                                }
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>

                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    openEditDialog(member)
                                                }
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>

                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    handleResetPassword(
                                                        member.memberId,
                                                        member.fullName
                                                    )
                                                }
                                                title="Reset Password"
                                            >
                                                <KeyRound className="h-4 w-4" />
                                            </Button>

                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                onClick={() =>
                                                    handleDelete(
                                                        member.memberId
                                                    )
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

            {/* Add Member Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Add New Member</DialogTitle>
                    </DialogHeader>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                        <div>
                            <Label>Member Code (Optional)</Label>
                            <Input
                                value={addFormData.memberCode}
                                onChange={(e) =>
                                    setAddFormData({
                                        ...addFormData,
                                        memberCode: e.target.value,
                                    })
                                }
                                placeholder="Auto-generated if empty"
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
                            />
                        </div>

                        <div>
                            <Label>Email</Label>
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
                                placeholder="Phone"
                            />
                        </div>

                        <div>
                            <Label>ID Card</Label>
                            <Input
                                value={addFormData.idCard}
                                onChange={(e) =>
                                    setAddFormData({
                                        ...addFormData,
                                        idCard: e.target.value,
                                    })
                                }
                                placeholder="ID Card"
                            />
                        </div>

                        <div>
                            <Label>Date of Birth</Label>
                            <Input
                                type="date"
                                value={addFormData.dateOfBirth}
                                onChange={(e) =>
                                    setAddFormData({
                                        ...addFormData,
                                        dateOfBirth: e.target.value,
                                    })
                                }
                            />
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
                                placeholder="Password"
                                required
                            />
                        </div>

                        <div className="col-span-2">
                            <Label>Address</Label>
                            <Input
                                value={addFormData.address}
                                onChange={(e) =>
                                    setAddFormData({
                                        ...addFormData,
                                        address: e.target.value,
                                    })
                                }
                                placeholder="Address"
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
                        <Button onClick={handleAdd}>Register Member</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog
                open={isDialogOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        setIsDialogOpen(false);
                        setEditingMember(null);
                    }
                }}
            >
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit Member</DialogTitle>
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
                            <Label>Email</Label>
                            <Input
                                type="email"
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        email: e.target.value,
                                    })
                                }
                                placeholder="Email"
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
                            <Label>ID Card</Label>
                            <Input
                                value={formData.idCard}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        idCard: e.target.value,
                                    })
                                }
                                placeholder="ID Card"
                            />
                        </div>

                        <div>
                            <Label>Date of Birth</Label>
                            <Input
                                type="date"
                                value={formData.dateOfBirth}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        dateOfBirth: e.target.value,
                                    })
                                }
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
                            <Label>Membership Type</Label>
                            <Select
                                value={formData.membershipType.toString()}
                                onValueChange={(value) =>
                                    setFormData({
                                        ...formData,
                                        membershipType: parseInt(value),
                                    })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {memberships.map((m) => (
                                        <SelectItem
                                            key={m.value}
                                            value={m.value.toString()}
                                        >
                                            {m.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label>Expiry Date</Label>
                            <Input
                                type="date"
                                value={formData.expiryDate}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        expiryDate: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div className="col-span-2">
                            <Label>Address</Label>
                            <Input
                                value={formData.address}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        address: e.target.value,
                                    })
                                }
                                placeholder="Address"
                            />
                        </div>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsDialogOpen(false);
                                setEditingMember(null);
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
