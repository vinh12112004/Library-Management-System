import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Dashboard } from "./components/Dashboard";
import { BooksManagement } from "./components/BooksManagement";
import { BookDetail } from "./components/BookDetail";
import { BookCopiesManagement } from "./components/BookCopiesManagement";
import { AuthorsManagement } from "./components/AuthorsManagement";
import { AuthorDetail } from "./components/AuthorDetail";
import { CategoriesManagement } from "./components/CategoriesManagement";
import { MembersManagement } from "./components/MembersManagement";
import { MemberDetail } from "./components/MemberDetail";
import { StaffsManagement } from "./components/StaffsManagement";
import { LoansManagement } from "./components/LoansManagement";
import { FinesManagement } from "./components/FinesManagement";
import { ActivityLogsManagement } from "./components/ActivityLogsManagement";
import { Login } from "./components/Login";
import { ChatSupport } from "./components/ChatSupport";
import { ChatReader } from "./components/ChatReader";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

export default function App() {
    const { isAuthenticated, roles } = useAuth();

    // Determine user type from roles
    const getUserType = () => {
        if (roles.includes("Reader")) {
            return "reader";
        }
        return "staff";
    };

    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route
                path="/*"
                element={
                    <ProtectedRoute>
                        <Layout userType={getUserType()}>
                            <Routes>
                                <Route
                                    index
                                    element={<Navigate to="/dashboard" replace />}
                                />
                                <Route
                                    path="dashboard"
                                    element={<Dashboard />}
                                />
                                <Route
                                    path="books"
                                    element={<BooksManagement />}
                                />
                                <Route
                                    path="books/:id"
                                    element={<BookDetail />}
                                />
                                <Route
                                    path="book-copies"
                                    element={<BookCopiesManagement />}
                                />
                                <Route
                                    path="authors"
                                    element={<AuthorsManagement />}
                                />
                                <Route
                                    path="authors/:id"
                                    element={<AuthorDetail />}
                                />
                                <Route
                                    path="categories"
                                    element={<CategoriesManagement />}
                                />
                                <Route
                                    path="members"
                                    element={<MembersManagement />}
                                />
                                <Route
                                    path="members/:id"
                                    element={<MemberDetail />}
                                />
                                <Route
                                    path="staff"
                                    element={<StaffsManagement />}
                                />
                                <Route
                                    path="loans"
                                    element={<LoansManagement />}
                                />
                                <Route
                                    path="fines"
                                    element={<FinesManagement />}
                                />
                                <Route
                                    path="activity-logs"
                                    element={<ActivityLogsManagement />}
                                />
                                <Route
                                    path="chat"
                                    element={
                                        getUserType() === "staff" ? (
                                            <ChatSupport />
                                        ) : (
                                            <ChatReader />
                                        )
                                    }
                                />
                                <Route
                                    path="*"
                                    element={<Navigate to="/dashboard" replace />}
                                />
                            </Routes>
                        </Layout>
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}
