import { useState } from "react";
import { User2, Lock, Trash2, Mail } from "lucide-react";

// Replace with your actual user and auth logic
const useAuthUser = () => ({
  name: "Anurag Sawant",
  email: "anuragsawant@duck.com",
  avatarUrl: "",
  username: "annuraggg",
});

const updateProfile = async () => {
  /* ... */
};
const changeEmail = async (newEmail: string) => {
  /* ... */
};
const changePassword = async (oldPw: string, newPw: string) => {
  /* ... */
};
const deleteAccount = async () => {
  /* ... */
};

const UserSettings = () => {
  const user = useAuthUser();
  const [emailEdit, setEmailEdit] = useState(false);
  const [emailValue, setEmailValue] = useState(user.email);
  const [pwModal, setPwModal] = useState(false);
  const [pwOld, setPwOld] = useState("");
  const [pwNew, setPwNew] = useState("");
  const [loading, setLoading] = useState(false);

  // Handlers
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
    setLoading(true);
    try {
      await changePassword(pwOld, pwNew);
      setPwModal(false);
      setPwOld("");
      setPwNew("");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete your account? This action is irreversible."
      )
    )
      return;
    setLoading(true);
    try {
      await deleteAccount();
      // Redirect or sign out
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
    <div
      className="fixed inset-0 z-[2100] flex items-center justify-center bg-black/30"
      style={{ backdropFilter: "blur(2px)" }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-[600px] max-w-full min-h-[500px] flex flex-col overflow-hidden">
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
              <div className="text-sm text-gray-400">{user.username}</div>
            </div>
            <button
              className="ml-auto text-[#6C47FF] text-sm font-medium hover:underline"
              onClick={updateProfile}
              tabIndex={0}
              type="button"
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
                <span className="text-sm">{user.email}</span>
                <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded text-xs font-medium">
                  Primary
                </span>
                <button
                  className="ml-2 text-gray-400 text-sm hover:text-[#6C47FF] px-2 py-1"
                  onClick={() => setEmailEdit(true)}
                  tabIndex={0}
                  type="button"
                >
                  Edit
                </button>
              </div>
            )}
            {emailEdit && (
              <div className="flex items-center gap-2 pl-7">
                <input
                  className="border rounded px-2 py-1 text-sm"
                  value={emailValue}
                  onChange={(e) => setEmailValue(e.target.value)}
                  disabled={loading}
                />
                <button
                  className="text-[#6C47FF] text-sm font-medium"
                  onClick={handleChangeEmail}
                  disabled={loading}
                  tabIndex={0}
                  type="button"
                >
                  Save
                </button>
                <button
                  className="text-gray-500 text-sm font-medium"
                  onClick={() => {
                    setEmailEdit(false);
                    setEmailValue(user.email);
                  }}
                  disabled={loading}
                  tabIndex={0}
                  type="button"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
          {/* Security & Danger */}
          <div className="flex flex-col gap-6">
            {/* Password */}
            <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
              <Lock className="w-5 h-5 text-gray-400" />
              <span className="font-medium text-sm text-gray-900">
                Password
              </span>
              <button
                className="ml-auto text-[#6C47FF] text-sm font-medium"
                onClick={() => setPwModal(true)}
                tabIndex={0}
                type="button"
              >
                Change
              </button>
            </div>
            {/* Delete account */}
            <div className="flex items-center gap-4">
              <Trash2 className="w-5 h-5 text-gray-400" />
              <span className="font-medium text-sm text-gray-900">
                Delete account
              </span>
              <button
                className="ml-auto text-red-600 text-sm font-medium hover:underline"
                onClick={handleDeleteAccount}
                disabled={loading}
                tabIndex={0}
                type="button"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Change password modal */}
      {pwModal && (
        <div className="fixed inset-0 z-[2200] flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-[400px] p-8">
            <h3 className="text-lg font-semibold mb-4">Change password</h3>
            <div className="flex flex-col gap-3">
              <input
                className="border rounded px-3 py-2 text-base"
                type="password"
                placeholder="Current password"
                value={pwOld}
                onChange={(e) => setPwOld(e.target.value)}
              />
              <input
                className="border rounded px-3 py-2 text-base"
                type="password"
                placeholder="New password"
                value={pwNew}
                onChange={(e) => setPwNew(e.target.value)}
              />
              <div className="flex gap-2 mt-4">
                <button
                  className="px-5 py-2 bg-[#6C47FF] text-white rounded text-sm font-medium"
                  onClick={handleChangePassword}
                  disabled={loading}
                  tabIndex={0}
                  type="button"
                >
                  Save
                </button>
                <button
                  className="px-5 py-2 text-gray-600 rounded text-sm font-medium"
                  onClick={() => setPwModal(false)}
                  tabIndex={0}
                  type="button"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSettings;
