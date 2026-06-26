/**
 * Minimal Telegram bot that opens the System 108 Mini App.
 * Optional: menu button from BotFather works without this script.
 */

const BOT_TOKEN = process.env.BOT_TOKEN;
const WEB_APP_URL = process.env.WEB_APP_URL;
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;
const RETRY_DELAY_MS = 5000;

if (!BOT_TOKEN || !WEB_APP_URL) {
  console.error("Set BOT_TOKEN and WEB_APP_URL in .env");
  process.exit(1);
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function telegramFetch(path, options) {
  while (true) {
    try {
      return await fetch(`${API_URL}${path}`, options);
    } catch (error) {
      console.error("Telegram API unavailable, retrying in 5s...", error.message);
      await wait(RETRY_DELAY_MS);
    }
  }
}

async function sendMessage(chatId, text, withAppButton = false) {
  const body = {
    chat_id: chatId,
    text,
    parse_mode: "HTML",
  };

  if (withAppButton) {
    body.reply_markup = {
      inline_keyboard: [[{ text: "Открыть System 108", web_app: { url: WEB_APP_URL } }]],
    };
  }

  await telegramFetch("/sendMessage", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

async function handleUpdate(update) {
  const message = update.message;
  if (!message?.text) return;

  const text = message.text.trim().toLowerCase();
  const chatId = message.chat.id;

  if (text === "/start" || text === "/app") {
    await sendMessage(
      chatId,
      "<b>System 108</b>\n\nРелизы, ивенты, лайнапы и новости лейбла — в мини-приложении.",
      true,
    );
    return;
  }

  await sendMessage(chatId, "Команды: /start — открыть приложение");
}

async function poll(offset = 0) {
  const response = await telegramFetch(`/getUpdates?timeout=30&offset=${offset}`);
  const payload = await response.json();

  if (!payload.ok) {
    console.error("Telegram API error:", payload);
    await wait(RETRY_DELAY_MS);
    return poll(offset);
  }

  let nextOffset = offset;
  for (const update of payload.result) {
    nextOffset = update.update_id + 1;
    await handleUpdate(update);
  }

  await poll(nextOffset);
}

console.log("System 108 bot polling...");
console.log("Если api.telegram.org недоступен — включи VPN или тестируй через кнопку меню в боте.");
poll();
