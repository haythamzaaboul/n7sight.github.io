import { GoogleGenAI } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

const getAiClient = () => {
  if (!aiClient) {
    // Note: In a real production app, you might want to proxy this or handle keys more securely if possible.
    // However, the instructions state strictly to use process.env.API_KEY.
    if (!process.env.API_KEY) {
        console.warn("API_KEY not found in environment. Gemini features may not work.");
        return null;
    }
    aiClient = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return aiClient;
};

export const askGeminiAboutArticle = async (
  articleContent: string, 
  question: string,
  history: {role: 'user' | 'model', text: string}[] = []
): Promise<string> => {
  const client = getAiClient();
  if (!client) return "Erreur : La clé API est manquante.";

  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `Vous êtes un tuteur expert à l'ENSEEIHT (l'N7), une prestigieuse école d'ingénieurs française.
  Un étudiant lit un article de blog et pose des questions à son sujet.
  Votre objectif est d'expliquer des concepts d'ingénierie complexes (Maths, Physique, Info) de manière simple, intuitive et en français.
  Encouragez la compréhension profonde plutôt que le par cœur.
  Soyez concis, utile et amical.
  
  Voici le contenu de l'article que l'étudiant lit :
  ---
  ${articleContent}
  ---
  `;

  try {
    const chat = client.chats.create({
      model,
      config: {
        systemInstruction,
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      }))
    });

    const result = await chat.sendMessage({ message: question });
    return result.text || "Désolé, je n'ai pas pu générer de réponse.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Désolé, j'ai rencontré une erreur lors de la réflexion. Veuillez réessayer.";
  }
};