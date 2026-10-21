import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Helper to get GoogleGenAI client safely
function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// 1. Config & Health Route
app.get('/api/config', (req, res) => {
  const hasKey = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY';
  res.json({
    status: 'ok',
    hasKey,
    youtubeChannelUrl: process.env.YOUTUBE_CHANNEL_URL || 'https://www.youtube.com/@IONIVoiceStudio',
    brandName: 'IONI Voice Studio',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
  });
});

// 2. AI Voice Studio Route (Gemini 3.8 Flash Lite TTS)
app.post('/api/voice/generate', async (req, res) => {
  try {
    const { text, voiceName = 'Kore', style = 'Clear, professional narrative', language = 'en' } = req.body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ error: 'Text prompt is required.' });
    }

    if (text.length > 5000) {
      return res.status(400).json({ error: 'Text exceeds maximum limit of 5,000 characters.' });
    }

    const ai = getAiClient();
    if (!ai) {
      return res.status(503).json({
        error: 'GEMINI_API_KEY is not configured on the server. Please add your GEMINI_API_KEY in the environment secrets.',
        isConfigError: true,
      });
    }

    // Supported voices: Puck, Charon, Kore, Fenrir, Zephyr
    const validVoices = ['Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'];
    const chosenVoice = validVoices.includes(voiceName) ? voiceName : 'Kore';

    const promptText = text.trim();
    const styleInstruction = style ? `${style}. Speak naturally with accurate cadence and pronunciation.` : 'Natural, clear and professional tone.';

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: promptText,
              speechMetadata: {
                style: styleInstruction,
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: chosenVoice },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    const mimeType = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.mimeType || 'audio/wav';

    if (!base64Audio) {
      return res.status(502).json({
        error: 'The AI model completed the request but did not return audio data. Please try with different text or voice.',
      });
    }

    return res.json({
      success: true,
      audioBase64: base64Audio,
      mimeType,
      voiceName: chosenVoice,
      charCount: promptText.length,
      estimatedWords: promptText.split(/\s+/).filter(Boolean).length,
      generatedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('Error in /api/voice/generate:', err);
    return res.status(500).json({
      error: err?.message || 'Failed to synthesize voice with Gemini TTS.',
      details: err?.toString?.() || '',
    });
  }
});

// 3. AI Chat Route (Gemini 3.8 Flash)
app.post('/api/chat/message', async (req, res) => {
  try {
    const { message, history = [], language = 'en' } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message content is required.' });
    }

    const ai = getAiClient();
    if (!ai) {
      return res.status(503).json({
        error: 'GEMINI_API_KEY is not configured on the server.',
        isConfigError: true,
      });
    }

    const systemInstruction = `You are IONI Studio Master AI, the premier creative partner for creators, voice artists, video editors, and freelancers.
Language preference: ${language === 'ar' ? 'Arabic (العربية) with professional, fluent, modern Arabic formatting' : 'English with crisp, engaging creative advice'}.
Key expertise:
- Scriptwriting, hooks, audience retention pacing, storytelling for YouTube & Short-form video.
- Professional voice-over direction, emotion cues, breathing marks, tone guidance.
- Video editing direction: B-roll sequencing, sound design cues, visual continuity, transitions.
- Freelancing growth: proposal writing, client negotiation, pricing models, avoiding scams.
Always deliver well-structured, actionable, high-impact responses using markdown. If asked in Arabic, reply in articulate Arabic. If asked in English, reply in articulate English.`;

    // Map history to contents
    const contents: any[] = [];
    for (const h of history.slice(-8)) {
      contents.push({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.text }],
      });
    }
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return res.json({
      reply: response.text || '',
    });
  } catch (err: any) {
    console.error('Error in /api/chat/message:', err);
    return res.status(500).json({
      error: err?.message || 'Failed to communicate with AI model.',
    });
  }
});

// 4. Video Editing Plan Generator (Gemini 3.8 Flash)
app.post('/api/video-plan/generate', async (req, res) => {
  try {
    const {
      title,
      script,
      category = 'educational',
      format = 'YouTube Long-form (16:9)',
      targetDuration = '5 minutes',
      style = 'dynamic & cinematic',
      experienceLevel = 'intermediate',
      software = 'CapCut / Premiere Pro',
      budget = 'free / low-cost',
      assets = 'Voice-over, images, stock footage',
      language = 'en',
    } = req.body;

    if (!title && !script) {
      return res.status(400).json({ error: 'Video title or script is required.' });
    }

    const ai = getAiClient();
    if (!ai) {
      return res.status(503).json({
        error: 'GEMINI_API_KEY is not configured on the server.',
        isConfigError: true,
      });
    }

    const prompt = `Generate an exhaustive, scene-by-scene AI Video Editing Blueprint for the following project:
- Title: ${title || 'Untitled Project'}
- Video Category: ${category}
- Format: ${format}
- Target Duration: ${targetDuration}
- Preferred Editing Style: ${style}
- Creator Experience Level: ${experienceLevel}
- Editing Software: ${software}
- Budget Category: ${budget}
- Available Assets: ${assets}
- Language: ${language === 'ar' ? 'Arabic (العربية)' : 'English'}

Script / Concept:
"""
${script || title}
"""

Please structure the editing plan clearly into:
1. OVERVIEW & EXPORT SPECIFICATIONS (Target Resolution, Aspect Ratio, Frame Rate, Audio Loudness Target e.g. -14 LUFS for YouTube, Color space).
2. DUAL WORKFLOW PATHWAYS:
   - FREE WORKFLOW: (e.g. CapCut / DaVinci Resolve free, Freesound, Pexels) step-by-step.
   - PROFESSIONAL WORKFLOW: (e.g. Premiere Pro / After Effects, Epidemic Sound, Storyblocks) step-by-step.
3. DETAILED SCENE-BY-SCENE TIMELINE TABLE:
   For every scene (Scene 1, Scene 2, etc.):
   - Scene Number & Timecode Range (e.g. 00:00 - 00:15)
   - Duration (seconds)
   - Narration / Spoken Word Segment
   - Visual Description & B-Roll / Image / Animation requirement
   - Camera Movement & Framing (e.g. Slow zoom-in, wide shot, close-up)
   - Transition & Cut Style (e.g. J-cut, match cut, hard cut on beat)
   - Text Overlay / Lower Thirds / Dynamic Subtitles
   - Music & SFX Cues (e.g. Whoosh, bass drop, ambient synth pad)
   - Audio Balance & Pacing / Retention Tip
   - Asset Generation Prompts (AI Image / Video prompt ready to paste)
4. POST-PRODUCTION CHECKLIST:
   - Asset preparation & rough cut
   - Voice-over sync & audio ducking
   - Motion graphics & hook retention
   - Color grade & contrast curve
   - Export settings & final QC check.

Respond in ${language === 'ar' ? 'well-organized, professional Arabic' : 'clear, highly actionable professional English'} with clean Markdown formatting and tables.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        temperature: 0.6,
      },
    });

    return res.json({
      success: true,
      plan: response.text || '',
    });
  } catch (err: any) {
    console.error('Error in /api/video-plan/generate:', err);
    return res.status(500).json({
      error: err?.message || 'Failed to generate video editing plan.',
    });
  }
});

// 5. YouTube Keyword Research Route
app.post('/api/youtube/keywords', async (req, res) => {
  try {
    const { topic, language = 'en' } = req.body;

    if (!topic || typeof topic !== 'string') {
      return res.status(400).json({ error: 'Topic or primary keyword is required.' });
    }

    const ai = getAiClient();
    if (!ai) {
      return res.status(503).json({
        error: 'GEMINI_API_KEY is not configured on the server.',
        isConfigError: true,
      });
    }

    const prompt = `You are a YouTube SEO and algorithm specialist. Analyze the following topic/niche: "${topic}".
Language: ${language === 'ar' ? 'Arabic' : 'English'}.

Provide a structured strategic keyword research and content gap analysis.
Output MUST be valid JSON with the following structure:
{
  "mainKeyword": "${topic}",
  "searchIntent": "Informational | Commercial | Entertainment | How-To",
  "recommendedTags": ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6", "tag7", "tag8"],
  "longTailKeywords": [
    { "keyword": "...", "intent": "...", "competition": "Low" | "Medium" | "High", "opportunityScore": 1-100 }
  ],
  "viralTitleHooks": [
    { "title": "...", "formula": "Curiosity Gap | Extreme Contrast | How-to | Question" }
  ],
  "contentGaps": [
    "Unanswered question or unique angle 1",
    "Unanswered question or unique angle 2",
    "Unanswered question or unique angle 3"
  ],
  "videoStructureOutline": {
    "hook": "0:00 - 0:30 description",
    "corePoints": ["Point 1", "Point 2", "Point 3"],
    "retentionRehook": "Middle retention bridge technique",
    "cta": "Closing action and next video hook"
  }
}
Only output pure JSON without markdown backticks if possible, or inside \`\`\`json.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const raw = response.text?.trim() || '{}';
    let parsedData;
    try {
      parsedData = JSON.parse(raw);
    } catch {
      parsedData = { rawText: raw };
    }

    return res.json({
      success: true,
      data: parsedData,
    });
  } catch (err: any) {
    console.error('Error in /api/youtube/keywords:', err);
    return res.status(500).json({
      error: err?.message || 'Failed to research keywords.',
    });
  }
});

// 6. YouTube Competitor Analysis Route
app.post('/api/youtube/competitor', async (req, res) => {
  try {
    const { channelIdentifier, niche, language = 'en' } = req.body;

    if (!channelIdentifier && !niche) {
      return res.status(400).json({ error: 'Channel name/URL or niche is required.' });
    }

    const ai = getAiClient();
    if (!ai) {
      return res.status(503).json({
        error: 'GEMINI_API_KEY is not configured on the server.',
        isConfigError: true,
      });
    }

    const prompt = `You are a YouTube Strategist. Conduct a thorough competitive breakdown for:
Channel/Identifier: "${channelIdentifier || 'Niche Competitor'}"
Niche/Category: "${niche || 'Digital Content'}"
Language: ${language === 'ar' ? 'Arabic' : 'English'}.

Structure the analysis into:
1. Channel Positioning & Content Pillars
2. Thumbnail & Title Strategy Audit (What patterns make viewers click?)
3. Audience Retention & Pacing Tactics
4. Content Vulnerabilities / Gaps (Where is this competitor falling short?)
5. Blue Ocean Opportunity: How our IONI studio user can out-produce them with superior hooks, voice-over quality, and editing pacing.
6. 5 High-Potential Video Concepts with calculated unfair advantages.

Respond in ${language === 'ar' ? 'fluent, actionable Arabic' : 'sharp, analytical English'} with structured Markdown.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        temperature: 0.7,
      },
    });

    return res.json({
      success: true,
      analysis: response.text || '',
    });
  } catch (err: any) {
    console.error('Error in /api/youtube/competitor:', err);
    return res.status(500).json({
      error: err?.message || 'Failed to analyze competitor.',
    });
  }
});

// 7. AI Image Studio Route (Gemini 3.1 Flash Lite Image)
app.post('/api/image/generate', async (req, res) => {
  try {
    const { prompt, aspectRatio = '16:9', style = 'Cinematic' } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Image prompt is required.' });
    }

    const ai = getAiClient();
    if (!ai) {
      return res.status(503).json({
        error: 'GEMINI_API_KEY is not configured on the server.',
        isConfigError: true,
      });
    }

    // Supported aspect ratios for 3.1-flash-lite-image: "1:1", "3:4", "4:3", "9:16", "16:9"
    const allowedRatios = ['1:1', '3:4', '4:3', '9:16', '16:9'];
    const selectedRatio = allowedRatios.includes(aspectRatio) ? aspectRatio : '16:9';

    const fullPrompt = `${prompt.trim()}, ${style} style, ultra-detailed, professional 4K studio lighting, sharp focus, vibrant color palette.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite-image',
      contents: {
        parts: [{ text: fullPrompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: selectedRatio,
        },
      },
    });

    let imageUrl: string | null = null;
    let captionText = '';

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData?.data) {
        const mime = part.inlineData.mimeType || 'image/png';
        imageUrl = `data:${mime};base64,${part.inlineData.data}`;
      } else if (part.text) {
        captionText += part.text;
      }
    }

    if (!imageUrl) {
      return res.status(502).json({
        error: captionText || 'The model completed the request but did not return image data. Note that image generation models may require an enabled billing tier on your Gemini API key.',
      });
    }

    return res.json({
      success: true,
      imageUrl,
      aspectRatio: selectedRatio,
      prompt: fullPrompt,
    });
  } catch (err: any) {
    console.error('Error in /api/image/generate:', err);
    return res.status(500).json({
      error: err?.message || 'Failed to generate image.',
    });
  }
});

// Setup Vite in Dev or Static files in Production
async function setupServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`IONI Voice Studio server running on http://0.0.0.0:${PORT}`);
  });
}

setupServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
