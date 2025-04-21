
export interface ProfileAnalysisResult {
    analysis_metadata: {
        timestamp_utc: string;
        model_used: string;
        analysis_version: string;
    };
    profile_context: {
        username: string;
        biography_text: string;
        fullname?: string;
        follower_count?: number;
        following_count?: number;
        is_verified?: boolean;
    };
    initial_profile_analysis: {
        profile_overview: string;
        biography_summary: string;
        sentiment_analysis: {
            label: string;
            score: number;
        };
        key_information: string[];
        potential_interests: string[];
    };
    forensic_analysis: {
        pii_indicators: string[];
        mentioned_locations: string[];
        external_connections: {
            usernames: string[];
            urls: string[];
        };
        keywords_of_interest: string[];
        language_notes: string;
    };
    account_authenticity: {
        assessment: string;
        indicators: {
            positive: string[];
            negative: string[];
            neutral: string[];
        };
        recommendations: string[];
    };
    entity_extraction: {
        mentions: string[];
        hashtags: string[];
        urls: string[];
        emails: string[];
        phone_numbers: string[];
        locations: string[];
        organizations: string[];
        persons: string[];
        technologies_tools: string[];
        projects_products: string[];
    };
    temporal_analysis?: {
        posting_frequency: {
            summary: string;
            patterns: string[];
        };
        time_of_day_patterns: {
            summary: string;
            patterns: string[];
        };
        seasonal_variations: string[];
        gaps_or_spikes: string[];
        evolution_over_time: string;
        anomalies: string[];
    };
    content_analysis?: {
        dominant_themes: string[];
        linguistic_style: {
            summary: string;
            patterns: string[];
        };
        hashtag_strategy: string;
        mention_patterns: string[];
        sentiment_evolution: {
            summary: string;
            trends: string[];
        };
        content_evolution: string;
        automated_vs_human: {
            assessment: string;
            indicators: string[];
        };
        concerning_content: string[];
        post_analyses: Array<{
            timestamp: string;
            summary: string;
            key_observations: string[];
            sentiment: string;
            themes: string[];
        }>;
    };
    inferred_analysis: {
        potential_interests: Array<{
            interest: string;
            reasoning: string;
            confidence: "Low" | "Medium" | "High";
        }>;
        potential_affiliations: Array<{
            affiliation: string;
            reasoning: string;
            confidence: "Low" | "Medium" | "High";
        }>;
        potential_skills: Array<{
            skill: string;
            reasoning: string;
            confidence: "Low" | "Medium" | "High";
        }>;
        potential_locations: Array<{
            location: string;
            reasoning: string;
            confidence: "Low" | "Medium" | "High";
        }>;
    };
    network_graph_data: {
        nodes: Array<{
            id: string;
            label: string;
            type: string;
        }>;
        edges: Array<{
            source: string;
            target: string;
            label: string;
        }>;
    };
    visualization_data: {
        posting_heatmap?: Array<{
            day: number;
            hour: number;
            count: number;
        }>;
        sentiment_timeline?: Array<{
            timestamp: number;
            sentiment: number;
        }>;
        topic_distribution?: Array<{
            topic: string;
            count: number;
        }>;
        mention_network?: {
            nodes: Array<{
                id: string;
                label: string;
                weight: number;
            }>;
            edges: Array<{
                source: string;
                target: string;
                weight: number;
            }>;
        };
    };
}

export interface BasicUserInfo {
    full_name: string | null;
    biography: string | null;
    followers_count: number | null;
    following_count: number | null;
    is_private: boolean | null;
    is_verified: boolean | null;
    profile_pic_url: string | null;
    posts: InstagramPost[] | null;
}

export interface InstagramPost {
    id: string;
    shortcode: string;
    display_url: string;
    is_video: boolean;
    video_url?: string;
    caption: string;
    timestamp: number;
    like_count: number;
    comment_count: number;
    location?: string;
    tagged_users?: string[];
    media_type: string;
    children?: InstagramPost[];
}

