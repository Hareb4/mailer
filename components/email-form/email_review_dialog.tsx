"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Image, Mail, FileText, FileSpreadsheet } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge as UIBadge } from "@/components/ui/badge";
import { EmailData } from "@/types/types";


interface EmailReviewDialogProps {
  config
  emailData: EmailData;
  onConfirm: () => void;
  open: boolean;
  setOpen: (value: boolean) => void;
}

export default function EmailReviewDialog({
  emailData,
  onConfirm,
  open,
  setOpen,
}: EmailReviewDialogProps) {

  const handleConfirm = () => {
    onConfirm();
    setOpen(false);
  };

  return (
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
              <div className="truncate">{emailData.}</div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="font-medium text-lg">{emailData.subject}</div>
              <div className="whitespace-pre-wrap text-sm max-h-[180px] overflow-y-auto">
                {emailData.body}
              </div>
            </div>

            {(emailData.excel ||
              emailData.docs ||
              emailData.posters ||
              emailData.poster_url) && (
              <>
                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    {emailData.excel && (
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
                            {emailData.excel}
                          </div>
                        </div>
                      </div>
                    )}

                    {emailData.docs && (
                      <div className="space-y-2">
                        <h3 className="font-medium">Documents</h3>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-blue-600 flex-shrink-0" />
                          <div className="text-sm truncate">
                            {emailData.docs}
                          </div>
                        </div>
                      </div>
                    )}

                    {emailData.posters && (
                      <div className="space-y-2">
                        <h3 className="font-medium">Posters</h3>
                        <div className="flex items-center gap-2">
                          <Image className="h-4 w-4 text-purple-600 flex-shrink-0" />
                          <div className="text-sm truncate">
                            {emailData.posters}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    {emailData.poster_url && (
                      <div className="space-y-2">
                        <h3 className="font-medium">Poster Preview</h3>
                        <div className="text-xs text-muted-foreground truncate mb-2">
                          {emailData.poster_url}
                        </div>
                        {emailData.poster_url.match(
                          /\.(jpeg|jpg|gif|png)$/i
                        ) && (
                          <Card className="overflow-hidden h-[160px]">
                            <CardContent className="p-2 h-full">
                              <img
                                src={emailData.poster_url || "/placeholder.svg"}
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
              </>
            )}
          </div>
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
          <Button onClick={handleConfirm}>Send Emails</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
