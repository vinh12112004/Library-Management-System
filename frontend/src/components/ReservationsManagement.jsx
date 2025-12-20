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
import { Search, BookmarkCheck, Bell } from "lucide-react";
import { mockReservations } from "../data/mockData";

export function ReservationsManagement() {
    const [reservations, setReservations] = useState(mockReservations || []);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    const statuses = ["Pending", "Ready", "Completed", "Cancelled", "Expired"];

    const filteredReservations = reservations.filter((reservation) => {
        const matchesSearch =
            reservation.MemberName?.toLowerCase().includes(
                searchQuery.toLowerCase()
            ) ||
            reservation.BookTitle?.toLowerCase().includes(
                searchQuery.toLowerCase()
            );
        const matchesStatus = statusFilter
            ? reservation.Status === statusFilter
            : true;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case "Pending":
                return "bg-amber-100 text-amber-700";
            case "Ready":
                return "bg-green-100 text-green-700";
            case "Completed":
                return "bg-blue-100 text-blue-700";
            case "Cancelled":
                return "bg-gray-100 text-gray-700";
            case "Expired":
                return "bg-red-100 text-red-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const handleStatusChange = (reservationId, newStatus) => {
        setReservations(
            reservations.map((r) =>
                r.ReservationId === reservationId
                    ? { ...r, Status: newStatus }
                    : r
            )
        );
    };

    return (
        <div className="space-y-6 p-4">
            <div>
                <h1 className="text-3xl font-bold">Reservations Management</h1>
                <p className="text-gray-600 mt-1">
                    View and manage book reservations
                </p>
            </div>

            {/* Search & Filter */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex gap-4 items-center">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                placeholder="Search by member or book..."
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

            {/* Reservations Table */}
            <Card>
                <CardContent className="p-4">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Reservation ID</TableHead>
                                <TableHead>Member Name</TableHead>
                                <TableHead>Book Title</TableHead>
                                <TableHead>Reservation Date</TableHead>
                                <TableHead>Expiry Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Notified</TableHead>
                                <TableHead>Change Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredReservations.map((reservation) => (
                                <TableRow key={reservation.ReservationId}>
                                    <TableCell>
                                        #{reservation.ReservationId}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {reservation.MemberName}
                                    </TableCell>
                                    <TableCell>
                                        {reservation.BookTitle}
                                    </TableCell>
                                    <TableCell>
                                        {reservation.ReservationDate}
                                    </TableCell>
                                    <TableCell>
                                        {reservation.ExpiryDate}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            className={getStatusColor(
                                                reservation.Status
                                            )}
                                        >
                                            {reservation.Status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {reservation.NotificationSent ? (
                                            <Badge
                                                variant="outline"
                                                className="flex items-center gap-1"
                                            >
                                                <Bell className="h-4 w-4" /> Yes
                                            </Badge>
                                        ) : (
                                            <span>No</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Select
                                            value={reservation.Status}
                                            onValueChange={(newStatus) =>
                                                handleStatusChange(
                                                    reservation.ReservationId,
                                                    newStatus
                                                )
                                            }
                                        >
                                            <SelectTrigger className="w-40">
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
