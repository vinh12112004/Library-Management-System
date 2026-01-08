import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { getBookById } from "../../services/bookService";
import "./BookDetailPage.css";

export default function ClientBookDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBook = async () => {
            try {
                setLoading(true);
                const data = await getBookById(id);
                setBook(data);
            } catch (err) {
                setError("Không thể tải thông tin sách");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchBook();
    }, [id]);

    if (loading) {
        return (
            <div className="book-detail-container">
                <div className="loading">Đang tải...</div>
            </div>
        );
    }

    if (error || !book) {
        return (
            <div className="book-detail-container">
                <Button
                    variant="ghost"
                    onClick={() => navigate(-1)}
                    className="back-btn"
                >
                    ← Quay lại
                </Button>
                <div className="error">{error || "Không tìm thấy sách"}</div>
            </div>
        );
    }

    return (
        <div className="book-detail-container">
            <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="back-btn"
            >
                ← Quay lại
            </Button>

            <div className="book-detail-content">
                {/* Left: Book Cover */}
                <div className="book-detail-cover-section">
                    {book.coverImageUrl ? (
                        <img
                            src={book.coverImageUrl}
                            alt={book.title}
                            className="book-cover"
                            onError={(e) => {
                                e.target.style.display = "none";
                                e.target.nextSibling.style.display = "flex";
                            }}
                        />
                    ) : null}
                    <div
                        className="no-cover"
                        style={{
                            display: book.coverImageUrl ? "none" : "flex",
                        }}
                    >
                        <span>📚</span>
                    </div>

                    <div className="book-detail-availability">
                        {book.availableCopies > 0 ? (
                            <span className="available-badge">
                                ✓ Còn {book.availableCopies}/{book.totalCopies}{" "}
                                cuốn
                            </span>
                        ) : (
                            <span className="unavailable-badge">
                                ✕ Hết sách ({book.totalCopies} cuốn)
                            </span>
                        )}
                    </div>
                </div>

                {/* Right: Book Info */}
                <div className="book-detail-info-section">
                    <h1 className="book-title">{book.title}</h1>

                    <div className="book-detail-meta">
                        <div className="meta-item">
                            <span className="meta-label">Tác giả:</span>
                            <span className="meta-value">
                                {book.authors.join(", ")}
                            </span>
                        </div>

                        <div className="meta-item">
                            <span className="meta-label">Nhà xuất bản:</span>
                            <span className="meta-value">
                                {book.publisherName}
                            </span>
                        </div>

                        <div className="meta-item">
                            <span className="meta-label">ISBN:</span>
                            <span className="meta-value">{book.isbn}</span>
                        </div>

                        <div className="meta-item">
                            <span className="meta-label">Năm xuất bản:</span>
                            <span className="meta-value">
                                {book.publicationYear}
                            </span>
                        </div>

                        <div className="meta-item">
                            <span className="meta-label">Phiên bản:</span>
                            <span className="meta-value">
                                Lần {book.edition}
                            </span>
                        </div>

                        <div className="meta-item">
                            <span className="meta-label">Ngôn ngữ:</span>
                            <span className="meta-value">{book.language}</span>
                        </div>

                        <div className="meta-item">
                            <span className="meta-label">Số trang:</span>
                            <span className="meta-value">
                                {book.pages} trang
                            </span>
                        </div>

                        <div className="meta-item">
                            <span className="meta-label">Thể loại:</span>
                            <span className="meta-value">
                                {book.categories.map((cat, index) => (
                                    <span key={index} className="category-tag">
                                        {cat}
                                    </span>
                                ))}
                            </span>
                        </div>
                    </div>

                    <div className="book-detail-description">
                        <h3>Mô tả</h3>
                        <p>{book.description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
