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
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { LogOut } from "lucide-react";

export default function AuthButton() {
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

  if (loading) {
    return (
      <Button disabled className="w-[160px] bg-gray-800 text-gray-100 animate-pulse">
        {/* Skeleton */}
      </Button>
    );
  }

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

  if (!session?.data) {
    return (
      <Button onClick={signIn} className="bg-black text-white px-4 py-1 rounded cursor-pointer">
        Sign in with Google
      </Button>
    );
  }

  return (
    <>
      <div className="flex items-center gap-3">
        {/* User Initial Avatar */}
        <div className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center text-sm font-medium">
          {userInitial}
        </div>

        {/* Logout with dialog */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button
              className="flex items-center cursor-pointer gap-1 text-black py-1 text-sm rounded"
              disabled={processing}
            >
              Logout  <LogOut size={15}/>
            </button>
          </DialogTrigger>
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
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                className="px-3 py-1 text-sm rounded"
                disabled={processing}
              >
                Cancel
              </Button>
              <Button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-1 text-sm rounded"
                disabled={processing}
              >
                {processing ? "Logging out..." : "Logout"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}