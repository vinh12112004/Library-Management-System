import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
    BookOpen,
    User,
    LogIn,
    LogOut,
    ClipboardList,
    Home as HomeIcon,
    MessageCircle,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { useAuth } from "../context/AuthContext";
import { ChatReader } from "../components/ChatReader";
import { useState } from "react";
import "./ClientLayout.css";

export default function ClientLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, user, logout } = useAuth();
    const [isChatOpen, setIsChatOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const navItems = [
        {
            label: "Trang chủ",
            path: "/",
            icon: <HomeIcon className="h-4 w-4" />,
        },
        {
            label: "Sách",
            path: "/books",
            icon: <BookOpen className="h-4 w-4" />,
        },
    ];

    if (isAuthenticated) {
        navItems.push({
            label: "Mượn sách",
            path: "/loans",
            icon: <ClipboardList className="h-4 w-4" />,
        });
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
            {/* Header */}
            <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div
                        className="flex items-center gap-2 cursor-pointer group"
                        onClick={() => navigate("/")}
                    >
                        <div className="bg-blue-600 p-1.5 rounded-lg group-hover:bg-blue-700 transition-colors">
                            <BookOpen className="h-6 w-6 text-white" />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-gray-800">
                            LibraryMS
                        </span>
                    </div>

                    <nav className="flex items-center gap-1 md:gap-4">
                        {navItems.map((item) => (
                            <button
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                                    location.pathname === item.path
                                        ? "bg-blue-50 text-blue-600"
                                        : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
                                }`}
                            >
                                {item.icon}
                                {item.label}
                            </button>
                        ))}

                        <div className="h-6 w-[1px] bg-gray-200 mx-2" />

                        {!isAuthenticated ? (
                            <Button
                                size="sm"
                                onClick={() => navigate("/login")}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                <LogIn className="h-4 w-4 mr-2" /> Đăng nhập
                            </Button>
                        ) : (
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full">
                                    <User className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm font-semibold text-gray-700">
                                        {user?.email?.split("@")[0]}
                                    </span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleLogout}
                                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                >
                                    <LogOut className="h-4 w-4 mr-1" /> Thoát
                                </Button>
                            </div>
                        )}
                    </nav>
                </div>
            </header>

            <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
                <Outlet />
            </main>

            <footer className="bg-white border-t py-6 text-center text-sm text-gray-500">
                <p>© {new Date().getFullYear()} Library Management System.</p>
            </footer>

            {/* Floating Chat Button - chỉ hiển thị khi đã đăng nhập */}
            {isAuthenticated && (
                <>
                    {!isChatOpen && (
                        <button
                            className="floating-chat-button"
                            onClick={() => setIsChatOpen(true)}
                            title="Hỗ trợ trực tuyến"
                        >
                            <MessageCircle className="h-6 w-6" />
                        </button>
                    )}

                    {/* Chat Modal */}
                    {isChatOpen && (
                        <div className="chat-modal-overlay">
                            <div className="chat-modal">
                                <div className="chat-modal-header">
                                    <h3>Hỗ trợ trực tuyến</h3>
                                    <button
                                        className="chat-close-button"
                                        onClick={() => setIsChatOpen(false)}
                                    >
                                        ✕
                                    </button>
                                </div>
                                <div className="chat-modal-content">
                                    <ChatReader />
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
