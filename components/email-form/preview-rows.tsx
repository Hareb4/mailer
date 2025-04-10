"use client";

import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { Card, CardContent } from "@/components/ui/card";

interface ExcelPreview {
  headers: string[];
  rows: string[][];
}

export default function PreviewPage({ excelFile }: { excelFile: File }) {
  const [emails, setEmails] = useState<string[]>([]);
  const [totalEmails, setTotalEmails] = useState(0);

  useEffect(() => {
    const readExcelFile = () => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json<{ email: string }>(firstSheet, {
          header: ["email"],
          range: 1, // Skip header row
        });

        // Extract and filter valid emails
        const emailList = rows
          .map((row) => row.email)
          .filter((email) => email && email.trim() !== "");

        setEmails(emailList);
        setTotalEmails(emailList.length);
      };
      reader.readAsArrayBuffer(excelFile);
    };

    readExcelFile();
  }, [excelFile]);

  return (
    <Card className="mt-4">
      <CardContent className="pt-6">
        <div className="overflow-y-auto max-h-[60vh]">
          <table className="min-w-full border border-gray-200">
            <thead className="sticky top-0 bg-white">
              <tr>
                <th className="border border-gray-200 px-4 py-2 bg-gray-50 text-left">
                  Email Address
                </th>
              </tr>
            </thead>
            <tbody>
              {emails.map((email, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border border-gray-200 px-4 py-2">{email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
          <span>Total emails: {totalEmails}</span>
          {totalEmails > 0 && (
            <span className="text-xs text-gray-400">
              Showing all {totalEmails} email{totalEmails !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
