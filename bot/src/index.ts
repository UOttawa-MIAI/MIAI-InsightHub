import { DiscordHono } from 'discord-hono'
import { GoogleGenAI } from '@google/genai'

type Env = {
  Bindings: {
    GEMINI_API_KEY: string
    DISCORD_PUBLIC_KEY: string
    DISCORD_APPLICATION_ID: string
    DISCORD_TOKEN: string
    WEB_API_URL: string // e.g., https://miai-insighthub.vercel.app
  }
}

const app = new DiscordHono<Env>()

app.command('insight', async (c) => {
  const courseCode = c.var.getString('course') || 'Unknown';
  const apiUrl = c.env.WEB_API_URL || 'http://localhost:3000';
  
  try {
    const res = await fetch(`${apiUrl}/api/insight?course=${courseCode}`);
    const data: any = await res.json();
    
    if (data.insight) {
      return c.res({ content: `🔍 **Insight for ${courseCode}**\n\n${data.insight}` });
    } else {
      return c.res({ content: `❌ Could not find insights for ${courseCode}.` });
    }
  } catch (error: any) {
    return c.res({ content: `❌ Error connecting to Insight API: ${error.message}` });
  }
})

app.command('ask', async (c) => {
  const courseCode = c.var.getString('course') || 'Unknown';
  const question = c.var.getString('question') || '';
  
  if (!c.env.GEMINI_API_KEY) {
    return c.res({ content: '❌ Gemini API Key not configured.' })
  }

  try {
    const ai = new GoogleGenAI({ apiKey: c.env.GEMINI_API_KEY })
    // Simple placeholder for RAG (Ideally, we fetch syllabus text here too)
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: `You are the MIAI Oracle. A student asked about ${courseCode}: "${question}". Briefly answer based on general AI knowledge.`,
    })
    
    return c.res({ content: `**Oracle says:**\n${response.text}` })
  } catch (error: any) {
    return c.res({ content: `❌ Error connecting to Oracle: ${error.message}` })
  }
})

export default app
