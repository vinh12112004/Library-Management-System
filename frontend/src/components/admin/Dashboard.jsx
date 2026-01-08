import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
    BookOpen,
    BookCheck,
    BookMarked,
    AlertCircle,
    Users,
    TrendingUp,
    BookCopy,
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";
import { getDashboardStats } from "../../services/dashboardService";
import { toast } from "sonner";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            setLoading(true);
            const data = await getDashboardStats();
            setStats(data);
        } catch (error) {
            console.error("Error fetching dashboard stats:", error);
            toast.error("Failed to load dashboard statistics");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-lg">Loading dashboard...</div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-lg text-red-500">
                    Failed to load dashboard data
                </div>
            </div>
        );
    }

    const summaryStats = [
        {
            title: "Total Books",
            value: stats.totalBooks,
            icon: BookOpen,
            color: "text-blue-500",
            bgColor: "bg-blue-50",
        },
        {
            title: "Total Members",
            value: stats.totalMembers,
            icon: Users,
            color: "text-purple-500",
            bgColor: "bg-purple-50",
        },
        {
            title: "Total Loans",
            value: stats.totalLoans,
            icon: BookMarked,
            color: "text-green-500",
            bgColor: "bg-green-50",
        },
        {
            title: "Active Loans",
            value: stats.activeLoans,
            icon: BookCheck,
            color: "text-teal-500",
            bgColor: "bg-teal-50",
        },
        {
            title: "Overdue Loans",
            value: stats.overdueLoans,
            icon: AlertCircle,
            color: "text-red-500",
            bgColor: "bg-red-50",
        },
        {
            title: "Available Copies",
            value: stats.availableCopies,
            icon: BookCopy,
            color: "text-yellow-500",
            bgColor: "bg-yellow-50",
        },
        {
            title: "Borrowed Copies",
            value: stats.borrowedCopies,
            icon: BookMarked,
            color: "text-orange-500",
            bgColor: "bg-orange-50",
        },
    ];

    return (
        <div className="space-y-6 p-4">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold">Library Dashboard</h1>
                <p className="text-gray-600 mt-1">
                    Overview of library activity and statistics
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {summaryStats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={stat.title}>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">
                                            {stat.title}
                                        </p>
                                        <p className="text-2xl font-bold mt-2">
                                            {stat.value}
                                        </p>
                                    </div>
                                    <div
                                        className={`p-3 rounded-full ${stat.bgColor}`}
                                    >
                                        <Icon
                                            className={`h-6 w-6 ${stat.color}`}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Category Statistics */}
                <Card>
                    <CardHeader>
                        <CardTitle>Books by Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {stats.categoryStats.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={stats.categoryStats}
                                        dataKey="bookCount"
                                        nameKey="categoryName"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        label
                                    >
                                        {stats.categoryStats.map(
                                            (entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={
                                                        COLORS[
                                                            index %
                                                                COLORS.length
                                                        ]
                                                    }
                                                />
                                            )
                                        )}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="text-center text-gray-500 py-20">
                                No category data available
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Popular Books */}
                <Card>
                    <CardHeader>
                        <CardTitle>Most Popular Books</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {stats.popularBooks.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={stats.popularBooks}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="title"
                                        angle={-45}
                                        textAnchor="end"
                                        height={100}
                                    />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar
                                        dataKey="loanCount"
                                        fill="#8884d8"
                                        name="Loans"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="text-center text-gray-500 py-20">
                                No popular books data available
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Recent Loans Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Loans</CardTitle>
                </CardHeader>
                <CardContent>
                    {stats.recentLoans.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-3 px-4">
                                            Loan ID
                                        </th>
                                        <th className="text-left py-3 px-4">
                                            Member
                                        </th>
                                        <th className="text-left py-3 px-4">
                                            Book
                                        </th>
                                        <th className="text-left py-3 px-4">
                                            Loan Date
                                        </th>
                                        <th className="text-left py-3 px-4">
                                            Due Date
                                        </th>
                                        <th className="text-left py-3 px-4">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.recentLoans.map((loan) => (
                                        <tr
                                            key={loan.loanId}
                                            className="border-b hover:bg-gray-50"
                                        >
                                            <td className="py-3 px-4">
                                                #{loan.loanId}
                                            </td>
                                            <td className="py-3 px-4">
                                                {loan.memberName}
                                            </td>
                                            <td className="py-3 px-4">
                                                {loan.bookTitle}
                                            </td>
                                            <td className="py-3 px-4">
                                                {new Date(
                                                    loan.loanDate
                                                ).toLocaleDateString()}
                                            </td>
                                            <td className="py-3 px-4">
                                                {new Date(
                                                    loan.dueDate
                                                ).toLocaleDateString()}
                                            </td>
                                            <td className="py-3 px-4">
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                        loan.status ===
                                                        "Overdue"
                                                            ? "bg-red-100 text-red-800"
                                                            : loan.status ===
                                                              "Borrowing"
                                                            ? "bg-yellow-100 text-yellow-800"
                                                            : "bg-green-100 text-green-800"
                                                    }`}
                                                >
                                                    {loan.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 py-8">
                            No recent loans available
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Popular Books List */}
            {stats.popularBooks.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Top Borrowed Books</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {stats.popularBooks.map((book, index) => (
                                <div
                                    key={book.bookId}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <p className="font-semibold">
                                                {book.title}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                by {book.authorName}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="h-4 w-4 text-green-500" />
                                        <span className="font-semibold">
                                            {book.loanCount} loans
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
