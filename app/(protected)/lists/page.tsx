"use client";
import React, { useState } from "react";
import * as XLSX from "xlsx";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronLeft,
  ChevronRight,
  Upload,
  Users,
  FileSpreadsheet,
} from "lucide-react";

const CommunityPage = () => {
  const [communities] = useState([
    {
      name: "Waves Community",
      emails: Array.from({ length: 300 }, (_, i) => `user${i + 1}@dev.com`),
    },
    {
      name: "One Park Avenue Community",
      emails: ["designer1@example.com", "designer2@example.com"],
    },
    {
      name: "CREEK VISTAS RESERVÉ Community",
      emails: Array.from({ length: 150 }, (_, i) => `user${i + 1}@dev.com`),
    },
  ]);

  const [expandedCommunities, setExpandedCommunities] = useState(
    communities.map(() => false)
  );

  const handleFileUpload = (event, communityIndex) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      const emails = rows.slice(1).map((row) => row[0]);
      updateCommunityEmails(communityIndex, emails);
      // Reset expansion when new file is uploaded
      setExpandedCommunities((prev) => {
        const newExpanded = [...prev];
        newExpanded[communityIndex] = false;
        return newExpanded;
      });
    };
    reader.readAsArrayBuffer(file);
  };

  const updateCommunityEmails = (index, emails) => {
    setCommunities((prevCommunities) => {
      const updatedCommunities = [...prevCommunities];
      updatedCommunities[index].emails = emails;
      return updatedCommunities;
    });
  };

  const toggleCommunityExpansion = (index) => {
    setExpandedCommunities((prev) => {
      const newExpanded = [...prev];
      newExpanded[index] = !newExpanded[index];
      return newExpanded;
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent">
          Community Email Manager
        </h1>
        <p className="mt-3 text-muted-foreground">
          Manage and organize community email lists with ease
        </p>
      </div>

      {communities.map((community, index) => {
        const maxInitialItems = 5;
        const showAll = expandedCommunities[index];
        const displayedEmails = showAll
          ? community.emails
          : community.emails.slice(0, maxInitialItems);
        const hiddenCount = community.emails.length - maxInitialItems;

        return (
          <Card
            key={index}
            className="rounded-xl shadow-lg hover:shadow-xl transition-shadow shadow-accent"
          >
            <CardHeader className="px-6 py-4 border-b">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6 " />
                  <h2 className="text-2xl font-semibold ">{community.name}</h2>
                  <span className="bg-foreground text-background px-3 py-1 rounded-full text-sm">
                    {community.emails.length} members
                  </span>
                </div>
                <label className="bg-accent cursor-pointer px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                  <Upload className="w-5 h-5" />
                  <span>Upload XLSX</span>
                  <Input
                    type="file"
                    accept=".xlsx"
                    onChange={(e) => handleFileUpload(e, index)}
                    className="hidden"
                  />
                </label>
              </div>
            </CardHeader>

            <CardContent className="p-6 ">
              {community.emails.length > 0 ? (
                <>
                  <div className="mb-4  p-4 rounded-lg border border-foreground/50">
                    <div className="text-sm  mb-3">
                      Showing {displayedEmails.length} of{" "}
                      {community.emails.length} members
                    </div>
                    <ul className="grid gap-2">
                      {displayedEmails.map((email, i) => (
                        <li
                          key={i}
                          className="bg-accent flex items-center gap-3 p-3  rounded-md  transition-colors border"
                        >
                          <FileSpreadsheet className="w-5 h-5  flex-shrink-0" />
                          <span className=" font-mono text-sm  break-all">
                            {email}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {community.emails.length > maxInitialItems && (
                    <div className="text-center mt-4">
                      <Button
                        variant="ghost"
                        onClick={() => toggleCommunityExpansion(index)}
                      >
                        {showAll
                          ? "Show Less"
                          : `Show All Members (${hiddenCount} more)`}
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8  rounded-lg">
                  <p className=" mb-4">
                    No emails uploaded yet for this community
                  </p>
                  <FileSpreadsheet className="w-12 h-12 mx-auto  mb-4" />
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default CommunityPage;
