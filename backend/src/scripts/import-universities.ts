import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import mongoose from "mongoose";
import readline from "readline";

import { connectDatabase } from "../database/mongodb";
import { University } from "../models/university.model";

type CsvRow = Record<string, string>;

// Very small CSV reader that supports quoted fields; avoids extra deps.
async function readCsv(filePath: string): Promise<CsvRow[]> {
  const rows: CsvRow[] = [];
  const input = fs.createReadStream(filePath, { encoding: "utf8" });
  const rl = readline.createInterface({ input, crlfDelay: Infinity });

  let headers: string[] = [];

  const parseLine = (line: string) => {
    const cells: string[] = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i += 1) {
      const char = line[i];
      const next = line[i + 1];
      if (char === '"' && inQuotes && next === '"') {
        current += '"';
        i += 1;
        continue;
      }
      if (char === '"') {
        inQuotes = !inQuotes;
        continue;
      }
      if (char === "," && !inQuotes) {
        cells.push(current);
        current = "";
        continue;
      }
      current += char;
    }
    cells.push(current);
    return cells.map((cell) => cell.trim());
  };

  let lineIndex = 0;
  for await (const raw of rl) {
    const cells = parseLine(raw);
    if (lineIndex === 0) {
      headers = cells;
      lineIndex += 1;
      continue;
    }
    const row: CsvRow = {};
    cells.forEach((cell, idx) => {
      row[headers[idx] || `col${idx}`] = cell;
    });
    rows.push(row);
    lineIndex += 1;
  }
  return rows;
}

const toNumber = (value: string | undefined) => {
  if (!value) return null;
  const num = Number(String(value).replace(/[^\d.]/g, ""));
  return Number.isFinite(num) ? num : null;
};

dotenv.config();

(async () => {
  const filePath = path.resolve(__dirname, "../uploads/universities.csv");
  if (!fs.existsSync(filePath)) {
    console.error("universities.csv not found at", filePath);
    process.exit(1);
  }

  await connectDatabase();

  const rows = await readCsv(filePath);
  let count = 0;
  for (const row of rows) {
    const courses = String(row["Popular Courses / Degrees"] || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    const degreeLevels = String(row["Degree Levels"] || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    await University.findOneAndUpdate(
      { sourceId: row["S/N"] || row["id"] },
      {
        sourceId: row["S/N"] || row["id"],
        alpha2: (row["Country Code"] || row["alpha2"] || "").toUpperCase(),
        name: row["University"] || row["name"],
        country: row["Country"] || row["country"],
        state: row["State"] || row["state"],
        city: row["City"] || row["city"],
        web_pages: row["Official Website"] || row["website"],
        flag_url: row["Country Flag URL"] || row["flag_url"],
        logo_url: row["University Logo URL"] || row["logo_url"],
        courses,
        degreeLevels: degreeLevels.length ? degreeLevels : undefined,
        ieltsMin: toNumber(row["Typical IELTS"]),
        satMin: toNumber(row["Typical SAT (Accepted)"]),
        description: row["Description"] || undefined,
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    count += 1;
  }

  console.log(`Imported/updated ${count} universities`);
  await mongoose.connection.close();
})();
