import { ExtendedDrive } from "@shared-types/ExtendedDrive";
import { WorkflowStep } from "@shared-types/Drive";
import { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import DataTable from "./DataTable";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, InfoIcon } from "lucide-react";

interface OutletContext {
  drive: ExtendedDrive;
  active: string;
  refetch: () => void;
}

const Custom = () => {
  const { drive, refetch } = useOutletContext<OutletContext>();
  const { stepId } = useParams<{ stepId: string }>();
  const [step, setStep] = useState<WorkflowStep | null>(null);
  const [isCurrent, setIsCurrent] = useState(false);

  useEffect(() => {
    if (!stepId) return;

    const step = drive.workflow?.steps?.find((s) => s._id === stepId);
    const isCurrent =
      drive?.workflow?.steps?.find((s) => s._id === stepId)?.status ===
      "in-progress";

    if (step) {
      setStep(step);
      setIsCurrent(isCurrent);
    }
  }, [stepId, drive.workflow?.steps]);

  if (!isCurrent && step?.status === "pending") {
    return (
      <div className="flex h-screen items-center justify-center">
        <Alert className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Step Not Yet Active</AlertTitle>
          <AlertDescription>
            This step is not yet active in the recruitment process. Please
            navigate to the currently active step to manage candidates.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col space-y-4">
        <h3 className="text-2xl font-bold">{step?.name}</h3>

        {!isCurrent && step?.status === "completed" && (
          <Alert className="mb-4 bg-yellow-100 rounded-xl">
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>Historical Data View</AlertTitle>
            <AlertDescription>
              This step has been completed. You are viewing historical results
              from this recruitment stage. Candidates are shown as either
              "Accepted" (proceeded to next step) or "Rejected" (eliminated at
              this stage).
            </AlertDescription>
          </Alert>
        )}

        {isCurrent && (
          <p className="text-gray-600">
            On this page, you can manage candidates for the current step of the
            recruitment process. You can qualify or disqualify candidates based
            on their performance in this stage.
          </p>
        )}

        <DataTable
          data={drive?.candidates}
          refetch={refetch}
          readOnly={!isCurrent}
          stepId={stepId}
        />
      </div>
    </div>
  );
};

export default Custom;