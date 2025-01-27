import Link from "next/link";

export function NewCampaignButton() {
  return (
    <Link
      href="/newemail"
      prefetch={true}
      className="inline-flex items-center px-4 py-2 bg-foreground text-background rounded-md ">
      Create Campaign
    </Link>
  );
}
