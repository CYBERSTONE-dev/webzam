import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import axios from "axios";
import * as cheerio from "cheerio";
import cors from "cors";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Meesho Scraping API
  app.post("/api/import-meesho", async (req, res) => {
    const { url } = req.body;
    if (!url || !url.includes("meesho.com")) {
      return res.status(400).json({ error: "Invalid Meesho URL" });
    }

    try {
      const { data: html } = await axios.get(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
      });
      const $ = cheerio.load(html);

      // Extracting data (Meesho structure can change, using common selectors/OG tags)
      const title = $("meta[property='og:title']").attr("content") || $("h1").first().text().trim();
      const description = $("meta[property='og:description']").attr("content") || $("p").first().text().trim();
      const image = $("meta[property='og:image']").attr("content");
      
      // Price extraction is tricky as it's often dynamic, but we can try to find common patterns
      let price = 0;
      const priceText = $(".ProductPrice__Price-sc-1641662-0").first().text() || $(".price").text();
      if (priceText) {
        price = parseInt(priceText.replace(/[^0-9]/g, "")) || 0;
      }

      res.json({
        title,
        description,
        image,
        basePrice: price,
        originalUrl: url
      });
    } catch (error) {
      console.error("Scraping error:", error);
      res.status(500).json({ error: "Failed to extract product data" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
