"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmailData, Config } from "@/types/types";
import { MenuBar } from "./MenuBar";
import { EditorContent } from "@tiptap/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EmailFormProps {
  emailData: EmailData;
  configs: any;
  selectedConfig: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeDocument: (index: number) => void;
  removePoster: (index: number) => void;
  editor: any;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  onPreview: () => void;
  setSelectedConfig: (value: string) => void;
  resetForm: () => void;
  setLogView: (value: boolean) => void;
}

export const EmailForm = ({
  emailData,
  configs,
  selectedConfig,
  setSelectedConfig,
  onInputChange,
  onFileChange,
  setLogView,
  removeDocument,
  removePoster,
  editor,
  onSubmit,
  onPreview,
  resetForm,
}: EmailFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* Config Selection */}
        <div className="space-y-2">
          <label htmlFor="config" className="block text-sm font-medium">
            Select Configuration *
          </label>
          <Select
            onValueChange={setSelectedConfig}
            value={selectedConfig}
            name="config"
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a configuration" />
            </SelectTrigger>
            <SelectContent>
              {configs.map((config: any) => (
                <SelectItem key={config._id} value={config._id}>
                  {config.name} - {config.from_email}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Email Subject */}
        <div className="space-y-2">
          <label htmlFor="emailSubject" className="block text-sm font-medium">
            Email Subject *
          </label>
          <Input
            type="text"
            name="emailSubject"
            placeholder="Email Subject"
            value={emailData.emailSubject}
            onChange={onInputChange}
            required
          />
        </div>

        {/* Email Body Editor */}
        <div className="space-y-2">
          <label htmlFor="emailBody" className="block text-sm font-medium">
            Email Body
          </label>
          <div className="border rounded-lg">
            <MenuBar editor={editor} />
            <div className="p-4">
              <EditorContent editor={editor} />
            </div>
          </div>
        </div>

        {/* Test Email */}
        <div className="space-y-2">
          <label htmlFor="testEmail" className="block text-sm font-medium">
            Test Email
          </label>
          <Input
            type="text"
            name="testEmail"
            placeholder="Test Email Address"
            value={emailData.testEmail}
            onChange={onInputChange}
          />
        </div>

        {/* Excel File */}
        <div className="space-y-2">
          <label htmlFor="excelFile" className="block text-sm font-medium">
            Excel File *
          </label>
          <Input
            type="file"
            name="excelFile"
            onChange={onFileChange}
            accept=".xlsx,.xls"
            required
          />
        </div>

        {/* Documents */}
        <div className="space-y-2">
          <label htmlFor="documents" className="block text-sm font-medium">
            Documents
          </label>
          <Input
            type="file"
            name="documents"
            onChange={onFileChange}
            multiple
            accept=".pdf,.doc,.docx"
          />
          {emailData.documents.map((doc, index) => (
            <div key={index} className="flex items-center gap-2">
              <span>{doc.name}</span>
              <Button
                onClick={() => removeDocument(index)}
                variant="destructive"
                size="sm"
              >
                Remove
              </Button>
            </div>
          ))}
        </div>

        {/* Posters */}
        <div className="space-y-2">
          <label htmlFor="posters" className="block text-sm font-medium">
            Posters
          </label>
          <Input
            type="file"
            name="posters"
            onChange={onFileChange}
            multiple
            accept="image/*"
          />
          {emailData.posters.map((poster, index) => (
            <div key={index} className="flex items-center gap-2">
              <span>{poster.name}</span>
              <Button
                onClick={() => removePoster(index)}
                variant="destructive"
                size="sm"
              >
                Remove
              </Button>
            </div>
          ))}
        </div>

        {/* Poster URL */}
        <div className="space-y-2">
          <label htmlFor="posterUrl" className="block text-sm font-medium">
            Poster URL
          </label>
          <Input
            type="text"
            name="posterUrl"
            placeholder="Poster URL"
            value={emailData.posterUrl}
            onChange={onInputChange}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button type="submit" className="w-full">
            Send Emails
          </Button>
          <button type="reset" onClick={resetForm} className="w-full">
            Reset
          </button>
          <div className="flex gap-4">
            <Button
              type="button"
              onClick={() => setLogView(true)}
              variant="outline"
              className="w-full"
            >
              View Logs
            </Button>
          </div>
          <Button
            type="button"
            onClick={() => {
              console.log("hi test");
            }}
            variant="outline"
            className="w-full"
          >
            Send Test Email
          </Button>
          <Button
            type="button"
            onClick={onPreview}
            variant="outline"
            className="w-full"
          >
            Preview
          </Button>
          <Button
            type="button"
            onClick={() => {
              console.log("gi grom gest");
            }}
            variant="outline"
            className="w-full"
          >
            Test Connection
          </Button>
        </div>
      </div>
    </form>
  );
};
