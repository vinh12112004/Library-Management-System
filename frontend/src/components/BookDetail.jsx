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
import { ArrowLeft, BookOpen, Star } from "lucide-react";
import {
    mockBooks,
    mockBookCopies,
    mockAuthors,
    mockReviews,
    mockCategories,
} from "../data/mockData";

export function BookDetail({ bookId, onBack }) {
    const book = mockBooks.find((b) => b.BookId === bookId);
    const copies = mockBookCopies.filter((c) => c.BookId === bookId);
    const reviews = mockReviews.filter((r) => r.BookId === bookId);

    // Fake: book has Authors = [1,2]
    const bookAuthors = mockAuthors.filter((a) =>
        book.AuthorIds.includes(a.AuthorId)
    );
    const bookCategories = mockCategories.filter((c) =>
        book.CategoryIds.includes(c.CategoryId)
    );

    if (!book) return <div>Book not found</div>;

    const getStatusColor = (status) => {
        switch (status) {
            case "Available":
                return "bg-green-100 text-green-700";
            case "Borrowed":
                return "bg-amber-100 text-amber-700";
            case "Maintenance":
                return "bg-blue-100 text-blue-700";
            case "Lost":
                return "bg-red-100 text-red-700";
            case "Damaged":
                return "bg-orange-100 text-orange-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div className="space-y-6 p-4">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={onBack}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">{book.Title}</h1>
                    <p className="text-muted-foreground">
                        Book ID: #{book.BookId}
                    </p>
                </div>
            </div>

            {/* Book Info */}
            <Card>
                <CardHeader>
                    <CardTitle>Book Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <p>
                            <strong>ISBN:</strong> {book.ISBN}
                        </p>
                        <p>
                            <strong>Publisher:</strong> {book.Publisher}
                        </p>
                        <p>
                            <strong>Publish Year:</strong> {book.PublishYear}
                        </p>
                        <p>
                            <strong>Language:</strong> {book.Language}
                        </p>
                        <p>
                            <strong>Pages:</strong> {book.Pages}
                        </p>
                        <p>
                            <strong>Edition:</strong> {book.Edition}
                        </p>
                        <p>
                            <strong>Category Count:</strong>{" "}
                            {book.CategoryIds.length}
                        </p>
                        <p>
                            <strong>Authors Count:</strong>{" "}
                            {book.AuthorIds.length}
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="copies" className="w-full">
                <TabsList>
                    <TabsTrigger value="copies">Book Copies</TabsTrigger>
                    <TabsTrigger value="authors">Authors</TabsTrigger>
                    <TabsTrigger value="categories">Categories</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>

                {/* Copies */}
                <TabsContent value="copies">
                    <Card>
                        <CardContent className="pt-4">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Copy ID</TableHead>
                                        <TableHead>Barcode</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Location</TableHead>
                                        <TableHead>Acquisition Date</TableHead>
                                        <TableHead>Price</TableHead>
                                        <TableHead>Notes</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {copies.map((copy) => (
                                        <TableRow key={copy.CopyId}>
                                            <TableCell>
                                                #{copy.CopyId}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {copy.Barcode}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    className={getStatusColor(
                                                        copy.Status
                                                    )}
                                                >
                                                    {copy.Status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {copy.Location}
                                            </TableCell>
                                            <TableCell>
                                                {copy.AcquisitionDate}
                                            </TableCell>
                                            <TableCell>${copy.Price}</TableCell>
                                            <TableCell>{copy.Notes}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Authors */}
                <TabsContent value="authors">
                    <Card>
                        <CardContent className="pt-4">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Author ID</TableHead>
                                        <TableHead>Full Name</TableHead>
                                        <TableHead>Nationality</TableHead>
                                        <TableHead>Date of Birth</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {bookAuthors.map((author) => (
                                        <TableRow key={author.AuthorId}>
                                            <TableCell>
                                                #{author.AuthorId}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {author.FullName}
                                            </TableCell>
                                            <TableCell>
                                                {author.Nationality}
                                            </TableCell>
                                            <TableCell>
                                                {author.DateOfBirth}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Categories */}
                <TabsContent value="categories">
                    <Card>
                        <CardContent className="pt-4">
                            <div className="flex gap-2 flex-wrap">
                                {bookCategories.map((category) => (
                                    <Badge key={category.CategoryId}>
                                        {category.Name}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Reviews */}
                <TabsContent value="reviews">
                    <div className="space-y-4">
                        {reviews.length > 0 ? (
                            reviews.map((review) => (
                                <Card key={review.ReviewId}>
                                    <CardContent className="pt-4">
                                        <div className="flex justify-between">
                                            <p className="font-semibold">
                                                {review.UserName}
                                            </p>
                                            <div className="flex items-center">
                                                {Array.from({ length: 5 }).map(
                                                    (_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`w-5 h-5 ${
                                                                i <
                                                                review.Rating
                                                                    ? "fill-amber-400 text-amber-400"
                                                                    : "text-gray-300"
                                                            }`}
                                                        />
                                                    )
                                                )}
                                                <span className="ml-2">
                                                    {review.Rating}/5
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-2">
                                            {review.Date}
                                        </p>
                                        <p className="mt-3">{review.Comment}</p>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <Card>
                                <CardContent className="text-center py-8">
                                    <BookOpen className="w-10 h-10 mx-auto text-gray-400" />
                                    <p className="mt-2 text-muted-foreground">
                                        No reviews yet
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
