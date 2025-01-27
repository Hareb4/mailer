import { format } from "date-fns";
import { EmailCampaignWithConfig } from "@/types/types";

interface CampaignCardProps {
  campaign: EmailCampaignWithConfig;
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  return (
    <div className="rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow shadow-foreground/10 dark:shadow-none dark:border-2 dark:border-gray-500">
      <div className="mb-4">
        <h3 className="font-semibold text-lg truncate" title={campaign.subject}>
          {campaign.subject}
        </h3>
        <p className="text-sm text-gray-400 truncate">
          From: {campaign.configurations?.smtp_email}
        </p>
      </div>

      <div className="mb-4">
        <div className="text-sm max-h-32 overflow-y-auto prose prose-sm">
          <div dangerouslySetInnerHTML={{ __html: campaign.body }} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-sm">
        <StatBox label="Total" value={campaign.email_count} />
        <StatBox
          label="Success"
          value={campaign.success_count}
          variant="success"
        />
        <StatBox
          label="Failed"
          value={campaign.failure_count}
          variant="error"
        />
      </div>

      <div className="mt-4 text-xs text-gray-400 text-right">
        {format(new Date(campaign.created_at), "MMM d, yyyy HH:mm")}
      </div>
    </div>
  );
}

interface StatBoxProps {
  label: string;
  value: number;
  variant?: "default" | "success" | "error";
}

function StatBox({ label, value, variant = "default" }: StatBoxProps) {
  const variantStyles = {
    default: "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100",
    success: "bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-50",
    error: "bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-50",
  };

  return (
    <div className={`text-center p-2 rounded ${variantStyles[variant]}`}>
      <div className="font-medium">{label}</div>
      <div>{value}</div>
    </div>
  );
}
