import "dotenv/config";
import cors from "cors";
import express from "express";
import session from "express-session";
import crypto from "node:crypto";

const app = express();
const port = Number(process.env.PORT || 4000);
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(
  cors({
    origin: frontendUrl,
    credentials: true,
  }),
);
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "replace-this-session-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  }),
);

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function createUrl(base, params) {
  const url = new URL(base);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });
  return url.toString();
}

function getPublishingAccount(req) {
  if (req.session.instagram?.accessToken && req.session.instagram?.userId) {
    return req.session.instagram;
  }

  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const userId = process.env.INSTAGRAM_USER_ID;

  if (accessToken && userId) {
    return { accessToken, userId };
  }

  return null;
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/auth/instagram", (req, res) => {
  try {
    const state = crypto.randomBytes(24).toString("hex");
    req.session.oauthState = state;

    const authorizeUrl = createUrl(requiredEnv("INSTAGRAM_OAUTH_AUTHORIZE_URL"), {
      client_id: requiredEnv("INSTAGRAM_APP_ID"),
      redirect_uri: requiredEnv("INSTAGRAM_REDIRECT_URI"),
      response_type: "code",
      scope: requiredEnv("INSTAGRAM_SCOPES"),
      state,
    });

    res.redirect(authorizeUrl);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/auth/instagram/callback", async (req, res) => {
  try {
    const { code, state } = req.query;

    if (!code || !state || state !== req.session.oauthState) {
      return res.status(400).send("Invalid OAuth callback state.");
    }

    const tokenBody = new URLSearchParams({
      client_id: requiredEnv("INSTAGRAM_APP_ID"),
      client_secret: requiredEnv("INSTAGRAM_APP_SECRET"),
      grant_type: "authorization_code",
      redirect_uri: requiredEnv("INSTAGRAM_REDIRECT_URI"),
      code: String(code),
    });

    const tokenResponse = await fetch(requiredEnv("INSTAGRAM_OAUTH_TOKEN_URL"), {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: tokenBody,
    });

    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok || !tokenData.access_token) {
      return res.status(400).json({
        error: "Token exchange failed",
        details: tokenData,
      });
    }

    req.session.instagram = {
      accessToken: tokenData.access_token,
      userId: tokenData.user_id || tokenData.id,
    };
    delete req.session.oauthState;

    res.redirect(`${frontendUrl}/publisher?connected=1`);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/instagram/status", (req, res) => {
  const instagram = getPublishingAccount(req);
  res.json({
    connected: Boolean(instagram),
    userId: instagram?.userId || null,
    source: req.session.instagram ? "oauth-session" : instagram ? "server-environment" : null,
  });
});

app.post("/api/instagram/publish", async (req, res) => {
  try {
    const instagram = getPublishingAccount(req);
    if (!instagram) {
      return res.status(401).json({
        error: "No publishing account is configured. Complete OAuth or set the server environment variables.",
      });
    }

    const { imageUrl, caption = "" } = req.body;
    if (!imageUrl || !/^https:\/\//i.test(imageUrl)) {
      return res.status(400).json({ error: "A public HTTPS image URL is required." });
    }

    const graphBase = requiredEnv("INSTAGRAM_GRAPH_BASE_URL").replace(/\/$/, "");
    const mediaUrl = `${graphBase}/${encodeURIComponent(instagram.userId)}/media`;

    const mediaBody = new URLSearchParams({
      image_url: imageUrl,
      caption,
      access_token: instagram.accessToken,
    });

    const mediaResponse = await fetch(mediaUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: mediaBody,
    });
    const mediaData = await mediaResponse.json();

    if (!mediaResponse.ok || !mediaData.id) {
      return res.status(400).json({
        error: "Media container creation failed",
        details: mediaData,
      });
    }

    const publishUrl = `${graphBase}/${encodeURIComponent(instagram.userId)}/media_publish`;
    const publishBody = new URLSearchParams({
      creation_id: mediaData.id,
      access_token: instagram.accessToken,
    });

    const publishResponse = await fetch(publishUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: publishBody,
    });
    const publishData = await publishResponse.json();

    if (!publishResponse.ok || !publishData.id) {
      return res.status(400).json({
        error: "Publishing failed",
        details: publishData,
      });
    }

    res.json({ success: true, mediaId: publishData.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/auth/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ success: true });
  });
});

app.listen(port, () => {
  console.log(`Publisher API running on http://localhost:${port}`);
});
