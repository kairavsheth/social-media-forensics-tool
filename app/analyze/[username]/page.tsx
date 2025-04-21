import React from 'react';
import { insta_scrape } from './scrape';
import { generateComprehensiveAnalysis } from "@/app/analyze/[username]/analyzer";
import Dashboard from "@/components/analysis-report/dashboard";
import { MongoClient } from 'mongodb';
import { BasicUserInfo, ProfileAnalysisResult } from '@/lib/types';

// MongoDB connection setup
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = 'instagram_cache';
const cacheCollection = 'user_data_cache';
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 1 week in milliseconds

async function getMongoClient() {
    const client = new MongoClient(mongoUri);
    await client.connect();
    return client;
}

async function getCachedData(username: string, forceRefresh: boolean = false) {
    if (forceRefresh) {
        console.log(`Force refresh for user: ${username}`);
        return null;
    }
    const client = await getMongoClient();
    try {
        const db = client.db(dbName);
        const collection = db.collection(cacheCollection);

        const cachedEntry = await collection.findOne({username});

        if (cachedEntry) {
            const currentTime = new Date().getTime();
            const cacheTime = new Date(cachedEntry.timestamp).getTime();

            // Check if cache is still valid (within TTL)
            if (currentTime - cacheTime < CACHE_TTL) {
                console.log(`Cache hit for user: ${username}`);
                return {
                    data: cachedEntry.data,
                    report: cachedEntry.report,
                    timestamp: cacheTime,
                    isCached: true
                };
            }
            console.log(`Cache expired for user: ${username}`);
        } else {
            console.log(`Cache miss for user: ${username}`);
        }

        return null;
    } finally {
        await client.close();
    }
}

async function cacheData(username: string, data: BasicUserInfo, report: ProfileAnalysisResult) {
    const client = await getMongoClient();
    try {
        const db = client.db(dbName);
        const collection = db.collection(cacheCollection);

        const timestamp = new Date();

        // Upsert the data (update if exists, insert if not)
        await collection.updateOne(
            { username },
            {
                $set: {
                    username,
                    data,
                    report,
                    timestamp
                }
            },
            { upsert: true }
        );

        return timestamp;
    } finally {
        await client.close();
    }
}

async function Page({params, searchParams}: {params: Promise<{ username: string }>, searchParams: { refresh?: string }}) {
    const forceRefresh = searchParams?.refresh === 'true';

    const {username} = await params;
    let instagramData;
    let analysisReport;
    let isCached = false;

    // Try to get data from cache first
    const cachedResult = await getCachedData(username, forceRefresh);

    if (forceRefresh) {

    }
    if (cachedResult) {
        // Cache hit
        instagramData = cachedResult.data;
        analysisReport = cachedResult.report;
        isCached = true;
    } else {
        // Cache miss - fetch fresh data
        const data = await insta_scrape(username);

        // Check if data is empty or error
        if (!data || data.error || !data.basicInfo) {
            return <div>Error fetching data [todo: beautify this page]</div>;
        }

        instagramData = data.basicInfo;

        // Generate the analysis report
        analysisReport = await generateComprehensiveAnalysis(
            instagramData.full_name || "",
            instagramData.biography || "",
            instagramData.full_name || undefined,
            instagramData.followers_count || undefined,
            instagramData.following_count || undefined,
            instagramData.is_verified || undefined,
            instagramData.posts || undefined
        );

        // Cache the fresh data and report
        await cacheData(username, instagramData, analysisReport);
    }

    return (
        <Dashboard
            forensicData={analysisReport}
            instagramData={instagramData}
            isCached={isCached}
        />
    );
}

export default Page;