export default async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { key } = event.queryStringParameters;

  if (!key) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "API key is missing. Please set VITE_GEMINI_API_KEY in Netlify env and redeploy." })
    };
  }

  try {
    const body = JSON.parse(event.body);
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/interactions?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        statusCode: response.status,
        body: JSON.stringify(errorData)
      };
    }

    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("Netlify Function Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error in Netlify Function" })
    };
  }
}