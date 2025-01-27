export interface Config {
  _id: string;
  user_id: string;
  name: string;
  from_email: string;
  smtp_server: string;
  smtp_port: number;
  smtp_email: string;
  smtp_password: string;
}

export interface ConfigFormData {
  name: string;
  from_email: string;
  smtp_server: string;
  smtp_port: number;
  smtp_email: string;
  smtp_password: string;
}

export interface EmailData {
  emailSubject: string;
  testEmail: string;
  excelFile: File | null;
  excelFileUrl?: string; // Add this
  documents: File[];
  posters: File[];
  posterUrl: string;
}

export interface FileMetadata {
  id: string;
  user_id: string;
  file_url: string;
  file_name: string;
  created_at: string;
}

export interface ProgressData {
  status: string; // e.g., 'Sending' or 'Sent'
  email: string; // The email address being processed
  sentEmails: number; // Number of emails sent so far
  totalEmails: number; // Total number of emails to be sent
  percentage: number; // Percentage of emails sent
  message: string; // A message describing the current status
  estimatedTimeRemaining: string; // Estimated time remaining
  speed: string; // Speed of email sending
  avgTimePerEmail: string; // Average time per email
}

export interface EmailCampaign {
  id: string;
  user_id: string;
  config_id: string;
  subject: string;
  body: string;
  email_count: number;
  success_count: number;
  failure_count: number;
  duration?: string;
  created_at: string;
}

export interface FailedEmail {
  email: string;
  error: string;
  [key: string]: string; // This allows any other dynamic fields to be added
}

export interface ExcelRow {
  email: string;
  [key: string]: string; // Assuming the Excel rows also have dynamic fields
}

export interface EmailCampaignWithConfig extends EmailCampaign {
  configurations: {
    smtp_email: string;
  };
}
