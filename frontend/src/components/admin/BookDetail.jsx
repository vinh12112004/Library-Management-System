import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    ArrowLeft,
    BookOpen,
    User,
    Tag,
    Building2,
    Calendar,
    Globe,
    FileText,
    Package,
} from "lucide-react";
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

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
                <Button
                    variant="ghost"
                    onClick={() => navigate("/books")}
                    className="hover:bg-white/80 transition-all"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Quay lại
                </Button>
                <div className="flex items-center justify-center mt-20">
                    <div className="text-center space-y-4">
                        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="text-slate-600 font-medium">
                            Đang tải dữ liệu...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
                <Button
                    variant="ghost"
                    onClick={() => navigate("/books")}
                    className="hover:bg-white/80 transition-all"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Quay lại
                </Button>
                <div className="flex items-center justify-center mt-20">
                    <Card className="max-w-md">
                        <CardContent className="p-8 text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl">⚠️</span>
                            </div>
                            <p className="text-red-600 font-medium">{error}</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    if (!book) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
                <Button
                    variant="ghost"
                    onClick={() => navigate("/books")}
                    className="hover:bg-white/80 transition-all"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Quay lại
                </Button>
                <div className="flex items-center justify-center mt-20">
                    <Card className="max-w-md">
                        <CardContent className="p-8 text-center">
                            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <BookOpen className="w-8 h-8 text-amber-600" />
                            </div>
                            <p className="text-slate-700 font-medium">
                                Không tìm thấy sách (ID: {bookId})
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    const InfoRow = ({ icon: Icon, label, value }) => (
        <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-slate-50 transition-colors">
            <Icon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-slate-600 block">
                    {label}
                </span>
                <p className="text-slate-900 mt-1 break-words">{value}</p>
            </div>
        </div>
    );

    const GridInfoItem = ({ label, value }) => (
        <div className="rounded-lg p-5 hover:bg-slate-50 transition-all">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide block mb-2">
                {label}
            </span>
            <p className="text-lg font-semibold text-slate-900">{value}</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="max-w-7xl mx-auto p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        onClick={() => navigate("/books")}
                        className="hover:bg-white/80 transition-all shadow-sm"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Quay lại
                    </Button>
                    <h1 className="text-3xl font-bold text-slate-800">
                        Chi tiết sách
                    </h1>
                </div>

                {/* Main Content */}
                <Card className="shadow-xl border-0 overflow-hidden">
                    <CardContent className="p-0">
                        <div className="flex flex-col lg:flex-row">
                            {/* LEFT: Cover Image Section */}
                            <div className="lg:w-96 bg-gradient-to-br from-blue-50 to-indigo-50 p-12 flex items-start justify-center">
                                <div className="sticky top-8">
                                    {book.coverImageUrl ? (
                                        <img
                                            src={book.coverImageUrl}
                                            alt={book.title}
                                            className="w-64 h-auto rounded-xl shadow-2xl object-cover border-4 border-white"
                                            onError={(e) =>
                                                (e.target.style.display =
                                                    "none")
                                            }
                                        />
                                    ) : (
                                        <div className="w-64 h-80 bg-white rounded-xl shadow-2xl flex flex-col items-center justify-center border-4 border-slate-200">
                                            <BookOpen className="w-16 h-16 text-slate-300 mb-3" />
                                            <span className="text-sm text-slate-400 font-medium">
                                                Không có ảnh bìa
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* RIGHT: Book Information */}
                            <div className="flex-1 p-12 lg:p-14 space-y-10">
                                {/* Title Section */}
                                <div className="pb-8">
                                    <h2 className="text-4xl font-bold text-slate-900 mb-3 leading-tight">
                                        {book.title}
                                    </h2>
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <span className="text-sm font-mono bg-slate-100 px-3 py-1 rounded-full">
                                            ISBN: {book.isbn}
                                        </span>
                                    </div>
                                </div>

                                {/* Main Info Section */}
                                <div className="space-y-3">
                                    <InfoRow
                                        icon={User}
                                        label="Tác giả"
                                        value={
                                            book.authors &&
                                            Array.isArray(book.authors) &&
                                            book.authors.length > 0
                                                ? typeof book.authors[0] ===
                                                  "string"
                                                    ? book.authors.join(", ")
                                                    : book.authors
                                                          .map(
                                                              (a) =>
                                                                  a.name ||
                                                                  a.fullName ||
                                                                  a
                                                          )
                                                          .join(", ")
                                                : book.authorNames || "Không có"
                                        }
                                    />

                                    <InfoRow
                                        icon={Tag}
                                        label="Thể loại"
                                        value={
                                            book.categories &&
                                            Array.isArray(book.categories) &&
                                            book.categories.length > 0
                                                ? typeof book.categories[0] ===
                                                  "string"
                                                    ? book.categories.join(", ")
                                                    : book.categories
                                                          .map(
                                                              (c) => c.name || c
                                                          )
                                                          .join(", ")
                                                : book.categoryName ||
                                                  "Không có"
                                        }
                                    />

                                    <InfoRow
                                        icon={Building2}
                                        label="Nhà xuất bản"
                                        value={book.publisherName || "Không có"}
                                    />
                                </div>

                                {/* Details Grid */}
                                <div className="pt-8">
                                    <h3 className="text-lg font-semibold text-slate-800 mb-6">
                                        Thông tin chi tiết
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                        <GridInfoItem
                                            label="Năm xuất bản"
                                            value={
                                                book.publicationYear || "N/A"
                                            }
                                        />
                                        <GridInfoItem
                                            label="Phiên bản"
                                            value={book.edition || "N/A"}
                                        />
                                        <GridInfoItem
                                            label="Ngôn ngữ"
                                            value={book.language || "N/A"}
                                        />
                                        <GridInfoItem
                                            label="Số trang"
                                            value={book.pages || "N/A"}
                                        />
                                        <GridInfoItem
                                            label="Tổng số lượng"
                                            value={
                                                book.quantity ??
                                                book.totalCopies ??
                                                0
                                            }
                                        />
                                        {(book.availableCopies !== undefined ||
                                            book.availableQuantity !==
                                                undefined) && (
                                            <GridInfoItem
                                                label="Còn lại"
                                                value={
                                                    book.availableCopies ??
                                                    book.availableQuantity ??
                                                    0
                                                }
                                            />
                                        )}
                                    </div>
                                </div>

                                {/* Description */}
                                {book.description && (
                                    <div className="pt-8">
                                        <div className="flex items-center gap-2 mb-5">
                                            <FileText className="w-5 h-5 text-blue-600" />
                                            <h3 className="text-lg font-semibold text-slate-800">
                                                Mô tả
                                            </h3>
                                        </div>
                                        <div className="rounded-lg p-6">
                                            <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                                                {book.description}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
