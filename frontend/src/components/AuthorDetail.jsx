import { useState, useEffect } from "react"; // Thêm useEffect và useState
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./ui/table";
import { ArrowLeft, Loader2 } from "lucide-react"; // Import Loader2 cho trạng thái loading

import { getAuthorById, getBooksByAuthorId } from "../services/authorService";

export function AuthorDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const authorId = id;
    const [author, setAuthor] = useState(null);
    const [authorBooks, setAuthorBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Lấy chi tiết tác giả
    useEffect(() => {
        setLoading(true);
        setError(null);

        Promise.all([getAuthorById(authorId), getBooksByAuthorId(authorId)])
            .then(([authorData, booksData]) => {
                setAuthor(authorData);
                setAuthorBooks(booksData);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching author detail:", err);
                setError("Failed to load author details.");
                setLoading(false);
            });
    }, [authorId]);

    // Xử lý trạng thái tải (Loading State)
    if (loading) {
        return (
            <div className="flex justify-center items-center h-48">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                <p className="ml-2">Loading author details...</p>
            </div>
        );
    }

    if (error) {
        return <div className="text-red-600">Error: {error}</div>;
    }

    if (!author) {
        return <div>Author not found</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate("/authors")}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold">{author.fullName}</h1>
                    <p className="text-gray-600">{author.nationality}</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Author Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">
                                Full Name
                            </p>
                            <p className="font-medium">{author.fullName}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 mb-1">
                                Nationality
                            </p>
                            <p className="font-medium">{author.nationality}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 mb-1">
                                Date of Birth
                            </p>
                            <p className="font-medium">{author.dateOfBirth}</p>
                        </div>
                        <div className="col-span-2">
                            <p className="text-sm text-gray-600 mb-1">
                                Biography
                            </p>
                            <p className="text-gray-700">{author.biography}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>
                        Books by {author.fullName} ({authorBooks.length})
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Book ID</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>ISBN</TableHead>
                                <TableHead>Year</TableHead>
                                <TableHead>Publisher</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {authorBooks.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="text-center text-gray-500"
                                    >
                                        No books found for this author
                                    </TableCell>
                                </TableRow>
                            ) : (
                                authorBooks.map((book) => (
                                    <TableRow key={book.bookId}>
                                        <TableCell>#{book.bookId}</TableCell>
                                        <TableCell className="font-medium">
                                            {book.title}
                                        </TableCell>
                                        <TableCell className="font-mono text-sm">
                                            {book.isbn}
                                        </TableCell>
                                        <TableCell>
                                            {book.publicationYear ?? "-"}
                                        </TableCell>
                                        <TableCell className="text-gray-600">
                                            {book.publisherName ?? "-"}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
