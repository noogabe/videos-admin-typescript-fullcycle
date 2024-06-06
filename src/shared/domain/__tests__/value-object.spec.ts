import { ValueObject } from "../value-object";

class StringValueObject extends ValueObject {
  constructor(readonly value: string) {
    super();
  }
}

class ComplexValueObject extends ValueObject {
  constructor(readonly prop1: string, readonly prop2: number) {
    super();
  }
}

describe("ValueObject Unit Tests", () => {
  it("should be equal", () => {
    const v1 = new StringValueObject("value1");
    const v2 = new StringValueObject("value1");
    expect(v1.equals(v2)).toBeTruthy();

    const v3 = new ComplexValueObject("value3", 3);
    const v4 = new ComplexValueObject("value3", 3);
    expect(v3.equals(v4)).toBeTruthy();
  });

  it("should not be equal", () => {
    const v1 = new StringValueObject("value1");
    const v2 = new StringValueObject("value2");
    expect(v1.equals(v2)).toBeFalsy();
    expect(v1.equals(null as any)).toBeFalsy();
    expect(v2.equals(undefined as any)).toBeFalsy();

    const v3 = new ComplexValueObject("value3", 3);
    const v4 = new ComplexValueObject("value3", 4);
    expect(v3.equals(null as any)).toBeFalsy();
    expect(v4.equals(undefined as any)).toBeFalsy();
  });
});
