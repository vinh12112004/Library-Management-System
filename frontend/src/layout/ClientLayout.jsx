import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { BookOpen, User, LogIn, LogOut } from "lucide-react";
import { Button } from "../components/ui/button";
import { useAuth } from "../context/AuthContext";

export default function ClientLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const navItems = [
        { label: "Trang chủ", path: "/" },
        { label: "Sách", path: "/books" },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    {/* Logo */}
                    <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => navigate("/")}
                    >
                        <BookOpen className="h-6 w-6 text-blue-600" />
                        <span className="font-bold text-lg">LibraryMS</span>
                    </div>

                    {/* Navigation */}
                    <nav className="flex items-center gap-6">
                        {navItems.map((item) => (
                            <button
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                className={`text-sm font-medium ${
                                    location.pathname === item.path
                                        ? "text-blue-600"
                                        : "text-gray-600 hover:text-blue-600"
                                }`}
                            >
                                {item.label}
                            </button>
                        ))}

                        {!isAuthenticated ? (
                            <Button
                                size="sm"
                                onClick={() => navigate("/login")}
                            >
                                <LogIn className="h-4 w-4 mr-1" />
                                Đăng nhập
                            </Button>
                        ) : (
                            <div className="flex items-center gap-2">
                                <User className="h-5 w-5 text-gray-500" />
                                <span className="text-sm">
                                    {user?.email?.split("@")[0]}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleLogout}
                                >
                                    <LogOut className="h-4 w-4 mr-1" />
                                    Thoát
                                </Button>
                            </div>
                        )}
                    </nav>
                </div>
            </header>

            {/* Main */}
            <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-6">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-white border-t py-4 text-center text-sm text-gray-500">
                © {new Date().getFullYear()} Library Management System
            </footer>
        </div>
    );
}
