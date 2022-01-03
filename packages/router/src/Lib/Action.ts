import type { Accept, ActionResponse, Redirect, Reject, Render } from "../Types/Action";

export const response: ActionResponse = {
  render(components: any | any[]): Render {
    return {
      status: "render",
      components: Array.isArray(components) ? components : [components]
    };
  },

  accept(): Accept {
    return {
      status: "accept"
    };
  },

  redirect(path: string, isExternal = false): Redirect {
    return {
      status: "redirect",
      isExternal,
      path
    };
  },

  reject(message: string, details: any = {}): Reject {
    return {
      status: "reject",
      message,
      details
    };
  }
};
