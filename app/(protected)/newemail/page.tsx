"use client";

import { useState, useEffect, Suspense } from "react";
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
import axios from "axios";

const socket = io("http://127.0.0.1:5000"); // Adjust the URL as needed

export default function RichTextEmailSender() {
  const [configs, setConfigs] = useState<any[]>([]);
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
  const { editor } = useEmailEditor();
  const [shouldSend, setShouldSend] = useState(false);

  useEffect(() => {
    const fetchUserAndConfigs = async () => {
      const { data } = await axios.get("/api/configs");
      console.log("configs after get fetch on load: ", data);

      setConfigs(data || []);
    };

    fetchUserAndConfigs();
  }, []);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket connected successfully", socket.id);
    });

    // socket.on("connect_error", (error) => {
    //   console.error("Socket connection error:", error);
    // });

    // socket.on("disconnect", (reason) => {
    //   console.log("Socket disconnected:", reason);
    // });

    // Listen for progress updates
    socket.on("progress", (data: ProgressData) => {
      console.log("Progress event received:", data);
      setProgress(data);
    });

    return () => {
      console.log("Cleaning up socket connections");
      socket.off("connect");
      socket.off("connect_error");
      socket.off("disconnect");
      socket.off("progress");
    };
  }, []);

  useEffect(() => {
    console.log(emailData);
  }, [emailData]);

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
        setEmailData((prev) => ({ ...prev, [name]: files[0] }));
      } else if (name === "documents" || name === "posters") {
        setEmailData((prev) => ({
          ...prev,
          [name]: [...prev[name], ...Array.from(files)],
        }));
      }
    }
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
    setEditorView(false);

    const api_url = "http://127.0.0.1:5000/send-email"; // Flask endpoint

    console.log("selectedConfig : ", selectedConfig);

    if (!configs || !selectedConfig) {
      throw new Error("User data or selected config not available.");
    }

    const selectedConfigObj = configs.find(
      (config) => config._id === selectedConfig
    );

    if (!selectedConfigObj) {
      throw new Error("Selected configuration not found in user data.");
    }

    const dataToSend = new FormData();
    console.log("selectedConfigObj", selectedConfigObj);
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
    dataToSend.append("is_test", isTest.toString());

    if (isTest) {
      dataToSend.append("test_email", emailData.testEmail);
    }

    // Optionally append files if they exist
    if (emailData.excelFile) {
      dataToSend.append("excelFile", emailData.excelFile);
    }

    // Append attachments
    emailData.documents.forEach((file) => {
      dataToSend.append("attachments", file);
    });

    // Append poster URL if provided
    if (emailData.posters.length > 0) {
      emailData.posters.forEach((file) => {
        dataToSend.append("posters", file);
      });
    }

    // Append test email information
    dataToSend.append("is_test", isTest.toString());
    if (isTest) {
      dataToSend.append("test_email", emailData.testEmail);
    }

    setLogView(true);
    try {
      const response = await fetch(api_url, {
        method: "POST",
        body: dataToSend, // Send FormData directly
      });

      if (!response.ok) {
        const errorData = await response.text(); // Get the error response
        throw new Error(`Failed to send email: ${errorData}`);
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error("Failed to send email");
      }
      if (result.failed_emails.length > 0) {
        setIsThereFailedEmails(true);
        setFailedEmailsbeforeSend(result.failed_emails);
        setFailedEmails(result.failed_emails);
      }

      // Add campaign record to Supabase
      // const supabase = createClient();
      // const {
      //   data: { user },
      // } = await supabase.auth.getUser();

      // if (!user) throw new Error("User not authenticated");

      // const { error: campaignError } = await supabase
      //   .from("email_campaigns")
      //   .insert({
      //     user_id: user.id,
      //     config_id: selectedConfigObj.id,
      //     subject: emailData.emailSubject,
      //     body: editor?.getHTML() || "",
      //     email_count: result.email_count || 0,
      //     success_count: result.success_count || 0,
      //     failure_count: result.failure_count || 0,
      //   })
      //   .single();

      // if (campaignError) {
      //   console.error("Error creating campaign record:", campaignError);
      // }

      console.log(result);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Processing failed emails
  const processFailedEmails = async () => {
    if (!emailData.excelFile) {
      console.error("No Excel file found in emailData");
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

  // const editFailedEmails = () => {
  //   createFailedEmailsFileWithExisting();
  //   console.log("failedEmailsbeforeSend", failedEmailsbeforeSend);
  //   setLogView(false);
  //   setEditorView(true);
  // };

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
    console.log("shouldSend", shouldSend);
    if (shouldSend && emailData.excelFile) {
      // Step 3: Handle submission only after state updates
      submitEmailCampaign();
      setShouldSend(false); // Reset the trigger
    }
  }, [shouldSend, emailData]);
  // Generating email preview
  const generateEmailPreview = () => {
    setPreviewHtml(editor?.getHTML() || "");
  };

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

    setEmailData({
      emailSubject: "",
      testEmail: "",
      excelFile: null,
      excelFileUrl: undefined,
      documents: [],
      posters: [],
      posterUrl: "",
    });
    setSelectedConfig("");
    setShouldSend(false);
    setPreviewHtml("");
    setFailedEmails([]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">New Email</h1>
      <EmailForm
        emailData={emailData}
        onInputChange={handleFormInputChange}
        onFileChange={handleAttachmentChange}
        removeDocument={removeAttachedDocument}
        removePoster={removeAttachedPoster}
        editor={editor}
        onSubmit={submitEmailCampaign}
        setLogView={setLogView}
        configs={configs}
        selectedConfig={selectedConfig}
        setSelectedConfig={setSelectedConfig}
        onPreview={generateEmailPreview}
        resetForm={resetForm}
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
    </div>
  );
}
