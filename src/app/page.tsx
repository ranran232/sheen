'use client'
import Hero from './components/Hero';
import { useEffect } from "react";
import { createAuthClient } from "better-auth/client";
import useSessionStore from './stores/sessionStore';
import { Toaster, toast } from 'sonner'; // import toast

const Page = () => {
  const authClient = createAuthClient();
  const setSession = useSessionStore((state) => state.setSession);

  useEffect(() => {
    const getSession = async () => {
      try {
        const session = await authClient.getSession();

        if (session?.data?.user) {
          setSession(session); // store it in Zustand

          // 🔥 Make POST request to /api/user
          const { email, name } = session.data.user;
          try {
            const res = await fetch("/api/user", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ email, name }),
            });

            if (!res.ok) {
              throw new Error(`Failed to post user: ${res.statusText}`);
            }
            const data= await res.json();
          } catch (postError) {
            console.error("Error posting user:", postError);
            toast.error("Failed to save user");
          }

        } else {
          setSession(null);
        }
      } catch (error) {
        console.error("Failed to get session:", error);
        toast.error("Failed to get user session");
      }
    };

    getSession();
  }, [authClient, setSession]);

  return (
    <div>
      <Hero />
      <Toaster position="top-right" richColors />
    </div>
  );
};

export default Page;