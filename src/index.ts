import { sendToTelegram } from "./telegram";

Bun.serve({
  async fetch(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const method = req.method;
    const headersObj: Record<string, string> = {};
    req.headers.forEach((value, key) => {
      headersObj[key] = value;
    });
    let body = "";

    try {
      // Try to parse request body - might be JSON or other format
      if (req.body) {
        const bodyText = await req.text();
        body = bodyText;

        try {
          // Try to parse as JSON for nicer formatting
          const jsonBody = JSON.parse(bodyText);
          body = JSON.stringify(jsonBody, null, 2);
        } catch (jsonError) {
          // Not JSON, use as is
        }
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      body = `[Error reading body: ${errorMessage}]`;
    }

    // Format the request information
    const requestInfo = `
🔔 New Request Captured 🔔
📝 Method: ${method}
🔗 URL: ${url.toString()}
📅 Time: ${new Date().toISOString()}

📋 Headers:
${JSON.stringify(headersObj, null, 2)}

📦 Body:
${body || "[No body]"}
`;

    // Send to Telegram
    await sendToTelegram(requestInfo);

    // Log to console
    console.log(`Request captured: ${method} ${url.pathname}`);

    // Return a generic response
    return new Response("OK", { status: 200 });
  },
  error(error: Error) {
    console.error("Server error:", error);
    return new Response(`Server Error: ${error.message}`, { status: 500 });
  },
});
