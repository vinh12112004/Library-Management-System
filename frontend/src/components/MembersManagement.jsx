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
import { Search, Plus, Eye, User } from "lucide-react";
import { mockMembers } from "../data/mockData";

export function MembersManagement({ onNavigate }) {
    const [members, setMembers] = useState(mockMembers || []);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [membershipFilter, setMembershipFilter] = useState("");

    const statuses = ["Active", "Suspended", "Expired"];
    const memberships = ["Premium", "Student"];

    const filteredMembers = members.filter((member) => {
        const matchesSearch =
            member.FullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.Email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.MemberCode.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter
            ? member.Status === statusFilter
            : true;
        const matchesMembership = membershipFilter
            ? member.MembershipType === membershipFilter
            : true;
        return matchesSearch && matchesStatus && matchesMembership;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case "Active":
                return "bg-green-100 text-green-700";
            case "Suspended":
                return "bg-red-100 text-red-700";
            case "Expired":
                return "bg-gray-100 text-gray-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const getMembershipColor = (type) => {
        switch (type) {
            case "Premium":
                return "bg-purple-100 text-purple-700";
            case "Student":
                return "bg-blue-100 text-blue-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div className="space-y-6 p-4">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Members Management</h1>
                    <p className="text-gray-600 mt-1">Manage library members</p>
                </div>
                <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
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
                                {statuses.map((status) => (
                                    <SelectItem key={status} value={status}>
                                        {status}
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
                                {memberships.map((type) => (
                                    <SelectItem key={type} value={type}>
                                        {type}
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
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredMembers.map((member) => (
                                <TableRow key={member.MemberCode}>
                                    <TableCell>{member.MemberCode}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <User className="h-5 w-5 text-gray-500" />
                                            <span>{member.FullName}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{member.Email}</TableCell>
                                    <TableCell>{member.Phone}</TableCell>
                                    <TableCell>
                                        <Badge
                                            className={getStatusColor(
                                                member.Status
                                            )}
                                        >
                                            {member.Status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            className={getMembershipColor(
                                                member.MembershipType
                                            )}
                                        >
                                            {member.MembershipType}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                onNavigate(member.MemberCode)
                                            }
                                            className="flex items-center gap-1"
                                        >
                                            <Eye className="h-4 w-4" />
                                            View
                                        </Button>
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
