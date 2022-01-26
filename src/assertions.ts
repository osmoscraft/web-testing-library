interface ExpectContext {
  actual: any;
  negated: boolean;
}

export class Expect {
  static create(actual: any) {
    return new Expect(actual);
  }

  private context: ExpectContext;

  constructor(actual: any) {
    this.context = {
      actual,
      negated: false,
    };
  }

  get not() {
    this.context.negated = !this.context.negated;
    return this;
  }

  async toThrow(expectedError?: any) {
    try {
      await this.context.actual();
      throw new _InternalFallthroughError();
    } catch (actualError) {
      const isThrown = !(actualError instanceof _InternalFallthroughError);
      const isExpectedToThrow = !this.context.negated;
      const isErrorTypeSpecificed = expectedError !== undefined;
      const isExpectedErrorType = expectedError && actualError instanceof expectedError;

      if (isExpectedToThrow && isThrown && isErrorTypeSpecificed && isExpectedErrorType) {
        return;
      } else if (isExpectedToThrow && isThrown && isErrorTypeSpecificed && !isExpectedErrorType) {
        throw new WrongErrorThrow(expectedError, actualError);
      } else if (isExpectedToThrow && isThrown && !isErrorTypeSpecificed) {
        return;
      } else if (isExpectedToThrow && !isThrown) {
        throw new ExpectedErrorNotThrown(expectedError);
      } else if (!isExpectedToThrow && isThrown && isErrorTypeSpecificed && isExpectedErrorType) {
        throw new UnexpectedThrown(actualError);
      } else if (!isExpectedToThrow && isThrown && isErrorTypeSpecificed && !isExpectedErrorType) {
        return;
      } else if (!isExpectedToThrow && isThrown && !isErrorTypeSpecificed) {
        throw new UnexpectedThrown(actualError);
      } else if (!isExpectedToThrow && !isThrown) {
        return;
      }

      throw new Error("Test framework error. Unreachable code is executed");
    }
  }

  async toEqual(expectedValue: any) {
    try {
      deepEqual(this.context.actual, expectedValue);
      throw new _InternalFallthroughError();
    } catch (actualError) {
      const isEqual = actualError instanceof _InternalFallthroughError;
      const isEqualExpected = !this.context.negated;

      if (isEqual && isEqualExpected) return;
      if (!isEqual && !isEqualExpected) return;
      if (isEqual && !isEqualExpected)
        throw new UnexpectedEquality(this.valueToString(expectedValue), this.valueToString(this.context.actual));
      if (!isEqual && isEqualExpected)
        throw new UnexpectedInequality(this.valueToString(expectedValue), this.valueToString(this.context.actual));
    }
  }

  valueToString(value: unknown): string {
    switch (typeof value) {
      case "string":
        return value;
      default:
        return JSON.stringify(value);
    }
  }
}

export const expect = Expect.create;

class ExpectedErrorNotThrown extends Error {
  constructor(expected: any) {
    super();
    this.message = `"${expected?.name ?? "(Unnamed error)"}" was expected to throw, but no error was thrown.`;
  }
}

class WrongErrorThrow extends Error {
  constructor(expected: any, actual: any) {
    super();
    this.message = `${expected?.name ?? "(Unnamed error)"}" was expected to be thrown, but "${
      actual?.name ?? "(unnamed error)"
    }" was thrown.`;
  }
}

class UnexpectedThrown extends Error {
  constructor(actual: any) {
    super();
    this.message = `"${actual?.name ?? "(Unnamed error)"}" was unexpectedly thrown.`;
  }
}

class UnexpectedInequality extends Error {
  constructor(expected: string, actual: string) {
    super();
    this.message = `Expected Left == Right, but Left != Right. \nLeft=${actual}\nRight=${expected}`;
  }
}

class UnexpectedEquality extends Error {
  constructor(expected: string, actual: string) {
    super();
    this.message = `Expected Left != Right, but Left == Right. \nLeft=${actual}\nRight=${expected}`;
  }
}
class _InternalFallthroughError extends Error {}

function deepEqual(a: any, b: any) {
  if (JSON.stringify(a) !== JSON.stringify(b)) {
    throw new DeepEqualNotSatified();
  }
}

class DeepEqualNotSatified extends Error {
  constructor() {
    super();
    this.message = `Expected two values to equal based on JSON.stringify() comparison, but they actual are not`;
  }
}
