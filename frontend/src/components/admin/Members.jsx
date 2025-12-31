import { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
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
import { Search, Plus, User } from "lucide-react";

const initialMembers = [
    {
        id: "001",
        name: "John Doe",
        phone: "123-4567",
        email: "john@example.com",
        activeBorrowings: 3,
    },
    {
        id: "002",
        name: "Jane Smith",
        phone: "234-5678",
        email: "jane@example.com",
        activeBorrowings: 1,
    },
    {
        id: "003",
        name: "Mark Lee",
        phone: "345-6789",
        email: "mark@example.com",
        activeBorrowings: 0,
    },
    {
        id: "004",
        name: "Emily Zhang",
        phone: "456-7890",
        email: "emily@example.com",
        activeBorrowings: 2,
    },
    {
        id: "005",
        name: "David Kim",
        phone: "567-8901",
        email: "david@example.com",
        activeBorrowings: 0,
    },
    {
        id: "006",
        name: "Sarah Brown",
        phone: "678-9012",
        email: "sarah@example.com",
        activeBorrowings: 5,
    },
    {
        id: "007",
        name: "Alex Johnson",
        phone: "789-0123",
        email: "alex@example.com",
        activeBorrowings: 4,
    },
    {
        id: "008",
        name: "Chris Walker",
        phone: "890-1234",
        email: "chris@example.com",
        activeBorrowings: 0,
    },
];

export function Members() {
    const [members, setMembers] = useState(initialMembers);
    const [searchQuery, setSearchQuery] = useState("");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
    });

    const filteredMembers = members.filter((member) => {
        return (
            member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.id.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    const handleAddMember = () => {
        const newMember = {
            id: (members.length + 1).toString().padStart(3, "0"),
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            activeBorrowings: 0,
        };
        setMembers([...members, newMember]);
        setFormData({ name: "", phone: "", email: "" });
        setIsAddDialogOpen(false);
    };

    return (
        <div className="members-page">
            {/* Page Header */}
            <div className="header flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-semibold">Members</h1>
                    <p className="text-sm text-gray-500">
                        Manage all members of the system
                    </p>
                </div>
                <Button
                    onClick={() => setIsAddDialogOpen(true)}
                    className="flex items-center"
                >
                    <Plus className="mr-2" />
                    Add Member
                </Button>
            </div>

            {/* Search */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex items-center">
                        <Search className="mr-2" />
                        <Input
                            placeholder="Search by Name, ID, or Email"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Members Table */}
            <Card>
                <CardContent className="p-4">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Member ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Active Borrowings</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredMembers.map((member) => (
                                <TableRow key={member.id}>
                                    <TableCell>{member.id}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center">
                                            <div className="mr-2">
                                                <User />
                                            </div>
                                            <span>{member.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{member.phone}</TableCell>
                                    <TableCell>{member.email}</TableCell>
                                    <TableCell>
                                        {member.activeBorrowings > 0 ? (
                                            <Badge className="bg-green-500 text-white">
                                                {member.activeBorrowings} Active
                                                Borrowings
                                            </Badge>
                                        ) : (
                                            <span className="text-gray-500">
                                                None
                                            </span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Add Member Dialog */}
            <Dialog open={isAddDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Member</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        name: e.target.value,
                                    })
                                }
                                placeholder="Enter member's name"
                            />
                        </div>
                        <div>
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                                id="phone"
                                value={formData.phone}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        phone: e.target.value,
                                    })
                                }
                                placeholder="Enter member's phone number"
                            />
                        </div>
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        email: e.target.value,
                                    })
                                }
                                placeholder="Enter member's email"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsAddDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleAddMember}>Add Member</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
