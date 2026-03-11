import puppeteer from "puppeteer";

let browserPromise = null;

export async function getBrowser() {
  if (!browserPromise) {
    browserPromise = puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--disable-features=IsolateOrigins",
        "--disable-site-isolation-trials",
      ],
    });
  }

  return browserPromise;
}