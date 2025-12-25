import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
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
    Plus,
    Eye,
    Edit,
    Trash2,
    Upload,
    X,
    Grid3X3,
    List,
} from "lucide-react";
import {
    getBooks,
    createBook,
    updateBook,
    deleteBook,
} from "../services/bookService";
import { getAuthors } from "../services/authorService";
import { getCategories } from "../services/categoryService";
import { toast } from "sonner";
import { BooksTableView } from "./book/BooksTableView";
import { BooksGridView } from "./book/BooksGridView";

export function BooksManagement() {
    const navigate = useNavigate();
    // ----------------------------------------
    // STATES
    // ----------------------------------------
    const [books, setBooks] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [languageFilter, setLanguageFilter] = useState("");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [editingBook, setEditingBook] = useState(null);
    const [coverImageFile, setCoverImageFile] = useState(null);
    const [viewMode, setViewMode] = useState("table");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    const [formData, setFormData] = useState({
        isbn: "",
        title: "",
        publisherName: "",
        publicationYear: new Date().getFullYear(),
        edition: "",
        language: "",
        pages: "",
        description: "",
        coverImageUrl: "",
        authorIds: [],
        categoryIds: [],
    });

    // ----------------------------------------
    // FETCH DATA
    // ----------------------------------------
    useEffect(() => {
        fetchBooks();
        fetchAuthors();
        fetchCategories();
    }, [searchQuery, page, pageSize]);

    const fetchBooks = async () => {
        try {
            const queryParams = {
                pageNumber: page,
                pageSize: pageSize,
                title: searchQuery || undefined,
                sortBy: "Title",
                sortOrder: "asc",
            };
            const response = await getBooks(queryParams);
            setBooks(response.items || []);
            setTotalPages(response.totalPages || 1);
            setTotalCount(response.totalCount || 0);
            // Sync to server-reported page if available
            if (response.pageNumber && response.pageNumber !== page) {
                setPage(response.pageNumber);
            }
        } catch (error) {
            console.error("Error fetching books:", error);
            toast.error("Failed to fetch books");
        }
    };

    const fetchAuthors = async () => {
        try {
            const response = await getAuthors({ pageNumber: 1, pageSize: 10000 });
            setAuthors(response?.items || response || []);
        } catch (error) {
            console.error("Error fetching authors:", error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await getCategories({ pageNumber: 1, pageSize: 10000 });
            setCategories(response?.items || response || []);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    // ----------------------------------------
    // FILTERS
    // ----------------------------------------
    const languages = [...new Set(books.map((b) => b.language))];

    const filteredBooks = books.filter((book) => {
        const matchesLanguage =
            languageFilter && languageFilter !== "all"
                ? book.language === languageFilter
                : true;
        return matchesLanguage;
    });

    const goToPreviousPage = () => {
        setPage((prev) => Math.max(1, prev - 1));
    };

    const goToNextPage = () => {
        setPage((prev) => (totalPages ? Math.min(totalPages, prev + 1) : prev + 1));
    };

    const handlePageSizeChange = (value) => {
        const nextSize = Number(value) || 10;
        setPageSize(nextSize);
        setPage(1);
    };

    // ----------------------------------------
    // HANDLERS
    // ----------------------------------------
    const handleAddBook = async () => {
        try {
            const bookData = {
                ISBN: formData.isbn,
                Title: formData.title,
                PublisherName: formData.publisherName,
                PublicationYear: Number(formData.publicationYear),
                Edition: formData.edition,
                Language: formData.language,
                Pages: Number(formData.pages),
                Description: formData.description,
                AuthorIds: formData.authorIds, // array
                CategoryIds: formData.categoryIds, // array
                CoverImageFile: coverImageFile || null,
            };

            await createBook(bookData);

            toast.success("Book added successfully");
            await fetchBooks();
            resetForm();
            setIsAddDialogOpen(false);
        } catch (error) {
            console.error("Error adding book:", error);
            toast.error("Failed to add book");
        }
    };

    const handleEditBook = async () => {
        if (!editingBook) return;

        try {
            const bookData = {
                isbn: formData.isbn,
                title: formData.title,
                publisherName: formData.publisherName,
                publicationYear: Number(formData.publicationYear),
                edition: formData.edition,
                language: formData.language,
                pages: Number(formData.pages),
                description: formData.description,
                coverImageUrl: formData.coverImageUrl,
                authorIds: formData.authorIds,
                categoryIds: formData.categoryIds,
            };

            await updateBook(editingBook.bookId, bookData);
            toast.success("Book updated successfully");
            await fetchBooks();
            setEditingBook(null);
            resetForm();
            setIsAddDialogOpen(false);
        } catch (error) {
            console.error("Error updating book:", error);
            toast.error("Failed to update book");
        }
    };

    const handleDeleteBook = async (id) => {
        if (!confirm("Are you sure you want to delete this book?")) return;

        try {
            await deleteBook(id);
            toast.success("Book deleted successfully");
            await fetchBooks();
        } catch (error) {
            console.error("Error deleting book:", error);
            toast.error("Failed to delete book");
        }
    };

    const resetForm = () => {
        setFormData({
            isbn: "",
            title: "",
            publisherName: "",
            publicationYear: new Date().getFullYear(),
            edition: "",
            language: "",
            pages: "",
            description: "",
            coverImageUrl: "",
            authorIds: [],
            categoryIds: [],
        });
        setCoverImageFile(null);
    };

    const openAddDialog = () => {
        resetForm();
        setEditingBook(null);
        setIsAddDialogOpen(true);
    };

    const openEditDialog = (book) => {
        // Convert author names sang authorIds
        const authorIds = [];
        if (Array.isArray(book.authors)) {
            book.authors.forEach((authorName) => {
                const author = authors.find((a) => a.fullName === authorName);
                if (author) {
                    authorIds.push(author.authorId);
                }
            });
        }

        // Convert category names sang categoryIds
        const categoryIds = [];
        if (Array.isArray(book.categories)) {
            book.categories.forEach((categoryName) => {
                const category = categories.find(
                    (c) => c.name === categoryName
                );
                if (category) {
                    categoryIds.push(category.categoryId);
                }
            });
        }

        setFormData({
            isbn: book.isbn || "",
            title: book.title || "",
            publisherName: book.publisherName || "",
            publicationYear: book.publicationYear || new Date().getFullYear(),
            edition: book.edition || "",
            language: book.language || "",
            pages: book.pages || "",
            description: book.description || "",
            coverImageUrl: book.coverImageUrl || "",
            authorIds: authorIds,
            categoryIds: categoryIds,
        });
        setEditingBook(book);
        setIsAddDialogOpen(true);
    };

    const handleCoverImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setCoverImageFile(file);
            const previewUrl = URL.createObjectURL(file);
            setFormData({ ...formData, coverImageUrl: previewUrl });
        }
    };

    const handleAuthorChange = (index, value) => {
        const newAuthorIds = [...formData.authorIds];
        newAuthorIds[index] = Number(value);
        setFormData({ ...formData, authorIds: newAuthorIds });
    };

    const addAuthor = () => {
        setFormData({ ...formData, authorIds: [...formData.authorIds, ""] });
    };

    const removeAuthor = (index) => {
        const newAuthorIds = formData.authorIds.filter((_, i) => i !== index);
        setFormData({ ...formData, authorIds: newAuthorIds });
    };

    const handleCategoryChange = (index, value) => {
        const newCategoryIds = [...formData.categoryIds];
        newCategoryIds[index] = Number(value);
        setFormData({ ...formData, categoryIds: newCategoryIds });
    };

    const addCategory = () => {
        setFormData({
            ...formData,
            categoryIds: [...formData.categoryIds, ""],
        });
    };

    const removeCategory = (index) => {
        const newCategoryIds = formData.categoryIds.filter(
            (_, i) => i !== index
        );
        setFormData({ ...formData, categoryIds: newCategoryIds });
    };

    // ----------------------------------------
    // UI
    // ----------------------------------------
    return (
        <div className="space-y-6 p-4">
            {/* Page Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Books Management</h1>
                    <p className="text-muted-foreground">
                        Manage all books in the library.
                    </p>
                </div>
                <div className="flex gap-2">
                    {/* View Mode Toggle */}
                    <div className="flex border rounded-md">
                        <Button
                            variant={viewMode === "table" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setViewMode("table")}
                            className="rounded-r-none"
                        >
                            <List className="w-4 h-4 mr-1" />
                            Table
                        </Button>
                        <Button
                            variant={viewMode === "grid" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setViewMode("grid")}
                            className="rounded-l-none"
                        >
                            <Grid3X3 className="w-4 h-4 mr-1" />
                            Grid
                        </Button>
                    </div>

                    <Button onClick={openAddDialog}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Book
                    </Button>
                </div>
            </div>

            {/* Search + Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex gap-4">
                        {/* Search */}
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                placeholder="Search by title..."
                                className="pl-10"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setPage(1);
                                }}
                            />
                        </div>

                        {/* Language Filter */}
                        <Select
                            value={languageFilter}
                            onValueChange={(value) => {
                                setLanguageFilter(value);
                                setPage(1);
                            }}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Language" />
                            </SelectTrigger>
                            <SelectContent>
                                {languages.map((lang) => (
                                    <SelectItem key={lang} value={lang}>
                                        {lang}
                                    </SelectItem>
                                ))}
                                <SelectItem value="all">All</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Conditional Rendering based on viewMode */}
            {viewMode === "table" ? (
                <Card>
                    <CardContent className="p-4">
                        <BooksTableView
                            books={filteredBooks}
                            onView={(id) => navigate(`/books/${id}`)}

                            onEdit={openEditDialog}
                            onDelete={handleDeleteBook}
                        />
                    </CardContent>
                </Card>
            ) : (
                <BooksGridView
                    books={filteredBooks}
                    onView={(id) => navigate(`/books/${id}`)}

                    onEdit={openEditDialog}
                    onDelete={handleDeleteBook}
                />
            )}

            {/* Pagination */}
            <div className="flex flex-col gap-3 px-2 sm:flex-row sm:items-center">
                <div className="text-sm text-muted-foreground">
                    Page {page} / {totalPages || 1} · {totalCount} results
                </div>
            </div>

            <div className="flex items-center gap-3 justify-end px-2">
                {/* Page Size Selector */}
                <Select
                    value={String(pageSize)}
                    onValueChange={handlePageSizeChange}
                >
                    <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Page size" />
                    </SelectTrigger>
                    <SelectContent>
                        {[5, 10, 20, 50].map((size) => (
                            <SelectItem key={size} value={String(size)}>
                                {size} / page
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Navigation Buttons */}
                <div className="flex items-center gap-1">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={goToPreviousPage}
                        disabled={page <= 1}
                    >
                        Prev
                    </Button>
                    <span className="text-sm w-20 text-center">
                        {page} / {totalPages || 1}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={goToNextPage}
                        disabled={totalPages ? page >= totalPages : false}
                    >
                        Next
                    </Button>
                </div>
            </div>


            {/* Add/Edit Dialog */}
            <Dialog
                open={isAddDialogOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        setIsAddDialogOpen(false);
                        setEditingBook(null);
                    }
                }}
            >
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {editingBook ? "Edit Book" : "Add New Book"}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                        {/* ISBN */}
                        <div>
                            <Label>ISBN *</Label>
                            <Input
                                value={formData.isbn}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        isbn: e.target.value,
                                    })
                                }
                                placeholder="ISBN"
                            />
                        </div>

                        {/* Title */}
                        <div>
                            <Label>Title *</Label>
                            <Input
                                value={formData.title}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        title: e.target.value,
                                    })
                                }
                                placeholder="Book Title"
                            />
                        </div>

                        {/* Publisher */}
                        <div>
                            <Label>Publisher *</Label>
                            <Input
                                value={formData.publisherName}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        publisherName: e.target.value,
                                    })
                                }
                                placeholder="Publisher Name"
                            />
                        </div>

                        {/* Year */}
                        <div>
                            <Label>Publication Year *</Label>
                            <Input
                                type="number"
                                value={formData.publicationYear}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        publicationYear: e.target.value,
                                    })
                                }
                            />
                        </div>

                        {/* Edition */}
                        <div>
                            <Label>Edition</Label>
                            <Input
                                value={formData.edition}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        edition: e.target.value,
                                    })
                                }
                                placeholder="Edition"
                            />
                        </div>

                        {/* Language */}
                        <div>
                            <Label>Language *</Label>
                            <Select
                                value={formData.language}
                                onValueChange={(v) =>
                                    setFormData({ ...formData, language: v })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select language" />
                                </SelectTrigger>
                                <SelectContent>
                                    {languages.map((lang) => (
                                        <SelectItem key={lang} value={lang}>
                                            {lang}
                                        </SelectItem>
                                    ))}
                                    <SelectItem value="English">
                                        English
                                    </SelectItem>
                                    <SelectItem value="Vietnamese">
                                        Vietnamese
                                    </SelectItem>
                                    <SelectItem value="French">
                                        French
                                    </SelectItem>
                                    <SelectItem value="Spanish">
                                        Spanish
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Pages */}
                        <div>
                            <Label>Pages *</Label>
                            <Input
                                type="number"
                                value={formData.pages}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        pages: e.target.value,
                                    })
                                }
                            />
                        </div>

                        {/* Cover Image */}
                        <div>
                            <Label>Cover Image</Label>
                            <div className="flex gap-2">
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleCoverImageChange}
                                    className="flex-1"
                                />
                                {formData.coverImageUrl && (
                                    <img
                                        src={formData.coverImageUrl}
                                        alt="Cover preview"
                                        className="h-10 w-10 object-cover rounded"
                                    />
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="col-span-2">
                            <Label>Description</Label>
                            <Textarea
                                rows={4}
                                placeholder="Description..."
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        description: e.target.value,
                                    })
                                }
                            />
                        </div>

                        {/* Authors */}
                        <div className="col-span-2">
                            <div className="flex justify-between items-center mb-2">
                                <Label>Authors</Label>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={addAuthor}
                                >
                                    <Plus className="w-4 h-4 mr-1" />
                                    Add Author
                                </Button>
                            </div>
                            <div className="space-y-2">
                                {formData.authorIds.map((authorId, index) => (
                                    <div key={index} className="flex gap-2">
                                        <Select
                                            value={
                                                authorId ? String(authorId) : ""
                                            }
                                            onValueChange={(value) =>
                                                handleAuthorChange(index, value)
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select author" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {authors.map((a) => (
                                                    <SelectItem
                                                        key={a.authorId}
                                                        value={String(
                                                            a.authorId
                                                        )}
                                                    >
                                                        {a.fullName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeAuthor(index)}
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Categories */}
                        <div className="col-span-2">
                            <div className="flex justify-between items-center mb-2">
                                <Label>Categories</Label>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={addCategory}
                                >
                                    <Plus className="w-4 h-4 mr-1" />
                                    Add Category
                                </Button>
                            </div>
                            <div className="space-y-2">
                                {formData.categoryIds.map(
                                    (categoryId, index) => (
                                        <div key={index} className="flex gap-2">
                                            <Select
                                                value={
                                                    categoryId
                                                        ? String(categoryId)
                                                        : ""
                                                }
                                                onValueChange={(value) =>
                                                    handleCategoryChange(
                                                        index,
                                                        value
                                                    )
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {categories.map((c) => (
                                                        <SelectItem
                                                            key={c.categoryId}
                                                            value={String(
                                                                c.categoryId
                                                            )}
                                                        >
                                                            {c.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    removeCategory(index)
                                                }
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsAddDialogOpen(false);
                                setEditingBook(null);
                            }}
                        >
                            Cancel
                        </Button>

                        <Button
                            onClick={
                                editingBook ? handleEditBook : handleAddBook
                            }
                            className="w-32"
                        >
                            {editingBook ? "Save Changes" : "Add Book"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
