import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { getBookById } from "@/services/bookService";

export function BookDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const bookId = id;
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
                <Button variant="ghost" onClick={() => navigate("/books")}>
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
                <Button variant="ghost" onClick={() => navigate("/books")}>
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
                <Button variant="ghost" onClick={() => navigate("/books")}>
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
                <Button variant="ghost" onClick={() => navigate("/books")}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>
                <h1 className="text-2xl font-semibold">Chi tiết sách</h1>
            </div>

            {/* Content */}
            <Card className="max-w-5xl mx-auto">
                <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row gap-8">
                        
                        {/* LEFT: Cover Image */}
                        <div className="flex-shrink-0 flex justify-center md:justify-start" style = {{paddingTop: "20px"}}>
                            {book.coverImageUrl ? (
                                <img
                                    src={book.coverImageUrl}
                                    alt={book.title}
                                    className="w-40 h-auto rounded-lg shadow-md object-cover"
                                    style={{ maxHeight: "354px" }}
                                    onError={(e) => (e.target.style.display = "none")}
                                />
                            ) : (
                                <div className="w-40 h-56 bg-muted flex items-center justify-center rounded-lg text-sm text-muted-foreground">
                                    No Image
                                </div>
                            )}
                        </div>

                        {/* RIGHT: Book Info */}
                        <div className="flex-1 space-y-6" style = {{paddingLeft: "20px"}}>
                            {/* Tiêu đề */}
                           <div className="text-center">
    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-primary mb-2" style = {{fontSize: "24px"}}>
        {book.title}
    </h2>
    <p className="text-sm text-muted-foreground">
        ISBN: {book.isbn}
    </p>
</div>


                            {/* Divider */}
                            <div className="border-t pt-5 space-y-4">
                                {/* Tác giả */}
                                <div className="flex gap-3">
                                    <span className="font-medium min-w-32">Tác giả:</span>
                                    <p className="flex-1 leading-relaxed">
                                        {book.authors && Array.isArray(book.authors) && book.authors.length > 0
                                            ? (typeof book.authors[0] === "string"
                                                ? book.authors.join(", ")
                                                : book.authors.map(a => a.name || a.fullName || a).join(", "))
                                            : book.authorNames || "Không có"}
                                    </p>
                                </div>

                                {/* Thể loại */}
                                <div className="flex gap-3">
                                    <span className="font-medium min-w-32">Thể loại:</span>
                                    <p className="flex-1 leading-relaxed">
                                        {book.categories && Array.isArray(book.categories) && book.categories.length > 0
                                            ? (typeof book.categories[0] === "string"
                                                ? book.categories.join(", ")
                                                : book.categories.map(c => c.name || c).join(", "))
                                            : book.categoryName || "Không có"}
                                    </p>
                                </div>

                                {/* Nhà xuất bản */}
                                <div className="flex gap-3">
                                    <span className="font-medium min-w-32">Nhà xuất bản:</span>
                                    <p className="flex-1 leading-relaxed">{book.publisherName || "Không có"}</p>
                                </div>
                            </div>

                            {/* Thông tin chi tiết - Grid 2 cột */}
                            <div className="border-t pt-5">
                                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                                    <div className="flex gap-3">
                                        <span className="font-medium">Năm XB:</span>
                                        <p>{book.publicationYear || "N/A"}</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <span className="font-medium">Phiên bản:</span>
                                        <p>{book.edition || "N/A"}</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <span className="font-medium">Ngôn ngữ:</span>
                                        <p>{book.language || "N/A"}</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <span className="font-medium">Số trang:</span>
                                        <p>{book.pages || "N/A"}</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <span className="font-medium">Số lượng:</span>
                                        <p>{book.quantity ?? book.totalCopies ?? 0}</p>
                                    </div>
                                    {(book.availableCopies !== undefined || book.availableQuantity !== undefined) && (
                                        <div className="flex gap-3">
                                            <span className="font-medium">Còn lại:</span>
                                            <p>{book.availableCopies ?? book.availableQuantity ?? 0}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Mô tả */}
                            {book.description && (
                                <div className="border-t pt-5">
                                    <span className="font-medium block mb-3">Mô tả:</span>
                                    <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                                        {book.description}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}   