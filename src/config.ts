/**
 * Server and Telegram configuration
 */
export const config = {
  // Telegram Bot token - must be set via environment variable
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || "",

  // Telegram User ID to send messages to - must be set via environment variable
  TELEGRAM_USER_ID: process.env.TELEGRAM_USER_ID || "",
};

// Validate required configuration
if (!config.TELEGRAM_BOT_TOKEN) {
  console.error(
    "❌ Error: TELEGRAM_BOT_TOKEN environment variable is required"
  );
  process.exit(1);
}

if (!config.TELEGRAM_USER_ID) {
  console.error("❌ Error: TELEGRAM_USER_ID environment variable is required");
  process.exit(1);
}
