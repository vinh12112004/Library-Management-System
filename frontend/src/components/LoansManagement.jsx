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
import { Search, BookMarked, AlertTriangle, Edit, Trash2 } from "lucide-react";
import {
    getLoans,
    getMyLoans,
    createLoan,
    updateLoan,
    deleteLoan,
} from "../services/loanService";
import { getMembers } from "../services/memberService";
import { getBookCopies } from "../services/bookCopyService";
import { useAuth } from "../context/AuthContext";
import { hasRole } from "../utils/permission";

export function LoansManagement() {
    const { roles } = useAuth();
    const isReader = hasRole(roles, ["Reader"]);
    const canManage = hasRole(roles, ["Admin", "Librarian"]);

    const [loans, setLoans] = useState([]);
    const [members, setMembers] = useState([]);
    const [bookCopies, setBookCopies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [editingLoan, setEditingLoan] = useState(null);
    const [showEditDialog, setShowEditDialog] = useState(false);

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

    const statuses = ["Borrowing", "Returned", "Overdue", "Lost"];

    // Load data khi component mount
    useEffect(() => {
        loadLoans();
        if (canManage) {
            loadMembers();
            loadBookCopies();
        }
    }, [canManage]);

    const loadLoans = async () => {
        try {
            setLoading(true);
            // Reader gọi getMyLoans, Staff gọi getLoans
            const data = isReader
                ? await getMyLoans()
                : await getLoans({ pageNumber: 1, pageSize: 100 });

            setLoans(Array.isArray(data) ? data : data.items || []);
        } catch (error) {
            console.error("Error loading loans:", error);
            setLoans([]);
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

    const parseDMY = (dateStr) => {
        if (!dateStr) return null;
        const [day, month, year] = dateStr.split("-");
        return new Date(year, month - 1, day);
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
        if (!confirm("Are you sure you want to mark this book as returned?")) {
            return;
        }
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

    const handleRenew = async (loanId, currentDueDate) => {
        if (!confirm("Extend the due date by 1 month?")) {
            return;
        }
        try {
            setLoading(true);
            const newDueDate = new Date(currentDueDate);
            newDueDate.setMonth(newDueDate.getMonth() + 1);

            await updateLoan(loanId, {
                status: "Borrowing",
            });
            await loadLoans();
            alert("Loan renewed successfully!");
        } catch (error) {
            console.error("Error renewing loan:", error);
            alert("Error renewing loan. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (loanId) => {
        if (
            !confirm(
                "Are you sure you want to delete this loan record? This action cannot be undone."
            )
        ) {
            return;
        }
        try {
            setLoading(true);
            await deleteLoan(loanId);
            await loadLoans();
            alert("Loan deleted successfully!");
        } catch (error) {
            console.error("Error deleting loan:", error);
            alert("Error deleting loan. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (loan) => {
        setEditingLoan({
            loanId: loan.loanId,
            returnDate: loan.returnDate
                ? new Date(loan.returnDate).toISOString().split("T")[0]
                : "",
            status: loan.status,
            notes: loan.notes || "",
        });
        setShowEditDialog(true);
    };

    const handleUpdateLoan = async () => {
        try {
            setLoading(true);
            const updateData = {
                status: editingLoan.status,
                notes: editingLoan.notes,
            };

            // Only include returnDate if status is "Returned"
            if (editingLoan.status === "Returned") {
                updateData.returnDate = editingLoan.returnDate
                    ? new Date(editingLoan.returnDate).toISOString()
                    : new Date().toISOString();
            } else {
                updateData.returnDate = null;
            }

            await updateLoan(editingLoan.loanId, updateData);
            await loadLoans();
            setShowEditDialog(false);
            setEditingLoan(null);
            alert("Loan updated successfully!");
        } catch (error) {
            console.error("Error updating loan:", error);
            alert("Error updating loan. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 p-4">
            <div>
                <h1 className="text-2xl font-bold">
                    {isReader ? "My Loans" : "Loans Management"}
                </h1>
                <p className="text-gray-600">
                    {isReader
                        ? "View your borrowed books"
                        : "Manage all book loans"}
                </p>
            </div>

            <Tabs defaultValue="all">
                <TabsList className="mb-4">
                    <TabsTrigger value="all">
                        {isReader ? "My Loans" : "All Loans"}
                    </TabsTrigger>
                    {canManage && (
                        <TabsTrigger value="borrow">Borrow Book</TabsTrigger>
                    )}
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
                            ) : filteredLoans.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    {searchQuery || statusFilter !== "all"
                                        ? "No loans found matching your filters."
                                        : isReader
                                        ? "You haven't borrowed any books yet."
                                        : "No loans available."}
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Loan ID</TableHead>
                                            {!isReader && (
                                                <TableHead>Member</TableHead>
                                            )}
                                            <TableHead>Book</TableHead>
                                            <TableHead>Loan Date</TableHead>
                                            <TableHead>Due Date</TableHead>
                                            <TableHead>Return Date</TableHead>
                                            {!isReader && (
                                                <TableHead>Staff</TableHead>
                                            )}
                                            <TableHead>Status</TableHead>
                                            {canManage && (
                                                <TableHead>Actions</TableHead>
                                            )}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredLoans.map((loan) => {
                                            const overdue =
                                                isOverdue(loan.dueDate) &&
                                                loan.status === "Borrowing";
                                            return (
                                                <TableRow key={loan.loanId}>
                                                    <TableCell>
                                                        #{loan.loanId}
                                                    </TableCell>
                                                    {!isReader && (
                                                        <TableCell className="font-medium">
                                                            {loan.memberName}
                                                        </TableCell>
                                                    )}
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
                                                    {!isReader && (
                                                        <TableCell>
                                                            {loan.staffName ||
                                                                "-"}
                                                        </TableCell>
                                                    )}
                                                    <TableCell>
                                                        {overdue ? (
                                                            <Badge className="bg-red-100 text-red-700 flex items-center gap-1">
                                                                <AlertTriangle className="w-4 h-4" />
                                                                Overdue
                                                            </Badge>
                                                        ) : loan.status ===
                                                          "Borrowing" ? (
                                                            <Badge className="bg-blue-100 text-blue-700">
                                                                Borrowing
                                                            </Badge>
                                                        ) : loan.status ===
                                                          "Returned" ? (
                                                            <Badge className="bg-green-100 text-green-700">
                                                                Returned
                                                            </Badge>
                                                        ) : loan.status ===
                                                          "Lost" ? (
                                                            <Badge className="bg-gray-100 text-gray-700">
                                                                Lost
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="outline">
                                                                {loan.status}
                                                            </Badge>
                                                        )}
                                                    </TableCell>
                                                    {canManage && (
                                                        <TableCell>
                                                            <div className="flex gap-2">
                                                                <Button
                                                                    onClick={() =>
                                                                        handleEdit(
                                                                            loan
                                                                        )
                                                                    }
                                                                    size="sm"
                                                                    variant="outline"
                                                                    disabled={
                                                                        loading
                                                                    }
                                                                    title="Edit loan"
                                                                >
                                                                    <Edit className="w-4 h-4" />
                                                                </Button>
                                                                <Button
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            loan.loanId
                                                                        )
                                                                    }
                                                                    size="sm"
                                                                    variant="destructive"
                                                                    disabled={
                                                                        loading
                                                                    }
                                                                    title="Delete loan record"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    )}
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Borrow Book Tab - Only for Staff */}
                {canManage && (
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
                                        <Label htmlFor="copy">
                                            Book Copy *
                                        </Label>
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
                )}
            </Tabs>

            {/* Edit Dialog - Only for Staff */}
            {canManage && showEditDialog && editingLoan && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <Card className="w-full max-w-md">
                        <CardHeader>
                            <CardTitle>
                                Edit Loan #{editingLoan.loanId}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="editStatus">Status</Label>
                                <Select
                                    value={editingLoan.status}
                                    onValueChange={(val) =>
                                        setEditingLoan({
                                            ...editingLoan,
                                            status: val,
                                            returnDate:
                                                val === "Returned"
                                                    ? editingLoan.returnDate ||
                                                      new Date()
                                                          .toISOString()
                                                          .split("T")[0]
                                                    : "",
                                        })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
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

                            {editingLoan.status === "Returned" && (
                                <div>
                                    <Label htmlFor="editReturnDate">
                                        Return Date
                                    </Label>
                                    <Input
                                        id="editReturnDate"
                                        type="date"
                                        value={editingLoan.returnDate}
                                        onChange={(e) =>
                                            setEditingLoan({
                                                ...editingLoan,
                                                returnDate: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            )}

                            <div>
                                <Label htmlFor="editNotes">Notes</Label>
                                <Input
                                    id="editNotes"
                                    value={editingLoan.notes}
                                    onChange={(e) =>
                                        setEditingLoan({
                                            ...editingLoan,
                                            notes: e.target.value,
                                        })
                                    }
                                    placeholder="Add notes..."
                                />
                            </div>

                            <div className="flex gap-2 justify-end">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setShowEditDialog(false);
                                        setEditingLoan(null);
                                    }}
                                    disabled={loading}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleUpdateLoan}
                                    disabled={loading}
                                >
                                    {loading ? "Saving..." : "Save Changes"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
