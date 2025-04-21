// app/dashboard/components/PostingAnalytics.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {Clock, AlertTriangle, TrendingUp, MapPin} from "lucide-react";
import {BasicUserInfo, ProfileAnalysisResult} from "@/lib/types";
import {CalendarHeatmap} from "@/components/analysis-report/calendar-heat-map";

interface PostingAnalyticsProps {
    forensicData: ProfileAnalysisResult;
    instagramData: BasicUserInfo;
}

export default function PostingAnalytics({ forensicData, instagramData }: PostingAnalyticsProps) {
    if (!forensicData.temporal_analysis) return "Insufficient data for analysis";

    // Prepare data for post frequency by month visualization
    const preparePostFrequencyData = () => {
        const posts = instagramData.posts;
        const postsByMonth: { [key: string]: number } = {};

        posts?.forEach(post => {
            const date = new Date(post.timestamp * 1000);
            const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;

            if (!postsByMonth[monthYear]) {
                postsByMonth[monthYear] = 0;
            }

            postsByMonth[monthYear]++;
        });

        // Create data array for the chart
        const sortedMonths = Object.keys(postsByMonth).sort();
        return sortedMonths.map(month => ({
            month: month,
            posts: postsByMonth[month]
        }));
    };

    // Prepare data for post engagement visualization
    const prepareEngagementData = () => {
        return instagramData.posts?.map(post => {
            const date = new Date(post.timestamp * 1000);
            return {
                id: post.id,
                date: date.toLocaleDateString(),
                likes: post.like_count,
                comments: post.comment_count,
                engagement: post.like_count + post.comment_count,
                caption: post.caption.length > 30 ? post.caption.substring(0, 30) + '...' : post.caption
            };
        }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    };

    // Prepare data for heatmap
    const prepareHeatmapData = () => {
        const posts = instagramData.posts;
        const startDate = new Date(Math.min(...posts?.map(post => post.timestamp * 1000) ?? []));
        const endDate = new Date(Math.max(...posts?.map(post => post.timestamp * 1000) ?? []));

        startDate.setDate(1);
        endDate.setMonth(endDate.getMonth() + 1, 0);

        const data = [];
        const currentDate = new Date(startDate);

        while (currentDate <= endDate) {
            const dateString = currentDate.toISOString().split('T')[0];
            const postsOnDay = posts?.filter(post => {
                const postDate = new Date(post.timestamp * 1000);
                return postDate.toISOString().split('T')[0] === dateString;
            }) ?? [];

            data.push({
                date: dateString,
                count: postsOnDay.length
            });

            currentDate.setDate(currentDate.getDate() + 1);
        }

        return data;
    };

    const postFrequencyData = preparePostFrequencyData();
    const engagementData = prepareEngagementData();
    const heatmapData = prepareHeatmapData();

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Posting Frequency</CardTitle>
                        <CardDescription>Summary of post frequency patterns</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center space-x-2 text-xl font-semibold">
                            <Clock className="h-5 w-5 text-muted-foreground" />
                            <span>{instagramData.posts?.length ?? 0} posts</span>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">
                            {forensicData.temporal_analysis.posting_frequency.summary}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Temporal Patterns</CardTitle>
                        <CardDescription>Time of day patterns</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center space-x-2 text-xl font-semibold">
                            <TrendingUp className="h-5 w-5 text-muted-foreground" />
                            <span>Activity Analysis</span>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">
                            {forensicData.temporal_analysis.time_of_day_patterns.summary}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Anomalies</CardTitle>
                        <CardDescription>Unusual posting patterns</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center space-x-2 text-xl font-semibold">
                            <AlertTriangle className="h-5 w-5 text-muted-foreground" />
                            <span>Pattern Analysis</span>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">
                            {forensicData.temporal_analysis.evolution_over_time}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Post Frequency Over Time</CardTitle>
                    <CardDescription>Number of posts by month</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={postFrequencyData}
                                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="month"
                                    angle={-45}
                                    textAnchor="end"
                                    tick={{ fontSize: 12 }}
                                    height={60}
                                />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="posts" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Post Engagement</CardTitle>
                    <CardDescription>Likes and comments per post</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={engagementData}
                                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="date"
                                    angle={-45}
                                    textAnchor="end"
                                    tick={{ fontSize: 12 }}
                                    height={60}
                                />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="likes" stroke="#8884d8" name="Likes" />
                                <Line type="monotone" dataKey="comments" stroke="#82ca9d" name="Comments" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Posting Activity Calendar</CardTitle>
                    <CardDescription>Calendar heatmap of posting activity</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-64">
                        <CalendarHeatmap data={heatmapData} />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Posts Timeline</CardTitle>
                    <CardDescription>Chronological view of posts</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {instagramData.posts?.sort((a, b) => b.timestamp - a.timestamp).map(post => (
                            <div key={post.id} className="flex items-start p-4 border rounded-lg">
                                <div className="mr-4 w-16 h-16 overflow-hidden rounded-md flex-shrink-0">
                                    <img src={`/proxy?url=${encodeURIComponent(post.display_url)}`} alt="Post thumbnail" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm font-medium">{formatDate(post.timestamp)}</span>
                                        <div className="flex items-center space-x-3 text-sm">
                                            <span>❤️ {post.like_count}</span>
                                            <span>💬 {post.comment_count}</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground line-clamp-2">{post.caption}</p>
                                    {post.location && (
                                        <div className="mt-1 flex items-center text-xs text-muted-foreground">
                                            <MapPin className="h-3 w-3 mr-1" />
                                            <span>{post.location}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )) ?? "No posts available"}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}