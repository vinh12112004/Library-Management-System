import { useState, useEffect } from "react";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../components/ui/table";
import { Search, AlertTriangle } from "lucide-react";
import { getMyLoans } from "../../services/loanService";
import "./MyLoansPage.css";

export default function MyLoansPage() {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const statuses = ["Borrowing", "Returned", "Overdue", "Lost"];

    useEffect(() => {
        loadMyLoans();
    }, []);

    const loadMyLoans = async () => {
        try {
            setLoading(true);
            const data = await getMyLoans();
            setLoans(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error loading loans:", error);
            setLoans([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredLoans = loans.filter((loan) => {
        const matchesSearch = loan.bookTitle
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase());
        const matchesStatus =
            statusFilter && statusFilter !== "all"
                ? loan.status === statusFilter
                : true;
        return matchesSearch && matchesStatus;
    });

    // Parse date từ định dạng dd-MM-yyyy
    const parseDateDMY = (dateStr) => {
        if (!dateStr) return null;
        const parts = dateStr.split("-");
        if (parts.length === 3) {
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
            const year = parseInt(parts[2], 10);
            return new Date(year, month, day);
        }
        return null;
    };

    // Format date sang dd/MM/yyyy
    const formatDate = (dateStr) => {
        if (!dateStr) return "-";
        const date = parseDateDMY(dateStr);
        if (!date || isNaN(date.getTime())) return dateStr;

        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const isOverdue = (dueDate) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const due = parseDateDMY(dueDate);
        if (!due) return false;
        return due < today;
    };

    return (
        <div className="my-loans-container">
            <div className="my-loans-header">
                <h1>Sách của tôi</h1>
                <p>Quản lý các sách bạn đang mượn</p>
            </div>

            <div className="my-loans-card">
                <div className="search-filter-section">
                    <div className="search-wrapper">
                        <Search className="search-icon" />
                        <Input
                            placeholder="Tìm kiếm theo tên sách..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                    </div>
                    <Select
                        value={statusFilter}
                        onValueChange={setStatusFilter}
                    >
                        <SelectTrigger className="filter-select">
                            <SelectValue placeholder="Lọc theo trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả</SelectItem>
                            {statuses.map((status) => (
                                <SelectItem key={status} value={status}>
                                    {status === "Borrowing"
                                        ? "Đang mượn"
                                        : status === "Returned"
                                        ? "Đã trả"
                                        : status === "Overdue"
                                        ? "Quá hạn"
                                        : "Mất"}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {loading ? (
                    <div className="loading-state">Đang tải...</div>
                ) : filteredLoans.length === 0 ? (
                    <div className="empty-state">
                        {searchQuery || statusFilter !== "all"
                            ? "Không tìm thấy sách phù hợp."
                            : "Bạn chưa mượn sách nào."}
                    </div>
                ) : (
                    <div className="table-container">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Mã mượn</TableHead>
                                    <TableHead>Tên sách</TableHead>
                                    <TableHead>Ngày mượn</TableHead>
                                    <TableHead>Hạn trả</TableHead>
                                    <TableHead>Ngày trả</TableHead>
                                    <TableHead>Trạng thái</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredLoans.map((loan) => {
                                    const overdue =
                                        isOverdue(loan.dueDate) &&
                                        loan.status === "Borrowing";
                                    return (
                                        <TableRow key={loan.loanId}>
                                            <TableCell className="font-medium">
                                                #{loan.loanId}
                                            </TableCell>
                                            <TableCell>
                                                {loan.bookTitle}
                                            </TableCell>
                                            <TableCell>
                                                {formatDate(loan.loanDate)}
                                            </TableCell>
                                            <TableCell>
                                                {formatDate(loan.dueDate)}
                                            </TableCell>
                                            <TableCell>
                                                {formatDate(loan.returnDate)}
                                            </TableCell>
                                            <TableCell>
                                                {overdue ? (
                                                    <Badge className="badge-overdue">
                                                        <AlertTriangle className="w-4 h-4" />
                                                        Quá hạn
                                                    </Badge>
                                                ) : loan.status ===
                                                  "Borrowing" ? (
                                                    <Badge className="badge-borrowing">
                                                        Đang mượn
                                                    </Badge>
                                                ) : loan.status ===
                                                  "Returned" ? (
                                                    <Badge className="badge-returned">
                                                        Đã trả
                                                    </Badge>
                                                ) : loan.status === "Lost" ? (
                                                    <Badge className="badge-lost">
                                                        Mất
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline">
                                                        {loan.status}
                                                    </Badge>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>
        </div>
    );
}
