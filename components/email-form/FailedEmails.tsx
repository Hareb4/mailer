"use client";

import { FailedEmail, ExcelRow } from "@/types/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface FailedEmailsProps {
  failedEmails: FailedEmail[];
  failedEmailsbeforeSend: ExcelRow[];
  setFailedEmailsbeforeSend: React.Dispatch<React.SetStateAction<ExcelRow[]>>;
  createExcelFile: () => void;
  resendEmails: (e: React.FormEvent) => void;
  isThereFailedEmails: boolean;
}

export const FailedEmails = ({
  failedEmails,
  failedEmailsbeforeSend,
  setFailedEmailsbeforeSend,
  createExcelFile,
  resendEmails,
  isThereFailedEmails,
}: FailedEmailsProps) => {
  if (failedEmails.length === 0 && failedEmailsbeforeSend.length === 0) {
    return null;
  }

  return (
    <div className={`mt-6`}>
      <h2>Edit Failed Emails</h2>
      <table className="table-auto border-collapse border border-gray-300 w-full">
        <thead>
          <tr>
            {failedEmailsbeforeSend.length > 0 &&
              Object.keys(failedEmailsbeforeSend[0]).map((header) => (
                <th key={header} className="border border-gray-300 px-4 py-2">
                  {header.charAt(0).toUpperCase() + header.slice(1)}{" "}
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {failedEmailsbeforeSend.map((item, index) => (
            <tr key={index}>
              {Object.keys(item).map((key) => (
                <td key={key} className="border border-gray-300 px-4 py-2">
                  <input
                    type="text"
                    value={item[key]}
                    onChange={(e) => {
                      const updatedFailedEmails = [...failedEmailsbeforeSend];
                      updatedFailedEmails[index][key] = e.target.value;
                      setFailedEmailsbeforeSend(updatedFailedEmails);
                    }}
                    className="w-full px-2 py-1 border border-gray-400 rounded"
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex gap-2 mt-4">
        <Button type="button" onClick={createExcelFile}>
          Download Failed Emails
        </Button>
        {/* <form onSubmit={resendEmails} hidden={!isThereFailedEmails}>
          <Button type="submit">ReSend Emails</Button>
        </form> */}
      </div>
    </div>
  );
};
