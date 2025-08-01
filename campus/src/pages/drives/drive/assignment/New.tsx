import { Select, SelectItem } from "@heroui/select";
import { Input, Textarea } from "@heroui/input";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Drive } from "@shared-types/Drive";
import { useOutletContext, useNavigate } from "react-router-dom";

import ax from "@/config/axios";
import { toast } from "sonner";
import { Button } from "@heroui/button";

const typeOpts = [
  { key: "file", label: "File Upload" },
  { key: "text", label: "Text" },
  { key: "link", label: "Link" },
];

const New = () => {
  const { drive } = useOutletContext() as { drive: Drive };

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [type, setType] = useState<string>("file");
  const navigate = useNavigate();

  useEffect(() => {
    console.log(drive);
    if (drive) {
      const step = new URLSearchParams(window.location.search).get("step");
      const assignment = drive?.workflow?.steps?.[Number(step)];
      setName(assignment?.name || "");
    }
  }, [drive]);

  
  const axios = ax();
  const step = window.history.state.usr.step;
  const handleCreateAssignment = () => {
    axios
      .post("/drives/assignment", {
        name,
        description,
        submissionType: type,
        driveId: drive._id,
        step,
      })
      .then(() => {
        toast.success("Assignment created successfully");
        const newLOC = window.location.pathname
          .split("/")
          .slice(0, 3)
          .join("/");
        navigate(newLOC);
      })
      .catch((err) => {
        toast.error(err.response.data || "An error occurred");
        console.log(err.response.data);
      });
  };

  return (
    <div className="flex gap-10 h-full p-14">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full flex flex-col justify-start h-full"
      >
        <Input label="Assignment Name" value={name} isDisabled />
        <Textarea
          className="mt-5"
          minRows={10}
          label="Assignment Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="flex gap-5 mt-10">
          {/* Additional inputs if needed */}
        </div>

        <Select
          className="max-w-xs"
          label="Assignment Type"
          placeholder="Select an animal"
          selectedKeys={[type]}
          onSelectionChange={(keys) => setType(keys.currentKey as string)}
        >
          {typeOpts.map((opt) => (
            <SelectItem key={opt.key}>{opt.label}</SelectItem>
          ))}
        </Select>

        {type === "file" && (
          <p className="text-sm text-blue-500 mt-2">
            Please note that files upto 10MB are allowed. If you need to upload
            a larger file, please consider using upload type link.
          </p>
        )}
      </motion.div>

      <Button
        color="success"
        className="absolute bottom-14 right-14 px-6 py-3"
        onClick={handleCreateAssignment}
      >
        Create Assignment
      </Button>
    </div>
  );
};

export default New;
