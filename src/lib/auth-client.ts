
// auth-client.ts
import { createAuthClient } from "better-auth/client";

const authClient = createAuthClient();

// ✅ Infer return types automatically
type SocialSignInResponse = Awaited<
  ReturnType<typeof authClient.signIn.social>
>;

type SignOutResponse = Awaited<
  ReturnType<typeof authClient.signOut>
>;

// ✅ Sign In
export const signIn = async (): Promise<SocialSignInResponse> => {
  try {
    const data = await authClient.signIn.social({
      provider: "google",
    });
    
    return data;
  } catch (error) {
    console.error("Sign-in failed:", error);
    throw error;
  }
};

// ✅ Sign Out
export const signOut = async (): Promise<SignOutResponse> => {
  try {
    const data = await authClient.signOut();
    return data;
  } catch (error) {
    console.error("Sign-out failed:", error);
    throw error;
  }
};