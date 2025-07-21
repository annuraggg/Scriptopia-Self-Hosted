import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { Cog, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import UserSettings from "./UserSettings";

// ---------------------------------------------------------------------------
// Dummy auth helpers – swap with real logic
// ---------------------------------------------------------------------------
const useAuthUser = () => ({
  name: "Anurag Sawant",
  avatarUrl: "",
});
const signOut = () => new Promise((r) => setTimeout(r, 500));

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
const MENU_HEIGHT = 196; // Approximate height of the menu in px, update if you adjust content

const BetterUserButton = ({
  onManageAccount,
}: {
  onManageAccount?: () => void;
}) => {
  const user = useAuthUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const navigate = useNavigate();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [coords, setCoords] = useState<{
    top: number;
    left: number;
    placement: "bottom" | "top";
  }>({
    top: 0,
    left: 1000,
    placement: "bottom",
  });

  // -----------------------------------------------------------------------
  // Helpers
  // -----------------------------------------------------------------------
  const getInitials = (name: string) =>
    name
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0]?.toUpperCase())
      .join("");

  const closeAll = () => {
    setMenuOpen(false);
    setShowSettings(false);
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      toast.success("Signed out successfully.");
      navigate("/login");
    } catch {
      toast.error("Error signing out. Please try again.");
    } finally {
      setIsSigningOut(false);
      closeAll();
    }
  };

  // -----------------------------------------------------------------------
  // Measure avatar button position for menu placement
  // -----------------------------------------------------------------------
  const calculateCoords = () => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) {
      const spaceBelow = window.innerHeight - (rect.top + rect.height);
      const spaceAbove = rect.top;
      const placement =
        spaceBelow >= MENU_HEIGHT + 12 || spaceBelow > spaceAbove
          ? "bottom"
          : "top";
      setCoords({
        top:
          placement === "bottom"
            ? rect.top + rect.height + 8
            : rect.top - MENU_HEIGHT - 8,
        left: 20,
        placement,
      });
    }
  };

  useLayoutEffect(calculateCoords, [menuOpen]);
  useEffect(() => {
    if (!menuOpen) return;
    window.addEventListener("resize", calculateCoords);
    window.addEventListener("scroll", calculateCoords, true);
    return () => {
      window.removeEventListener("resize", calculateCoords);
      window.removeEventListener("scroll", calculateCoords, true);
    };
  }, [menuOpen]);

  // -----------------------------------------------------------------------
  // Close on outside click / Esc
  // -----------------------------------------------------------------------
  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node) &&
        !(e.target as HTMLElement).closest("[data-user-menu]")
      ) {
        setMenuOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) =>
      e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------
  return (
    <>
      {/* Avatar button --------------------------------------------------- */}
      <button
        ref={buttonRef}
        onClick={() => setMenuOpen((o) => !o)}
        className="relative z-[1100] rounded-full bg-[#F2F2F2] text-[#7259e0] w-8 h-8 flex items-center justify-center text-base font-bold shadow focus:outline-none border border-zinc-200"
        aria-label="User menu"
      >
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="rounded-full w-7 h-7 object-cover"
          />
        ) : (
          <span>{getInitials(user.name)}</span>
        )}
      </button>

      {/* Drop‑down menu via portal -------------------------------------- */}
      {createPortal(
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              key="menu"
              data-user-menu
              initial={{
                opacity: 0,
                y: coords.placement === "bottom" ? -8 : 8,
                scale: 0.97,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: coords.placement === "bottom" ? -8 : 8,
                scale: 0.97,
              }}
              transition={{ duration: 0.15 }}
              style={{
                position: "absolute",
                top: coords.top,
                left: coords.left,
                width: 400,
                maxWidth: "99vw",
                zIndex: 1200,
              }}
              className="bg-white border border-zinc-100 rounded-xl py-2 px-0 flex flex-col shadow-xl"
            >
              {/* Profile ------------------------------------------------ */}
              <div className="flex items-center gap-4 p-5 pb-3 min-h-0">
                <div className="rounded-full bg-[#F2F2F2] text-[#7259e0] w-10 h-10 flex items-center justify-center text-base font-bold border border-zinc-200">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="rounded-full w-9 h-9 object-cover"
                    />
                  ) : (
                    <span>{getInitials(user.name)}</span>
                  )}
                </div>
                <div>
                  <div className="font-medium text-black text-sm leading-tight">
                    {user.name}
                  </div>
                </div>
              </div>

              {/* List menu -------------------------------------------- */}
              <ul className="flex flex-col py-1" role="menu">
                <li>
                  <button
                    className="w-full flex items-center gap-3 px-6 py-3 text-sm text-gray-800 rounded transition hover:bg-gray-100"
                    role="menuitem"
                    onClick={() => {
                      setMenuOpen(false);
                      setShowSettings(true);
                      onManageAccount?.();
                    }}
                  >
                    <Cog className="w-4 h-4 opacity-80" />
                    Manage account
                  </button>
                </li>
                <li>
                  <button
                    disabled={isSigningOut}
                    className="w-full flex items-center gap-3 px-6 py-3 text-sm text-gray-800 rounded transition hover:bg-gray-100"
                    role="menuitem"
                    onClick={handleSignOut}
                  >
                    <LogOut className="w-4 h-4 opacity-80" />
                    {isSigningOut ? "Signing out…" : "Sign out"}
                  </button>
                </li>
              </ul>

              <div className="w-full h-px bg-gray-100 my-1" />
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Settings modal ----------------------------------------------- */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            key="settings"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2100]"
          >
            <UserSettings setShowSettings={setShowSettings} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BetterUserButton;
