import { GoogleGenAI } from '@google/genai';
import type { AnalysisResult } from '../types';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

let ai: GoogleGenAI | null = null;
if (apiKey && apiKey !== 'your_api_key_here') {
  ai = new GoogleGenAI({ apiKey });
}

export async function analyzeImage(base64DataUrl: string): Promise<AnalysisResult> {
  if (!ai) {
    return {
      description: "SYSTEM ERROR: Neural link connection failed. API Key missing or invalid.",
      tags: ["ERROR", "OFFLINE"],
      threatLevel: "UNKNOWN"
    };
  }

  try {
    // Extract base64 payload from data URL
    const base64Str = base64DataUrl.split(',')[1];
    
    const prompt = "Analyze this image. Return a JSON object with three fields: description (2-3 sentence dramatic cyberpunk-style description of what you see), tags (array of 5 short uppercase keyword strings), and threatLevel (one of: LOW, MODERATE, HIGH, CRITICAL, UNKNOWN).";
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                data: base64Str,
                mimeType: 'image/jpeg'
              }
            },
            {
              text: prompt
            }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
      }
    });

    let textStr = response.text;
    if (!textStr) {
      throw new Error("Empty response from AI");
    }

    // Strip markdown formatting if the model wrapped the response
    textStr = textStr.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    const result = JSON.parse(textStr) as AnalysisResult;
    return result;

  } catch (error: any) {
    console.error("Gemini analysis error:", error.message || error);
    return {
      description: `SYSTEM ERROR: Neural link connection failed. Unable to parse visual data stream. ${error.message || ''}`,
      tags: ["ERROR", "OFFLINE"],
      threatLevel: "UNKNOWN"
    };
  }
}
