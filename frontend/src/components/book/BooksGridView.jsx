import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Eye, Edit, Trash2 } from "lucide-react";

export function BooksGridView({ books, onView, onEdit, onDelete }) {
    return (
        <div className="w-full">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {books.map((book) => (
                    <Card
                        key={book.bookId}
                        className="overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col"
                    >
                        {/* Cover Image (SMALLER) */}
                        <div className="relative w-full aspect-[3/4] max-h-[180px] bg-gray-50 flex items-center justify-center overflow-hidden">
                            {book.coverImageUrl ? (
                                <img
                                    src={book.coverImageUrl}
                                    alt={book.title}
                                    className="w-full h-full object-contain p-2"
                                    onError={(e) => {
                                        e.currentTarget.src =
                                            "https://via.placeholder.com/150x200?text=No+Cover";
                                    }}
                                />
                            ) : (
                                <span className="text-gray-400 text-[10px] text-center px-2">
                                    No Cover
                                </span>
                            )}
                        </div>

                        {/* Content */}
                        <CardContent className="p-2 flex flex-col gap-1 flex-1">
                            {/* Title */}
                            <h3
                                className="text-[11px] font-semibold line-clamp-2 leading-tight min-h-[2rem]"
                                title={book.title}
                            >
                                {book.title}
                            </h3>

                            {/* Info */}
                            <div className="flex flex-col gap-0.5 text-[10px] text-muted-foreground flex-1">
                                <p className="truncate">
                                    <span className="font-medium">Year:</span>{" "}
                                    {book.publicationYear}
                                </p>

                                <p className="truncate">
                                    <span className="font-medium">Lang:</span>{" "}
                                    {book.language}
                                </p>

                                {book.authors?.length > 0 && (
                                    <p
                                        className="line-clamp-1"
                                        title={book.authors.join(", ")}
                                    >
                                        <span className="font-medium">By:</span>{" "}
                                        {book.authors.join(", ")}
                                    </p>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-1 pt-1 border-t mt-auto" style = {{paddingTop: "10px"}}>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="flex-1 h-6 px-2"
                                    onClick={() => onView(book.bookId)}
                                >
                                    <Eye className="w-3 h-3" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="flex-1 h-6 px-2"
                                    onClick={() => onEdit(book)}
                                >
                                    <Edit className="w-3 h-3" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="flex-1 h-6 px-2 text-destructive hover:bg-destructive/10"
                                    onClick={() => onDelete(book.bookId)}
                                >
                                    <Trash2 className="w-3 h-3" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
