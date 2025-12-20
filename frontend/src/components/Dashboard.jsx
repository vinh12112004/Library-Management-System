import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
    BookOpen,
    BookCheck,
    BookMarked,
    AlertCircle,
    Users,
    DollarSign,
    BookmarkCheck,
    TrendingUp,
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
} from "recharts";
import { Badge } from "./ui/badge";

export function Dashboard({ onNavigate }) {
    const stats = [
        {
            title: "Books Borrowed",
            value: 847,
            change: "12%",
            icon: BookOpen,
            color: "text-blue-500",
        },
        {
            title: "Books Returned",
            value: 923,
            change: "-8%",
            icon: BookCheck,
            color: "text-green-500",
        },
        {
            title: "Books Pending",
            value: 245,
            change: "5%",
            icon: BookMarked,
            color: "text-yellow-500",
        },
        {
            title: "Late Returns",
            value: 340,
            change: "-4%",
            icon: AlertCircle,
            color: "text-red-500",
        },
        {
            title: "Users Registered",
            value: 245,
            change: "15%",
            icon: Users,
            color: "text-purple-500",
        },
        {
            title: "Late Fees",
            value: "$340",
            change: "-2%",
            icon: DollarSign,
            color: "text-gray-500",
        },
        {
            title: "Books Available",
            value: 923,
            change: "10%",
            icon: BookmarkCheck,
            color: "text-teal-500",
        },
        {
            title: "Trending Books",
            value: 245,
            change: "7%",
            icon: TrendingUp,
            color: "text-orange-500",
        },
    ];

    const recentActivities = [
        {
            id: 1,
            userType: "Member",
            userName: "John Doe",
            action: "borrowed",
            details: "The Great Gatsby",
            timestamp: "2025-12-01",
        },
        {
            id: 2,
            userType: "Admin",
            userName: "Jane Smith",
            action: "returned",
            details: "1984",
            timestamp: "2025-12-01",
        },
        {
            id: 3,
            userType: "Member",
            userName: "Sam Green",
            action: "borrowed",
            details: "To Kill a Mockingbird",
            timestamp: "2025-12-02",
        },
        {
            id: 4,
            userType: "Member",
            userName: "Alice Brown",
            action: "borrowed",
            details: "Pride and Prejudice",
            timestamp: "2025-12-02",
        },
    ];

    const borrowingData = [
        { month: "Jan", borrowed: 100, returned: 90 },
        { month: "Feb", borrowed: 120, returned: 110 },
        { month: "Mar", borrowed: 130, returned: 120 },
        { month: "Apr", borrowed: 150, returned: 140 },
        { month: "May", borrowed: 160, returned: 150 },
        { month: "Jun", borrowed: 180, returned: 170 },
    ];

    return (
        <div>
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-semibold">Library Dashboard</h1>
                <p className="text-lg text-gray-500">
                    Overview of library activity and statistics.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={stat.title}>
                            <CardContent className="flex justify-between items-center">
                                <div>
                                    <p className="text-sm text-gray-500">
                                        {stat.title}
                                    </p>
                                    <p className="text-xl font-semibold">
                                        {stat.value}
                                    </p>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <TrendingUp
                                            className={`h-4 w-4 ${stat.color}`}
                                        />
                                        <span className="ml-1">
                                            {stat.change}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-3xl">
                                    <Icon className={`h-8 w-8 ${stat.color}`} />
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Chart */}
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Borrowing & Return Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={borrowingData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="borrowed"
                                stroke="#8884d8"
                            />
                            <Line
                                type="monotone"
                                dataKey="returned"
                                stroke="#82ca9d"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Recent Activities</CardTitle>
                </CardHeader>
                <CardContent>
                    <div>
                        {recentActivities.map((activity) => (
                            <div
                                key={activity.id}
                                className="flex justify-between items-center py-2"
                            >
                                <div className="flex items-center">
                                    {activity.userType === "Member" ? (
                                        <BookOpen className="h-6 w-6 text-blue-500" />
                                    ) : (
                                        <Users className="h-6 w-6 text-green-500" />
                                    )}
                                    <p className="ml-2 text-sm">
                                        {activity.userName}
                                    </p>
                                </div>
                                <div className="text-sm">
                                    <p>
                                        {activity.userName} {activity.action} "
                                        {activity.details}"
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {activity.timestamp}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
