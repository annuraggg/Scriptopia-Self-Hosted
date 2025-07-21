// ⬇️ Unchanged imports
import { useEffect, useState } from "react";
import { User2, Lock, Mail, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

// ⬇️ Modal loader component
const Loader = () => (
  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
);

// ⬇️ Update handlers
const updateProfile = async (newName: string) => {
  const trimmed = newName.trim();
  if (!trimmed || trimmed.length < 2) return toast.error("Name is too short");

  return authClient
    .updateUser({ name: trimmed })
    .then(() => toast.success("Profile updated successfully."))
    .catch(() => toast.error("Failed to update name."));
};

const changeEmail = async (newEmail: string) => {
  const trimmed = newEmail.trim();
  if (!trimmed) return toast.error("Email cannot be empty");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) return toast.error("Invalid email format");

  authClient
    .changeEmail({ newEmail: trimmed, callbackURL: "/dashboard" })
    .then((res) => {
      if (res.error) {
        return toast.error("Failed to change email. Please try again.");
      } else {
        toast.success("Email change request sent. Please check your inbox.");
      }
    })
    .catch(() => toast.error("Failed to change email. Please try again."));
};

const changePassword = async (oldPw: string, newPw: string) => {
  const trimmedOld = oldPw.trim();
  const trimmedNew = newPw.trim();

  if (!trimmedOld || !trimmedNew)
    return toast.error("Password fields cannot be empty");
  if (trimmedNew.length < 8)
    return toast.error("New password must be at least 8 characters");
  if (trimmedOld === trimmedNew)
    return toast.error("New password must be different");

  return authClient
    .changePassword({
      currentPassword: trimmedOld,
      newPassword: trimmedNew,
      revokeOtherSessions: true,
    })
    .then(() => toast.success("Password changed successfully."))
    .catch(() => toast.error("Failed to change password."));
};

// ⬇️ Modal animations
const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: -10 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: -10 },
};

type AnimatedModalProps = {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
};

const AnimatedModal = ({ title, children, onClose }: AnimatedModalProps) => (
  <div className="fixed inset-0 z-[2200] flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <motion.div
      variants={modalVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="bg-white rounded-2xl shadow-xl w-[400px] p-6 relative"
    >
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-400 hover:text-black"
      >
        <X className="w-5 h-5" />
      </button>
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      {children}
    </motion.div>
  </div>
);

const UserSettings = ({
  setShowSettings,
}: {
  setShowSettings: (show: boolean) => void;
}) => {
  const [user, setUser] = useState({ name: "", email: "", avatarUrl: "" });
  const [emailEdit, setEmailEdit] = useState(false);
  const [emailValue, setEmailValue] = useState(user.email);
  const [editNameModal, setEditNameModal] = useState(false);
  const [nameValue, setNameValue] = useState(user.name);
  const [pwModal, setPwModal] = useState(false);
  const [pwOld, setPwOld] = useState("");
  const [pwNew, setPwNew] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const { data, isPending, error, refetch } = authClient.useSession();

  useEffect(() => {
    console.log(isPending);
    if (error) {
      toast.error("Failed to load user data. Please try again.");
      setShowSettings(false);
    }

    if (!isPending) {
      const user = {
        name: data?.user?.name ?? "",
        email: data?.user?.email ?? "",
        avatarUrl: data?.user?.image ?? "",
      };

      setUser(user);
      setEmailValue(user.email);
      setNameValue(user.name);
      setPwOld("");
      setPwNew("");
      setPwConfirm("");
      setLoading(false);
      refetch();
    }
  }, [isPending]);

  useEffect(() => {
    const user = {
      name: data?.user?.name ?? "",
      email: data?.user?.email ?? "",
      avatarUrl: data?.user?.image ?? "",
    };
    setUser(user);
  }, [data]);

  const handleChangeEmail = async () => {
    setLoading(true);
    try {
      await changeEmail(emailValue);
      setEmailEdit(false);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (pwNew.trim() !== pwConfirm.trim()) {
      toast.error("New password and confirm password do not match.");
      return;
    }
    setLoading(true);
    try {
      await changePassword(pwOld, pwNew);
      setPwModal(false);
      setPwOld("");
      setPwNew("");
      setPwConfirm("");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateName = async () => {
    setLoading(true);
    try {
      await updateProfile(nameValue);
      setEditNameModal(false);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0]?.toUpperCase())
      .join("");

  return (
    <div className="fixed inset-0 z-[2100] flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-[600px] max-w-full min-h-[500px] flex flex-col overflow-hidden relative">
        <button
          onClick={() => setShowSettings(false)}
          className="absolute top-5 right-5 text-gray-400 hover:text-black"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex-1 h-full overflow-y-auto p-10">
          <h2 className="text-xl font-semibold mb-8 flex items-center gap-2">
            <User2 className="w-6 h-6 text-[#6C47FF]" />
            Account Settings
          </h2>

          {/* Profile */}
          <div className="flex items-center gap-4 border-b border-gray-100 pb-6 mb-6">
            <div className="rounded-full bg-[#F2F2F2] text-[#6C47FF] w-14 h-14 flex items-center justify-center text-2xl font-bold border border-zinc-200">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="rounded-full w-12 h-12 object-cover"
                />
              ) : (
                <span>{getInitials(user.name)}</span>
              )}
            </div>
            <div>
              <div className="font-semibold text-base text-black">
                {user.name}
              </div>
            </div>
            <button
              className="ml-auto text-[#6C47FF] text-sm font-medium hover:underline"
              onClick={() => setEditNameModal(true)}
            >
              Edit
            </button>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2 border-b border-gray-100 pb-6 mb-6">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-gray-400" />
              <span className="font-medium text-sm text-gray-900">
                Email address
              </span>
            </div>
            {!emailEdit && (
              <div className="flex items-center gap-2 pl-7">
                <span className="text-sm text-black">{user.email}</span>
                <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded text-xs font-medium">
                  Primary
                </span>
                <button
                  className="ml-2 text-gray-400 text-sm hover:text-[#6C47FF]"
                  onClick={() => setEmailEdit(true)}
                >
                  Edit
                </button>
              </div>
            )}
            {emailEdit && (
              <div className="flex items-center gap-2 pl-7">
                <input
                  className="border rounded px-2 py-1 text-sm text-black"
                  value={emailValue}
                  onChange={(e) => setEmailValue(e.target.value)}
                  disabled={loading}
                />
                <button
                  className="text-[#6C47FF] text-sm font-medium flex items-center gap-1"
                  onClick={handleChangeEmail}
                  disabled={loading}
                >
                  {loading ? <Loader /> : "Save"}
                </button>
                <button
                  className="text-gray-500 text-sm font-medium"
                  onClick={() => {
                    setEmailEdit(false);
                    setEmailValue(user.email);
                  }}
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
              <Lock className="w-5 h-5 text-gray-400" />
              <span className="font-medium text-sm text-gray-900">
                Password
              </span>
              <button
                className="ml-auto text-[#6C47FF] text-sm font-medium"
                onClick={() => setPwModal(true)}
              >
                Change
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {editNameModal && (
          <AnimatedModal
            title="Edit Name"
            onClose={() => setEditNameModal(false)}
          >
            <input
              className="border rounded px-3 py-2 w-full text-black"
              type="text"
              value={nameValue}
              onChange={(e) => setNameValue(e.target.value)}
              disabled={loading}
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="bg-[#6C47FF] text-white px-4 py-2 rounded text-sm flex items-center gap-2"
                onClick={handleUpdateName}
                disabled={loading}
              >
                {loading ? <Loader /> : "Save"}
              </button>
            </div>
          </AnimatedModal>
        )}

        {pwModal && (
          <AnimatedModal
            title="Change Password"
            onClose={() => setPwModal(false)}
          >
            <input
              className="border rounded px-3 py-2 w-full mb-2 text-black"
              type="password"
              placeholder="Current password"
              value={pwOld}
              onChange={(e) => setPwOld(e.target.value)}
              disabled={loading}
            />
            <input
              className="border rounded px-3 py-2 w-full mb-2 text-black"
              type="password"
              placeholder="New password"
              value={pwNew}
              onChange={(e) => setPwNew(e.target.value)}
              disabled={loading}
            />
            <input
              className="border rounded px-3 py-2 w-full text-black"
              type="password"
              placeholder="Confirm password"
              value={pwConfirm}
              onChange={(e) => setPwConfirm(e.target.value)}
              disabled={loading}
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="bg-[#6C47FF] text-white px-4 py-2 rounded text-sm flex items-center gap-2"
                onClick={handleChangePassword}
                disabled={loading}
              >
                {loading ? <Loader /> : "Save"}
              </button>
            </div>
          </AnimatedModal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserSettings;
