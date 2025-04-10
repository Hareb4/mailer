"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import {
  Config,
  ProgressData,
  EmailData,
  FailedEmail,
  ExcelRow,
} from "@/types/types";
import { useEmailEditor } from "@/hooks/useEmailEditor";
import * as XLSX from "xlsx";
import { io, Socket } from "socket.io-client";
import { decrypt } from "@/utils/crypt";
import { ProgressBar } from "@/components/email-form/ProgressBar";
import { FailedEmails } from "@/components/email-form/FailedEmails";
import { EmailForm } from "@/components/email-form/EmailForm";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Image, Mail, FileText, FileSpreadsheet } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge as UIBadge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

const emailApiUrl = "http://127.0.0.1:5000";

export default function App() {
  const [configs, setConfigs] = useState<Config[]>([]);
  const [selectedConfig, setSelectedConfig] = useState<string>("");
  const [logView, setLogView] = useState(false);
  const [EditorView, setEditorView] = useState(false);
  const [failedEmails, setFailedEmails] = useState<FailedEmail[]>([]);
  const [failedEmailsbeforeSend, setFailedEmailsbeforeSend] = useState<
    ExcelRow[]
  >([]);

  const [isThereFailedEmails, setIsThereFailedEmails] = useState(false);
  const [emailData, setEmailData] = useState<EmailData>({
    emailSubject: "",
    testEmail: "",
    excelFile: null,
    documents: [],
    posters: [],
    posterUrl: "",
    emailCount: 0,
  });
  const [progress, setProgress] = useState<ProgressData>({
    status: "",
    email: "",
    sentEmails: 0,
    totalEmails: 0,
    percentage: 0,
    message: "",
    estimatedTimeRemaining: "",
    speed: "",
    avgTimePerEmail: "",
  });
  const [previewHtml, setPreviewHtml] = useState<string>("");
  const [showPreview, setShowPreview] = useState(false);
  const [isTest, setIsTest] = useState(false);
  const [open, setOpen] = useState(false);
  const { editor } = useEmailEditor();
  const [shouldSend, setShouldSend] = useState(false);

  useEffect(() => {
    const fetchUserAndConfigs = async () => {
      const response = await fetch("/api/configs");
      const data = await response.json();
      setConfigs(data || []);
    };

    fetchUserAndConfigs();
  }, []);

  useEffect(() => {
    // Only create socket connection when this page loads
    const newSocket = io(emailApiUrl, {
      autoConnect: true,
      reconnection: true,
    });

    newSocket.on("connect", () => {
      console.log("Socket connected successfully", newSocket.id);
    });

    newSocket.on("progress", (data) => {
      console.log("Progress event received:", data);
      setProgress(data);
    });

    return () => {
      console.log("Cleaning up socket connections");
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (emailData.excelFile) {
      countemails();
    }
  }, [emailData.excelFile]);

  const showSendEmailDialog = () => {
    // Your logic here
    console.log("Button clicked!");
    setOpen(true);
  };

  // Handling email failure
  const handleEmailFailure = (data: { email: string; error: string }) => {
    setFailedEmails((prev) => [...prev, data]);
    setIsThereFailedEmails(true);
  };

  // Handling form input change
  const handleFormInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmailData((prev) => ({ ...prev, [name]: value }));
  };

  // Handling attachment change
  const handleAttachmentChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, files } = e.target;
    if (files) {
      if (name === "excelFile") {
        if (files[0].size < 500000) {
          setEmailData((prev) => ({ ...prev, [name]: files[0] }));
        } else {
          toast.error("Excel file size exceeds 500 KB.");
        }
      } else if (name === "documents" || name === "posters") {
        setEmailData((prev) => ({
          ...prev,
          [name]: [...prev[name], ...Array.from(files)],
        }));
      }
    }
  };

  // get the excel .xlsx file and count the emails in it or the rows
  const countemails = () => {
    if (!emailData.excelFile) {
      toast.error("No Excel file provided.");
      return; // Exit if no file is present
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      const emailCount = jsonData
        .slice(1) // Skip the header row ("email")
        .filter((row) => row[0] && row[0].toString().trim() !== "").length; // Count non-empty, non-whitespace cells in first column

      setEmailData((prev) => ({
        ...prev,
        emailCount: emailCount,
      }));
    };

    reader.readAsArrayBuffer(emailData.excelFile);
  };

  // Removing attached document
  const removeAttachedDocument = (index: number) => {
    setEmailData((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }));
  };

  // Removing attached poster
  const removeAttachedPoster = (index: number) => {
    setEmailData((prev) => ({
      ...prev,
      posters: prev.posters.filter((_, i) => i !== index),
    }));
  };

  // Handling email campaign submission
  const submitEmailCampaign = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    setOpen(false);
    setEditorView(false);

    const api_url = `${emailApiUrl}/send-email`;

    if (!configs || !selectedConfig) {
      const errorMessage = !configs
        ? "No configurations available. Please check your settings."
        : "No configuration selected. Please select a configuration.";

      toast.error(errorMessage);
    }

    const requiredFields = ["emailSubject", "excelFile"];
    const missingFields = requiredFields.filter(
      (field) => !emailData[field as keyof typeof emailData]
    );

    if (missingFields.length > 0) {
      toast.error(
        `Please fill in the required fields: ${missingFields.join(", ")}`
      );
      return;
    }

    const selectedConfigObj = configs.find(
      (config) => config._id === selectedConfig
    );

    if (!selectedConfigObj) {
      throw new Error("Selected configuration not found in user data.");
    }

    const dataToSend = new FormData();
    console.log("selected Config: ", selectedConfigObj);
    dataToSend.append("smtp_server", selectedConfigObj.smtp_server);
    dataToSend.append("port", selectedConfigObj.smtp_port.toString());
    dataToSend.append("sender_email", selectedConfigObj.smtp_email);
    dataToSend.append("smtp_from", selectedConfigObj.from_email);
    dataToSend.append(
      "sender_password",
      decrypt(selectedConfigObj.smtp_password)
    );
    dataToSend.append("subject_template", emailData.emailSubject);
    dataToSend.append("body_template", editor?.getHTML() || "");
    dataToSend.append("poster_url", emailData.posterUrl);
    if (emailData.excelFile) {
      dataToSend.append("excelFile", emailData.excelFile);
    }
    emailData.documents.forEach((file) => {
      dataToSend.append("attachments", file);
    });
    // Append poster URL if provided
    if (emailData.posters.length > 0) {
      emailData.posters.forEach((file) => {
        dataToSend.append("posters", file);
      });
    }

    setLogView(true);
    try {
      const response = await fetch(api_url, {
        method: "POST",
        body: dataToSend, // Send FormData directly
      });

      if (!response.ok) {
        const errorData = await response.text(); // Get the error response
        toast.error(`Failed to send email: ${errorData}`);
        throw new Error(`Failed to send email: ${errorData}`);
      }

      const result = await response.json();
      if (!result.success) {
        toast.error("Failed to send email");
        throw new Error("Failed to send email");
      }
      if (result.failed_emails.length > 0) {
        setIsThereFailedEmails(true);
        setFailedEmailsbeforeSend(result.failed_emails);
        setFailedEmails(result.failed_emails);
      }

      console.log(result);
    } catch (error) {
      toast.error("Error:" + error);
    }
  };

  // Processing failed emails
  const processFailedEmails = async () => {
    if (!emailData.excelFile) {
      toast.error("No Excel file found in emailData");
      return;
    }
    console.log("failedEmailsbeforeSend :", failedEmailsbeforeSend);

    // Create a new file with failed emails
    const worksheet = XLSX.utils.json_to_sheet(failedEmailsbeforeSend);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "FailedEmails");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    // Create a new File object
    const newFile = new File([excelBuffer], emailData.excelFile.name, {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Update the state with the new file
    setEmailData((prev) => ({
      ...prev,
      excelFile: newFile,
    }));
  };

  // Preparing failed emails for resend
  const prepareFailedEmailsForResend = async () => {
    // First update the UI state to show loading
    setLogView(false);
    setEditorView(true);

    // Then process the file asynchronously
    setTimeout(() => {
      processFailedEmails();
    }, 0);
  };
  // Resending failed emails
  const resendFailedEmails = (e: React.FormEvent) => {
    e.preventDefault();

    // Step 1: Generate the Excel file and update the state
    createFailedEmailsExcel();
    setEditorView(false);

    // Step 2: Set the trigger for sending
    setShouldSend(true);
  };

  useEffect(() => {
    if (shouldSend && emailData.excelFile) {
      // Step 3: Handle submission only after state updates
      console.log("shouldSend", shouldSend);
      submitEmailCampaign();
      setShouldSend(false); // Reset the trigger
    }
  }, [shouldSend, emailData]);


  // Exporting failed emails to Excel
  const exportFailedEmailsToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(failedEmailsbeforeSend);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "FailedEmails");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const fileBlob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = URL.createObjectURL(fileBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "FailedEmails.xlsx";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Creating new Excel file for failed emails
  const createFailedEmailsExcel = () => {
    //Create a new worksheet with filtered data
    const newWorksheet = XLSX.utils.json_to_sheet(failedEmailsbeforeSend);
    // Create a new workbook and append the worksheet
    const newWorkbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, "Sheet1");
    // Create a binary string of the workbook
    const excelBuffer = XLSX.write(newWorkbook, {
      bookType: "xlsx",
      type: "array",
    });

    // Create a Blob from the binary string
    const fileBlob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Create a File object (optional, for better handling of file metadata)
    const file = new File([fileBlob], "FailedEmails.xlsx", {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Update the state with the new file
    setEmailData((prev) => ({
      ...prev,
      excelFile: file, // Save the File object to state under the key "excelFile"
    }));
  };

  // Function to reset the form
  const resetForm = () => {
    editor?.commands.clearContent();
    setEditorView(false);
    setLogView(false);
    setFailedEmailsbeforeSend([]);
    setProgress({
      percentage: 0,
      status: "Not started",
      email: "",
      sentEmails: 0,
      totalEmails: 0,
      estimatedTimeRemaining: "",
      speed: "",
      avgTimePerEmail: "",
      message: "",
    });

    setEmailData({
      emailSubject: "",
      testEmail: "",
      excelFile: null,
      excelFileUrl: undefined,
      documents: [],
      posters: [],
      posterUrl: "",
      emailCount: 0,
    });
    setSelectedConfig("");
    setShouldSend(false);
    setPreviewHtml("");
    setFailedEmails([]);
  };

  const submitTestEmailCampaign = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    setEditorView(false);

    const api_url = `${emailApiUrl}/send-test`; // Flask endpoint

    if (!configs || !selectedConfig) {
      const errorMessage = !configs
        ? "No configurations available. Please check your settings."
        : "No configuration selected. Please select a configuration.";
      toast.error(errorMessage);
      return; // Exit early if there's an error
    }

    const requiredFields = ["emailSubject", "testEmail"];
    const missingFields = requiredFields.filter(
      (field) => !emailData[field as keyof typeof emailData]
    );

    if (missingFields.length > 0) {
      toast.error(
        `Please fill in the required fields: ${missingFields.join(", ")}`
      );
      return;
    }

    const selectedConfigObj = configs.find(
      (config) => config._id === selectedConfig
    );

    const dataToSend = new FormData();
    console.log("selected Config : ", selectedConfigObj);
    if (!selectedConfigObj) {
      throw new Error("Selected configuration not found in user data.");
    }
    dataToSend.append("smtp_server", selectedConfigObj.smtp_server);
    dataToSend.append("port", selectedConfigObj.smtp_port.toString());
    dataToSend.append("sender_email", selectedConfigObj.smtp_email);
    dataToSend.append("smtp_from", selectedConfigObj.from_email);
    dataToSend.append(
      "sender_password",
      decrypt(selectedConfigObj.smtp_password)
    );
    dataToSend.append("subject_template", emailData.emailSubject);
    dataToSend.append("body_template", editor?.getHTML() || "");
    dataToSend.append("poster_url", emailData.posterUrl);
    dataToSend.append("test_email", emailData.testEmail);
    emailData.documents.forEach((file) => {
      dataToSend.append("attachments", file);
    });
    // Append poster URL if provided
    if (emailData.posters.length > 0) {
      emailData.posters.forEach((file) => {
        dataToSend.append("posters", file);
      });
    }

    // Wrap the email sending logic in a promise
    const promise = async () => {
      const response = await fetch(api_url, {
        method: "POST",
        body: dataToSend, // Send FormData directly
      });
      if (!response.ok) {
        return response.text().then((errorData) => {
          throw new Error(`Failed to send email: ${errorData}`);
        });
      }
      return await response.json();
    };

    // Use toast.promise to handle the promise
    toast.promise(promise(), {
      loading: "Sending email...",
      success: (data) => {
        return `${data.success ? "Email sent successfully" : "Failed to send email"}`;
      },
      error: (error) => {
        return error.message || "Error";
      },
    });
  };

  const testConnection = async () => {
    const api_url = `${emailApiUrl}/test-connection`;
    const response = await fetch(api_url, {
      method: "GET",
    });
    console.log(response.ok);
    if (response.ok) {
      toast.success("Success");
    } else {
      toast.error("Failed");
    }
  };

  const removeExcelFile = () => {
    setEmailData((prev) => ({
      ...prev,
      excelFile: null,
    }));
  };

  const cfg = configs.find((config) => config._id === selectedConfig);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">New Email</h1>
      <EmailForm
        emailData={emailData}
        onInputChange={handleFormInputChange}
        onFileChange={handleAttachmentChange}
        removeExcelFile={removeExcelFile}
        removeDocument={removeAttachedDocument}
        removePoster={removeAttachedPoster}
        editor={editor}
        onSubmit={submitEmailCampaign}
        showSendEmailDialog={showSendEmailDialog}
        onTestSubmit={submitTestEmailCampaign}
        setLogView={setLogView}
        configs={configs}
        selectedConfig={selectedConfig}
        setSelectedConfig={setSelectedConfig}
        resetForm={resetForm}
        testConnection={testConnection}
      />

      {logView && (
        <ProgressBar
          progress={progress}
          isThereFailedEmails={isThereFailedEmails}
          editFailedEmails={prepareFailedEmailsForResend}
          logView={logView}
          setLogView={setLogView}
        />
      )}

      {EditorView && (
        <FailedEmails
          failedEmails={failedEmails}
          failedEmailsbeforeSend={failedEmailsbeforeSend}
          setFailedEmailsbeforeSend={setFailedEmailsbeforeSend}
          resendEmails={resendFailedEmails}
          isThereFailedEmails={isThereFailedEmails}
          createExcelFile={exportFailedEmailsToExcel}
        />
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Email Review</DialogTitle>
            <DialogDescription>
              Review the email details before sending via Excel file.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 flex flex-col gap-4">
            <div className="grid gap-4">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <div className="font-medium">From:</div>
                <div className="truncate">{cfg?.from_email}</div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="font-medium text-lg">
                  {emailData.emailSubject}
                </div>
                <div
                  dangerouslySetInnerHTML={{ __html: editor?.getHTML() || "" }}
                  className="whitespace-pre-wrap text-sm max-h-[180px] overflow-y-auto"
                ></div>
              </div>

              <Separator />

              <div className="flex gap-6 w-full">
                {/* LEFT SIDE - Attachments */}
                {emailData.excelFile && (
                  <div className="space-y-2">
                    <h3 className="font-medium flex items-center gap-2">
                      Excel Data Source
                      <UIBadge variant="secondary" className="rounded-full">
                        {emailData.emailCount} emails
                      </UIBadge>
                    </h3>
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <div className="text-sm truncate">
                        {emailData.excelFile?.name}
                      </div>
                    </div>
                  </div>
                )}

                {emailData.documents && (
                  <div className="space-y-2">
                    <h3 className="font-medium">Documents</h3>
                    <div className="space-y-1">
                      {emailData.documents.map((doc, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-blue-600 flex-shrink-0" />
                          <div className="text-sm truncate">{doc.name}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {emailData.posters ? (
                  <div className="space-y-2">
                    <h3 className="font-medium">Posters</h3>
                    <div className="space-y-1">
                      {emailData.posters.map((poster, index) => (
                        <div className="flex items-center gap-2" key={index}>
                          <Image className="h-4 w-4 text-purple-600 flex-shrink-0" />
                          <div className="text-sm truncate">{poster.name}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <h3 className="font-medium">Posters</h3>
                    <p>No posters selected</p>
                  </div>
                )}
              </div>
              {/* RIGHT SIDE - Poster Preview */}
              {emailData.posterUrl && (
                <div className="space-y-3 w-full">
                  <h3 className="font-medium">Poster Preview</h3>
                  <div className="text-xs text-muted-foreground truncate">
                    {emailData.posterUrl}
                  </div>
                  {emailData.posterUrl.match(/\.(jpeg|jpg|gif|png)$/i) && (
                    <Card className="overflow-hidden h-[160px] w-full">
                      <CardContent className="p-2 h-full">
                        <img
                          src={emailData.posterUrl || "/placeholder.svg"}
                          alt="Poster preview"
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/placeholder.svg?height=200&width=300";
                          }}
                        />
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="flex justify-between sm:justify-between">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
            <Button onClick={submitEmailCampaign}>Send Emails</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
