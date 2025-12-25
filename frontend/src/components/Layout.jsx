import {
    BookOpen,
    LayoutDashboard,
    Users,
    Menu,
    Bell,
    Search,
    User,
    BookCopy,
    UserCircle,
    FolderTree,
    UserCog,
    BookmarkCheck,
    DollarSign,
    MessageCircle,
    LogOut,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function Layout({ children, userType }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { roles, user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };

    // Determine user type from roles if not provided
    const actualUserType = userType || (roles.includes("Reader") ? "reader" : "staff");
    const navItems = [
        { id: "dashboard", path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "books", path: "/books", label: "Books", icon: BookOpen },
        { id: "authors", path: "/authors", label: "Authors", icon: UserCircle },
        { id: "categories", path: "/categories", label: "Categories", icon: FolderTree },
        { id: "book-copies", path: "/book-copies", label: "Book Copies", icon: BookCopy },
        { id: "members", path: "/members", label: "Members", icon: Users },
        { id: "staff", path: "/staff", label: "Staff", icon: UserCog },
        { id: "loans", path: "/loans", label: "Loans", icon: BookmarkCheck },
        { id: "fines", path: "/fines", label: "Fines", icon: DollarSign },
        { id: "chat", path: "/chat", label: "Chat Support", icon: MessageCircle },
    ];

    // Tạm thời bỏ filter để xem tất cả items
    const filteredNavItems = navItems.filter((item) => {
        if (actualUserType === "reader") {
            // Reader can see: Books, Authors, Categories, Chat
            return ["books", "authors", "categories", "chat"].includes(item.id);
        }
        return true; // staff sees everything
    });

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                            <BookOpen className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">
                                LibraryMS
                            </h1>
                            <p className="text-xs text-gray-500">
                                Management System
                            </p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto py-4">
                    <ul className="space-y-1 px-3">
                        {filteredNavItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path ||
                                (item.id === "books" && location.pathname.startsWith("/books/")) ||
                                (item.id === "authors" && location.pathname.startsWith("/authors/")) ||
                                (item.id === "members" && location.pathname.startsWith("/members/"));
                            return (
                                <li key={item.id}>
                                    <button
                                        onClick={() => navigate(item.path)}
                                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                                            isActive
                                                ? "bg-blue-50 text-blue-600"
                                                : "text-gray-700 hover:bg-gray-50"
                                        }`}
                                    >
                                        <Icon className="h-5 w-5" />
                                        <span className="font-medium">
                                            {item.label}
                                        </span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                                {user?.email?.split("@")[0] || "User"}
                            </p>
                            <p className="text-xs text-gray-500">
                                {user?.email || "user@library.com"}
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={handleLogout}
                    >
                        <LogOut className="h-4 w-4 mr-2" />
                        Đăng xuất
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Navigation */}
                <header className="bg-white border-b border-gray-200">
                    <div className="px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                            <Button variant="ghost" size="icon">
                                <Menu className="h-5 w-5" />
                            </Button>
                            <div className="relative w-96">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    placeholder="Search books, members, or authors..."
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon">
                                <Bell className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto p-6">{children}</main>
            </div>
        </div>
    );
}
