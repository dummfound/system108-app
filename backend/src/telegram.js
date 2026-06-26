const BOT_TOKEN = process.env.BOT_TOKEN;
const WEB_APP_URL = process.env.WEB_APP_URL;

export async function syncMenuButton() {
  if (!BOT_TOKEN || !WEB_APP_URL) return;

  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setChatMenuButton`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        menu_button: {
          type: "web_app",
          text: "System 108",
          web_app: { url: WEB_APP_URL },
        },
      }),
    });

    const payload = await response.json();
    if (payload.ok) {
      console.log(`Telegram menu button set to ${WEB_APP_URL}`);
      return;
    }

    console.error("Failed to set Telegram menu button:", payload.description);
  } catch (error) {
    console.error("Telegram menu button sync failed:", error.message);
  }
}
