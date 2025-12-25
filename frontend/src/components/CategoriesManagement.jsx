import { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
} from "./ui/dialog";
import { Plus, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
} from "../services/categoryService";

export function CategoriesManagement() {
    const [categories, setCategories] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    // State cho phân trang
    const [pagination, setPagination] = useState({
        pageNumber: 1,
        pageSize: 10,
        totalCount: 0,
        totalPages: 0,
        hasPreviousPage: false,
        hasNextPage: false,
    });

    const [formData, setFormData] = useState({
        name: "",
        description: "",
    });

    // Load categories từ backend
    useEffect(() => {
        fetchCategories();
    }, [pagination.pageNumber, pagination.pageSize]);

    const fetchCategories = async () => {
        try {
            const response = await getCategories(
                pagination.pageNumber,
                pagination.pageSize
            );
            setCategories(response.items || []);
            setPagination({
                pageNumber: response.pageNumber,
                pageSize: response.pageSize,
                totalCount: response.totalCount,
                totalPages: response.totalPages,
                hasPreviousPage: response.hasPreviousPage,
                hasNextPage: response.hasNextPage,
            });
        } catch (err) {
            console.error("Error fetching categories:", err);
            toast.error("Failed to fetch categories");
        }
    };

    // Mở dialog thêm mới
    const openAddDialog = () => {
        setFormData({
            name: "",
            description: "",
        });
        setEditingCategory(null);
        setIsDialogOpen(true);
    };

    // Mở dialog sửa
    const openEditDialog = (category) => {
        setFormData({
            name: category.name || "",
            description: category.description || "",
        });
        setEditingCategory(category);
        setIsDialogOpen(true);
    };

    const handleSave = async () => {
        if (!formData.name.trim()) {
            toast.error("Category name is required");
            return;
        }

        try {
            if (editingCategory) {
                await updateCategory(editingCategory.categoryId, formData);
                toast.success("Category updated successfully");
            } else {
                await createCategory(formData);
                toast.success("Category added successfully");
            }

            await fetchCategories();
            setIsDialogOpen(false);
            setEditingCategory(null);
        } catch (err) {
            console.error("Error saving category:", err);
            toast.error("Failed to save category");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this category?")) return;

        try {
            await deleteCategory(id);
            toast.success("Category deleted successfully");
            await fetchCategories();
        } catch (err) {
            console.error("Error deleting category:", err);
            toast.error("Failed to delete category");
        }
    };

    // Xử lý chuyển trang
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

    return (
        <div className="space-y-6 p-4">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">
                        Categories Management
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Organize and manage book categories
                    </p>
                </div>
                <Button
                    onClick={openAddDialog}
                    className="bg-blue-600 hover:bg-blue-700"
                >
                    <Plus className="mr-2 h-4 w-4" /> Add Category
                </Button>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categories.map((category) => (
                                <TableRow key={category.categoryId}>
                                    <TableCell>
                                        #{category.categoryId}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {category.name}
                                    </TableCell>
                                    <TableCell className="text-gray-600">
                                        {category.description}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    openEditDialog(category)
                                                }
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                onClick={() =>
                                                    handleDelete(
                                                        category.categoryId
                                                    )
                                                }
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {/* Phân trang */}
                    <div className="flex items-center justify-between px-4 py-4 border-t">
                        <div className="text-sm text-gray-600">
                            Showing {categories.length} of{" "}
                            {pagination.totalCount} categories
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
                                Page {pagination.pageNumber} of{" "}
                                {pagination.totalPages}
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
                        setEditingCategory(null);
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editingCategory
                                ? "Edit Category"
                                : "Add New Category"}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 pt-2">
                        {/* Name */}
                        <div>
                            <Label>Name *</Label>
                            <Input
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        name: e.target.value,
                                    })
                                }
                                placeholder="Category name"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <Label>Description</Label>
                            <Input
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        description: e.target.value,
                                    })
                                }
                                placeholder="Category description"
                            />
                        </div>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsDialogOpen(false);
                                setEditingCategory(null);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button className="w-32" onClick={handleSave}>
                            {editingCategory ? "Save Changes" : "Add Category"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
