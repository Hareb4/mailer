"use client";

import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { Card, CardContent } from "@/components/ui/card";

interface ExcelPreview {
  headers: string[];
  rows: string[][];
}

export default function PreviewPage({ excelFile }: { excelFile: File }) {
  const [excelPreview, setExcelPreview] = useState<ExcelPreview>({
    headers: [],
    rows: [],
  });

  useEffect(() => {
    const readExcelFile = () => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json<string[]>(firstSheet, {
          header: 1,
        });

        setExcelPreview({
          headers: rows[0],
          rows: rows.slice(1, 6), // Show first 5 rows of data
        });
      };
      reader.readAsArrayBuffer(excelFile);
    };

    readExcelFile();
  }, [excelFile]);

  return (
    <Card className="mt-4">
      <CardContent className="pt-6">
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead>
              <tr>
                {excelPreview.headers.map((header, index) => (
                  <th
                    key={index}
                    className="border border-gray-200 px-4 py-2 bg-gray-50">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {excelPreview.rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className="border border-gray-200 px-4 py-2">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
