import express from "express";
import path from "path";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Load environment variables locally
dotenv.config();

// Define the root folder and database file paths for local fallback
const DB_DIR = process.env.VERCEL ? "/tmp" : path.join(process.cwd(), "data");
const DB_FILE = path.join(DB_DIR, "db.json");

// Ensure data directory exists
try {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
} catch (e) {
  console.warn("Unable to create local DB folder, ignoring if in memory/Supabase:", e);
}

// Supabase client initialization
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
const isSupabaseEnabled = !!(supabaseUrl && supabaseKey);

if (isSupabaseEnabled) {
  console.log("Supabase Integration Active: Reading/writing to Supabase database.");
} else {
  console.log("Supabase Offline: Falling back to local db.json database file.");
}

const supabase = isSupabaseEnabled ? createClient(supabaseUrl!, supabaseKey!) : null;

// Interfaces for our local DB structure
interface DatabaseSchema {
  niches: any[];
  videos: any[];
  settings: {
    openaiApiKey: string;
    crayoApiKey: string;
    veoApiKey: string;
    youtubeApiKey: string;
    tiktokClientKey: string;
    tiktokClientSecret: string;
    instagramAppId: string;
    instagramAppSecret: string;
    fullAutoMode: boolean;
  };
  logs: Array<{ id: string; timestamp: string; type: string; message: string }>;
}

// Initial/default seed data
const DEFAULT_NICHES = [
  {
    id: "niche-ai",
    name: "AI Tools",
    promptStyle: "Ultra-fast paced, high-energy tech reveal. Start with a shocking statement about a new AI website that feels illegal to know. Use futuristic metaphors, screen graphics descriptions.",
    scheduleTime: "09:00",
    hashtags: "#ai #aitools #chatgpt #tech #future #automation #worksmart",
    affiliateTitle: "Join the No-Code AI Accelerator",
    affiliateLink: "https://partner.aishorts.co/link/ai-accelerator",
    landingPageUrl: "https://mycourse.carrd.co"
  },
  {
    id: "niche-motivation",
    name: "Motivation & Discipline",
    promptStyle: "Deep, echoing voiceover style over cinematic slow-motion visuals. Brutally honest, focus on grit, daily routines, showing up when nobody is watching. End with self-reflection question.",
    scheduleTime: "06:00",
    hashtags: "#motivation #discipline #mindset #grind #stoic #success #habits",
    affiliateTitle: "Download the Daily Stoic Planner (Free Trial)",
    affiliateLink: "https://partner.aishorts.co/link/stoic-planner",
    landingPageUrl: "https://myaffiliateplanner.com"
  },
  {
    id: "niche-finance",
    name: "Personal Finance & Side Hustles",
    promptStyle: "Clean, step-by-step layout. Visualise math or profit calculations. Breakdown how an average person can earn $150/day using 2 simple web services. Keep style straightforward, low-hype, realistic.",
    scheduleTime: "12:00",
    hashtags: "#sidehustle #money #finance #passiveincome #investing #wealth",
    affiliateTitle: "Get 2 Free Stocks when signing up",
    affiliateLink: "https://partner.aishorts.co/link/webull-rewards",
    landingPageUrl: "https://getfreestocks.com"
  },
  {
    id: "niche-facts",
    name: "Deep Space & Unsolved Facts",
    promptStyle: "Mysterious atmospheric style. Focus on cosmic anomalies, terrifying statistics about the depth of the ocean, or historic oddities. Fast facts edited in text overlay blocks.",
    scheduleTime: "20:00",
    hashtags: "#facts #space #mindblown #universe #history #mysterious #earth",
    affiliateTitle: "Unlock Cosmic Astronomy Masterclass",
    affiliateLink: "https://partner.aishorts.co/link/cosmo-astronomy",
    landingPageUrl: "https://cosmictalks.com"
  },
  {
    id: "niche-reddit",
    name: "Reddit Deep Stories",
    promptStyle: "Enthralling conversational first-person storytelling style (e.g. 'Am I the asshole for calling off my wedding 2 hours before...'). Describe gaming background video clips (Minecraft parkour/Subway Surfers).",
    scheduleTime: "18:00",
    hashtags: "#redditstories #reddit #askreddit #aita #confession #drama #gamingbg",
    affiliateTitle: "Try Audible's Free Trial (Includes 1 Credit)",
    affiliateLink: "https://partner.aishorts.co/link/audible-stories",
    landingPageUrl: "https://audibletrial.com"
  }
];

const DEFAULT_VIDEOS = [
  {
    id: "vid-1",
    title: "The Insane AI Website That Does Your Work",
    nicheId: "niche-ai",
    nicheName: "AI Tools",
    language: "English",
    tone: "Dramatic & High Energy",
    duration: 58,
    status: "Publish",
    progress: 100,
    viralHook: "Stop scrolling! This single AI website feels 100% illegal to know.",
    scriptText: "Stop scrolling! This single AI website feels 100% illegal to know. Go to gamma.app right now. It creates fully comprehensive pitch-decks, business plans, and slide presentations in less than 40 seconds. Just type what you want to build and the AI writes the script, selects high-resolution images, and designs a gorgeous custom CSS theme. You don't need Canva or powerpoint anymore. Follow for daily AI hacks!",
    ctaText: "Gain instant access to our No-Code AI Accelerator in the bio!",
    hashtags: "#ai #aitools #productivity #future",
    seoDescription: "Gamma AI review. Discover how to automate slide creations and pitch decks with AI algorithms.",
    voiceUrl: "https://res.cloudinary.com/demo/video/upload/sample.mp3",
    videoUrl: "https://res.cloudinary.com/demo/video/upload/v1453303632/dog.mp4",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop",
    scheduledDate: "2026-05-23",
    scheduledTime: "12:00",
    platforms: {
      tiktok: "published",
      youtube: "published",
      instagram: "published",
      facebook: "none"
    },
    createdAt: "2026-05-23T08:00:00Z",
    publishedAt: "2026-05-23T12:05:00Z",
    stats: {
      views: 14250,
      engagement: 1450,
      clicks: 342,
      conversions: 24,
      revenue: 240
    }
  },
  {
    id: "vid-2",
    title: "The Stoic Hack For Instant Motivation",
    nicheId: "niche-motivation",
    nicheName: "Motivation & Discipline",
    language: "English",
    tone: "Stoic & Serious",
    duration: 45,
    status: "Schedule",
    progress: 100,
    viralHook: "If you are lazy right now, listen to Marcus Aurelius.",
    scriptText: "If you are lazy right now, listen to Marcus Aurelius. He said: 'At dawn, when you have trouble getting out of bed, tell yourself: I have to go to work—as a human being.' No one is coming to save you. No one is going to breathe for you, work for you, or build for you. Motivation is fake. Only daily disciplined action stands between you and the version of yourself you hate. Wake up, focus, and grind.",
    ctaText: "Download the Daily Stoic Planner in the bio.",
    hashtags: "#motivation #stoic #mindset #grind",
    seoDescription: "Stoicism and getting motivated. Inspirational quotes for success.",
    voiceUrl: "https://res.cloudinary.com/demo/video/upload/sample.mp3",
    videoUrl: "https://res.cloudinary.com/demo/video/upload/v1453303632/dog.mp4",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format&fit=crop",
    scheduledDate: "2026-05-23",
    scheduledTime: "18:00",
    platforms: {
      tiktok: "queued",
      youtube: "queued",
      instagram: "queued",
      facebook: "queued"
    },
    createdAt: "2026-05-23T10:15:00Z",
    stats: {
      views: 0,
      engagement: 0,
      clicks: 0,
      conversions: 0,
      revenue: 0
    }
  }
];

// Load Local Database helper
function loadDB(): DatabaseSchema {
  try {
    if (fs.existsSync(DB_FILE)) {
      const parsed = JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
      return {
        niches: parsed.niches || DEFAULT_NICHES,
        videos: parsed.videos || DEFAULT_VIDEOS,
        settings: parsed.settings || {
          openaiApiKey: "",
          crayoApiKey: "",
          veoApiKey: "",
          youtubeApiKey: "",
          tiktokClientKey: "",
          tiktokClientSecret: "",
          instagramAppId: "",
          instagramAppSecret: "",
          fullAutoMode: false,
        },
        logs: parsed.logs || [
          { id: "log-seed", timestamp: new Date().toISOString(), type: "system", message: "AI Shorts Factory initialized successfully." }
        ]
      };
    }
  } catch (error) {
    console.error("Error reading database file, resetting to fallback values.", error);
  }
  
  const initial: DatabaseSchema = {
    niches: DEFAULT_NICHES,
    videos: DEFAULT_VIDEOS,
    settings: {
      openaiApiKey: "",
      crayoApiKey: "",
      veoApiKey: "",
      youtubeApiKey: "",
      tiktokClientKey: "",
      tiktokClientSecret: "",
      instagramAppId: "",
      instagramAppSecret: "",
      fullAutoMode: false,
    },
    logs: [
      { id: "log-seed", timestamp: new Date().toISOString(), type: "system", message: "AI Shorts Factory DB seeded successfully." }
    ]
  };
  saveDB(initial);
  return initial;
}

// Save Local Database helper
function saveDB(data: DatabaseSchema): void {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing database file:", err);
  }
}

// Global cached local state synced to JSON (only active if Supabase is disabled)
let state = loadDB();

// --- CASE CONVERSION UTILITIES FOR POSTGRESQL SCHEMAS ---
function toSnakeCase(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map(toSnakeCase);
  if (typeof obj === "object" && !(obj instanceof Date)) {
    const result: any = {};
    for (const key of Object.keys(obj)) {
      const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      result[snakeKey] = toSnakeCase(obj[key]);
    }
    return result;
  }
  return obj;
}

function toCamelCase(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map(toCamelCase);
  if (typeof obj === "object" && !(obj instanceof Date)) {
    const result: any = {};
    for (const key of Object.keys(obj)) {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      result[camelKey] = toCamelCase(obj[key]);
    }
    return result;
  }
  return obj;
}

// --- SECURE STATELWSS DATABASE ACCESSORS ---
async function getNiches() {
  if (isSupabaseEnabled) {
    try {
      const { data, error } = await supabase!.from("niches").select("*").order("name");
      if (error) throw error;
      return toCamelCase(data || []);
    } catch (err) {
      console.error("Supabase Error getting niches, falling back to cached local state:", err);
      return state.niches;
    }
  }
  return state.niches;
}

async function getVideos() {
  if (isSupabaseEnabled) {
    try {
      const { data, error } = await supabase!.from("videos").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return toCamelCase(data || []);
    } catch (err) {
      console.error("Supabase Error getting videos, falling back to cached local state:", err);
      return state.videos;
    }
  }
  return state.videos;
}

async function getSettings() {
  if (isSupabaseEnabled) {
    try {
      let { data, error } = await supabase!.from("settings").select("*").eq("id", 1).maybeSingle();
      if (error) throw error;
      if (!data) {
        const defaultSettings = {
          id: 1,
          openai_api_key: "",
          crayo_api_key: "",
          veo_api_key: "",
          youtube_api_key: "",
          tiktok_client_key: "",
          tiktok_client_secret: "",
          instagram_app_id: "",
          instagram_app_secret: "",
          full_auto_mode: false
        };
        const { data: inserted, error: insErr } = await supabase!.from("settings").insert(defaultSettings).select().single();
        if (insErr) throw insErr;
        data = inserted;
      }
      return toCamelCase(data);
    } catch (err) {
      console.error("Supabase Error getting settings, falling back to cached local state:", err);
      return state.settings;
    }
  }
  return state.settings;
}

async function getLogs() {
  if (isSupabaseEnabled) {
    try {
      const { data, error } = await supabase!.from("logs").select("*").order("timestamp", { ascending: false }).limit(80);
      if (error) throw error;
      return toCamelCase(data || []);
    } catch (err) {
      console.error("Supabase Error getting logs, falling back to cached local state:", err);
      return state.logs;
    }
  }
  return state.logs;
}

async function saveNiche(niche: any) {
  if (isSupabaseEnabled) {
    try {
      const { error } = await supabase!.from("niches").upsert(toSnakeCase(niche));
      if (error) throw error;
    } catch (err) {
      console.error("Supabase Error saving niche:", err);
    }
  } else {
    const idx = state.niches.findIndex(n => n.id === niche.id);
    if (idx !== -1) {
      state.niches[idx] = niche;
    } else {
      state.niches.push(niche);
    }
    saveDB(state);
  }
}

async function deleteNiche(id: string) {
  if (isSupabaseEnabled) {
    try {
      const { error } = await supabase!.from("niches").delete().eq("id", id);
      if (error) throw error;
    } catch (err) {
      console.error("Supabase Error deleting niche:", err);
    }
  } else {
    state.niches = state.niches.filter(n => n.id !== id);
    saveDB(state);
  }
}

async function saveVideo(video: any) {
  if (isSupabaseEnabled) {
    try {
      const { error } = await supabase!.from("videos").upsert(toSnakeCase(video));
      if (error) throw error;
    } catch (err) {
      console.error("Supabase Error saving video:", err);
    }
  } else {
    const idx = state.videos.findIndex(v => v.id === video.id);
    if (idx !== -1) {
      state.videos[idx] = video;
    } else {
      state.videos.push(video);
    }
    saveDB(state);
  }
}

async function deleteVideo(id: string) {
  if (isSupabaseEnabled) {
    try {
      const { error } = await supabase!.from("videos").delete().eq("id", id);
      if (error) throw error;
    } catch (err) {
      console.error("Supabase Error deleting video:", err);
    }
  } else {
    state.videos = state.videos.filter(v => v.id !== id);
    saveDB(state);
  }
}

async function saveSettings(settingsObj: any) {
  if (isSupabaseEnabled) {
    try {
      const dbSettings = {
        ...toSnakeCase(settingsObj),
        id: 1
      };
      const { error } = await supabase!.from("settings").upsert(dbSettings);
      if (error) throw error;
    } catch (err) {
      console.error("Supabase Error updating settings:", err);
    }
  } else {
    state.settings = settingsObj;
    saveDB(state);
  }
}

async function clearLogs() {
  if (isSupabaseEnabled) {
    try {
      const { error } = await supabase!.from("logs").delete().neq("id", "none");
      if (error) throw error;
    } catch (err) {
      console.error("Supabase Error clearing logs:", err);
    }
  } else {
    state.logs = [
      { id: "log-clear", timestamp: new Date().toISOString(), type: "system", message: "Logs database cleared manually by admin." }
    ];
    saveDB(state);
  }
}

async function addLog(type: string, message: string) {
  const logEntry = {
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    type,
    message
  };
  
  if (isSupabaseEnabled) {
    try {
      const { error } = await supabase!.from("logs").insert(toSnakeCase(logEntry));
      if (error) throw error;
    } catch (err) {
      console.error("Supabase Error logging failed:", err);
    }
  } else {
    state.logs.unshift(logEntry);
    if (state.logs.length > 80) {
      state.logs = state.logs.slice(0, 80);
    }
    saveDB(state);
  }
}

// Admin Configurations
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const AUTH_TOKEN = "ai-shorts-factory-secret-token-key-2026";

// --- AUTOPILOT ENGINE RUNNER ---
async function runAutopilotStep() {
  const currentSettings = await getSettings();
  if (!currentSettings.fullAutoMode) return;

  const videosList = await getVideos();
  const nichesList = await getNiches();

  const activeVideo = videosList.find((v: any) => v.status !== "Publish" && v.status !== "failed");

  if (activeVideo) {
    const statusSchedule = ['Idea', 'Script', 'Voice', 'Video', 'Subtitle', 'Thumbnail', 'Schedule', 'Publish'];
    const currentIndex = statusSchedule.indexOf(activeVideo.status);
    const nextStatus = statusSchedule[currentIndex + 1];

    if (nextStatus) {
      let progress = 10;
      let extra: any = {};
      
      if (nextStatus === "Script") {
        progress = 25;
        extra.viralHook = `Instantly viral hook for ${activeVideo.title}!`;
        extra.scriptText = `Auto-written viral narrative about ${activeVideo.nicheName} side-hustles. Dynamic edits, visual text cuts to sustain retention rates.`;
        extra.ctaText = "Sign up using our exclusive partnership links inside our description panel.";
        extra.hashtags = "#marketing #automation #sidehustle";
        extra.seoDescription = "Viral shorts secrets and growth tutorial guidelines.";
      } else if (nextStatus === "Voice") {
        progress = 38;
        extra.voiceUrl = `/sounds/voice-${activeVideo.id}.mp3`;
      } else if (nextStatus === "Video") {
        progress = 55;
        extra.videoUrl = "https://res.cloudinary.com/demo/video/upload/v1453303632/dog.mp4";
      } else if (nextStatus === "Subtitle") {
        progress = 70;
      } else if (nextStatus === "Thumbnail") {
        progress = 85;
        extra.imageUrl = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop";
      } else if (nextStatus === "Schedule") {
        progress = 95;
        extra.scheduledDate = new Date().toISOString().split("T")[0];
        extra.scheduledTime = "18:00";
      } else if (nextStatus === "Publish") {
        progress = 100;
        extra.publishedAt = new Date().toISOString();
        extra.stats = {
          views: Math.floor(Math.random() * 2000) + 1000,
          engagement: Math.floor(Math.random() * 200) + 50,
          clicks: Math.floor(Math.random() * 40) + 5,
          conversions: Math.floor(Math.random() * 4) + 1,
          revenue: Math.floor(Math.random() * 50) + 2
        };
      }

      const updatedVideo = {
        ...activeVideo,
        status: nextStatus as any,
        progress,
        ...extra
      };
      await saveVideo(updatedVideo);
      await addLog("engine", `FULL AUTO: Advanced "${activeVideo.title}" to state: [${nextStatus}] (${progress}%)`);
    }
  } else {
    const randomNiche = nichesList[Math.floor(Math.random() * nichesList.length)] || DEFAULT_NICHES[0];
    const ideaTitles = [
      "The Secret Framework Nobody Teaches You",
      "Stop Wasting Time on This Simple Habit",
      "This Single Mistake is Hurting Your Wallet Daily",
      "The Shocking Truth About Medieval Hygiene",
      "An AI tool That Feels Too Powerful"
    ];
    const selectedTitle = ideaTitles[Math.floor(Math.random() * ideaTitles.length)];
    
    const newVideo = {
      id: `vid-${Date.now()}`,
      title: `${selectedTitle} (${randomNiche.name})`,
      nicheId: randomNiche.id,
      nicheName: randomNiche.name,
      language: "English",
      tone: "Snappy & Suspenseful",
      duration: 45,
      status: "Idea",
      progress: 10,
      createdAt: new Date().toISOString(),
      platforms: {
        tiktok: "queued",
        youtube: "queued",
        instagram: "queued",
        facebook: "none"
      },
      stats: {
        views: 0,
        engagement: 0,
        clicks: 0,
        conversions: 0,
        revenue: 0
      }
    };

    await saveVideo(newVideo);
    await addLog("engine", `FULL AUTO: Spawned new campaign draft: "${newVideo.title}" in niche: ${randomNiche.name}`);
  }

  // Accumulate views automatically on older videos
  for (const v of videosList) {
    if (v.status === "Publish" && v.stats) {
      const viewBoost = Math.floor(Math.random() * 250) + 50;
      const clicksBoost = Math.random() > 0.6 ? Math.floor(Math.random() * 6) + 1 : 0;
      const convBoost = clicksBoost > 0 && Math.random() > 0.82 ? 1 : 0;
      
      const updatedVideo = {
        ...v,
        stats: {
          views: v.stats.views + viewBoost,
          engagement: Math.floor(v.stats.engagement + (viewBoost * 0.12)),
          clicks: v.stats.clicks + clicksBoost,
          conversions: v.stats.conversions + convBoost,
          revenue: Math.floor(v.stats.revenue + (convBoost * 10) + (viewBoost * 0.01))
        }
      };
      await saveVideo(updatedVideo);
    }
  }
}

let lastAutopilotTick = 0;
async function checkAutopilotTick() {
  const now = Date.now();
  // Throttle simulation calls to run at most once every 30 seconds to be extremely serverless friendly
  if (now - lastAutopilotTick < 30000) return;
  lastAutopilotTick = now;
  try {
    await runAutopilotStep();
  } catch (err) {
    console.error("Autopilot tick simulation execution error:", err);
  }
}

// Express App Initialization
const app = express();
app.use(express.json());

// API Authentication middleware checking static auth header
const authMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.split(" ")[1] === AUTH_TOKEN) {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized. Admin session invalid/missing." });
  }
};

// --- AUTH SERVICE ---
app.post("/api/auth/login", async (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    await addLog("auth", "Admin login successful.");
    res.json({ token: AUTH_TOKEN, success: true });
  } else {
    await addLog("auth", "Failed login attempt with incorrect credentials.");
    res.status(401).json({ error: "Invalid password. Access Denied." });
  }
});

app.get("/api/auth/verify", (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.split(" ")[1] === AUTH_TOKEN) {
    res.json({ valid: true });
  } else {
    res.json({ valid: false });
  }
});

// --- STATS / ANALYTICS ---
app.get("/api/dashboard/stats", authMiddleware, async (req, res) => {
  // Trigger simulation worker tick serverless-friendly style
  await checkAutopilotTick();

  const videosList = await getVideos();
  const currentSettings = await getSettings();

  const generatedToday = videosList.filter((v: any) => {
    if (!v.createdAt) return false;
    const todayString = new Date().toISOString().split("T")[0];
    return v.createdAt.startsWith(todayString);
  }).length;

  const scheduled = videosList.filter((v: any) => v.status === "Schedule").length;
  const published = videosList.filter((v: any) => v.status === "Publish").length;

  let totalViews = 0;
  let totalClicks = 0;
  let totalConversions = 0;
  let totalRevenue = 0;

  videosList.forEach((v: any) => {
    if (v.stats) {
      totalViews += v.stats.views || 0;
      totalClicks += v.stats.clicks || 0;
      totalConversions += v.stats.conversions || 0;
      totalRevenue += v.stats.revenue || 0;
    }
  });

  res.json({
    generatedToday,
    scheduled,
    published,
    totalViews,
    totalClicks,
    totalConversions,
    totalRevenue,
    estimatedRPM: totalViews > 0 ? (totalRevenue / (totalViews / 1000)) : 1.45,
    fullAutoMode: currentSettings.fullAutoMode
  });
});

// --- NICHES API ---
app.get("/api/niches", authMiddleware, async (req, res) => {
  const nichesList = await getNiches();
  res.json(nichesList);
});

app.post("/api/niches", authMiddleware, async (req, res) => {
  const { name, promptStyle, scheduleTime, hashtags, affiliateTitle, affiliateLink, landingPageUrl } = req.body;
  if (!name || !promptStyle) {
    return res.status(400).json({ error: "Name and Prompt Style are required." });
  }
  const newNiche = {
    id: `niche-${Date.now()}`,
    name,
    promptStyle,
    scheduleTime: scheduleTime || "12:00",
    hashtags: hashtags || "",
    affiliateTitle: affiliateTitle || "",
    affiliateLink: affiliateLink || "",
    landingPageUrl: landingPageUrl || ""
  };
  await saveNiche(newNiche);
  await addLog("niche", `Created new niche: ${name}`);
  res.json(newNiche);
});

app.put("/api/niches/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { name, promptStyle, scheduleTime, hashtags, affiliateTitle, affiliateLink, landingPageUrl } = req.body;
  
  const nichesList = await getNiches();
  const index = nichesList.findIndex((n: any) => n.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Niche not found." });
  }

  const updatedNiche = {
    ...nichesList[index],
    name: name || nichesList[index].name,
    promptStyle: promptStyle || nichesList[index].promptStyle,
    scheduleTime: scheduleTime || nichesList[index].scheduleTime,
    hashtags: hashtags !== undefined ? hashtags : nichesList[index].hashtags,
    affiliateTitle: affiliateTitle !== undefined ? affiliateTitle : nichesList[index].affiliateTitle,
    affiliateLink: affiliateLink !== undefined ? affiliateLink : nichesList[index].affiliateLink,
    landingPageUrl: landingPageUrl !== undefined ? landingPageUrl : nichesList[index].landingPageUrl,
  };

  await saveNiche(updatedNiche);
  await addLog("niche", `Updated niche details for: ${updatedNiche.name}`);
  res.json(updatedNiche);
});

app.delete("/api/niches/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const nichesList = await getNiches();
  const found = nichesList.some((n: any) => n.id === id);
  if (found) {
    await deleteNiche(id);
    await addLog("niche", `Deleted niche ${id}`);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: "Niche not found" });
  }
});

// --- VIDEOS PIPELINE API ---
app.get("/api/videos", authMiddleware, async (req, res) => {
  await checkAutopilotTick();
  const videosList = await getVideos();
  res.json(videosList);
});

app.post("/api/videos", authMiddleware, async (req, res) => {
  const { nicheId, language, tone, duration, title } = req.body;
  
  const nichesList = await getNiches();
  const selectedNiche = nichesList.find((n: any) => n.id === nicheId) || { name: "Custom Niche", hashtags: "#shorts" };

  const newVideo = {
    id: `vid-${Date.now()}`,
    title: title || `Viral Script Idea #${Math.floor(Math.random() * 900) + 100}`,
    nicheId: nicheId || "custom",
    nicheName: selectedNiche.name,
    language: language || "English",
    tone: tone || "High Energy Storyteller",
    duration: duration || 60,
    status: "Idea",
    progress: 10,
    createdAt: new Date().toISOString(),
    platforms: {
      tiktok: "queued",
      youtube: "queued",
      instagram: "queued",
      facebook: "none"
    },
    stats: {
      views: 0,
      engagement: 0,
      clicks: 0,
      conversions: 0,
      revenue: 0
    }
  };

  await saveVideo(newVideo);
  await addLog("video", `Drafted new video idea: "${newVideo.title}" in ${selectedNiche.name}`);
  res.json(newVideo);
});

app.put("/api/videos/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const videosList = await getVideos();
  const index = videosList.findIndex((v: any) => v.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Video project not found." });
  }

  const updatedVideo = {
    ...videosList[index],
    ...req.body
  };

  await saveVideo(updatedVideo);
  res.json(updatedVideo);
});

app.delete("/api/videos/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  await deleteVideo(id);
  await addLog("video", `Removed video project ${id}`);
  res.json({ success: true });
});

// --- AI SCRIPT GENERATOR ---
app.post("/api/videos/:id/generate-script", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const videosList = await getVideos();
  const nichesList = await getNiches();

  const index = videosList.findIndex((v: any) => v.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Video project not found" });
  }

  const video = videosList[index];
  const nicheObj = nichesList.find((n: any) => n.id === video.nicheId) || { promptStyle: "viral video", hashtags: "#custom", affiliateTitle: "Free Gift", affiliateLink: "https://myshop.com" };

  await addLog("ai", `Requesting AI Script generation for "${video.title}" using Gemini Server-Side integration...`);

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      throw new Error("No real GEMINI_API_KEY found, playing mock AI generation instead with realistic copy.");
    }

    const aiGen = new GoogleGenAI({
      apiKey: apiKey,
    });

    const systemPrompt = `You are an elite short-form media writer specializing in virality for TikTok, YouTube Shorts, and Reels.
    You produce punchy scripts with rapid transitions, strong viral hooks, and high-converting calls to action.
    Provide response formatted in raw JSON with these exact string attributes:
    {
      "viralHook": "A direct, bold, attention-commanding statement under 15 words to stop the scroll.",
      "scriptText": "The entire video script divided into short sentences or phrasing beats. Speak directly to the listener in a snappy manner, avoiding verbose text. Aim for maximum audience retention.",
      "ctaText": "An dynamic checkout/follow/click CTA statement incorporating the following offer info: ${nicheObj.affiliateTitle}",
      "hashtags": "Space separated viral hashtags specific to the niche.",
      "title": "A high CTR hook title.",
      "seoDescription": "A search engines friendly caption summarizing the facts."
    }`;

    const userInstruction = `Niche Category: "${video.nicheName}"
    Tone style of narration: "${video.tone}"
    Target duration: ${video.duration} seconds.
    Creative style prompt: "${nicheObj.promptStyle}"
    Language: "${video.language}"`;

    const response = await aiGen.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userInstruction,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        temperature: 1
      }
    });

    const parsedResult = JSON.parse(response.text || "{}");
    
    const updatedVideo = {
      ...video,
      status: "Script",
      progress: 25,
      title: parsedResult.title || video.title,
      viralHook: parsedResult.viralHook || "Attention scroll readers!",
      scriptText: parsedResult.scriptText || "No script could be formed. Check variables.",
      ctaText: parsedResult.ctaText || `Visit affiliate links! ${nicheObj.affiliateLink}`,
      hashtags: parsedResult.hashtags || nicheObj.hashtags || "#trending",
      seoDescription: parsedResult.seoDescription || "SEO keywords optimized for search feeds.",
    };
    
    await saveVideo(updatedVideo);
    await addLog("ai", `Successfully generated AI Script for niche: ${video.nicheName}`);
    res.json(updatedVideo);

  } catch (err: any) {
    console.warn("Gemini execution failed inside serverlet, forming secure offline response:", err.message);
    
    let mockTitle = video.title;
    let mockHook = "You won't believe what they hid from us!";
    let mockScript = "This entire process has been automatically drafted by the engine. You can connect your Google Gemini API key inside the settings for real-time generative outputs. Once connected, every script adapts perfectly to your custom prompt instructions.";
    let mockCTA = `Check the top resource link in the dashboard description: ${nicheObj.affiliateTitle || "Our Course"}`;
    let mockTags = nicheObj.hashtags || "#shorts #viral #fyp";
    let mockSearch = "SaaS viral reels generator automations step tutorial.";

    if (video.nicheId === "niche-ai") {
      mockTitle = "This AI website is literally illegal to know!";
      mockHook = "Stop designing slides by hand. Use this AI secret instead.";
      mockScript = "Stop designing slides by hand. Go right now to Gamma.app. Just input your topic and this specialized AI generator crafts your entire presentation, imports relevant images, and designs the typography layout in under 1 minute. It is completely clean and outperforms Canva by a mile. Save this video so you don't forget!";
      mockCTA = `Check the pinned link to access: ${nicheObj.affiliateTitle || "AI No-Code Masterclass"}`;
    } else if (video.nicheId === "niche-motivation") {
      mockTitle = "The Stoic Routine Marcus Aurelius Swore By";
      mockHook = "If you lack discipline, Marcus Aurelius has a harsh message.";
      mockScript = "Marcus Aurelius once wrote: 'When you wake in the morning, remember what a privilege it is to be alive—to think, to enjoy, to love.' It is easy to lie in bed scrolling social feeds. Only those who master discomfort succeed. Stop waiting for motivation. Your goals will not materialize itself.";
      mockCTA = `Grab the Daily Stoic Tracker Workbook for 50% discount: ${nicheObj.affiliateTitle || "Stoic Tools"}`;
    }

    const updatedVideo = {
      ...video,
      status: "Script",
      progress: 25,
      title: mockTitle,
      viralHook: mockHook,
      scriptText: mockScript,
      ctaText: mockCTA,
      hashtags: mockTags,
      seoDescription: mockSearch,
    };

    await saveVideo(updatedVideo);
    await addLog("ai", `Created fallback AI script for offline/mock state: "${mockTitle}"`);
    res.json(updatedVideo);
  }
});

// --- AUTOMATIC RENDERING PROCESS (SIMULATOR FOR CHANNELS: VEO / CRAYO) ---
app.post("/api/videos/:id/simulate-generation", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const videosList = await getVideos();
  const index = videosList.findIndex((v: any) => v.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Video project not found" });
  }

  const { targetStatus } = req.body;
  const video = videosList[index];
  
  let nextStatus = video.status;
  let progress = video.progress;
  let urlUpdates: any = {};

  if (targetStatus === "Voice") {
    nextStatus = "Voice";
    progress = 38;
    urlUpdates.voiceUrl = `/media/sounds/tts-${video.id}.mp3`;
    await addLog("generation", `Synthesized voice-over template for: "${video.title}" using Crayo TTS engine.`);
  } else if (targetStatus === "Video") {
    nextStatus = "Video";
    progress = 55;
    urlUpdates.videoUrl = "https://res.cloudinary.com/demo/video/upload/v1453303632/dog.mp4";
    await addLog("generation", `Generated background video footage matching hook using VeoAI renderer.`);
  } else if (targetStatus === "Subtitle") {
    nextStatus = "Subtitle";
    progress = 70;
    await addLog("generation", `Burned auto transcription overlays & transition typography style: Crayo-Neon.`);
  } else if (targetStatus === "Thumbnail") {
    nextStatus = "Thumbnail";
    progress = 85;
    urlUpdates.imageUrl = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop";
    await addLog("generation", `Rendered customized click-magnet 9:16 vertical cover banner.`);
  } else if (targetStatus === "Schedule") {
    nextStatus = "Schedule";
    progress = 95;
    const today = new Date();
    urlUpdates.scheduledDate = today.toISOString().split("T")[0];
    urlUpdates.scheduledTime = "18:00";
    urlUpdates.platforms = {
      tiktok: "queued",
      youtube: "queued",
      instagram: "queued",
      facebook: "queued"
    };
    await addLog("posting", `Scheduled to automated publish queue at: 18:00`);
  } else if (targetStatus === "Publish") {
    nextStatus = "Publish";
    progress = 100;
    urlUpdates.publishedAt = new Date().toISOString();
    urlUpdates.platforms = {
      tiktok: "published",
      youtube: "published",
      instagram: "published",
      facebook: "published"
    };
    urlUpdates.stats = {
      views: Math.floor(Math.random() * 2500) + 750,
      engagement: Math.floor(Math.random() * 250) + 80,
      clicks: Math.floor(Math.random() * 30) + 10,
      conversions: Math.floor(Math.random() * 3) + 1,
      revenue: Math.floor(Math.random() * 40) + 5
    };
    await addLog("posting", `Successfully published shorts content across: TikTok, YouTube, Reels.`);
  }

  const updatedVideo = {
    ...video,
    status: nextStatus,
    progress,
    ...urlUpdates
  };

  await saveVideo(updatedVideo);
  res.json(updatedVideo);
});

// --- SETTINGS (KEYS) API ---
app.get("/api/settings", authMiddleware, async (req, res) => {
  const s = await getSettings();
  res.json({
    openaiApiKey: s.openaiApiKey ? "••••••••••••••••" : "",
    crayoApiKey: s.crayoApiKey ? "••••••••••••••••" : "",
    veoApiKey: s.veoApiKey ? "••••••••••••••••" : "",
    youtubeApiKey: s.youtubeApiKey ? "••••••••••••••••" : "",
    tiktokClientKey: s.tiktokClientKey ? "••••••••••••••••" : "",
    tiktokClientSecret: s.tiktokClientSecret ? "••••••••••••••••" : "",
    instagramAppId: s.instagramAppId ? "••••••••••••••••" : "",
    instagramAppSecret: s.instagramAppSecret ? "••••••••••••••••" : "",
    fullAutoMode: s.fullAutoMode
  });
});

app.post("/api/settings", authMiddleware, async (req, res) => {
  const s = await getSettings();
  const body = req.body;

  const newSettings = {
    openaiApiKey: body.openaiApiKey && body.openaiApiKey !== "••••••••••••••••" ? body.openaiApiKey : s.openaiApiKey,
    crayoApiKey: body.crayoApiKey && body.crayoApiKey !== "••••••••••••••••" ? body.crayoApiKey : s.crayoApiKey,
    veoApiKey: body.veoApiKey && body.veoApiKey !== "••••••••••••••••" ? body.veoApiKey : s.veoApiKey,
    youtubeApiKey: body.youtubeApiKey && body.youtubeApiKey !== "••••••••••••••••" ? body.youtubeApiKey : s.youtubeApiKey,
    tiktokClientKey: body.tiktokClientKey && body.tiktokClientKey !== "••••••••••••••••" ? body.tiktokClientKey : s.tiktokClientKey,
    tiktokClientSecret: body.tiktokClientSecret && body.tiktokClientSecret !== "••••••••••••••••" ? body.tiktokClientSecret : s.tiktokClientSecret,
    instagramAppId: body.instagramAppId && body.instagramAppId !== "••••••••••••••••" ? body.instagramAppId : s.instagramAppId,
    instagramAppSecret: body.instagramAppSecret && body.instagramAppSecret !== "••••••••••••••••" ? body.instagramAppSecret : s.instagramAppSecret,
    fullAutoMode: body.fullAutoMode !== undefined ? body.fullAutoMode : s.fullAutoMode
  };

  await saveSettings(newSettings);
  await addLog("system", `System parameters saved. Auto mode state: ${newSettings.fullAutoMode ? "ENABLED (FULL AUTO)" : "DISABLED"}`);
  res.json({ success: true, fullAutoMode: newSettings.fullAutoMode });
});

// --- LOGS API ---
app.get("/api/logs", authMiddleware, async (req, res) => {
  const logsList = await getLogs();
  res.json(logsList);
});

app.post("/api/logs/clear", authMiddleware, async (req, res) => {
  await clearLogs();
  res.json({ success: true });
});

// --- SEED TEST DEMO SYSTEM ---
app.post("/api/system/seed-demo", authMiddleware, async (req, res) => {
  const sampleVideos = [
    ...DEFAULT_VIDEOS,
    {
      id: `vid-demo-1`,
      title: "5 Mind-Blowing Facts About Deep Ocean Creatures",
      nicheId: "niche-facts",
      nicheName: "Deep Space & Unsolved Facts",
      language: "English",
      tone: "Dramatic Narrator",
      duration: 50,
      status: "Publish",
      progress: 100,
      viralHook: "At the deepest part of the ocean, creatures exist that defy modern science.",
      scriptText: "At the deepest part of the ocean, creatures exist that defy modern science. Meet the Mariana Snailfish—it lives 26,000 feet underwater where pressure is equal to an elephant standing on your thumb. Their bodies are completely transparent, gelatinous, and lack scales. How do they survive? Follow for more insane facts!",
      ctaText: "Check science course options in details.",
      hashtags: "#facts #deepocean #mindblown",
      voiceUrl: "mock-url",
      videoUrl: "mock-url",
      imageUrl: "https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=500&auto=format&fit=crop",
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      publishedAt: new Date(Date.now() - 1800000).toISOString(),
      stats: {
        views: 9410,
        engagement: 940,
        clicks: 182,
        conversions: 12,
        revenue: 120
      }
    },
    {
      id: `vid-demo-2`,
      title: "Reddit confession: Am I clean for running out?",
      nicheId: "niche-reddit",
      nicheName: "Reddit Deep Stories",
      language: "English",
      tone: "Dramatic Confession",
      duration: 60,
      status: "Publish",
      progress: 100,
      viralHook: "Am I the asshole for calling off my wedding because of a soup?",
      scriptText: "Am I the asshole for calling off my wedding because of a soup? Yes. My fiance's mother insisted on serving mushroom cream soup, knowing fully well I'm severely allergic. But she told me to just 'eat around it'. I told her she is clinically insane and ran out.",
      ctaText: "Get Amazon Audible story collection free in bio.",
      hashtags: "#redditdrama #reddit #askreddit",
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      publishedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      stats: {
        views: 52180,
        engagement: 6240,
        clicks: 1140,
        conversions: 84,
        revenue: 420
      }
    }
  ];

  if (isSupabaseEnabled) {
    try {
      // Loop upsert each video
      for (const sv of sampleVideos) {
        await supabase!.from("videos").upsert(toSnakeCase(sv));
      }
    } catch (err) {
      console.error("Supabase Error seeding demo:", err);
    }
  } else {
    state.videos = sampleVideos;
    saveDB(state);
  }

  await addLog("system", "Demographic test data database reseeded.");
  res.json({ success: true, videos: sampleVideos });
});

// Periodic local ticks when running in persistent processes (fallback)
if (!process.env.VERCEL) {
  setInterval(async () => {
    const currentSettings = await getSettings();
    if (currentSettings.fullAutoMode) {
      try {
        await runAutopilotStep();
      } catch (err) {
        console.error("Autopilot loop error:", err);
      }
    }
  }, 45000);
}

// Export the Express App for Vercel Serverless compilation
export default app;

// Only start listening if executed directly by Node/tsx or not on Vercel
if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  const PORT = Number(process.env.PORT) || 3000;
  
  if (process.env.NODE_ENV !== "production") {
    import("vite").then(({ createServer: createViteServer }) => {
      createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      }).then(vite => {
        app.use(vite.middlewares);
        app.listen(PORT, "0.0.0.0", () => {
          console.log(`Development server running on http://localhost:${PORT}`);
        });
      });
    }).catch(err => {
      console.error("Failed to load Vite server dynamically:", err);
    });
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running in production on http://localhost:${PORT}`);
    });
  }
}
