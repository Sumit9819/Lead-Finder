import { GoogleGenAI } from "@google/genai";
import { Company, SearchCriteria, Source } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const findCompanies = async (criteria: SearchCriteria): Promise<{ results: Company[], sources: Source[] | null }> => {
  const { country, niche, year } = criteria;

  const prompt = `
    Find 10 real companies that precisely match the following criteria:
    - Country of headquarters: ${country}
    - Niche / Industry: ${niche}
    - Established around the year: ${year}

    For each company, provide:
    - companyName: The full legal name of the company.
    - website: The official website URL.
    - phone: A valid primary phone number. If not available, use "N/A".
    - email: A valid general contact email address (e.g., info@, contact@). If not available, use "N/A".
    - location: The city and country of their headquarters.
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: `You are an expert web researcher. Your task is to find real-world company data based on user criteria. Return the data ONLY as a valid JSON array of objects. Each object must conform to this structure: { "companyName": string, "website": string, "phone": string, "email": string, "location": string }. Do not include any introductory text, backticks, or the word "json" in your response. If you cannot find companies that match all criteria, explain why in plain text instead of returning an empty list or partial data.`,
        tools: [{googleSearch: {}}],
        temperature: 0.2,
      },
    });
    
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? null;
    const rawText = response.text.trim();

    if (!rawText) {
      console.warn("Gemini API returned an empty response.");
      return { results: [], sources };
    }

    // Regex to extract JSON from markdown code blocks, e.g., ```json ... ```
    const jsonRegex = /```(?:json)?\s*([\s\S]*?)\s*```/;
    const match = rawText.match(jsonRegex);
    const jsonText = match ? match[1] : rawText;

    let parsedData;
    try {
        parsedData = JSON.parse(jsonText);
    } catch (e) {
        // If parsing fails, the response is likely a natural language explanation.
        // This indicates no results were found that match the criteria.
        console.warn("Gemini API returned a non-JSON response (likely an explanation):", rawText);
        return { results: [], sources };
    }

    if (!Array.isArray(parsedData)) {
       // If the parsed data is not an array, it might be an explanatory object.
       // Treat this as a "no results" case as well.
       console.warn("Gemini API returned valid JSON that was not an array:", parsedData);
       return { results: [], sources };
    }
    
    const results = parsedData.filter(item => 
      item &&
      typeof item.companyName === 'string' &&
      typeof item.website === 'string' &&
      typeof item.phone === 'string' &&
      typeof item.email === 'string' &&
      typeof item.location === 'string'
    ) as Company[];

    return { results, sources };

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        // Re-throw actual errors (network, auth, etc.) to be displayed in the UI
        throw error;
    }
    throw new Error("Failed to generate company data from Gemini API.");
  }
};