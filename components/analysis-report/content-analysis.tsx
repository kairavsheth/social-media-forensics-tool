// app/dashboard/components/ContentAnalysis.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Hash } from "lucide-react";
import {BasicUserInfo, ProfileAnalysisResult} from "@/lib/types";

interface ContentAnalysisProps {
    forensicData: ProfileAnalysisResult;
    instagramData: BasicUserInfo;
}

export default function ContentAnalysis({ forensicData, instagramData }: ContentAnalysisProps) {
    if (!forensicData.content_analysis) return "No content analysis data available";

    // Prepare data for sentiment distribution
    const prepareSentimentData = () => {
        const sentiments = forensicData.content_analysis?.sentiment_evolution.trends;
        const sentimentCounts: Record<string, number> = {};

        sentiments?.forEach(sentiment => {
            if (!sentimentCounts[sentiment]) {
                sentimentCounts[sentiment] = 0;
            }
            sentimentCounts[sentiment]++;
        });

        return Object.entries(sentimentCounts).map(([name, value]) => ({
            name,
            value
        }));
    };

    // Prepare data for theme distribution
    const prepareThemeData = () => {
        const themes = forensicData.content_analysis?.post_analyses.map(i=> i.themes).flat();
        const themeCounts: Record<string, number> = {};

        themes?.forEach(theme => {
            if (!themeCounts[theme]) {
                themeCounts[theme] = 0;
            }
            themeCounts[theme]++;
        });

        return Object.entries(themeCounts).map(([name, value]) => ({
            name,
            value
        }));
    };

    const sentimentData = prepareSentimentData();
    const themeData = prepareThemeData();

    // Colors for sentiment chart
    const sentimentColors = {
        Positive: "#10b981",
        Neutral: "#6b7280",
        Negative: "#ef4444"
    };

    // Random colors for theme chart
    const themeColors = ["#6366f1", "#8b5cf6", "#ec4899", "#f43f5e", "#f97316", "#eab308", "#84cc16"];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Dominant Themes</CardTitle>
                        <CardDescription>Primary content themes</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {forensicData.content_analysis!.dominant_themes.map((theme, index) => (
                                <Badge key={index} variant="outline">{theme}</Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Hashtag Usage</CardTitle>
                        <CardDescription>Hashtag patterns</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center mb-2">
                            <Hash className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="text-sm font-medium">Strategy</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                            {forensicData.content_analysis!.hashtag_strategy}
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {forensicData.entity_extraction.hashtags.map((hashtag, index) => (
                                <Badge key={index} variant="secondary">#{hashtag}</Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Linguistic Style</CardTitle>
                        <CardDescription>Writing patterns</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                            {forensicData.content_analysis!.linguistic_style.summary}
                        </p>
                        <ul className="list-disc pl-5 text-sm space-y-1">
                            {forensicData.content_analysis!.linguistic_style.patterns.map((pattern, index) => (
                                <li key={index}>{pattern}</li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Sentiment Distribution</CardTitle>
                        <CardDescription>Sentiment analysis of posts</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={sentimentData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {sentimentData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={sentimentColors[entry.name as keyof typeof sentimentColors] || themeColors[index % themeColors.length]}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Theme Distribution</CardTitle>
                        <CardDescription>Content theme analysis</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={themeData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {themeData.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={themeColors[index % themeColors.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Keywords Analysis</CardTitle>
                    <CardDescription>Significant keywords and entities</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <h3 className="text-sm font-medium mb-2">Keywords of Interest</h3>
                            <div className="flex flex-wrap gap-2">
                                {forensicData.forensic_analysis.keywords_of_interest.map((keyword, index) => (
                                    <Badge key={index} variant="outline">{keyword}</Badge>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium mb-2">Persons Mentioned</h3>
                            <div className="flex flex-wrap gap-2">
                                {forensicData.entity_extraction.persons.map((person, index) => (
                                    <Badge key={index} variant="outline">{person}</Badge>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium mb-2">Locations</h3>
                            <div className="flex flex-wrap gap-2">
                                {forensicData.entity_extraction.locations.map((location, index) => (
                                    <Badge key={index} variant="outline">{location}</Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Content Evolution</CardTitle>
                    <CardDescription>How content has changed over time</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-sm font-medium mb-2">Content Evolution</h3>
                            <p className="text-sm text-muted-foreground">
                                {forensicData.content_analysis!.content_evolution}
                            </p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium mb-2">Sentiment Evolution</h3>
                            <p className="text-sm text-muted-foreground">
                                {forensicData.content_analysis!.sentiment_evolution.summary}
                            </p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium mb-2">Automated vs Human Assessment</h3>
                            <p className="text-sm text-muted-foreground">
                                {forensicData.content_analysis!.automated_vs_human.assessment}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Post Sentiment Analysis</CardTitle>
                    <CardDescription>Sentiment analysis by post</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {forensicData.content_analysis!.post_analyses.map((post, index) => {
                            const instagramPost = instagramData.posts?.find(
                                p => new Date(p.timestamp * 1000).toISOString().split('T')[0] ===
                                    new Date(post.timestamp).toISOString().split('T')[0]
                            );

                            const sentimentColor =
                                post.sentiment === "Positive" ? "border-green-500" :
                                    post.sentiment === "Negative" ? "border-red-500" : "border-gray-300";

                            return (
                                <div key={index} className={`p-4 border-l-4 ${sentimentColor} rounded-md bg-muted/30`}>
                                    <div className="flex justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <Badge variant={
                                                post.sentiment === "Positive" ? "default" :
                                                    post.sentiment === "Negative" ? "destructive" : "secondary"
                                            }>
                                                {post.sentiment}
                                            </Badge>
                                            <span className="text-sm font-medium">{new Date(post.timestamp).toLocaleDateString()}</span>
                                        </div>
                                        <div>{post.themes.map((i, idx)=>(<Badge variant="outline" key={idx}>{i}</Badge>))}</div>
                                    </div>

                                    {instagramPost && (
                                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                            {instagramPost.caption}
                                        </p>
                                    )}

                                    {instagramPost?.location !== "None" && (
                                        <div className="mt-1 flex items-center text-xs text-muted-foreground">
                                            <span className="font-medium mr-1">Location:</span> {instagramPost?.location}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}