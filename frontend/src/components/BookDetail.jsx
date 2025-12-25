import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { getBookById } from "@/services/bookService";

export function BookDetail({ bookId, onBack }) {
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!bookId) return;

        const fetchBook = async () => {
            try {
                setLoading(true);
                const data = await getBookById(bookId);
                setBook(data);
            } catch (err) {
                console.error(err);
                setError("Không thể tải thông tin sách");
            } finally {
                setLoading(false);
            }
        };

        fetchBook();
    }, [bookId]);

    // 🔄 Loading
    if (loading) {
        return (
            <div className="p-6">
                <Button variant="ghost" onClick={onBack}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>
                <p className="mt-4">Đang tải dữ liệu...</p>
            </div>
        );
    }

    // ❌ Error
    if (error) {
        return (
            <div className="p-6">
                <Button variant="ghost" onClick={onBack}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>
                <p className="mt-4 text-red-500">{error}</p>
            </div>
        );
    }

    // ❌ Không tìm thấy sách
    if (!book) {
        return (
            <div className="p-6">
                <Button variant="ghost" onClick={onBack}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>
                <p className="mt-4 text-red-500">
                    Không tìm thấy sách (ID: {bookId})
                </p>
            </div>
        );
    }

    // ✅ Render chi tiết sách
    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={onBack}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>
                <h1 className="text-2xl font-semibold">
                    Chi tiết sách
                </h1>
            </div>

            {/* Content */}
            <Card className="max-w-3xl">
                <CardContent className="p-6 space-y-4">
                    <div>
                        <span className="font-medium">Tiêu đề:</span>
                        <p>{book.title}</p>
                    </div>

                    <div>
                        <span className="font-medium">ISBN:</span>
                        <p>{book.isbn}</p>
                    </div>

                    <div>
                        <span className="font-medium">Thể loại:</span>
                        <p>{book.categoryName}</p>
                    </div>

                    <div>
                        <span className="font-medium">Tác giả:</span>
                        <p>
                            {book.authors?.length > 0
                                ? book.authors.map(a => a.name).join(", ")
                                : "Không có"}
                        </p>
                    </div>

                    <div>
                        <span className="font-medium">Số lượng:</span>
                        <p>{book.quantity}</p>
                    </div>

                    <div>
                        <span className="font-medium">Mô tả:</span>
                        <p className="text-sm text-muted-foreground">
                            {book.description || "Không có mô tả"}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
