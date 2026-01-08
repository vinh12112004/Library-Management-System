const SAMPLE_LOANS = [
    {
        id: "L001",
        book: "Lập trình React cơ bản",
        borrowDate: "2023-10-20",
        returnDate: "2023-11-20",
        status: "Đang mượn",
    },
    {
        id: "L002",
        book: "Thiết kế UI/UX",
        borrowDate: "2023-09-15",
        returnDate: "2023-10-15",
        status: "Quá hạn",
    },
];

export function LoanPage() {
    return (
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
            <div className="p-6 border-b">
                <h2 className="text-xl font-bold text-gray-800">
                    Sách đang mượn
                </h2>
                <p className="text-sm text-gray-500">
                    Theo dõi thời hạn và trạng thái trả sách của bạn
                </p>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold">
                        <tr>
                            <th className="px-6 py-4">Mã đơn</th>
                            <th className="px-6 py-4">Tên sách</th>
                            <th className="px-6 py-4">Ngày mượn</th>
                            <th className="px-6 py-4">Hạn trả</th>
                            <th className="px-6 py-4">Trạng thái</th>
                            <th className="px-6 py-4 text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y text-sm">
                        {SAMPLE_LOANS.map((loan) => (
                            <tr
                                key={loan.id}
                                className="hover:bg-gray-50 transition-colors"
                            >
                                <td className="px-6 py-4 font-mono font-medium text-blue-600">
                                    {loan.id}
                                </td>
                                <td className="px-6 py-4 font-bold text-gray-800">
                                    {loan.book}
                                </td>
                                <td className="px-6 py-4 text-gray-500">
                                    {loan.borrowDate}
                                </td>
                                <td className="px-6 py-4 text-gray-500">
                                    {loan.returnDate}
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                                            loan.status === "Quá hạn"
                                                ? "bg-red-100 text-red-600"
                                                : "bg-green-100 text-green-600"
                                        }`}
                                    >
                                        {loan.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 text-xs border-blue-200 text-blue-600 hover:bg-blue-50"
                                    >
                                        Trả sách
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
