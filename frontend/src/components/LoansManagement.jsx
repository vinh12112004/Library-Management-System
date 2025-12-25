import { useState, useEffect } from "react";
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
    getLoans,
    createLoan,
    updateLoan,
    getLoansByMemberId,
} from "../services/loanService";
import { getMembers } from "../services/memberService";
import { getBookCopies } from "../services/bookCopyService";

export function LoansManagement() {
    const [loans, setLoans] = useState([]);
    const [members, setMembers] = useState([]);
    const [bookCopies, setBookCopies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    // Calculate default due date (1 month from now)
    const getDefaultDueDate = () => {
        const date = new Date();
        date.setMonth(date.getMonth() + 1);
        return date.toISOString().split("T")[0];
    };

    const [borrowForm, setBorrowForm] = useState({
        memberId: "",
        copyId: "",
        loanDate: new Date().toISOString().split("T")[0],
        dueDate: getDefaultDueDate(),
        notes: "",
    });

    const statuses = ["Active", "Returned", "Overdue"];

    // Load data khi component mount
    useEffect(() => {
        loadLoans();
        loadMembers();
        loadBookCopies();
    }, []);

    const loadLoans = async () => {
        try {
            setLoading(true);
            const data = await getLoans({ pageNumber: 1, pageSize: 100 });
            setLoans(data.items || data);
        } catch (error) {
            console.error("Error loading loans:", error);
        } finally {
            setLoading(false);
        }
    };

    const loadMembers = async () => {
        try {
            const data = await getMembers();
            setMembers(
                Array.isArray(data)
                    ? data.filter((m) => m.status === "Active")
                    : []
            );
        } catch (error) {
            console.error("Error loading members:", error);
            setMembers([]);
        }
    };

    const loadBookCopies = async () => {
        try {
            const data = await getBookCopies();
            setBookCopies(
                Array.isArray(data)
                    ? data.filter((copy) => copy.status === "Available")
                    : []
            );
        } catch (error) {
            console.error("Error loading book copies:", error);
            setBookCopies([]);
        }
    };

    const filteredLoans = loans.filter((loan) => {
        const matchesSearch =
            loan.memberName
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            loan.bookTitle?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus =
            statusFilter && statusFilter !== "all"
                ? loan.status === statusFilter
                : true;
        return matchesSearch && matchesStatus;
    });

    const isOverdue = (dueDate) => {
        const today = new Date();
        const due = new Date(dueDate);
        return due < today;
    };

    const handleBorrow = async () => {
        try {
            setLoading(true);
            await createLoan(borrowForm);
            await loadLoans();
            setBorrowForm({
                memberId: "",
                copyId: "",
                loanDate: new Date().toISOString().split("T")[0],
                dueDate: getDefaultDueDate(),
                notes: "",
            });
            alert("Book borrowed successfully!");
        } catch (error) {
            console.error("Error borrowing book:", error);
            alert("Error borrowing book. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleReturn = async (loanId) => {
        try {
            setLoading(true);
            await updateLoan(loanId, {
                returnDate: new Date().toISOString(),
                status: "Returned",
            });
            await loadLoans();
            alert("Book returned successfully!");
        } catch (error) {
            console.error("Error returning book:", error);
            alert("Error returning book. Please try again.");
        } finally {
            setLoading(false);
        }
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
                                    placeholder="Search by member, book..."
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
                                        <SelectItem value="all">All</SelectItem>
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

                            {loading ? (
                                <div className="text-center py-8">
                                    Loading...
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Loan ID</TableHead>
                                            <TableHead>Member</TableHead>
                                            <TableHead>Book</TableHead>
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
                                                isOverdue(loan.dueDate) &&
                                                loan.status === "Active";
                                            return (
                                                <TableRow key={loan.loanId}>
                                                    <TableCell>
                                                        #{loan.loanId}
                                                    </TableCell>
                                                    <TableCell className="font-medium">
                                                        {loan.memberName}
                                                    </TableCell>
                                                    <TableCell>
                                                        {loan.bookTitle}
                                                    </TableCell>
                                                    <TableCell>
                                                        {new Date(
                                                            loan.loanDate
                                                        ).toLocaleDateString()}
                                                    </TableCell>
                                                    <TableCell>
                                                        {new Date(
                                                            loan.dueDate
                                                        ).toLocaleDateString()}
                                                    </TableCell>
                                                    <TableCell>
                                                        {loan.returnDate
                                                            ? new Date(
                                                                  loan.returnDate
                                                              ).toLocaleDateString()
                                                            : "-"}
                                                    </TableCell>
                                                    <TableCell>
                                                        {loan.staffName || "-"}
                                                    </TableCell>
                                                    <TableCell>
                                                        {overdue ? (
                                                            <Badge className="bg-red-100 text-red-700 flex items-center gap-1">
                                                                <AlertTriangle className="w-4 h-4" />
                                                                Overdue
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="outline">
                                                                {loan.status}
                                                            </Badge>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {loan.status ===
                                                            "Active" && (
                                                            <Button
                                                                onClick={() =>
                                                                    handleReturn(
                                                                        loan.loanId
                                                                    )
                                                                }
                                                                size="sm"
                                                                disabled={
                                                                    loading
                                                                }
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
                            )}
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
                                    <Label htmlFor="member">Member *</Label>
                                    <Select
                                        value={
                                            borrowForm.memberId
                                                ? borrowForm.memberId.toString()
                                                : ""
                                        }
                                        onValueChange={(val) =>
                                            setBorrowForm({
                                                ...borrowForm,
                                                memberId: parseInt(val),
                                            })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select member" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {members.map((member) => (
                                                <SelectItem
                                                    key={member.memberId}
                                                    value={member.memberId.toString()}
                                                >
                                                    {member.fullName} (
                                                    {member.memberCode})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="copy">Book Copy *</Label>
                                    <Select
                                        value={
                                            borrowForm.copyId
                                                ? borrowForm.copyId.toString()
                                                : ""
                                        }
                                        onValueChange={(val) =>
                                            setBorrowForm({
                                                ...borrowForm,
                                                copyId: parseInt(val),
                                            })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select book copy" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {bookCopies.map((copy) => (
                                                <SelectItem
                                                    key={copy.copyId}
                                                    value={copy.copyId.toString()}
                                                >
                                                    {copy.bookTitle} -{" "}
                                                    {copy.barcode}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="loanDate">
                                        Loan Date *
                                    </Label>
                                    <Input
                                        id="loanDate"
                                        type="date"
                                        value={borrowForm.loanDate}
                                        onChange={(e) =>
                                            setBorrowForm({
                                                ...borrowForm,
                                                loanDate: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="dueDate">
                                        Due Date * (Default: 1 month)
                                    </Label>
                                    <Input
                                        id="dueDate"
                                        type="date"
                                        value={borrowForm.dueDate}
                                        onChange={(e) =>
                                            setBorrowForm({
                                                ...borrowForm,
                                                dueDate: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="col-span-2">
                                    <Label htmlFor="notes">Notes</Label>
                                    <Input
                                        id="notes"
                                        placeholder="Optional notes"
                                        value={borrowForm.notes}
                                        onChange={(e) =>
                                            setBorrowForm({
                                                ...borrowForm,
                                                notes: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>

                            <div>
                                <Button
                                    onClick={handleBorrow}
                                    disabled={
                                        loading ||
                                        !borrowForm.memberId ||
                                        !borrowForm.copyId ||
                                        !borrowForm.dueDate
                                    }
                                >
                                    <BookMarked className="w-4 h-4 mr-1" />
                                    {loading
                                        ? "Processing..."
                                        : "Confirm Borrow"}
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
