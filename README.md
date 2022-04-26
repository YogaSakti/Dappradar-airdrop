# Dappradar Airdrop [Telegram Bot](https://t.me/dappradarairdrop)

[![Bot Updater](https://github.com/YogaSakti/Dappradar-airdrop/actions/workflows/airdrop.yml/badge.svg?branch=master)](https://github.com/YogaSakti/Dappradar-airdrop/actions/workflows/airdrop.yml) 


A telegram bot that will notify if there is a new event or an event has ended on [dappradar airdrop](https://dappradar.com/hub/airdrops)




## want to run it yourself?
Clone this project

```bash
> git clone https://github.com/YogaSakti/Dappradar-airdrop.git
> cd Dappradar-airdrop

```

Install the dependencies:

```bash
> npm i
```

create .env before run the program
```
cp .env.example .env
```

Edit .env file: 

Input telegram bot token and telegram chatid, mongodb server url, as well as private key (login key) for dappradar auth.

```
BOT_TOKEN=
CHANNEL_ID=
LOGIN_KEY= 
DATABASE_USER=
DATABASE_PASSWORD=
```

run:

```bash
> node airdrop.js
> node status.js
> node telegram.js
```
