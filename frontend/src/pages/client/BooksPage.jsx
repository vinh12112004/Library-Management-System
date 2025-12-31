import { Card, CardContent } from "../../components/ui/card";
import { useNavigate } from "react-router-dom";

const mockBooks = [
    {
        id: 1,
        title: "Clean Code",
        author: "Robert C. Martin",
    },
    {
        id: 2,
        title: "Design Patterns",
        author: "GoF",
    },
    {
        id: 3,
        title: "You Don't Know JS",
        author: "Kyle Simpson",
    },
];

export default function ClientBooksPage() {
    const navigate = useNavigate();

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">📖 Danh sách sách</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {mockBooks.map((book) => (
                    <Card
                        key={book.id}
                        className="cursor-pointer hover:shadow-lg transition"
                        onClick={() => navigate(`/books/${book.id}`)}
                    >
                        <CardContent className="p-4">
                            <h3 className="font-semibold text-lg">
                                {book.title}
                            </h3>
                            <p className="text-sm text-gray-500">
                                {book.author}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
