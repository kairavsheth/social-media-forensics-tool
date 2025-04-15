import {OpenAI} from 'openai';
import moment from 'moment';
import {InstagramPost} from "@/app/analyze/[username]/scrape";

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
        const {message, name} = error as never;
        return `LLM_ERROR: ${name}: ${message}`;
    }
};

// Specific analysis functions

const generateReportLLM = async (username: string, biographyText: string): Promise<string> => {
    const model = 'gemini-2.0-flash'; // Set model
    const maxTokens = 1000;
    const temperature = 0.5;

    const reportPrompt = `
    **Task:** Generate an "Initial Profile Reconnaissance" report based *only* on the provided Instagram biography text and username context. Output ONLY plain text.

    **Username Context:** Analyze potential implications of the username (${username}) itself if relevant.
    **Biography Text:** "${biographyText}"

    **Report Structure (Use Plain Text Headings/Lists):**
    1. Profile Overview: Briefly mention the username (${username}).
    2. Biography Summary: Summarize the key themes, stated purpose, or activities mentioned in the biography text (2-4 sentences). If empty or nonsensical, state that.
    3. Sentiment Analysis: State the inferred overall sentiment of the biography text (Positive, Negative, Neutral, Mixed, or Not Applicable if empty/nonsensical).
    4. Key Information Extraction: List any explicitly mentioned key entities like locations, organizations, projects, or skills identified directly *in the bio text*. If none, state "No specific entities mentioned." Use simple list format (e.g., "- Entity 1").
    5. Potential Interests (Inferred): Briefly mention 1-2 potential high-level interests that *might* be inferred *speculatively* from the bio or username, clearly labeling them as such (e.g., "Potential interest in [topic] based on bio phrasing."). If none inferred, state "No specific interests could be reasonably inferred."
    6. Concluding Remark: Add a brief concluding sentence (e.g., "Analysis based solely on provided bio text.").

    **Output:** Generate ONLY the plain text report. **Do NOT use any markdown formatting (no asterisks, no hashes, no markdown lists).** Use simple line breaks for structure.
  `;

    const reportText = await callLLM(model, reportPrompt, maxTokens, temperature);
    if (reportText.startsWith("LLM_ERROR")) {
        console.error(`Report generation failed: ${reportText}`);
        return `Failed to generate report: ${reportText}`;
    }

    console.log("Report generation successful.");
    return reportText;
};

const generateForensicAnalysisLLM = async (username: string, biographyText: string): Promise<string> => {
    const model = 'gemini-2.0-flash';
    const maxTokens = 1000;
    const temperature = 0.4;

    const forensicPrompt = `
    **Task:** Analyze the provided Instagram biography text *strictly* for potential digital forensic points of interest. Focus *only* on patterns and explicit mentions within the text provided. **Do not make assumptions beyond the text.** Output ONLY plain text.

    **Biography Text:** "${biographyText}"

    **Analysis Points (Use Plain Text Headings/Lists):**
    1. Potential PII Indicators: Identify any patterns that *might resemble* PII (e.g., email format \`user@domain.com\`, phone number patterns \`XXX-XXX-XXXX\`, specific location names). Note the *presence* of the pattern/mention found in the text. If none, state "No direct PII pattern indicators identified in the bio text."
    2. Explicitly Mentioned Locations: List any specific cities, states, countries, or landmarks mentioned. If none, state "No locations mentioned." Use simple list format (e.g., "- Location 1").
    3. Explicit Mentions/Connections: List any other usernames (@mentions) or specific websites (URLs beginning with http/https) found directly in the text. If none, state "No external usernames or URLs mentioned." Use simple list format.
    4. Keywords/Themes of Interest: List 3-5 key terms or concepts directly present in the bio that might be relevant for further investigation (e.g., specific technologies, project names, organizations, event names). If none, state "No specific keywords/themes identified." Use simple list format.
    5. Language/Tone Notes: Briefly comment if the language used seems unusual, coded, highly technical, or noteworthy in tone (optional, only if prominent).

    **Output:** Generate ONLY the analysis notes as plain text. Use simple headings (e.g., "1. Potential PII Indicators:") and simple lists (e.g., "- Item"). **Do NOT use any markdown formatting.** State clearly if no relevant information was found for a point. Emphasize that findings are based solely on the provided text.
  `;

    const forensicText = await callLLM(model, forensicPrompt, maxTokens, temperature);
    if (forensicText.startsWith("LLM_ERROR")) {
        console.error(`Forensic note generation failed: ${forensicText}`);
        return `Failed to generate forensic notes: ${forensicText}`;
    }

    console.log("Forensic note generation successful.");
    return forensicText;
};

const generateProfileAnalysisLLM = async (username: string, biographyText: string, fullname: string, follower_count: number, following_count: number, is_verfied: boolean ): Promise<string> => {
    const model = 'gemini-2.0-flash';
    const maxTokens = 1000;
    const temperature = 0.4;

    const profilePrompt = `
    You are a digital forensics expert analyzing Instagram data. Examine the following Instagram profile data and provide a comprehensive forensic analysis:

    Profile Information:
    - Username: ${username}
    - Full Name: ${fullname}
    - Biography: ${biographyText}
    - Followers: ${follower_count}
    - Following: ${following_count}
    - Verified: ${is_verfied}
    
    Focus your analysis on:
    1. Account authenticity assessment
    2. Audience demographics estimation
    3. Profile optimization analysis
    4. Potential security or privacy concerns
    5. Notable patterns in profile presentation
    
    Provide your analysis in a structured format with clear sections and actionable insights.
    `;

    const forensicText = await callLLM(model, profilePrompt, maxTokens, temperature);
    if (forensicText.startsWith("LLM_ERROR")) {
        console.error(`Forensic note generation failed: ${forensicText}`);
        return `Failed to generate forensic notes: ${forensicText}`;
    }

    console.log("Forensic note generation successful.");
    return forensicText;
};

const generateTemporalAnalysis = async (username: string, biographyText: string, posts: InstagramPost[]): Promise<string> => {
    const model = 'gemini-2.0-flash';
    const maxTokens = 1000;
    const temperature = 0.4;

    if (!posts || posts.length === 0) {
        return "No posts data available for analysis.";
    }

    // Check if posts is an array
    if (!Array.isArray(posts)) {
        console.error("Posts is not an array:", posts);
        return "Failed to generate forensic notes: posts data is not in expected format";
    }

    // Sort posts by timestamp (oldest to newest)
    const sortedPosts = [...posts].sort((a, b) => a.timestamp - b.timestamp);

    // Handle empty array case
    if (sortedPosts.length === 0) {
        return "No posts found for analysis.";
    }

    // Extract required data in a simple way
    const oldestPostDate = sortedPosts[0]?.timestamp || 'unknown';
    const newestPostDate = sortedPosts[sortedPosts.length - 1]?.timestamp || 'unknown';

    // Simply join all timestamps
    const postTimestamps = sortedPosts.map(post => post.timestamp).join('\n');

    const temporalPrompt = `
    As a digital forensics analyst, examine the following Instagram posting timeline data for user ${username}. The data spans from ${oldestPostDate} to ${newestPostDate}.

    Post timestamps:
    ${postTimestamps}
    
    Analyze this data to determine:
    1. Posting frequency patterns (daily, weekly, monthly trends)
    2. Time-of-day patterns (when posts are typically published)
    3. Seasonal or periodic variations in posting activity
    4. Unusual gaps or spikes in posting frequency
    5. Evolution of posting behavior over time
    
    Present your findings with specific examples from the data and identify any anomalies that might warrant further investigation.
    `;

    const forensicText = await callLLM(model, temporalPrompt, maxTokens, temperature);
    if (forensicText.startsWith("LLM_ERROR")) {
        console.error(`Forensic note generation failed: ${forensicText}`);
        return `Failed to generate forensic notes: ${forensicText}`;
    }

    console.log("Forensic note generation successful.");
    return forensicText;
};

const extractJSONDataLLM = async (username: string, biographyText: string): Promise<never> => {
    const model = 'gemini-2.0-flash';
    const maxTokens = 6000;
    const temperature = 0.5;

    const timestamp = moment.utc().format();
    const escapedBio = JSON.stringify(biographyText); // Escape bio text for safe JSON embedding

    const jsonPrompt = `
    **Task:** Perform a detailed forensic analysis of the provided Instagram username and biography. Extract structured data relevant for Social Media Analysis Toolkit (SMAT) investigations. Generate ONLY a single, valid JSON object adhering strictly to the specified structure. Be exhaustive and inventive in extracting explicit graph data, even from simple bios. Infer and generate relevant details, clearly marking speculation.

    **Username:** "${username}"
    **Biography Text:** ${escapedBio} // Biography text is pre-escaped for JSON

    **JSON Output Structure:**
    {
      "analysis_metadata": {
        "timestamp_utc": "${timestamp}",
        "model_used": "${model}"
      },
      "profile_context": {
        "username": "${username}",
        "biography_text": ${escapedBio}
      },
      "linguistic_analysis": {
        "summary": "string",
        "language": "string",
        "sentiment_overall_label": "string",
        "sentiment_overall_score": "float",
        "keywords": ["list", "of", "strings"],
        "topics": ["list", "of", "strings"],
        "writing_style_notes": "string"
      },
      "entity_extraction": {
        "mentions": ["list", "of", "strings"],
        "hashtags": ["list", "of", "strings"],
        "urls": ["list", "of", "strings"],
        "emails": ["list", "of", "strings"],
        "phone_numbers": ["list", "of", "strings"],
        "locations": ["list", "of", "strings"],
        "organizations": ["list", "of", "strings"],
        "persons": ["list", "of", "strings"],
        "technologies_tools": ["list", "of", "strings"],
        "projects_products": ["list", "of", "strings"]
      },
      "network_connections_explicit": {
        "nodes": [
          {"id": "profile_owner", "label": "${username}", "type": "ProfileOwner"}
        ],
        "edges": []
      },
      "inferred_analysis": {
        "potential_interests": [{"interest": "string", "reasoning": "string", "confidence": "Low/Medium/High"}],
        "potential_affiliations": [{"affiliation": "string", "reasoning": "string", "confidence": "Low/Medium/High"}],
        "potential_skills": [{"skill": "string", "reasoning": "string", "confidence": "Low/Medium/High"}],
        "potential_locations": [{"location": "string", "reasoning": "string", "confidence": "Low/Medium/High"}]
      },
      "threat_indicators_potential": {
        "violent_extremism_keywords": ["list", "of", "strings"],
        "misinformation_themes": ["list", "of", "strings"],
        "hate_speech_indicators": ["list", "of", "strings"],
        "self_harm_indicators": ["list", "of", "strings"],
        "overall_risk_assessment_llm": "string"
      },
      "cross_platform_links_potential": [
        {"platform": "string", "identifier": "string", "reasoning": "string"}
      ],
      "suggestions_for_investigation": {
        "similar_users_suggested": [{"suggestion": "string", "reasoning": "string"}],
        "relevant_hashtags_suggested": [{"suggestion": "string", "reasoning": "string"}],
        "topics_to_monitor": ["list", "of", "strings"]
      }
    }
  `;

    try {
        const jsonData = await callLLM(model, jsonPrompt, maxTokens, temperature);
        return JSON.parse(jsonData) as never;
    } catch (error) {
        console.error(`Error during JSON extraction: ${error}`);
        const {message} = error as never;
        return { error: `Error: ${message}` } as never; // Return a JSON object with error message
    }
};

export { generateReportLLM, generateForensicAnalysisLLM, extractJSONDataLLM, generateProfileAnalysisLLM, generateTemporalAnalysis };
