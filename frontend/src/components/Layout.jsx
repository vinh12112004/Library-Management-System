import {
    BookOpen,
    LayoutDashboard,
    Users,
    RefreshCw,
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
    Star,
    MessageCircle,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function Layout({ children, currentPage, onNavigate, userType }) {
    const navItems = [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "books", label: "Books", icon: BookOpen },
        { id: "authors", label: "Authors", icon: UserCircle },
        { id: "categories", label: "Categories", icon: FolderTree },
        { id: "book-copies", label: "Book Copies", icon: BookCopy },
        { id: "members", label: "Members", icon: Users },
        { id: "staff", label: "Staff", icon: UserCog },
        {
            id: "borrow-return",
            label: "Borrow & Return",
            icon: RefreshCw,
        },
        { id: "loans", label: "Loans", icon: BookmarkCheck },
        { id: "reservations", label: "Reservations", icon: BookmarkCheck },
        { id: "fines", label: "Fines", icon: DollarSign },
        { id: "reviews", label: "Reviews", icon: Star },
        { id: "chat", label: "Chat Support", icon: MessageCircle },
    ];

    // Tạm thời bỏ filter để xem tất cả items
    const filteredNavItems = navItems.filter((item) => {
        if (userType === "reader") {
            // Reader chỉ cần Chat
            return item.id === "chat";
        }
        return true; // staff thấy tất cả
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
                            const isActive =
                                (item.id === "dashboard" &&
                                    currentPage === "dashboard") ||
                                (item.id === "books" &&
                                    (currentPage === "books" ||
                                        currentPage === "book-detail")) ||
                                (item.id === "authors" &&
                                    (currentPage === "authors" ||
                                        currentPage === "author-detail")) ||
                                (item.id === "members" &&
                                    (currentPage === "members" ||
                                        currentPage === "member-detail")) ||
                                (item.id === "staff" &&
                                    (currentPage === "staff" ||
                                        currentPage === "staff-detail")) ||
                                currentPage === item.id;
                            return (
                                <li key={item.id}>
                                    <button
                                        onClick={() => onNavigate(item.id)}
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
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                                Admin User
                            </p>
                            <p className="text-xs text-gray-500">
                                admin@library.com
                            </p>
                        </div>
                    </div>
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
