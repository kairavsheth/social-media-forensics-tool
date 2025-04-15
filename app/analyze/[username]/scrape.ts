interface BasicUserInfo {
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


async function getUserInfoAndId(username: string, headers: HeadersInit): Promise<[string | null, BasicUserInfo | null, string | null]> {
    const url = `https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`;
    console.log(`Fetching user info for ${username}...`);

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: headers,
            credentials: 'include', // To send cookies along with the request
        });

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();
        const userData = data?.data?.user;

        if (!userData) {
            console.log(`Error: Could not find 'user' object in profile info for ${username}`);
            return [null, null, "User object not found in response"];
        }

        const userId = userData?.id;
        if (!userId) {
            console.log(`Error: Could not extract user ID for ${username}`);
            return [null, null, "User ID not found in response"];
        }

        const posts = userData?.edge_owner_to_timeline_media?.edges || null;

        const basicInfo: BasicUserInfo = {
            full_name: userData?.full_name || null,
            biography: userData?.biography || null,
            followers_count: userData?.edge_followed_by?.count || null,
            following_count: userData?.edge_follow?.count || null,
            is_private: userData?.is_private || null,
            is_verified: userData?.is_verified || null,
            profile_pic_url: userData?.profile_pic_url_hd || userData?.profile_pic_url || null,
            posts: null,
        };

        console.log(userData?.edge_owner_to_timeline_media?.edges);

        if (posts) {
            basicInfo.posts = posts.map((edge: {node: any}) => {
                const node = edge.node;

                // Extract basic post data
                const post: InstagramPost = {
                    id: node.id || '',
                    shortcode: node.shortcode || '',
                    display_url: node.display_url || '',
                    is_video: node.is_video || false,
                    caption: node.edge_media_to_caption?.edges?.[0]?.node?.text || '',
                    timestamp: node.taken_at_timestamp || 0,
                    like_count: node.edge_liked_by?.count || 0,
                    comment_count: node.edge_media_to_comment?.count || 0,
                    media_type: node.__typename || ''
                };

                // Add video URL if available
                if (node.is_video && node.video_url) {
                    post.video_url = node.video_url;
                }

                // Extract location if available
                if (node.location) {
                    post.location = node.location.name;
                }

                // Extract tagged users if available
                if (node.edge_media_to_tagged_user && node.edge_media_to_tagged_user.edges) {
                    post.tagged_users = node.edge_media_to_tagged_user.edges.map((userEdge: any) =>
                        userEdge.node.user.username
                    );
                }

                // Handle carousel posts (multiple images/videos)
                if (node.edge_sidecar_to_children && node.edge_sidecar_to_children.edges) {
                    post.children = node.edge_sidecar_to_children.edges.map((childEdge: { node: never; }) => {
                        const childNode = childEdge.node;
                        const {shortcode, __typename, video_url, id, is_video, display_url} = childNode;
                        return {
                            id: id || '',
                            shortcode: shortcode || '',
                            display_url: display_url || '',
                            is_video: is_video || false,
                            video_url: is_video ? video_url : undefined,
                            media_type: __typename || ''
                        };
                    });
                }

                return post;
            });
        }


        console.log(`Successfully fetched info for User ID: ${userId}`);
        return [userId, basicInfo, null]; // Return null for error message on success
    } catch (error) {
        if (error instanceof Error) {
            console.log(`An error occurred fetching profile info: ${error.message}`);
            const statusCode = error.message.includes('HTTP error') ? parseInt(error.message.split(':')[1].trim()) : 0;
            let errorMsg = `Network Error: ${error.message}`;

            if (statusCode === 404) {
                errorMsg = "Profile not found (404 Error)";
            } else if (statusCode === 401 || statusCode === 403) {
                errorMsg = "Unauthorized or Forbidden (401/403 Error) - Check cookies/login";
            } else if (statusCode === 429) {
                errorMsg = "Rate Limited (429 Error) - Wait before trying again";
            }

            return [null, null, errorMsg];
        } else {
            console.log(`Unexpected error occurred fetching profile info: ${error}`);
            return [null, null, `Unexpected Error: ${error}`];
        }
    }
}

import puppeteer from 'puppeteer';

async function extractCookiesAndSession(): Promise<{ [key: string]: string }> {
    // Launch headless browser
    const browser = await puppeteer.launch({
        headless: true, // Run headlessly
        args: ['--no-sandbox', '--disable-setuid-sandbox'], // Use additional flags for serverless environments
    });

    // Open a new page
    const page = await browser.newPage();

    // Go to Instagram homepage (or any other public page)
    await page.goto('https://www.instagram.com/');

    // Wait for the page to load
    await page.waitForNetworkIdle(); // 5 seconds wait

    // Extract cookies
    const cookies = await browser.cookies();

    // Extract sessionid from localStorage via page.evaluate
    const sessionid = await page.evaluate(() => {
        return window.localStorage.getItem('Session');
    });

    // Wait for the sessionid to be loaded properly
    await page.waitForNetworkIdle(); // 3 seconds for sessionid to load

    // Convert cookies to a dictionary for easy access
    const cookieDict: { [key: string]: string } = {};
    cookies.forEach(cookie => {
        cookieDict[cookie.name] = cookie.value;
    });

    // Add sessionid from localStorage
    if (sessionid) {
        cookieDict['sessionid'] = sessionid;
    }

    // Close the browser session
    await browser.close();

    return cookieDict;
}


function prepare_headers(username: string, cookies: { [key: string]: string }) {
    return {
        "accept": "*/*",
        "accept-language": "en-US,en;q=0.9",
        "referer": `https://www.instagram.com/${username}/`,
        "sec-ch-prefers-color-scheme": "dark",
        "sec-ch-ua": '"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
        "x-csrftoken": cookies["csrftoken"],
        "x-ig-app-id": "936619743392459",
        "x-requested-with": "XMLHttpRequest",
        "x-ig-user-id": cookies["ds_user_id"],
    }
}


export async function insta_scrape(username: string) {
    const cookies = await extractCookiesAndSession();
    const headers = prepare_headers(username, cookies);
    const [userId, basicInfo, errorMessage] = await getUserInfoAndId(username, headers);


    if (errorMessage) {
        console.log(`Error fetching user info: ${errorMessage}`);
        return {error: errorMessage};
    }

    return {
        userId,
        basicInfo,
        cookies,
    };
}
