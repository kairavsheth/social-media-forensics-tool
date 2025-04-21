// app/dashboard/page.tsx
"use client";

import {useState} from "react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {BasicUserInfo, ProfileAnalysisResult} from "@/lib/types";
import ProfileOverview from "@/components/analysis-report/profile-overview";
import PostingAnalytics from "./posting-analysis";
import ContentAnalysis from "@/components/analysis-report/content-analysis";
import NetworkGraph from "@/components/analysis-report/network-graph";
import ForensicFindings from "@/components/analysis-report/forensic-findings";

interface DashboardProps {
    forensicData: ProfileAnalysisResult;
    instagramData: BasicUserInfo;
    isCached: boolean;
}

export default function Dashboard({forensicData, instagramData, isCached}: DashboardProps) {
    const [activeTab, setActiveTab] = useState("overview");

    return (
        <div className="container mx-auto py-6">
            <h1 className="text-3xl font-bold mb-2">Instagram Forensic Analysis</h1>
            <p className="text-muted-foreground mb-6">
                Comprehensive analysis for {instagramData.full_name} ({forensicData.profile_context.username})
            </p>

            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-5 mb-8">
                    <TabsTrigger value="overview">Profile Overview</TabsTrigger>
                    <TabsTrigger value="posts">Posting Analytics</TabsTrigger>
                    <TabsTrigger value="content">Content Analysis</TabsTrigger>
                    <TabsTrigger value="network">Network Analysis</TabsTrigger>
                    <TabsTrigger value="forensic">Forensic Findings</TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                    <ProfileOverview forensicData={forensicData} instagramData={instagramData} isCached={isCached}/>
                </TabsContent>

                <TabsContent value="posts">
                    <PostingAnalytics forensicData={forensicData} instagramData={instagramData}/>
                </TabsContent>

                <TabsContent value="content">
                    <ContentAnalysis forensicData={forensicData} instagramData={instagramData}/>
                </TabsContent>

                <TabsContent value="network">
                    <NetworkGraph forensicData={forensicData} instagramData={instagramData}/>
                </TabsContent>

                <TabsContent value="forensic">
                    <ForensicFindings forensicData={forensicData} instagramData={instagramData}/>
                </TabsContent>
            </Tabs>
        </div>
    );
}