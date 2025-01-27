import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ProgressData } from "@/types/types";

interface ProgressBarProps {
  progress: ProgressData;
  isThereFailedEmails: boolean;
  editFailedEmails: () => void;
  logView: boolean;
  setLogView: (value: boolean) => void;
}

export const ProgressBar = ({
  progress,
  isThereFailedEmails,
  editFailedEmails,
  logView,
  setLogView,
}: ProgressBarProps) => {
  return (
    // <div className="space-y-2">
    //   <Progress value={progress.percentage} />
    //   <div className="text-sm">
    //     <p>Status: {progress.status}</p>
    //     <p>Current Email: {progress.email}</p>
    //     <p>Progress: {progress.sentEmails} / {progress.totalEmails}</p>
    //     <p>Estimated Time Remaining: {progress.estimatedTimeRemaining}</p>
    //     <p>Speed: {progress.speed}</p>
    //     <p>Average Time Per Email: {progress.avgTimePerEmail}</p>
    //   </div>
    // </div>
    <Card className={`mt-6 fixed bottom-4 right-4 w-1/2`}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">Email Log</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLogView(!logView)}
          >
            {logView ? "Hide Log" : "Show Log"}
          </Button>
        </div>
        <Progress value={progress.percentage} className="mb-2" />
        <p>
          Sent {progress.sentEmails} of {progress.totalEmails} emails
        </p>
        <p>Estimated Time Remaining: {progress.estimatedTimeRemaining}</p>
        <p className="text-sm text-gray-600">{progress.message}</p>
        <div className="flex gap-2">
          <Button
            className={isThereFailedEmails ? "" : "hidden"}
            onClick={editFailedEmails}
          >
            Edit and ReSend
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
