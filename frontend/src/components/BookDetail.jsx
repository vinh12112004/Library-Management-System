import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { ArrowLeft, BookOpen, Star } from "lucide-react";

/* =========================
   FAKE DATA 
========================= */
const FAKE_BOOKS = [
  {
    bookId: 1,
    isbn: "978-604-80-1234-5",
    title: "Lập Trình Web Hiện Đại",
    publisherName: "NXB CNTT",
    publicationYear: 2023,
    edition: "2nd",
    language: "Tiếng Việt",
    pages: 420,
    description: "Sách về React & NodeJS",
    coverImageUrl: "https://picsum.photos/300/450?1",
    authorIds: [1],
    categoryIds: [2],
  },
  {
    bookId: 2,
    isbn: "978-604-80-5678-9",
    title: "Cấu Trúc Dữ Liệu & Giải Thuật",
    publisherName: "NXB Giáo Dục",
    publicationYear: 2021,
    edition: "1st",
    language: "Tiếng Việt",
    pages: 550,
    description: "Nền tảng tư duy thuật toán",
    coverImageUrl: "https://picsum.photos/300/450?2",
    authorIds: [2],
    categoryIds: [1, 4],
  },
];

const FAKE_AUTHORS = [
  { id: 1, name: "Nguyễn Văn A", nationality: "Vietnam", dob: "1985-06-12" },
  { id: 2, name: "Trần Thị B", nationality: "Vietnam", dob: "1990-03-21" },
];

const FAKE_CATEGORIES = [
  { id: 1, name: "Computer Science" },
  { id: 2, name: "Web Development" },
  { id: 4, name: "Algorithms" },
];

const FAKE_COPIES = [
  {
    id: 101,
    bookId: 1,
    barcode: "BC-001",
    status: "Available",
    location: "Shelf A1",
    date: "2024-01-10",
    price: 120000,
  },
  {
    id: 102,
    bookId: 1,
    barcode: "BC-002",
    status: "Borrowed",
    location: "Shelf A1",
    date: "2024-02-05",
    price: 120000,
  },
  {
    id: 201,
    bookId: 2,
    barcode: "BC-101",
    status: "Available",
    location: "Shelf B2",
    date: "2023-08-15",
    price: 150000,
  },
];

const FAKE_REVIEWS = [
  {
    id: 1,
    bookId: 1,
    user: "minh_anh",
    rating: 5,
    comment: "Sách rất dễ hiểu, phù hợp người mới.",
    date: "2024-11-01",
  },
];

/* =========================
   COMPONENT
========================= */
export function BookDetail({ bookId, onBack }) {
  const book = FAKE_BOOKS.find((b) => b.bookId === bookId);
  if (!book) return <div className="p-4">Book not found</div>;

  const copies = FAKE_COPIES.filter((c) => c.bookId === bookId);
  const reviews = FAKE_REVIEWS.filter((r) => r.bookId === bookId);

  const authors = FAKE_AUTHORS.filter((a) =>
    book.authorIds.includes(a.id)
  );
  const categories = FAKE_CATEGORIES.filter((c) =>
    book.categoryIds.includes(c.id)
  );

  const statusColor = (status) => ({
    Available: "bg-green-100 text-green-700",
    Borrowed: "bg-amber-100 text-amber-700",
  }[status] || "bg-gray-100");

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{book.title}</h1>
          <p className="text-muted-foreground">Book ID: #{book.bookId}</p>
        </div>
      </div>

      {/* Info */}
      <Card>
        <CardHeader>
          <CardTitle>Book Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <p><b>ISBN:</b> {book.isbn}</p>
          <p><b>Publisher:</b> {book.publisherName}</p>
          <p><b>Year:</b> {book.publicationYear}</p>
          <p><b>Language:</b> {book.language}</p>
          <p><b>Pages:</b> {book.pages}</p>
          <p><b>Edition:</b> {book.edition}</p>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="copies">
        <TabsList>
          <TabsTrigger value="copies">Copies</TabsTrigger>
          <TabsTrigger value="authors">Authors</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="copies">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Barcode</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Location</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {copies.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>#{c.id}</TableCell>
                  <TableCell>{c.barcode}</TableCell>
                  <TableCell>
                    <Badge className={statusColor(c.status)}>
                      {c.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{c.location}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="authors">
          {authors.map((a) => (
            <Card key={a.id} className="mb-2">
              <CardContent className="p-4">
                <b>{a.name}</b> – {a.nationality} ({a.dob})
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="categories">
          <div className="flex gap-2">
            {categories.map((c) => (
              <Badge key={c.id}>{c.name}</Badge>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reviews">
          {reviews.length ? reviews.map((r) => (
            <Card key={r.id}>
              <CardContent className="p-4">
                <b>{r.user}</b>
                <div className="flex">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i}
                      className={`w-4 h-4 ${i <= r.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <p>{r.comment}</p>
              </CardContent>
            </Card>
          )) : (
            <p className="text-muted-foreground">No reviews</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
