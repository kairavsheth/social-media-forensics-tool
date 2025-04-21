import {OpenAI} from 'openai';
import moment from 'moment';
import {InstagramPost, ProfileAnalysisResult} from "@/lib/types";

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

// Helper function to call the OpenAI API and handle the LLM response
const callLLM = async (model: string, prompt: string, maxTokens: number, temperature: number): Promise<string> => {
    try {
        const response = await openai.chat.completions.create({
            model: model,
            messages: [{ role: 'user', content: prompt }],
            max_tokens: maxTokens,
            temperature: temperature,
        });

        const responseText = response.choices[0].message.content?.trim();

        if (!responseText) {
            throw new Error('No response from LLM');
        }

        // Clean response if necessary
        if (responseText.startsWith("```json")) {
            return responseText.slice(7, -3).trim(); // Clean JSON markdown
        } else if (responseText.startsWith("```")) {
            return responseText.slice(3, -3).trim(); // Clean general markdown
        }

        return responseText;
    } catch (error) {
        console.error('LLM call failed:', error);
        const { message, name } = error as never;
        return `LLM_ERROR: ${name}: ${message}`;
    }
};

/**
 * Consolidated function to generate a comprehensive profile analysis
 * Combines multiple analysis types into a single LLM call
 */
const generateComprehensiveAnalysis = async (
    username: string,
    biographyText: string,
    fullname?: string,
    follower_count?: number,
    following_count?: number,
    is_verified?: boolean,
    posts?: InstagramPost[]
): Promise<ProfileAnalysisResult> => {
    const model = 'gemini-2.0-flash';
    const maxTokens = 6000;  // Increased to handle comprehensive analysis
    const temperature = 0.3; // Reduced for more consistent, structured output

    const timestamp = moment.utc().format();
    const escapedBio = JSON.stringify(biographyText);

    // Create formatted posts data if available
    let postsData = "";
    let timeAnalysisData = "";

    if (posts && Array.isArray(posts) && posts.length > 0) {
        // Format posts for content analysis
        postsData = posts.map((post, idx) => {
            const date = new Date(0);
            date.setUTCSeconds(post.timestamp);
            return `Post ${idx+1}:\n  Date: ${date.toISOString()}\n  Caption: ${post.caption || 'None'}\n  Tagged: ${(post.tagged_users && post.tagged_users.length) ? post.tagged_users.join(', ') : 'None'}\n  Location: ${post.location || 'None'}\n`;
        }).join("\n");

        // Format timestamps for temporal analysis
        const sortedPosts = [...posts].sort((a, b) => a.timestamp - b.timestamp);
        const oldestPostDate = new Date(0);
        oldestPostDate.setUTCSeconds(sortedPosts[0].timestamp);

        const newestPostDate = new Date(0);
        newestPostDate.setUTCSeconds(sortedPosts[sortedPosts.length - 1].timestamp);

        timeAnalysisData = `Post Timeline:\n- Oldest: ${oldestPostDate.toISOString()}\n- Newest: ${newestPostDate.toISOString()}\n- Post Count: ${posts.length}\n`;

        // Add timestamp list (limited to avoid excessive prompt size)
        timeAnalysisData += "Sample Timestamps:\n" + sortedPosts.slice(0, Math.min(50, sortedPosts.length)).map(post => {
            const d = new Date(0);
            d.setUTCSeconds(post.timestamp);
            return `- ${d.toISOString()}`;
        }).join('\n');
    }

    // Build comprehensive analysis prompt
    const analysisPrompt = `
You are a digital forensics expert specializing in social media analysis. You need to analyze an Instagram profile and provide a complete, structured analysis in JSON format that can be parsed by a frontend visualization system.

PROFILE DATA:
- Username: ${username}
- Biography: ${escapedBio}
${fullname ? `- Full Name: ${fullname}` : ''}
${follower_count !== undefined ? `- Followers: ${follower_count}` : ''}
${following_count !== undefined ? `- Following: ${following_count}` : ''}
${is_verified !== undefined ? `- Verified: ${is_verified}` : ''}

${posts && posts.length > 0 ? `POST DATA:\n${postsData}\n\nTIMELINE DATA:\n${timeAnalysisData}` : 'No posts data available for analysis.'}

ANALYSIS REQUIREMENTS:
1. Analyze all provided profile information.
2. Identify patterns, entities, and insights.
3. Format your entire response as a SINGLE, well-structured JSON object matching the exact schema provided below.
4. Include detailed analysis across all available dimensions.
5. Generate appropriate data for visualizations where applicable.
6. If certain data is unavailable, include empty arrays or appropriate default values rather than omitting keys.

OUTPUT FORMAT:
Respond ONLY with a valid JSON object following this exact structure:

{
  "analysis_metadata": {
    "timestamp_utc": "${timestamp}",
    "model_used": "${model}",
    "analysis_version": "1.0"
  },
  "profile_context": {
    "username": "${username}",
    "biography_text": ${escapedBio}
    ${fullname ? `,"fullname": "${fullname}"` : ''}
    ${follower_count !== undefined ? `,"follower_count": ${follower_count}` : ''}
    ${following_count !== undefined ? `,"following_count": ${following_count}` : ''}
    ${is_verified !== undefined ? `,"is_verified": ${is_verified}` : ''}
  },
  "initial_profile_analysis": {
    "profile_overview": "",
    "biography_summary": "",
    "sentiment_analysis": {
      "label": "",
      "score": 0.0
    },
    "key_information": []
  },
  "forensic_analysis": {
    "pii_indicators": [],
    "mentioned_locations": [],
    "external_connections": {
      "usernames": [],
      "urls": []
    },
    "keywords_of_interest": [],
    "language_notes": ""
  },
  "account_authenticity": {
    "assessment": "",
    "indicators": {
      "positive": [],
      "negative": [],
      "neutral": []
    },
    "recommendations": []
  },
  "entity_extraction": {
    "mentions": [],
    "hashtags": [],
    "urls": [],
    "emails": [],
    "phone_numbers": [],
    "locations": [],
    "organizations": [],
    "persons": [],
    "technologies_tools": [],
    "projects_products": []
  },
  ${posts && posts.length > 0 ? `
  "temporal_analysis": {
    "posting_frequency": {
      "summary": "",
      "patterns": []
    },
    "time_of_day_patterns": {
      "summary": "",
      "patterns": []
    },
    "seasonal_variations": [],
    "gaps_or_spikes": [],
    "evolution_over_time": "",
    "anomalies": []
  },
  "content_analysis": {
    "dominant_themes": [],
    "linguistic_style": {
      "summary": "",
      "patterns": []
    },
    "hashtag_strategy": "",
    "mention_patterns": [],
    "sentiment_evolution": {
      "summary": "",
      "trends": []
    },
    "content_evolution": "",
    "automated_vs_human": {
      "assessment": "",
      "indicators": []
    },
    "concerning_content": [],
    "post_analyses": {
            "timestamp": "YYYY-MM-DDTHH:mm:ss.sssZ",
            "summary": "",
            key_observations: [""],
            sentiment: "",
            themes: [""]

    }[]
  },` : ''}
  "inferred_analysis": {
    "potential_interests": [{
      "interest": "",
      "confidence": 0.0,
      "reasoning": ""
    }],
    "potential_affiliations": [{
      "affiliation": "",
      "confidence": 0.0,
      "reasoning": ""
    }],
    "potential_skills": [{
      "skill": "",
      "confidence": 0.0,
      "reasoning": ""
    }],
    "potential_locations": []
  },
  "network_graph_data": {
    "nodes": [
      {"id": "profile_owner", "label": "${username}", "type": "ProfileOwner"}
    ],
    "edges": []
  },
  "visualization_data": {
    ${posts && posts.length > 0 ? `
    "posting_heatmap": [],
    "sentiment_timeline": [],
    "topic_distribution": [],
    "mention_network": {
      "nodes": [],
      "edges": []
    }` : '[]'}
  }
}

IMPORTANT NOTES:
- Your entire response must be ONLY a valid, parseable JSON object. No explanatory text before or after. No markdown formatting outside the JSON.
- Use numeric values for scores (not strings).
- Use empty arrays [] rather than null for missing list data.
- Use empty strings "" rather than null for missing text fields.
`;

    try {
        const jsonResponse = await callLLM(model, analysisPrompt, maxTokens, temperature);

        if (jsonResponse.startsWith("LLM_ERROR")) {
            console.error(`Analysis generation failed: ${jsonResponse}`);
            throw new Error(jsonResponse);
        }

        // Parse and validate the response
        const analysisResult: ProfileAnalysisResult = JSON.parse(jsonResponse);
        console.log("Comprehensive analysis generation successful.");
        return analysisResult;
    } catch (error) {
        console.error(`Error during analysis generation: ${error}`);
        // Return a basic error structure that matches the expected type
        return {
            analysis_metadata: {
                timestamp_utc: timestamp,
                model_used: model,
                analysis_version: "error"
            },
            profile_context: {
                username,
                biography_text: biographyText
            },
            initial_profile_analysis: {
                profile_overview: `Error analyzing profile: ${(error as Error).message}`,
                biography_summary: "",
                sentiment_analysis: {
                    label: "Error",
                    score: 0
                },
                key_information: [],
                potential_interests: []
            },
            forensic_analysis: {
                pii_indicators: [],
                mentioned_locations: [],
                external_connections: {
                    usernames: [],
                    urls: []
                },
                keywords_of_interest: [],
                language_notes: ""
            },
            account_authenticity: {
                assessment: "Error during analysis",
                indicators: {
                    positive: [],
                    negative: [],
                    neutral: []
                },
                recommendations: []
            },
            entity_extraction: {
                mentions: [],
                hashtags: [],
                urls: [],
                emails: [],
                phone_numbers: [],
                locations: [],
                organizations: [],
                persons: [],
                technologies_tools: [],
                projects_products: []
            },
            inferred_analysis: {
                potential_interests: [],
                potential_affiliations: [],
                potential_skills: [],
                potential_locations: []
            },
            network_graph_data: {
                nodes: [
                    {id: "profile_owner", label: username, type: "ProfileOwner"}
                ],
                edges: []
            },
            visualization_data: {
                posting_heatmap: [],
                sentiment_timeline: [],
                topic_distribution: [],
                mention_network: {
                    nodes: [],
                    edges: []
                }
            }
        };
    }
};

export {
    generateComprehensiveAnalysis // Export the new consolidated function
};