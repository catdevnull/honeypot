import { sendToTelegram } from "./telegram";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

/**
 * Fetch IP information from ip-api.com
 */
async function getIpInfo(ip: string): Promise<any> {
  try {
    const response = await fetch(`http://ip-api.com/json/${ip}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching IP info: ${error}`);
    return null;
  }
}

/**
 * Save request data to a JSON file in the data directory
 */
async function saveRequestToFile(
  method: string,
  url: URL,
  headers: Record<string, string>,
  body: string,
  ipAddress: string,
  ipInfo: any
): Promise<string> {
  try {
    // Create data directory if it doesn't exist
    await mkdir(process.env.DATA_DIR || "data", { recursive: true });

    // Create a unique filename based on timestamp
    const timestamp = new Date();
    const fileName = `${timestamp
      .toISOString()
      .replace(/[:.]/g, "-")}_${method}_${url.hostname}${url.pathname.replace(
      /[\/]/g,
      "-"
    )}.json`;
    const filePath = join(process.env.DATA_DIR || "data", fileName);

    // Prepare the data
    const requestData = {
      method,
      url: url.toString(),
      timestamp: timestamp.toISOString(),
      headers,
      body: body || null,
      ipAddress,
      ipInfo,
    };

    // Write to file
    await writeFile(filePath, JSON.stringify(requestData, null, 2));
    return filePath;
  } catch (error) {
    console.error("Error saving request to file:", error);
    return "";
  }
}

Bun.serve({
  async fetch(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const method = req.method;

    const headersObj: Record<string, string> = {};
    req.headers.forEach((value, key) => {
      headersObj[key] = value;
    });
    let body = "";

    // Extract client IP address
    const ipAddress =
      req.headers.get("X-Forwarded-For")?.split(",")[0] ||
      req.headers.get("CF-Connecting-IP") ||
      req.headers.get("X-Real-IP") ||
      "unknown";
    // Get IP geolocation data
    const ipInfo = await getIpInfo(ipAddress);

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
🌐 IP: ${ipAddress} (${ipInfo.city}, ${ipInfo.region}, ${ipInfo.country}, ${
      ipInfo.as
    }, ${ipInfo.org}, ${ipInfo.isp})

📋 Headers:
${JSON.stringify(headersObj, null, 2)}

📦 Body:
${body || "[No body]"}
`;

    // Save request to file
    const savedPath = await saveRequestToFile(
      method,
      url,
      headersObj,
      body,
      ipAddress,
      ipInfo
    );
    if (savedPath) {
      console.log(`Request saved to ${savedPath}`);
    }

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
