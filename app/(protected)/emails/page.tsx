import React from "react";
import { NewCampaignButton } from "@/components/emails/NewCampaignButton";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Emails() {
  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Inbox</h1>
        <NewCampaignButton />
      </div>

      {/* {campaigns?.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No campaigns yet. Create your first campaign to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns?.map((campaign: EmailCampaignWithConfig) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      )} */}
    </div>
  );
}
