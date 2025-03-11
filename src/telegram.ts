import { config } from "./config";

/**
 * Send a message to the Telegram bot
 * @param message The message to send
 * @returns Promise that resolves when the message is sent
 */
export async function sendToTelegram(message: string): Promise<void> {
  try {
    // The Telegram Bot API endpoint for sending messages
    const url = `https://api.telegram.org/bot${config.TELEGRAM_BOT_TOKEN}/sendMessage`;

    // The message payload
    const payload = {
      chat_id: config.TELEGRAM_USER_ID,
      text: message,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    };

    // Send the request
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error sending to Telegram:", errorData);
      throw new Error(
        `Telegram API error: ${response.status} ${response.statusText}`
      );
    }

    const result = await response.json();
    console.log("Message sent to Telegram:", result.ok);
  } catch (error) {
    console.error("Failed to send message to Telegram:", error);
  }
}
