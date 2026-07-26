/**
 * Shared IBM watsonx.ai helpers
 * Used by all API routes for AI generation
 */

const WATSONX_TOKEN_URL = 'https://iam.cloud.ibm.com/identity/token';
const WATSONX_GENERATE_URL = 'https://us-south.ml.cloud.ibm.com/ml/v1/text/generation?version=2024-05-01';
const MODEL_ID = 'ibm/granite-3-8b-instruct';

export async function getWatsonxToken(): Promise<string | null> {
  const apiKey = process.env.WATSONX_API_KEY;
  if (!apiKey) return null;
  try {
    const resp = await fetch(WATSONX_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${apiKey}`,
    });
    const data = await resp.json();
    return data.access_token || null;
  } catch {
    return null;
  }
}

export async function generateWithAI(prompt: string, maxTokens = 800): Promise<string | null> {
  const token = await getWatsonxToken();
  const projectId = process.env.WATSONX_PROJECT_ID;
  if (!token || !projectId) return null;
  try {
    const resp = await fetch(WATSONX_GENERATE_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: prompt,
        model_id: MODEL_ID,
        parameters: { max_new_tokens: maxTokens, decoding_method: 'greedy' },
        project_id: projectId,
      }),
    });
    const data = await resp.json();
    return data.results?.[0]?.generated_text || null;
  } catch {
    return null;
  }
}

/**
 * Try to extract JSON from AI response text.
 * Handles cases where AI wraps JSON in markdown code blocks.
 */
export function extractJSON(text: string): Record<string, unknown> | null {
  try {
    // Try direct parse first
    return JSON.parse(text);
  } catch {
    // Try extracting from markdown code block
    const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) {
      try {
        return JSON.parse(codeBlockMatch[1].trim());
      } catch {}
    }
    // Try finding first JSON object
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch {}
    }
    return null;
  }
}
