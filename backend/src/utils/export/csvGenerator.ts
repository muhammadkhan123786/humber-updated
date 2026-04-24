import { Response } from "express";
import { Parser } from "json2csv";
import { ExportOptions } from "./ExportOptions";

export const generateCSV = (res: Response, options: ExportOptions): void => {
  const { title, table } = options;

  if (table.rows.length === 0) {
    // Return a header-only CSV rather than crashing the Parser
    const headerLine = table.headers.join(",");
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="${title}.csv"`);
    res.send(headerLine);
    return;
  }

  const jsonData = table.rows.map((row) => {
    const obj: Record<string, string | number> = {};
    table.headers.forEach((header, i) => {
      obj[header] = row[i] ?? "";
    });
    return obj;
  });

  const parser = new Parser({ fields: table.headers });
  const csv = parser.parse(jsonData);

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename="${title}.csv"`);
  res.send(csv);
};