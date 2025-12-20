import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./ui/table";
import { ArrowLeft, User } from "lucide-react";
import {
    mockMembers,
    mockLoans,
    mockReservations,
    mockFines,
    mockReviews,
} from "../data/mockData";

export function MemberDetail({ memberId, onBack }) {
    const member = mockMembers.find((m) => m.MemberId === memberId);
    const memberLoans = mockLoans.filter((l) => l.MemberId === memberId);
    const memberReservations = mockReservations.filter(
        (r) => r.MemberId === memberId
    );
    const memberFines = mockFines.filter((f) => f.MemberId === memberId);
    const memberReviews = mockReviews.filter((r) => r.MemberId === memberId);

    if (!member) return <div>Member not found</div>;

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

    return (
        <div className="space-y-6 p-4">
            {/* Back Button + Header */}
            <div className="flex items-center gap-4">
                <Button variant="outline" onClick={onBack}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">Member Detail</h1>
                    <p className="text-gray-600">ID: #{memberId}</p>
                </div>
            </div>

            {/* Member Information */}
            <Card>
                <CardHeader>
                    <CardTitle>Member Information</CardTitle>
                </CardHeader>

                <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="font-semibold">Name</p>
                            <p>{member.Name}</p>
                        </div>
                        <div>
                            <p className="font-semibold">Email</p>
                            <p>{member.Email}</p>
                        </div>
                        <div>
                            <p className="font-semibold">Phone</p>
                            <p>{member.Phone}</p>
                        </div>
                        <div>
                            <p className="font-semibold">Address</p>
                            <p>{member.Address}</p>
                        </div>
                        <div>
                            <p className="font-semibold">Status</p>
                            <Badge className={getStatusColor(member.Status)}>
                                {member.Status}
                            </Badge>
                        </div>
                        <div>
                            <p className="font-semibold">Membership</p>
                            <Badge variant="outline">
                                {member.MembershipType}
                            </Badge>
                        </div>
                        <div>
                            <p className="font-semibold">Join Date</p>
                            <p>{member.JoinDate}</p>
                        </div>
                        <div>
                            <p className="font-semibold">Expiry Date</p>
                            <p>{member.ExpiryDate}</p>
                        </div>
                        <div className="col-span-2">
                            <p className="font-semibold">Notes</p>
                            <p>{member.Notes || "—"}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="loans" className="w-full">
                <TabsList>
                    <TabsTrigger value="loans">Loans</TabsTrigger>
                    <TabsTrigger value="reservations">Reservations</TabsTrigger>
                    <TabsTrigger value="fines">Fines</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>

                {/* Loans */}
                <TabsContent value="loans">
                    <Card>
                        <CardContent className="p-4">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Loan ID</TableHead>
                                        <TableHead>Book</TableHead>
                                        <TableHead>Loan Date</TableHead>
                                        <TableHead>Due Date</TableHead>
                                        <TableHead>Return Date</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {memberLoans.map((loan) => (
                                        <TableRow key={loan.LoanId}>
                                            <TableCell>
                                                #{loan.LoanId}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {loan.BookTitle}
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
                                                <Badge variant="outline">
                                                    {loan.Status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Reservations */}
                <TabsContent value="reservations">
                    <Card>
                        <CardContent className="p-4">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Reservation ID</TableHead>
                                        <TableHead>Book</TableHead>
                                        <TableHead>Reservation Date</TableHead>
                                        <TableHead>Expiry Date</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {memberReservations.map((r) => (
                                        <TableRow key={r.ReservationId}>
                                            <TableCell>
                                                #{r.ReservationId}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {r.BookTitle}
                                            </TableCell>
                                            <TableCell>
                                                {r.ReservationDate}
                                            </TableCell>
                                            <TableCell>
                                                {r.ExpiryDate}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {r.Status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Fines */}
                <TabsContent value="fines">
                    <Card>
                        <CardContent className="p-4">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Fine ID</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Issue Date</TableHead>
                                        <TableHead>Paid Date</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {memberFines.map((fine) => (
                                        <TableRow key={fine.FineId}>
                                            <TableCell>
                                                #{fine.FineId}
                                            </TableCell>
                                            <TableCell>{fine.Type}</TableCell>
                                            <TableCell>
                                                ${fine.Amount}
                                            </TableCell>
                                            <TableCell>
                                                {fine.IssueDate}
                                            </TableCell>
                                            <TableCell>
                                                {fine.PaidDate || "-"}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {fine.Status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Reviews */}
                <TabsContent value="reviews">
                    <Card>
                        <CardContent className="p-4">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Review ID</TableHead>
                                        <TableHead>Book</TableHead>
                                        <TableHead>Rating</TableHead>
                                        <TableHead>Review Date</TableHead>
                                        <TableHead>Approved</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {memberReviews.map((review) => (
                                        <TableRow key={review.ReviewId}>
                                            <TableCell>
                                                #{review.ReviewId}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {review.BookTitle}
                                            </TableCell>
                                            <TableCell>
                                                {review.Rating}/5
                                            </TableCell>
                                            <TableCell>
                                                {review.ReviewDate}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {review.IsApproved
                                                        ? "Yes"
                                                        : "No"}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
