# Dukaan Voice AI

Dukaan is a voice-first udhaar ledger prototype for kirana shopkeepers. Dictate what happened at the counter, review the entries Dukaan prepares, and confirm the simulated update. You can also ask for a balance or generate a printable customer statement.

This is the web prototype for the Scaler × Wispr Flow India Runs on Voice hackathon, under Livelihoods and small business.

## Run with Docker Compose

With Docker and Compose running, open a terminal in this folder and run

```sh
docker compose up --build
```

Open [http://localhost:8080](http://localhost:8080). The first build downloads the Python base image. No API keys, account credentials, or environment file are required. To stop the app, run `docker compose down` from the same folder.

### Run without Docker

With Python 3.12 available, run the following in this folder and open the same URL.

```sh
python -m http.server 8080 --bind 127.0.0.1 --directory dist
```

On Windows, you can use `py -3.12` in place of `python`.

## Try the shop-counter scenario

1. Select Hindi and focus **Transaction or ledger question**. Dictate **“Ramesh aur Syed ke 50-50 rupaye likho”** with Wispr Flow, or type the same command.
2. Click **Interpret command**. Review the two editable ₹50 credit entries and click **Confirm simulated update** to save them to the demo ledger.
3. Dictate or type **“Ramesh ka hisaab karo aur bill do.”** Interpret it, then open **Print or save PDF** on the customer statement.
4. Try the built-in examples for Hindi, Telugu, English, Tamil, Kannada, and Marathi. The **Speak** button uses the browser's speech recognition when available.

## Demo data and dependencies

Docker runs a single static web service. The browser runs the command parser and ledger, and stores confirmed demo entries in local storage. The demo starts with sample records. WhatsApp previews are simulated. Wispr Flow is a separate dictation tool, and the app also accepts text input. Browser speech recognition depends on the browser and its microphone permissions.

[Docker Compose quickstart](https://docs.docker.com/compose/gettingstarted/)
