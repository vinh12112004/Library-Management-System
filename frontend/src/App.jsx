import { Routes, Route, Navigate } from "react-router-dom";
import { AdminLayout } from "./layout/AdminLayout";
import BooksPage from "./pages/admin/BooksPage";
import DashboardPage from "./pages/admin/DashboardPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Login } from "./components/Login";
import AuthorsPage from "./pages/admin/AuthorsPage";
import LoansPage from "./pages/admin/LoansPage";
import ChatPage from "./pages/admin/ChatPage";
import CategoriesPage from "./pages/admin/CategoriesPage";
import BookCopiesPage from "./pages/admin/BookCopiesPage";
import MembersPage from "./pages/admin/MembersPage";
import StaffsPage from "./pages/admin/StaffsPage";
import ClientLayout from "./layout/ClientLayout";
import HomePage from "./pages/client/HomePage";
import ClientBooksPage from "./pages/client/BooksPage";
import ClientBookDetailPage from "./pages/client/BookDetailPage";
import MyLoansPage from "./pages/client/MyLoansPage";
export default function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />

            {/* ADMIN */}
            <Route
                path="/admin"
                element={
                    <ProtectedRoute requiredRoles={["Admin", "Staff"]}>
                        <AdminLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="books" element={<BooksPage />} />
                <Route path="authors" element={<AuthorsPage />} />
                <Route path="loans" element={<LoansPage />} />
                <Route path="chat" element={<ChatPage />} />
                <Route path="categories" element={<CategoriesPage />} />
                <Route path="book-copies" element={<BookCopiesPage />} />
                <Route path="members" element={<MembersPage />} />
                <Route path="staffs" element={<StaffsPage />} />
            </Route>

            {/* CLIENT */}
            <Route path="/" element={<ClientLayout />}>
                <Route index element={<HomePage />} />
                <Route path="books" element={<ClientBooksPage />} />
                <Route path="books/:id" element={<ClientBookDetailPage />} />
                <Route path="loans" element={<MyLoansPage />} />
            </Route>
        </Routes>
    );
}
