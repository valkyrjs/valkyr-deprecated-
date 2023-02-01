import { request } from "./Requests.Mock";

it("should handle rpc call with positional parameters", async () => {
  await expect(request.subtract.positional([42, 23], 1)).resolves.toEqual(19);
  await expect(request.subtract.positional([23, 42], 2)).resolves.toEqual(-19);
});

it("should handle rpc call with named parameters", async () => {
  await expect(
    request.subtract.named(
      {
        subtrahend: 42,
        minuend: 23
      },
      3
    )
  ).resolves.toEqual(19);
  await expect(
    request.subtract.named(
      {
        minuend: 23,
        subtrahend: 42
      },
      4
    )
  ).resolves.toEqual(19);
});

it("should handle a notification", async () => {
  await expect(request.update([1, 2, 3, 4, 5])).resolves.toBeUndefined();
});

it("should handle call of non-existent method", async () => {
  await expect(request.foobar(5)).rejects.toThrow("Method not found");
});
