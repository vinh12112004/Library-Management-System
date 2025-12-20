import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Eye, Edit, Trash2 } from "lucide-react";

export function BooksTableView({ books, onView, onEdit, onDelete }) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>ISBN</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Publisher</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Edition</TableHead>
                    <TableHead>Language</TableHead>
                    <TableHead>Pages</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {books.map((book) => (
                    <TableRow key={book.bookId}>
                        <TableCell>#{book.bookId}</TableCell>
                        <TableCell>{book.isbn}</TableCell>
                        <TableCell>{book.title}</TableCell>
                        <TableCell>{book.publisherName}</TableCell>
                        <TableCell>{book.publicationYear}</TableCell>
                        <TableCell>{book.edition}</TableCell>
                        <TableCell>
                            <Badge variant="outline">{book.language}</Badge>
                        </TableCell>
                        <TableCell>{book.pages}</TableCell>
                        <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onView(book.bookId)}
                                >
                                    <Eye className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onEdit(book)}
                                >
                                    <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => onDelete(book.bookId)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
