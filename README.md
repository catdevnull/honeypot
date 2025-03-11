# Telegram HTTP Honeypot

A simple HTTP server built with [Bun](https://bun.sh) that captures all incoming HTTP requests and forwards them to a Telegram bot.

## Features

- 🕵️‍♂️ Captures all HTTP requests (method, URL, headers, body)
- 📱 Forwards captured requests to Telegram in real-time
- 🚀 Built with Bun for high performance
- 🔧 Easy to configure and deploy

## Prerequisites

- [Bun](https://bun.sh) installed
- A Telegram bot (create one with [@BotFather](https://t.me/BotFather))
- Your Telegram user ID (get it from [@userinfobot](https://t.me/userinfobot))

## Setup

1. Clone this repository
2. Copy `.env.example` to `.env`:
   ```
   cp .env.example .env
   ```
3. Edit `.env` and add your Telegram bot token and user ID:
   ```
   TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
   TELEGRAM_USER_ID=your_telegram_user_id_here
   ```
4. Install dependencies:
   ```
   bun install
   ```

## Usage

### Development

Run the server in development mode with hot reloading:

```
bun dev
```

### Production

Run the server in production mode:

```
bun start
```

## Deployment

You can deploy this server to any platform that supports Bun, such as:

- [Railway](https://railway.app)
- [Fly.io](https://fly.io)
- [Render](https://render.com)
- Any VPS or dedicated server

## How it works

1. The server listens for incoming HTTP requests on the configured port
2. When a request is received, it captures:
   - HTTP method
   - URL
   - Headers
   - Request body (if any)
3. The captured information is formatted into a message
4. The message is sent to your Telegram account via the Telegram Bot API

## License

MIT
