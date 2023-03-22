import { supabase } from "./Supabase";

export const auth = {
  get strictUserId(): string {
    const userId = this.userId;
    if (userId === undefined) {
      throw new Error("Could not resolve user id");
    }
    return userId;
  },

  get userId(): string | undefined {
    return this.data?.sub;
  },

  get isValid(): boolean {
    const data = this.data;
    if (data === undefined) {
      return false;
    }
    return data.exp > Date.now() / 1000;
  },

  get data(): SessionData | undefined {
    let token: string | null = null;
    for (const key in { ...localStorage }) {
      if (key.includes("-auth-token")) {
        token = localStorage.getItem(key);
        break;
      }
    }
    if (token === null) {
      return undefined;
    }
    try {
      const payload = token.split(".")[1];
      return JSON.parse(window.atob(payload));
    } catch (err) {
      console.error(err);
      return undefined;
    }
  },

  get auditor(): { auditor: string } {
    const auditor = this.userId;
    if (auditor === undefined) {
      throw new Error("Cannot assign auditor, user is not logged in");
    }
    return { auditor };
  },

  refresh: refreshSession
};

/*
 |--------------------------------------------------------------------------------
 | Utilities
 |--------------------------------------------------------------------------------
 */

async function refreshSession(): Promise<void> {
  const { data, error } = await supabase.auth.refreshSession();
  if (error !== null) {
    console.error(error);
    return;
  }
  if (data === null) {
    console.error("No data returned from refreshAccessToken");
    return;
  }
}

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

type SessionData = {
  aal: string;
  amr: {
    method: string;
    timestamp: number;
  }[];
  app_metadata: {
    provider: string;
    providers: string[];
  };
  aud: string;
  email: string;
  exp: number;
  phone: string;
  role: string;
  session_id: string;
  sub: string; // user id
  user_metadata: Record<string, unknown>;
};
