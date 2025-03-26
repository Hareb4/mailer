"use client";

import { useState, useRef } from "react";
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
import { Paperclip, Image, FilePlus, Plus } from "lucide-react";

interface EmailFormProps {
  emailData: EmailData;
  configs: any;
  selectedConfig: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeExcelFile: () => void;
  removeDocument: (index: number) => void;
  removePoster: (index: number) => void;
  editor: any;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  onTestSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  onPreview: () => void;
  setSelectedConfig: (value: string) => void;
  resetForm: () => void;
  setLogView: (value: boolean) => void;
  testConnection: () => void;
}

export const EmailForm = ({
  emailData,
  configs,
  selectedConfig,
  setSelectedConfig,
  onInputChange,
  onFileChange,
  setLogView,
  removeExcelFile,
  removeDocument,
  removePoster,
  editor,
  onSubmit,
  onTestSubmit,
  onPreview,
  resetForm,
  testConnection,
}: EmailFormProps) => {
  const excelFileInputRef = useRef<HTMLInputElement | null>(null);
  const documentsInputRef = useRef<HTMLInputElement | null>(null);
  const postersInputRef = useRef<HTMLInputElement | null>(null);

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-sm">
          {/* Excel File */}
          <div className="flex flex-col space-y-3 p-4 border rounded-lg">
            <h3 className="font-medium">Excel File</h3>
            <label htmlFor="excelFile" className="cursor-pointer">
              <Input
                type="file"
                id="excelFile"
                name="excelFile"
                ref={excelFileInputRef}
                onChange={onFileChange}
                accept=".xlsx,.xls"
                required
                className="hidden"
              />
              <span className="inline-flex items-center justify-center w-full  py-2 px-4 rounded hover:bg-gray-800/10 transition duration-200 border border-gray-300">
                <Plus size={14} className="mr-2" />
                Add Excel File
              </span>
            </label>
            {emailData.excelFile ? (
              <div className="mt-2 p-2  border rounded flex items-center justify-between">
                <span className="truncate max-w-xs text-sm">
                  {emailData.excelFile.name}
                </span>
                <Button
                  onClick={() => {
                    removeExcelFile();
                    if (excelFileInputRef.current) {
                      excelFileInputRef.current.value = "";
                    }
                  }}
                  variant="destructive"
                  size={"sm"}
                  className="ml-2 flex-shrink-0"
                >
                  Remove
                </Button>
              </div>
            ) : (
              <p className="text-xs text-gray-500">No file selected</p>
            )}
          </div>

          {/* Documents */}
          <div className="flex flex-col space-y-3 p-4 border rounded-lg ">
            <h3 className="font-medium">Documents</h3>
            <label htmlFor="documents" className="cursor-pointer">
              <Input
                type="file"
                id="documents"
                name="documents"
                ref={documentsInputRef}
                onChange={onFileChange}
                multiple
                accept=".pdf,.doc,.docx"
                className="hidden"
              />
              <span className="h-10 inline-flex items-center justify-center w-full  py-2 px-4 rounded hover:bg-gray-800/5 transition duration-200 border border-gray-300">
                <FilePlus size={14} className="mr-2" />
                Choose Documents
              </span>
            </label>
            <div className="max-h-32 overflow-y-auto space-y-2">
              {emailData.documents.length > 0 ? (
                emailData.documents.map((doc, index) => (
                  <div
                    key={index}
                    className="p-2  border rounded flex items-center justify-between"
                  >
                    <span className="max-w-xs text-xs">{doc.name}</span>
                    <Button
                      onClick={() => {
                        removeDocument(index);
                        if (emailData.documents.length === 1) {
                          if (documentsInputRef.current) {
                            documentsInputRef.current.value = "";
                          }
                        }
                        const newFiles = Array.from(
                          documentsInputRef.current?.files || []
                        ).filter((_, i) => i !== index);
                        const dataTransfer = new DataTransfer();
                        newFiles.forEach((file) =>
                          dataTransfer.items.add(file)
                        );
                        documentsInputRef.current!.files = dataTransfer.files;
                      }}
                      variant="destructive"
                      size="sm"
                      className="ml-2 flex-shrink-0"
                    >
                      Remove
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-500">No files selected</p>
              )}
            </div>
            {emailData.documents.length > 0 && (
              <p className="text-xs text-gray-600 font-medium">
                {emailData.documents.length} file
                {emailData.documents.length > 1 ? "s" : ""} selected
              </p>
            )}
          </div>

          {/* Posters */}
          <div className="flex flex-col space-y-3 p-4 border rounded-lg ">
            <h3 className="font-medium">Posters</h3>
            <label htmlFor="posters" className="cursor-pointer">
              <Input
                type="file"
                id="posters"
                name="posters"
                ref={postersInputRef}
                onChange={onFileChange}
                multiple
                accept="image/*"
                className="hidden"
              />
              <span className="inline-flex items-center justify-center w-full  py-2 px-4 rounded hover:bg-gray-800/5 transition duration-200 border border-gray-300">
                <Image size={14} className="mr-2" />
                Choose Posters
              </span>
            </label>
            <div className="max-h-32 overflow-y-auto space-y-2">
              {emailData.posters.length > 0 ? (
                emailData.posters.map((poster, index) => (
                  <div
                    key={index}
                    className="p-2  border rounded flex items-center justify-between"
                  >
                    <span className="truncate max-w-xs text-sm">
                      {poster.name}
                    </span>
                    <Button
                      onClick={() => {
                        removePoster(index);
                        if (emailData.posters.length === 1) {
                          if (postersInputRef.current) {
                            postersInputRef.current.value = "";
                          }
                        }
                      }}
                      variant="destructive"
                      size="sm"
                      className="ml-2 flex-shrink-0"
                    >
                      Remove
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-500">No files selected</p>
              )}
            </div>
            {emailData.posters.length > 0 && (
              <p className="text-xs text-gray-600 font-medium">
                {emailData.posters.length} file
                {emailData.posters.length > 1 ? "s" : ""} selected
              </p>
            )}
          </div>
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
            onClick={(e) => {
              e.preventDefault();
              const formEvent = new Event("submit", { bubbles: true });
              onTestSubmit(
                formEvent as unknown as React.FormEvent<HTMLFormElement>
              );
              console.log("Send Test Email");
            }}
            variant="outline"
            className="w-full"
          >
            Send Test Email
          </Button>
          <div className="hidden">
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
                testConnection();
              }}
              variant="outline"
              className="w-full"
            >
              Test Connection
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};
