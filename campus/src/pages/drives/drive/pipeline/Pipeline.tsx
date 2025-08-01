import { useEffect, useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";

import { toast } from "sonner";
import {
  Phone,
  Mail,
  FileText,
  Calendar,
  Users,
  ChevronRight,
  Download,
  Search,
} from "lucide-react";
import ax from "@/config/axios";
import Loader from "@/components/Loader";
import { DriveContext } from "@/types/DriveContext";
import { ExtendedAppliedDrive } from "@shared-types/ExtendedAppliedDrive";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Avatar,
  Chip,
  Divider,
  Badge,
} from "@nextui-org/react";

const Pipeline = () => {
  const [appliedDrives, setAppliedDrives] = useState<ExtendedAppliedDrive[]>(
    []
  );
  const { drive } = useOutletContext<DriveContext>();
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [resumeLoading, setResumeLoading] = useState<string | null>(null);
  const navigate = useNavigate();

  
  const axios = ax();

  useEffect(() => {
    const driveId = window.location.pathname.split("/")[2];

    axios
      .get(`/drives/${driveId}/applied`)
      .then((res) => {
        console.log(res.data.data);
        setAppliedDrives(res.data.data.applications);
      })
      .catch((err) => {
        toast.error(
          err.response?.data?.message || "Error fetching applied drives"
        );
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const getCandidatesForStep = (stepIndex: number, stepId: string) => {
    const isLastStep = stepIndex === (drive?.workflow?.steps?.length ?? 0) - 1;
    const step = drive?.workflow?.steps?.[stepIndex];
    
    return appliedDrives.filter((applied) => {
      if (step?.status === "in-progress") {
        return (
          applied.status === "inprogress" ||
          applied.status === "hired" ||
          (applied.status === "rejected" &&
            applied.disqualifiedStage?.toString() === stepId) ||
          (stepIndex === 0 && applied.status === "applied")
        );
      }
      else if (isLastStep && step?.status === "completed") {
        return (
          applied.status === "hired" ||
          (!drive?.hasEnded && applied.status === "inprogress") ||
          (applied.status === "rejected" &&
            applied.disqualifiedStage?.toString() === stepId)
        );
      }
      else if (step?.status === "completed") {
        return (
          applied.status === "rejected" &&
          applied.disqualifiedStage?.toString() === stepId
        );
      }
      else if (stepIndex === 0 && applied.status === "applied") {
        return true;
      }
      return false;
    });
  };

  const downloadCSV = () => {
    if (!drive?.workflow?.steps?.length) {
      toast.error("No workflow steps found");
      return;
    }

    const headers = drive.workflow.steps.map((step) => {
      const status = step.status === "in-progress" ? "In Progress" : 
                    step.status === "completed" ? "Completed" : step.status;
      return `${step.name} (${status})`;
    });

    const csvRows = [headers.join(",")];
    
    const candidatesByStep: Record<number, ExtendedAppliedDrive[]> = {};
    
    drive.workflow.steps.forEach((step, index) => {
      candidatesByStep[index] = getCandidatesForStep(index, step._id || "");
    });

    const maxCandidates = Math.max(
      ...Object.values(candidatesByStep).map((candidates) => candidates.length),
      0
    );

    for (let i = 0; i < maxCandidates; i++) {
      const rowData: string[] = [];

      for (let stepIndex = 0; stepIndex < drive.workflow.steps.length; stepIndex++) {
        const candidatesInStep = candidatesByStep[stepIndex] || [];
        
        if (i < candidatesInStep.length) {
          const candidate = candidatesInStep[i];
          const candidateInfo = `${candidate.user.name} (${candidate.user.email}) - ${getStatusLabel(candidate.status)}`;
          rowData.push(`"${candidateInfo.replace(/"/g, '""')}"`);
        } else {
          rowData.push("");
        }
      }

      csvRows.push(rowData.join(","));
    }

    csvRows.push("");
    const summaryRow = drive.workflow.steps.map((_, index) => {
      const count = candidatesByStep[index]?.length || 0;
      return `Total: ${count}`;
    });
    csvRows.push(summaryRow.join(","));

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `${drive?.title || "recruitment-drive"}-pipeline.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("CSV downloaded successfully!");
  };

  const handleViewResume = (candidateId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setResumeLoading(candidateId);

    axios
      .get(`/institutes/candidate/${candidateId}/resume`)
      .then((res) => {
        window.open(res.data.data.url);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Error fetching resume");
        console.error(err);
      })
      .finally(() => setResumeLoading(null));
  };

  const handleViewProfile = (candidateId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/c/${candidateId}`);
  };

  const filteredAppliedDrives = appliedDrives.filter(
    (applied) =>
      applied.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applied.user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "inprogress":
        return "primary";
      case "applied":
        return "secondary";
      case "hired":
        return "success";
      default:
        return "danger";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "inprogress":
        return "In Progress";
      case "applied":
        return "Applied";
      case "hired":
        return "Hired";
      case "rejected":
        return "Rejected";
      default:
        return "Unknown";
    }
  };

  const CandidateCard = ({ applied }: { applied: ExtendedAppliedDrive }) => {
    const isSelected = selectedCandidate === applied._id;
    const candidateInitials = applied.user.name
      .split(" ")
      .map((name) => name[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();

    return (
      <Card
        key={applied._id}
        className="mb-4 w-full min-w-full"
        isPressable
        isHoverable
        onPress={() =>
          setSelectedCandidate(isSelected ? null : applied._id || null)
        }
        shadow={isSelected ? "md" : "sm"}
        classNames={{
          base: isSelected
            ? "bg-primary-50 border-primary-200"
            : "bg-background",
        }}
      >
        <CardBody className="p-4 gap-4">
          <div className="flex items-start gap-4">
            <Avatar
              name={candidateInitials}
              color="primary"
              size="md"
              classNames={{
                base: "min-w-12 min-h-12",
              }}
            />
            <div className="flex flex-col gap-1 flex-grow">
              <h5 className="font-semibold text-base">{applied.user.name}</h5>
              <div className="flex items-center text-xs text-gray-500">
                <Calendar className="w-3 h-3 mr-1.5" />
                <span>
                  Applied{" "}
                  {formatDate(
                    typeof applied.createdAt === "string"
                      ? applied.createdAt ?? ""
                      : applied.createdAt?.toISOString() ?? ""
                  )}
                </span>
              </div>
              {!isSelected && (
                <Chip
                  color={getStatusColor(applied.status) as any}
                  variant="flat"
                  size="sm"
                  className="mt-2"
                >
                  {getStatusLabel(applied.status)}
                </Chip>
              )}
            </div>
          </div>

          {isSelected && (
            <>
              <Divider className="my-2" />
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="w-4 h-4 mr-3 text-primary" />
                  <span className="truncate">{applied.user.email}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-3 text-primary" />
                  <span>{applied.user.phone || "Not provided"}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-3 text-primary" />
                  <span>{applied.user.gender || "Not specified"}</span>
                </div>
                {applied.user.resumeUrl && (
                  <div className="flex items-center text-sm">
                    <FileText className="w-4 h-4 mr-3 text-primary" />
                    <Button
                      variant="light"
                      size="sm"
                      isLoading={resumeLoading === applied._id}
                      onClick={(e) => handleViewResume(applied.user?._id!, e)}
                      className="p-0 m-0 h-auto min-w-0"
                    >
                      View Resume
                    </Button>
                  </div>
                )}
              </div>

              <Button
                color="primary"
                className="w-full mt-4"
                endContent={<ChevronRight className="w-4 h-4" />}
                onClick={(e) => handleViewProfile(applied.user._id!, e)}
              >
                View Profile
              </Button>
            </>
          )}
        </CardBody>
      </Card>
    );
  };

  if (loading) return <Loader />;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Candidate Pipeline
            </h1>
            <p className="text-gray-500 mt-1">
              {drive?.title || "Recruitment Drive"} · {appliedDrives.length}{" "}
              candidate{appliedDrives.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex gap-4">
            <Button
              variant="bordered"
              startContent={<Download className="w-4 h-4" />}
              onClick={downloadCSV}
              isDisabled={!drive?.workflow?.steps?.length || appliedDrives.length === 0}
            >
              Download CSV
            </Button>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <Input
          type="text"
          placeholder="Search candidates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          startContent={<Search className="w-5 h-5 text-gray-400" />}
          classNames={{
            base: "max-w-lg",
            inputWrapper: "shadow-sm",
          }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {drive?.workflow?.steps?.map((step, index) => {
          const isLastStep =
            index === (drive?.workflow?.steps?.length ?? 0) - 1;

          const stageApplicants = filteredAppliedDrives.filter((applied) => {
            if (step.status === "in-progress") {
              return (
                applied.status === "inprogress" ||
                applied.status === "hired" ||
                (applied.status === "rejected" &&
                  applied.disqualifiedStage?.toString() ===
                    step._id?.toString()) ||
                (index === 0 && applied.status === "applied")
              );
            }
            else if (isLastStep && step.status === "completed") {
              return (
                applied.status === "hired" ||
                (!drive?.hasEnded && applied.status === "inprogress") ||
                (applied.status === "rejected" &&
                  applied.disqualifiedStage?.toString() ===
                    step._id?.toString())
              );
            }
            else if (applied.status === "rejected") {
              return (
                applied.disqualifiedStage?.toString() === step._id?.toString()
              );
            }
            return false;
          });

          return (
            <Card key={index} className="h-auto flex flex-col">
              <div
                className="h-2 w-full"
                style={{ backgroundColor: getStepColor(index) }}
              />
              <CardHeader className="flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {step.name}
                    </h3>
                    <Badge color="primary" shape="circle" size="sm">
                      {stageApplicants.length}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {step.status === "in-progress"
                      ? "In Progress"
                      : step.status}
                  </p>
                </div>
              </CardHeader>

              <Divider />

              <CardBody className="overflow-y-auto flex-grow h-96">
                <div className="w-full">
                  {stageApplicants.length > 0 ? (
                    stageApplicants.map((applied) => (
                      <CandidateCard key={applied._id} applied={applied} />
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-center p-6 text-gray-400">
                      <Users className="w-10 h-10 mb-3 opacity-50" />
                      <p className="text-sm">No candidates in this stage</p>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

const getStepColor = (index: number) => {
  const colors = [
    "#4f46e5",
    "#7c3aed",
    "#ec4899",
    "#f59e0b",
  ];
  return colors[index % colors.length];
};

export default Pipeline;