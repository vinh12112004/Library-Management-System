import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getBooks } from "../../services/bookService";
import "./BooksPage.css";

const BooksPage = () => {
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [pagination, setPagination] = useState({
        pageNumber: 1,
        pageSize: 12,
        totalPages: 1,
        totalCount: 0,
        hasNextPage: false,
        hasPreviousPage: false,
    });

    const fetchBooks = async (pageNumber = 1, search = "") => {
        setLoading(true);
        try {
            const response = await getBooks({
                pageNumber,
                pageSize: 12,
                title: search || undefined,
            });

            setBooks(response.items);
            setPagination({
                pageNumber: response.pageNumber,
                pageSize: response.pageSize,
                totalPages: response.totalPages,
                totalCount: response.totalCount,
                hasNextPage: response.hasNextPage,
                hasPreviousPage: response.hasPreviousPage,
            });
        } catch (error) {
            console.error("Lỗi khi tải sách:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks(1, searchTerm);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchBooks(1, searchTerm);
    };

    const handlePageChange = (newPage) => {
        fetchBooks(newPage, searchTerm);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleViewDetail = (bookId) => {
        navigate(`/books/${bookId}`);
    };

    return (
        <div className="page-container">
            {/* Header */}
            <div className="page-header">
                <h2>Tất cả sách</h2>
                <p className="total-books">
                    Có {pagination.totalCount} đầu sách trong thư viện
                </p>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="search-form">
                <div className="search-wrapper">
                    <input
                        type="text"
                        placeholder="Tìm kiếm sách theo tên..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <button type="submit" className="search-btn">
                        Tìm kiếm
                    </button>
                </div>
            </form>

            {/* Loading State */}
            {loading ? (
                <div className="book-grid">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                        <div key={i} className="skeleton-card"></div>
                    ))}
                </div>
            ) : books.length === 0 ? (
                <div className="empty-state">
                    <p>Không tìm thấy sách nào</p>
                </div>
            ) : (
                <>
                    {/* Books Grid */}
                    <div className="book-grid">
                        {books.map((book) => (
                            <div key={book.bookId} className="book-card">
                                <div className="book-image">
                                    {book.coverImageUrl ? (
                                        <img
                                            src={book.coverImageUrl}
                                            alt={book.title}
                                            onError={(e) => {
                                                e.target.style.display = "none";
                                                e.target.nextSibling.style.display =
                                                    "flex";
                                            }}
                                        />
                                    ) : null}
                                    <div
                                        className="no-image"
                                        style={{
                                            display: book.coverImageUrl
                                                ? "none"
                                                : "flex",
                                        }}
                                    >
                                        <span>📚</span>
                                    </div>

                                    {/* Availability Badge */}
                                    <div className="availability-badge">
                                        {book.availableCopies > 0 ? (
                                            <span className="available">
                                                Còn {book.availableCopies}
                                            </span>
                                        ) : (
                                            <span className="unavailable">
                                                Hết sách
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="book-info">
                                    <h3 className="book-title">{book.title}</h3>
                                    <p className="book-author">
                                        {book.authors.join(", ")}
                                    </p>
                                    <button
                                        className="view-detail-btn"
                                        onClick={() =>
                                            handleViewDetail(book.bookId)
                                        }
                                    >
                                        📖 Xem chi tiết
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="pagination">
                            <button
                                onClick={() =>
                                    handlePageChange(pagination.pageNumber - 1)
                                }
                                disabled={!pagination.hasPreviousPage}
                                className="pagination-btn"
                            >
                                ← Trước
                            </button>

                            <div className="pagination-numbers">
                                {Array.from(
                                    { length: pagination.totalPages },
                                    (_, i) => i + 1
                                ).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`pagination-number ${
                                            page === pagination.pageNumber
                                                ? "active"
                                                : ""
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() =>
                                    handlePageChange(pagination.pageNumber + 1)
                                }
                                disabled={!pagination.hasNextPage}
                                className="pagination-btn"
                            >
                                Sau →
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default BooksPage;
