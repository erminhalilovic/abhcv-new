import puppeteer from "puppeteer";
import jsPDF from "jspdf";

// A4 dimensions in jsPDF points
const A4_W_PT = 595.28;
const A4_H_PT = 841.89;

export async function POST(req: Request) {
  const { data } = (await req.json()) as { data: string };

  // Derive base URL from incoming request so it works in dev + prod
  const host = req.headers.get("host") ?? "localhost:3000";
  const isLocal =
    host.startsWith("localhost") || host.startsWith("127.0.0.1");
  const protocol = isLocal ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();

    // 2× DPR for retina-quality screenshots
    await page.setViewport({ width: 1400, height: 842, deviceScaleFactor: 2 });

    await page.goto(
      `${baseUrl}/cv-export?data=${encodeURIComponent(data)}`,
      { waitUntil: "networkidle0" }
    );

    // Wait for the pagination hook to finish (CVExportWrapper sets this)
    await page.waitForSelector("body[data-export-ready='true']", {
      timeout: 15_000,
    });

    // Collect all CV pages sorted by their index
    const pageHandles = await page.$$("[data-page-index]");
    const sorted = await Promise.all(
      pageHandles.map(async (handle) => {
        const idx = await handle.evaluate((el) =>
          Number(el.getAttribute("data-page-index"))
        );
        return { idx, handle };
      })
    );
    sorted.sort((a, b) => a.idx - b.idx);

    const pdf = new jsPDF({ unit: "pt", format: "a4", orientation: "portrait" });

    for (let i = 0; i < sorted.length; i++) {
      const screenshot = await sorted[i].handle.screenshot({ type: "png" });
      const imgData = `data:image/png;base64,${Buffer.from(screenshot).toString("base64")}`;
      if (i > 0) pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, 0, A4_W_PT, A4_H_PT);
    }

    const pdfBuffer = Buffer.from(pdf.output("arraybuffer"));

    return new Response(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="CV.pdf"',
      },
    });
  } finally {
    await browser.close();
  }
}
