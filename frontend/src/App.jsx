import { useState } from "react";
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
import { ReservationsManagement } from "./components/ReservationsManagement";
import { FinesManagement } from "./components/FinesManagement";
import { ReviewsManagement } from "./components/ReviewsManagement";
import { ActivityLogsManagement } from "./components/ActivityLogsManagement";
import { Login } from "./components/Login";

export default function App() {
    const [currentPage, setCurrentPage] = useState("dashboard");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userType, setUserType] = useState("staff");
    const [selectedId, setSelectedId] = useState(null);

    const handleLogin = (type) => {
        setUserType(type);
        setIsLoggedIn(true);
    };

    const handleNavigate = (page, id) => {
        setCurrentPage(page);
        console.log(`Navigating to ${page} with ID: ${id}`);
        if (id !== undefined) {
            setSelectedId(id);
        } else {
            setSelectedId(null);
        }
    };

    if (!isLoggedIn) {
        return <Login onLogin={handleLogin} />;
    }

    const renderPage = () => {
        switch (currentPage) {
            case "dashboard":
                return <Dashboard onNavigate={handleNavigate} />;
            case "books":
                return <BooksManagement onNavigate={handleNavigate} />;
            case "book-detail":
                return selectedId ? (
                    <BookDetail
                        bookId={selectedId}
                        onBack={() => setCurrentPage("books")}
                    />
                ) : (
                    <BooksManagement onNavigate={handleNavigate} />
                );
            case "book-copies":
                return <BookCopiesManagement />;
            case "authors":
                return <AuthorsManagement onNavigate={handleNavigate} />;
            case "author-detail":
                return selectedId ? (
                    <AuthorDetail
                        authorId={selectedId}
                        onBack={() => setCurrentPage("authors")}
                    />
                ) : (
                    <AuthorsManagement onNavigate={handleNavigate} />
                );
            case "categories":
                return <CategoriesManagement />;
            case "members":
                return <MembersManagement onNavigate={handleNavigate} />;
            case "member-detail":
                return selectedId ? (
                    <MemberDetail
                        memberId={selectedId}
                        onBack={() => setCurrentPage("members")}
                    />
                ) : (
                    <MembersManagement onNavigate={handleNavigate} />
                );
            case "staff":
                return <StaffsManagement onNavigate={handleNavigate} />;
            case "loans":
                return <LoansManagement />;
            case "reservations":
                return <ReservationsManagement />;
            case "fines":
                return <FinesManagement />;
            case "reviews":
                return <ReviewsManagement />;
            case "activity-logs":
                return <ActivityLogsManagement />;
            default:
                return <Dashboard onNavigate={handleNavigate} />;
        }
    };

    return (
        <Layout
            currentPage={currentPage}
            onNavigate={handleNavigate}
            userType={userType}
        >
            {renderPage()}
        </Layout>
    );
}
