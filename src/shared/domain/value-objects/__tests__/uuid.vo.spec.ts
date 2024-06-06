import { validate as uuidValidate } from "uuid";
import { InvalidUuidError, Uuid } from "../uuid.vo";

describe("Uuid Unit Tests", () => {
  const validateSpy = jest.spyOn(Uuid.prototype as any, "validate");

  it("should throw error when uuid is invalid", () => {
    expect(() => new Uuid("fake id")).toThrow(new InvalidUuidError());
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });

  it("should accept an uuid passed in constructor", () => {
    const id = "312cffad-1938-489e-a706-643dc9a3cfd3";
    const uuid = new Uuid(id);
    expect(uuid.id).toBe(id);
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });

  it("should create an uuid when it is not passed in constructor", () => {
    const uuid = new Uuid();
    expect(() => uuidValidate(uuid.id)).toBeTruthy();
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });
});
