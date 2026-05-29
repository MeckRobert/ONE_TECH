import axios from "axios";
import * as cheerio from "cheerio";

export async function GET() {
  try {
    const url = "https://dse.co.tz/";

    const { data } = await axios.get(url);

    const $ = cheerio.load(data);

    const shares = [];

    $("table tbody tr").each((i, el) => {
      const cols = $(el).find("td");

      shares.push({
        company: $(cols[0]).text().trim(),
        price: $(cols[1]).text().trim(),
      });
    });

    return Response.json({
      success: true,
      data: shares,
    });

  } catch (error) {
    return Response.json({
      success: false,
      error: error.message,
    });
  }
}