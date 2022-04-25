# Dappradar-airdrop-notification

### How To
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

Input telegram bot token and telegram chatid, mongodb server url, as well as private key for dappradar auth.

```
botToken=
channelId=
dappradarAuthorization=
mainPrivateKey=
mongodbServer=
```

run:

```bash
> node airdrop.js
> node status.js
> node telegram.js
```
