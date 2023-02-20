import { Attributes } from "../dist/src/Attributes.js";

/*
 |--------------------------------------------------------------------------------
 | Data
 |--------------------------------------------------------------------------------
 */

const USER_FLAGS = {
  firstName: 1 << 0,
  lastName: 1 << 1,
  email: 1 << 2
};

const JOHN = {
  firstName: "John",
  lastName: "Doe",
  email: "john@doe.com"
};

/*
 |--------------------------------------------------------------------------------
 | Unit Tests
 |--------------------------------------------------------------------------------
 */

describe("Attributes", () => {
  it("should create a empty attribute instance", () => {
    const attributes = new Attributes(USER_FLAGS);
    expect(attributes.has("firstName")).toBeFalsy();
    expect(attributes.has("lastName")).toBeFalsy();
    expect(attributes.has("email")).toBeFalsy();
  });

  it("should successfully .enable new flags", () => {
    const attributes = new Attributes(USER_FLAGS);

    attributes.enable(["firstName"]);
    expect(attributes.has("firstName")).toBeTruthy();
    expect(attributes.has("lastName")).toBeFalsy();
    expect(attributes.has("email")).toBeFalsy();

    attributes.enable(["lastName", "email"]);
    expect(attributes.has("firstName")).toBeTruthy();
    expect(attributes.has("lastName")).toBeTruthy();
    expect(attributes.has("email")).toBeTruthy();
  });

  it("should ignore .enable for already enabled flag", () => {
    const attributes = new Attributes(USER_FLAGS);

    attributes.enable(["firstName"]);
    expect(attributes.has("firstName")).toBeTruthy();

    attributes.enable(["firstName"]);
    expect(attributes.has("firstName")).toBeTruthy();
  });

  it("should successfully .disable existing flags", () => {
    const attributes = new Attributes(USER_FLAGS);

    attributes.enable(["firstName"]);
    expect(attributes.has("firstName")).toBeTruthy();

    attributes.disable(["firstName"]);
    expect(attributes.has("firstName")).toBeFalsy();
  });

  it("should ignore .disable for non existent flag", () => {
    const attributes = new Attributes(USER_FLAGS);

    attributes.disable(["firstName"]);
    expect(attributes.has("firstName")).toBeFalsy();
  });

  it("should only provide enabled attributes when .filter", () => {
    const attributes = new Attributes(USER_FLAGS);

    attributes.enable(["firstName"]);
    expect(attributes.filter(JOHN)).toEqual({
      firstName: "John"
    });

    attributes.enable(["firstName", "email"]);
    expect(attributes.filter(JOHN)).toEqual({
      firstName: "John",
      email: "john@doe.com"
    });
  });

  it("should provide a bitflag number when .toNumber is called", () => {
    const attributes = new Attributes(USER_FLAGS);

    expect(attributes.toNumber()).toEqual(0);

    attributes.enable(["firstName"]);
    expect(attributes.toNumber()).toEqual(1);

    attributes.enable(["lastName"]);
    expect(attributes.toNumber()).toEqual(3);

    attributes.enable(["email"]);
    expect(attributes.toNumber()).toEqual(7);

    attributes.disable(["firstName"]);
    expect(attributes.toNumber()).toEqual(6);
  });
});
