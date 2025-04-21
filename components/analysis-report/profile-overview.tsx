// app/dashboard/components/ProfileOverview.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {CalendarDays, MapPin, Users} from "lucide-react";
import Link from "next/link";
import {BasicUserInfo, ProfileAnalysisResult} from "@/lib/types";

interface ProfileOverviewProps {
    forensicData: ProfileAnalysisResult;
    instagramData: BasicUserInfo;
    isCached?: boolean;
}

export default function ProfileOverview({ forensicData, instagramData, isCached }: ProfileOverviewProps) {
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(part => part[0])
            .join('')
            .toUpperCase();
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-1">
                <CardHeader>
                    <CardTitle>User Profile</CardTitle>
                    <CardDescription>Basic profile information</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                    <Avatar className="h-24 w-24 mb-4">
                        <AvatarImage src={instagramData.profile_pic_url && `/proxy?url=${encodeURIComponent(instagramData.profile_pic_url)}` || ""} alt={instagramData.full_name ?? ""} />
                        <AvatarFallback>{getInitials(instagramData.full_name?? "")}</AvatarFallback>
                    </Avatar>

                    <h3 className="text-xl font-semibold">{instagramData.full_name}</h3>
                    <p className="text-muted-foreground mb-4">@{forensicData.profile_context.username}</p>

                    <div className="flex gap-4 mb-4">
                        <div className="text-center">
                            <p className="text-lg font-semibold">{instagramData.followers_count}</p>
                            <p className="text-xs text-muted-foreground">Followers</p>
                        </div>
                        <Separator orientation="vertical" className="h-10" />
                        <div className="text-center">
                            <p className="text-lg font-semibold">{instagramData.following_count}</p>
                            <p className="text-xs text-muted-foreground">Following</p>
                        </div>
                        <Separator orientation="vertical" className="h-10" />
                        <div className="text-center">
                            <p className="text-lg font-semibold">{instagramData.posts?.length ?? 0}</p>
                            <p className="text-xs text-muted-foreground">Posts</p>
                        </div>
                    </div>

                    <div className="w-full mt-4">
                        <p className="text-sm font-medium mb-2">Biography</p>
                        <div className="bg-muted p-3 rounded-md text-sm whitespace-pre-line">
                            {instagramData.biography}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="md:col-span-2">
                <CardHeader>
                    <CardTitle>Profile Analysis</CardTitle>
                    <CardDescription>Analysis of profile and activity</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-sm font-medium mb-2">Profile Overview</h3>
                            <p className="text-sm">{forensicData.initial_profile_analysis.profile_overview}</p>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium mb-2">Biography Summary</h3>
                            <p className="text-sm">{forensicData.initial_profile_analysis.biography_summary}</p>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium mb-2">Sentiment Analysis</h3>
                            <div className="flex items-center gap-2 mb-2">
                                <Badge variant={forensicData.initial_profile_analysis.sentiment_analysis.label === "Positive" ? "default" :
                                    forensicData.initial_profile_analysis.sentiment_analysis.label === "Negative" ? "destructive" :
                                        "secondary"}>
                                    {forensicData.initial_profile_analysis.sentiment_analysis.label}
                                </Badge>
                                <Progress value={forensicData.initial_profile_analysis.sentiment_analysis.score * 100} className="h-2" />
                                <span className="text-xs font-medium">{(forensicData.initial_profile_analysis.sentiment_analysis.score * 100).toFixed(0)}%</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h3 className="text-sm font-medium mb-2">Key Information</h3>
                                <ul className="list-disc pl-5 text-sm space-y-1">
                                    {forensicData.initial_profile_analysis.key_information.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium mb-2">Potential Interests</h3>
                                <div className="flex flex-wrap gap-2">
                                    {forensicData.inferred_analysis.potential_interests.map((interest, index) => (
                                        <Badge key={index} variant="outline">{interest.interest}</Badge>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 mt-4">
                            <div className="flex items-center gap-2 text-sm">
                                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                                <span>Analysis Timestamp: {formatDate(forensicData.analysis_metadata.timestamp_utc)} {isCached ? <>[Cached Report - <Link href={`?refresh=true`}>Refresh</Link>]</> : null}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <span>Model Used: {forensicData.analysis_metadata.model_used}</span>
                            </div>
                            {forensicData.inferred_analysis.potential_locations.length > 0 && (
                                <div className="flex items-center gap-2 text-sm">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <span>Potential Location: {forensicData.inferred_analysis.potential_locations.join(", ")}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}