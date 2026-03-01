'use client'

import { signIn, signOut } from "@/lib/auth-client";
import useSessionStore from "../stores/sessionStore";
import { useEffect, useState } from "react";
import { createAuthClient } from "better-auth/client";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { LogOut } from "lucide-react";

export default function AuthBtnMobile() {
  const { session, loading, setSession, clearSession } = useSessionStore();
  const [open, setOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const authClient = createAuthClient();

    const getSession = async () => {
      try {
        const currentSession = await authClient.getSession();
        setSession(currentSession);
      } catch (err) {
        console.error("Error fetching session:", err);
        setSession({ data: null, error: err });
      }
    };

    getSession();
  }, [setSession]);

  const handleLogout = async () => {
    try {
      setProcessing(true);
      await signOut();
      clearSession();
      setOpen(false);
      toast.success("You have successfully logged out.");
    } catch (err) {
      console.error("Logout error:", err);
      toast.error("Logout failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  // Helper: get the first letter of user's name or email
  const userInitial = session?.data?.user?.name
    ? session.data.user.name.charAt(0).toUpperCase()
    : session?.data?.user?.email
    ? session.data.user.email.charAt(0).toUpperCase()
    : "?";

  if (loading) {
    return (
      <a className="px-4 py-2 animate-pulse bg-gray-200 rounded w-full"></a>
    );
  }

  if (!session?.data) {
    return (
      <a
        onClick={signIn}
        className=" py-2 font-bold cursor-pointer hover:bg-gray-100 rounded flex items-center gap-2"
      >
        Sign in
      </a>
    );
  }

  return (
    <>
      <a className="flex font-bold items-center justify-between py-2 rounded hover:bg-gray-100">
        {/* Logout Trigger */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
  <span
    className={`flex items-center gap-1 cursor-pointer text-sm text-black ${
      processing ? "opacity-50 pointer-events-none" : ""
    }`}
  >
    Logout <LogOut size={14} />
  </span>
</DialogTrigger>

  {/* User Initial */}
        <span className="w-6 h-6 rounded-full bg-gray-800 text-white flex items-center justify-center text-xs font-medium">
          {userInitial}
        </span>

          <DialogContent className="max-w-xs p-4 rounded-md shadow-md">
            <DialogHeader className="p-0 mb-2">
              <DialogTitle className="text-sm font-medium">
                Confirm Logout
              </DialogTitle>
              <DialogDescription className="text-xs text-gray-600">
                Are you sure you want to logout? This will end your session.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex justify-end gap-2 mt-3 p-0">
              <button
                className="px-3 py-1 text-sm rounded border border-gray-300"
                onClick={() => setOpen(false)}
                disabled={processing}
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-1 text-sm rounded"
                disabled={processing}
              >
                {processing ? "Logging out..." : "Logout"}
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </a>
    </>
  );
}