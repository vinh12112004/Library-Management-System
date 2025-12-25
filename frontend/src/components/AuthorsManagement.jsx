import { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
} from "./ui/dialog";
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import {
    Search,
    Plus,
    Edit,
    Trash2,
    Eye,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

import {
    getAuthors,
    createAuthor,
    updateAuthor,
    deleteAuthor,
} from "../services/authorService";
import { useAuth } from "../context/AuthContext";
import { hasRole } from "../utils/permission";

export function AuthorsManagement({ onNavigate }) {
    const { roles } = useAuth();

    const canView = hasRole(roles, [
        "Reader",
        "Admin",
        "Librarian",
        "Assistant",
    ]);
    const canManage = hasRole(roles, ["Admin", "Librarian", "Assistant"]);

    const [authors, setAuthors] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingAuthor, setEditingAuthor] = useState(null);

    const [pagination, setPagination] = useState({
        pageNumber: 1,
        pageSize: 10,
        totalCount: 0,
        totalPages: 1,
        hasPreviousPage: false,
        hasNextPage: false,
    });

    const [formData, setFormData] = useState({
        fullName: "",
        nationality: "",
        dateOfBirth: "",
        biography: "",
    });

    // Load data
    useEffect(() => {
        fetchAuthors();
    }, [pagination.pageNumber, pagination.pageSize, searchQuery]);

    const fetchAuthors = async () => {
        try {
            const response = await getAuthors({
                pageNumber: pagination.pageNumber,
                pageSize: pagination.pageSize,
                searchTerm: searchQuery || undefined,
            });

            const items = response?.items || response || [];
            const nextPageNumber = response?.pageNumber ?? pagination.pageNumber;
            const nextPageSize = response?.pageSize ?? pagination.pageSize;
            const totalCount = response?.totalCount ?? items.length;
            const totalPages =
                response?.totalPages ??
                Math.max(1, Math.ceil(totalCount / nextPageSize));

            setAuthors(items);
            setPagination((prev) => ({
                ...prev,
                pageNumber: nextPageNumber,
                pageSize: nextPageSize,
                totalCount,
                totalPages,
                hasPreviousPage:
                    response?.hasPreviousPage ?? nextPageNumber > 1,
                hasNextPage:
                    response?.hasNextPage ?? nextPageNumber < totalPages,
            }));
        } catch (err) {
            console.error("Error fetching authors:", err);
        }
    };

    const openAddDialog = () => {
        setFormData({
            fullName: "",
            nationality: "",
            dateOfBirth: "",
            biography: "",
        });
        setEditingAuthor(null);
        setIsDialogOpen(true);
    };

    const toISO = (d) => {
        if (!d) return "";
        const [day, month, year] = d.split("-");
        return `${year}-${month}-${day}`;
    };

    const openEditDialog = (author) => {
        setFormData({
            fullName: author.fullName,
            nationality: author.nationality,
            dateOfBirth: toISO(author.dateOfBirth),
            biography: author.biography,
        });
        setEditingAuthor(author);
        setIsDialogOpen(true);
    };

    const handleSave = async () => {
        if (!formData.fullName.trim()) return;

        const payload = {
            ...formData,
        };
        if (editingAuthor) {
            // UPDATE
            const updated = await updateAuthor(editingAuthor.authorId, payload);
            if (updated) {
                await fetchAuthors();
            }
        } else {
            // CREATE
            await createAuthor(payload);
            await fetchAuthors();
        }

        setIsDialogOpen(false);
        setEditingAuthor(null);
    };

    const handleDelete = async (id) => {
        await deleteAuthor(id);
        await fetchAuthors();
    };

    const handlePreviousPage = () => {
        if (pagination.hasPreviousPage) {
            setPagination((prev) => ({
                ...prev,
                pageNumber: prev.pageNumber - 1,
            }));
        }
    };

    const handleNextPage = () => {
        if (pagination.hasNextPage) {
            setPagination((prev) => ({
                ...prev,
                pageNumber: prev.pageNumber + 1,
            }));
        }
    };

    const handlePageSizeChange = (value) => {
        const nextSize = Number(value) || 10;
        setPagination((prev) => ({
            ...prev,
            pageSize: nextSize,
            pageNumber: 1,
        }));
    };

    const filteredAuthors = authors.filter((author) => {
        const name = author.fullName || "";
        const nationality = author.nationality || "";
        return (
            name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            nationality.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    return (
        <div className="space-y-6 p-4">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Authors Management</h1>
                    <p className="text-gray-600 mt-1">Manage and organize authors</p>
                </div>

                {canManage && (
                    <Button onClick={openAddDialog} className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Author
                    </Button>
                )}
            </div>

            {/* Search */}
            <Card>
                <CardContent className="p-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            placeholder="Search author..."
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Table */}
            <Card>
                <CardContent className="p-4">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Nationality</TableHead>
                                <TableHead>DOB</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredAuthors.map((author) => (
                                <TableRow key={author.authorId}>
                                    <TableCell>#{author.authorId}</TableCell>
                                    <TableCell className="font-medium">
                                        {author.fullName}
                                    </TableCell>
                                    <TableCell>{author.nationality}</TableCell>
                                    <TableCell>{author.dateOfBirth}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            {canView && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() =>
                                                        onNavigate(
                                                            "author-detail",
                                                            author.authorId
                                                        )
                                                    }
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            )}

                                            {canManage && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() =>
                                                        openEditDialog(author)
                                                    }
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            )}

                                            {canManage && (
                                                <Button
                                                    variant="destructive"
                                                    size="icon"
                                                    onClick={() =>
                                                        handleDelete(
                                                            author.authorId
                                                        )
                                                    }
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="flex items-center justify-between px-4 py-4">
                    <div className="text-sm text-gray-600">
                        Showing {authors.length} of {pagination.totalCount} authors
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                            <span>Rows per page</span>
                            <Select
                                value={String(pagination.pageSize)}
                                onValueChange={handlePageSizeChange}
                            >
                                <SelectTrigger className="h-9 w-24">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {[5, 10, 20, 50].map((size) => (
                                        <SelectItem key={size} value={String(size)}>
                                            {size}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handlePreviousPage}
                                disabled={!pagination.hasPreviousPage}
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Previous
                            </Button>
                            <div className="text-sm">
                                Page {pagination.pageNumber} of {pagination.totalPages}
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleNextPage}
                                disabled={!pagination.hasNextPage}
                            >
                                Next
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Add/Edit Dialog */}
            <Dialog
                open={isDialogOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        setIsDialogOpen(false);
                        setEditingAuthor(null);
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editingAuthor ? "Edit Author" : "Add New Author"}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                        <div>
                            <Label>Full Name</Label>
                            <Input
                                value={formData.fullName}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        fullName: e.target.value,
                                    })
                                }
                                placeholder="Author's full name"
                            />
                        </div>

                        <div>
                            <Label>Nationality</Label>
                            <Input
                                value={formData.nationality}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        nationality: e.target.value,
                                    })
                                }
                                placeholder="Nationality"
                            />
                        </div>

                        <div>
                            <Label>Date of Birth</Label>
                            <Input
                                type="date"
                                value={formData.dateOfBirth}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        dateOfBirth: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div className="col-span-2">
                            <Label>Biography</Label>
                            <Textarea
                                rows={4}
                                placeholder="Short biography..."
                                value={formData.biography}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        biography: e.target.value,
                                    })
                                }
                            />
                        </div>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsDialogOpen(false);
                                setEditingAuthor(null);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button className="w-32" onClick={handleSave}>
                            {editingAuthor ? "Save Changes" : "Add Author"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
