# TGBot
![GitHub package.json version](https://img.shields.io/github/package-json/v/hniklass/tgbot)
![GitHub last commit](https://img.shields.io/github/last-commit/hniklass/tgbot)
![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/hniklass/tgbot/@nestjs/core)
![GitHub](https://img.shields.io/github/license/hniklass/tgbot)

TGBot is a fully-functional Telegram bot designed to be used in a single group as a general management/trivia/fun bot.

It was developed specifically for my Telegram group, but some of its component are highly reusable and can be adapted to other uses.

The bot fully supports i18n strings (in English and Spanish).

## Current features

### Admin
- Muting users for dynamic times based on a message
- Kicking users based on a message

### Trivia
- Retrieve YouTube videos based on a search parameter or message
- Daily pairing with prizes

## How to install?

1. Clone repo
2. Set up Firebase (optional)
3. Set up Environment Variables
2. `npm install`
3. `npx nest build`
4. `npm run start:prod`

You must've set your bot through BotFather first before running the bot.

## Environment variables

The bot requires certain environment variables to be set before working. Most of them have default values, however some are mandatory.

Environment variables must be set in an `.env` file at root level.

Below is a table containing all environment variables and their default values.
| Variable | Default | Mandatory | Description |
| --- | ---| --- | --- |
| PORT | 3000 | No | Defines the port to run the Node instance on. |
| NODE_ENV | "development" | No | Sets the environment. Any value other than the default will set it to production. |
| TG_API_KEY | - | **Yes** | The Telegram API key you got from BotFather |
| YT_API_KEY | - | No | The YouTube API key. Not mandatory, but YouTube search will error if not set. |
| FIREBASE_URL | - | No | Your Firebase Realtime DB URI. Not mandatory, but required for most trivia functions. |
| DEFAULT_GROUP_ID | - | **Yes** | A default group ID to send error messages and log information too. |
| BOT_USERNAME | - | **Yes** | The user handle you set for the bot through BotFather. |
| BOT_NAME | - | **Yes** | The bot name you set for the through BotFather. |
| CENSOR_DURATION_MAX_VALUE | 300 | No | The maximum amount of seconds a mute can be set for. |
| BOT_LANG | "en" | No | The bot language. Must be the same as one of the locale folders. |

## Firebase

To use certain functions of the bot, a Firebase Realtime Database is expected to be setup using the following structure:
```
index
 - prizes
  - 1: prize1
  - 2: prize2
  - 3: prize3
 - users
  - name1: {id: "@telegramIdOrHandle" }
  - name2: {id: "@telegramIdOrHandle" }
  - name3: {id: "@telegramIdOrHandle" }
```

However the database is filled is up to you. The bot was designed for a small group with a fixed number of members and, therefore, doesn't register new users in the DB automatically.
