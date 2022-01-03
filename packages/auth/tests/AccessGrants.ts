import { AccessGrants } from "../src/Lib/AccessGrants";
import { AccountAccessAttributes } from "./mocks/AccountAccessAttributes";
import { store } from "./mocks/TestAccessStore";

/*
 |--------------------------------------------------------------------------------
 | Unit Tests
 |--------------------------------------------------------------------------------
 */

describe("AccessGrants", () => {
  describe("when using the .grant method", () => {
    it("should assign new grants", async () => {
      const grants = new AccessGrants("john", "xyz");
      const attributes = new AccountAccessAttributes();

      await grants.grant("account", "update").grant("account", "read", attributes.toJSON()).grant("account", "delete").commit();

      expect(store).toEqual({
        john: {
          xyz: {
            account: {
              update: true,
              read: {
                owner: 3,
                public: 1
              },
              delete: true
            }
          }
        }
      });
    });
  });

  describe("when using the .deny method", () => {
    it("should remove update permissions", async () => {
      const grants = new AccessGrants("john", "xyz");

      await grants.deny("account", "delete").commit();

      expect(store).toEqual({
        john: {
          xyz: {
            account: {
              update: true,
              read: {
                owner: 3,
                public: 1
              }
            }
          }
        }
      });
    });
  });
});
