import React from 'react';
import {insta_scrape} from './scrape'
import {generateForensicAnalysisLLM, generateReportLLM, extractJSONDataLLM, generateProfileAnalysisLLM, generateTemporalAnalysis} from './analyze'


async function Page({params: {username}}: {params: {username: string}}) {
    // Fetch the Instagram data
    const data = await insta_scrape(username);
    // Check if data is empty or error
    if (!data || data.error || !data.basicInfo) {
        return <div>Error fetching data [todo: beautify this page]</div>;
    }

    // Extract the JSON data
    const jsonData = await extractJSONDataLLM(username, data.basicInfo.biography || "");
    // Generate the forensic analysis
    const forensicAnalysis = await generateForensicAnalysisLLM(username, data.basicInfo.biography || "");
    // Generate the report
    const report = await generateReportLLM(username, data.basicInfo.biography || "");
    console.log(report);
    const dirtyProfileAnalysis = await generateProfileAnalysisLLM(username, data.basicInfo.biography || "", data.basicInfo.full_name || "", data.basicInfo.followers_count || 0, data.basicInfo.following_count || 0, data.basicInfo.is_verified || false);
    const profileAnalysis = dirtyProfileAnalysis.replace(/\*/g, '');
    const temporalAnalysis = await generateTemporalAnalysis(username, data.basicInfo.biography || "", data.basicInfo.posts || []);
    // Return the report
    // You can render the report in your component or return it as JSON


    return (
        // render the report
        <div>
            <h1 className="text-center text-4xl font-bold p-5">Instagram Analysis</h1>
            <div className="p-5">
                <h2 className="text-2xl font-bold">Basic Info</h2>
                <pre>{JSON.stringify(data.basicInfo, null, 2)}</pre>
            </div>
            <div className="p-5">
                <h2 className="text-2xl font-bold">Forensic Analysis</h2>
                <pre>{JSON.stringify(jsonData)}</pre>
            </div>
            <div className="p-5">
                <h2 className="text-2xl font-bold">Forensic Analysis</h2>
                <pre>{forensicAnalysis}</pre>
            </div>
            <div className="p-5">
                <h2 className="text-2xl font-bold">Profile Analysis</h2>
                <pre>{profileAnalysis}</pre>
            </div>
            <div className="p-5">
                <h2 className="text-2xl font-bold">Report</h2>
                <pre>{report}</pre>
            </div>
            <div className="p-5">
                <h2 className="text-2xl font-bold">Posts Temporal Analysis</h2>
                <pre>{temporalAnalysis}</pre>
            </div>
        </div>
    );
}

export default Page;