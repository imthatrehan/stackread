export default async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { key } = event.queryStringParameters;
  const body = JSON.parse(event.body);

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/interactions?key=${key}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
}