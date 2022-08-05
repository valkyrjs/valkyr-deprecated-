import { Attributes } from "../src/Attributes";
import { permissionGranted } from "../src/Permission";

/*
 |--------------------------------------------------------------------------------
 | Data
 |--------------------------------------------------------------------------------
 */

const ACCOUNT_FLAGS = {
  name: 1 << 0,
  password: 1 << 1
};

const accounts = [
  {
    name: "John Doe",
    password: "bcrypt"
  },
  {
    name: "Jane Doe",
    password: "bcrypt"
  }
];

/*
 |--------------------------------------------------------------------------------
 | Unit Tests
 |--------------------------------------------------------------------------------
 */

describe("Permission", () => {
  it("should show no attributes when permission granted with no filter is provided", () => {
    const permission = permissionGranted(new Attributes(ACCOUNT_FLAGS));
    expect(permission.filter(accounts[0])).toEqual({});
  });

  it("should show enabled attributes when permission granted", () => {
    const permission = permissionGranted(new Attributes(ACCOUNT_FLAGS).enable(["name"]));
    expect(permission.filter(accounts[0])).toEqual({ name: accounts[0].name });
  });
});
