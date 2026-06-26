# System 108 — Telegram Mini App

Telegram Mini App для музыкального лейбла [System 108](https://system108.com/): релизы, ивенты, лайнапы и новости.

## Что внутри

- **Frontend** — React + Vite, Telegram Web App SDK, тёмный UI в стиле лейбла
- **Backend** — Express API, парсинг страниц Tilda (`/events`, `/catalogue`, `/reading`)
- **Bot** — простой long-polling бот с кнопкой запуска Mini App

## Быстрый старт

```bash
npm install
npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:3001/api/data

## Деплой

1. Соберите проект:

```bash
npm run build
```

2. Запустите backend (он отдаёт и API, и статику frontend):

```bash
PORT=3001 npm start
```

3. Нужен **HTTPS**-домен — Telegram Mini App работает только по HTTPS.

4. В [@BotFather](https://t.me/BotFather):
   - `/newbot` — создать бота
   - `/setmenubutton` — привязать Web App URL
   - или `/setcommands` → `start — открыть приложение`

5. Запустите бота:

```bash
BOT_TOKEN=your_token WEB_APP_URL=https://your-domain.com npm run bot
```

Добавьте в корневой `package.json` при необходимости:

```json
"scripts": {
  "bot": "node bot/poll.js"
}
```

## API

| Endpoint | Описание |
|----------|----------|
| `GET /api/data` | Все данные: releases, events, articles |
| `GET /api/health` | Health check |
| `POST /api/refresh` | Сброс кэша и повторный парсинг |

Кэш по умолчанию: 15 минут (`CACHE_TTL_SECONDS`).

## Источники данных

Данные подтягиваются с сайта на Tilda:

| Раздел | URL |
|--------|-----|
| Ивенты | `/events` |
| Релизы | `/catalogue` |
| Новости | `/reading` |

Лайнап парсится из названия ивента (`A & B`, `A + B`, `A × B`). На детальной странице показывается афиша и ссылка на билеты (Radario).

## Переменные окружения

| Переменная | По умолчанию | Описание |
|------------|--------------|----------|
| `PORT` | `3001` | Порт backend |
| `CACHE_TTL_SECONDS` | `900` | TTL кэша |
| `BOT_TOKEN` | — | Токен Telegram-бота |
| `WEB_APP_URL` | — | HTTPS URL Mini App |
| `VITE_API_URL` | `""` | Базовый URL API для frontend при отдельном деплое |

## Дальше

- Подключить официальный JSON/Google Sheet от лейбла вместо парсинга
- Push-уведомления о новых ивентах через бота
- Интеграция с Bandcamp API для обложек релизов
- Мультиязычность (RU/EN)
