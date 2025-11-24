const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const TELEGRAM_API = "https://api.telegram.org";

// Proxy Route
app.all("/telegram/*", async (req, res) => {
  try {
    // ساختن URL مقصد در تلگرام
    const targetUrl = TELEGRAM_API + req.originalUrl.replace("/telegram", "");

    const options = {
      method: req.method,
      headers: {
        ...req.headers,
        host: "api.telegram.org",
      },
    };

    // اگر POST بود → بدنه را اضافه می‌کنیم
    if (req.method !== "GET" && req.body) {
      const params = new URLSearchParams();
      for (const key in req.body) {
        params.append(key, req.body[key]);
      }
      options.body = params;
    }

    // ارسال درخواست به Telegram
    const response = await fetch(targetUrl, options);
    const text = await response.text();

    res.status(response.status).send(text);

  } catch (err) {
    res.status(500).json({ ok: false, error: err.toString() });
  }
});

// صفحه تست
app.get("/", (req, res) => {
  res.send("Telegram Proxy is running √");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Proxy running on " + PORT));
