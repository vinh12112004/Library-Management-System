import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import { Label } from "./ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./ui/table";
import {
    Search,
    BookMarked,
    CheckCircle,
    AlertTriangle,
    Calendar,
} from "lucide-react";
import {
    mockLoans,
    mockMembers,
    mockBookCopies,
    mockStaff,
} from "../data/mockData";

export function LoansManagement() {
    const [loans, setLoans] = useState(mockLoans);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [isBorrowDialogOpen, setIsBorrowDialogOpen] = useState(false);
    const [borrowForm, setBorrowForm] = useState({
        MemberId: "",
        CopyId: "",
        StaffId: "",
        LoanDate: new Date().toISOString().split("T")[0],
        DueDate: "",
    });

    const statuses = ["Active", "Returned", "Overdue"];
    const activeMembers = mockMembers.filter((m) => m.Status === "Active");
    const availableCopies = mockBookCopies.filter(
        (c) => c.Status === "Available"
    );

    const filteredLoans = loans.filter((loan) => {
        const matchesSearch =
            loan.MemberName?.toLowerCase().includes(
                searchQuery.toLowerCase()
            ) ||
            loan.BookTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            loan.Barcode?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter
            ? loan.Status === statusFilter
            : true;
        return matchesSearch && matchesStatus;
    });

    const isOverdue = (dueDate) => {
        const today = new Date();
        const due = new Date(dueDate);
        return due < today;
    };

    const handleBorrow = () => {
        const member = activeMembers.find(
            (m) => m.MemberId === borrowForm.MemberId
        );
        const copy = availableCopies.find(
            (c) => c.CopyId === borrowForm.CopyId
        );
        const staff = mockStaff.find((s) => s.StaffId === borrowForm.StaffId);

        if (member && copy && staff && borrowForm.DueDate) {
            const newLoan = {
                LoanId: loans.length + 1,
                MemberId: member.MemberId,
                MemberName: member.FullName,
                CopyId: copy.CopyId,
                BookTitle: copy.BookTitle,
                Barcode: copy.Barcode,
                StaffId: staff.StaffId,
                StaffName: staff.FullName,
                LoanDate: borrowForm.LoanDate,
                DueDate: borrowForm.DueDate,
                RenewalCount: 0,
                Status: "Active",
                ReturnDate: null,
            };
            setLoans([...loans, newLoan]);
            setIsBorrowDialogOpen(false);
            setBorrowForm({
                MemberId: "",
                CopyId: "",
                StaffId: "",
                LoanDate: new Date().toISOString().split("T")[0],
                DueDate: "",
            });
        }
    };

    const handleReturn = (loanId) => {
        setLoans(
            loans.map((loan) =>
                loan.LoanId === loanId
                    ? {
                          ...loan,
                          ReturnDate: new Date().toISOString().split("T")[0],
                          Status: "Returned",
                      }
                    : loan
            )
        );
    };

    return (
        <div className="space-y-6 p-4">
            <div>
                <h1 className="text-2xl font-bold">Loans Management</h1>
                <p className="text-gray-600">Manage all book loans</p>
            </div>

            <Tabs defaultValue="all">
                <TabsList className="mb-4">
                    <TabsTrigger value="all">All Loans</TabsTrigger>
                    <TabsTrigger value="borrow">Borrow Book</TabsTrigger>
                    <TabsTrigger value="return">Return Book</TabsTrigger>
                </TabsList>

                {/* All Loans Tab */}
                <TabsContent value="all">
                    <Card>
                        <CardContent className="p-4 space-y-4">
                            <div className="flex gap-2 items-center">
                                <Search className="w-5 h-5 text-gray-500" />
                                <Input
                                    placeholder="Search by member, book, barcode..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="flex-1"
                                />
                                <Select
                                    value={statusFilter}
                                    onValueChange={setStatusFilter}
                                >
                                    <SelectTrigger className="w-40">
                                        <SelectValue placeholder="Filter by status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {statuses.map((status) => (
                                            <SelectItem
                                                key={status}
                                                value={status}
                                            >
                                                {status}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Loan ID</TableHead>
                                        <TableHead>Member</TableHead>
                                        <TableHead>Book / Copy</TableHead>
                                        <TableHead>Loan Date</TableHead>
                                        <TableHead>Due Date</TableHead>
                                        <TableHead>Return Date</TableHead>
                                        <TableHead>Staff</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredLoans.map((loan) => {
                                        const overdue =
                                            isOverdue(loan.DueDate) &&
                                            loan.Status === "Active";
                                        return (
                                            <TableRow key={loan.LoanId}>
                                                <TableCell>
                                                    #{loan.LoanId}
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {loan.MemberName}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span>
                                                            {loan.BookTitle}
                                                        </span>
                                                        <span className="text-sm text-gray-500">
                                                            {loan.Barcode}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {loan.LoanDate}
                                                </TableCell>
                                                <TableCell>
                                                    {loan.DueDate}
                                                </TableCell>
                                                <TableCell>
                                                    {loan.ReturnDate || "-"}
                                                </TableCell>
                                                <TableCell>
                                                    {loan.StaffName}
                                                </TableCell>
                                                <TableCell>
                                                    {overdue ? (
                                                        <Badge className="bg-red-100 text-red-700 flex items-center gap-1">
                                                            <AlertTriangle className="w-4 h-4" />{" "}
                                                            Overdue
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="outline">
                                                            {loan.Status}
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {loan.Status ===
                                                        "Active" && (
                                                        <Button
                                                            onClick={() =>
                                                                handleReturn(
                                                                    loan.LoanId
                                                                )
                                                            }
                                                            size="sm"
                                                        >
                                                            <CheckCircle className="w-4 h-4 mr-1" />
                                                            Return
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Borrow Book Tab */}
                <TabsContent value="borrow">
                    <Card>
                        <CardHeader>
                            <div>
                                <h2 className="text-lg font-bold">
                                    Borrow Book
                                </h2>
                                <p className="text-gray-500">
                                    Fill the form to borrow a book
                                </p>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="member">Member</Label>
                                    <Select
                                        value={borrowForm.MemberId}
                                        onValueChange={(val) =>
                                            setBorrowForm({
                                                ...borrowForm,
                                                MemberId: val,
                                            })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select member" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {activeMembers.map((member) => (
                                                <SelectItem
                                                    key={member.MemberId}
                                                    value={member.MemberId}
                                                >
                                                    {member.FullName} (
                                                    {member.MemberCode})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="copy">Book Copy</Label>
                                    <Select
                                        value={borrowForm.CopyId}
                                        onValueChange={(val) =>
                                            setBorrowForm({
                                                ...borrowForm,
                                                CopyId: val,
                                            })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select copy" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableCopies.map((copy) => (
                                                <SelectItem
                                                    key={copy.CopyId}
                                                    value={copy.CopyId}
                                                >
                                                    {copy.BookTitle} (
                                                    {copy.Barcode})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="staff">Staff</Label>
                                    <Select
                                        value={borrowForm.StaffId}
                                        onValueChange={(val) =>
                                            setBorrowForm({
                                                ...borrowForm,
                                                StaffId: val,
                                            })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select staff" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {mockStaff.map((s) => (
                                                <SelectItem
                                                    key={s.StaffId}
                                                    value={s.StaffId}
                                                >
                                                    {s.FullName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="loanDate">Loan Date</Label>
                                    <Input
                                        id="loanDate"
                                        type="date"
                                        value={borrowForm.LoanDate}
                                        onChange={(e) =>
                                            setBorrowForm({
                                                ...borrowForm,
                                                LoanDate: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="dueDate">Due Date</Label>
                                    <Input
                                        id="dueDate"
                                        type="date"
                                        value={borrowForm.DueDate}
                                        onChange={(e) =>
                                            setBorrowForm({
                                                ...borrowForm,
                                                DueDate: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>

                            <div>
                                <Button onClick={handleBorrow}>
                                    <BookMarked className="w-4 h-4 mr-1" />
                                    Confirm Borrow
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Return Book Tab */}
                <TabsContent value="return">
                    <Card>
                        <CardHeader>
                            <div>
                                <h2 className="text-lg font-bold">
                                    Return Book
                                </h2>
                                <p className="text-gray-500">
                                    Active loans are shown in the "All Loans"
                                    tab. Click the Return button to process a
                                    return.
                                </p>
                            </div>
                        </CardHeader>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
