import { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Search, Star, CheckCircle, XCircle } from "lucide-react";
import { mockReviews } from "../../data/mockData";

export function ReviewsManagement() {
    const [reviews, setReviews] = useState(mockReviews || []);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredReviews = reviews.filter(
        (review) =>
            review.MemberName?.toLowerCase().includes(
                searchQuery.toLowerCase()
            ) ||
            review.BookTitle?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleApprove = (reviewId) => {
        setReviews(
            reviews.map((review) =>
                review.ReviewId === reviewId
                    ? { ...review, IsApproved: true }
                    : review
            )
        );
    };

    const handleReject = (reviewId) => {
        setReviews(
            reviews.map((review) =>
                review.ReviewId === reviewId
                    ? { ...review, IsApproved: false }
                    : review
            )
        );
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Reviews Management</h1>
                <p className="text-gray-600 mt-1">
                    Moderate and manage member book reviews
                </p>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            placeholder="Search by member name or book title..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-4">
                {filteredReviews.map((review) => (
                    <Card key={review.ReviewId}>
                        <CardContent className="pt-6">
                            <div className="flex justify-between items-start gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <p className="font-semibold">
                                            {review.MemberName}
                                        </p>
                                        <Badge variant="outline">
                                            {review.IsApproved
                                                ? "Approved"
                                                : "Pending"}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">
                                        {review.BookTitle}
                                    </p>
                                    <div className="flex items-center gap-3">
                                        <div className="flex">
                                            {Array.from({ length: 5 }).map(
                                                (_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`h-4 w-4 ${
                                                            i < review.Rating
                                                                ? "fill-amber-400 text-amber-400"
                                                                : "text-gray-300"
                                                        }`}
                                                    />
                                                )
                                            )}
                                        </div>
                                        <span className="text-sm text-gray-500">
                                            {review.ReviewDate}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <p className="text-sm text-gray-500 text-right">
                                        Review #{review.ReviewId}
                                    </p>
                                    <div className="flex gap-2">
                                        {!review.IsApproved && (
                                            <Button
                                                onClick={() =>
                                                    handleApprove(
                                                        review.ReviewId
                                                    )
                                                }
                                                size="sm"
                                                className="bg-green-600 hover:bg-green-700"
                                            >
                                                <CheckCircle className="mr-1 h-4 w-4" />
                                                Approve
                                            </Button>
                                        )}
                                        {review.IsApproved && (
                                            <Button
                                                onClick={() =>
                                                    handleReject(
                                                        review.ReviewId
                                                    )
                                                }
                                                size="sm"
                                                variant="destructive"
                                                className="bg-red-600 hover:bg-red-700"
                                            >
                                                <XCircle className="mr-1 h-4 w-4" />
                                                Reject
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <p className="text-gray-700 mt-4">
                                {review.ReviewText}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
