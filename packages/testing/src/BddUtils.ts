// ### Feature

export function feature(name: string | FeatureOptions, fn: jest.EmptyFunction): void {
  if (typeof name === "string") {
    describe(`Feature: ${name}`, fn);
  } else {
    describe(`Feature: ${name.name}\n${getDescription(name.desc)}`, fn);
  }
}

type FeatureOptions = {
  name: string;
  desc: string;
};

// ### Scenario

export function scenario<S extends ScenarioState = ScenarioState>(name: string, fn: ScenarioFn<S>): void;
export function scenario<S extends ScenarioState = ScenarioState, T = any>(
  opts: ScenarioOptions<T>,
  fn: ScenarioFn<S, T>
): void;
export function scenario<S extends ScenarioState = ScenarioState, T = any>(
  nameOrOptions: string | ScenarioOptions<T>,
  fn: ScenarioFn<S, T>
): void {
  if (typeof nameOrOptions === "string") {
    describe(`Scenario: ${nameOrOptions}`, () => {
      fn.call({} as S, { before: beforeAll, test: {} as T });
    });
  } else {
    let index = 1;
    for (const test of nameOrOptions.tests) {
      describe(`#${index} Scenario: ${nameOrOptions.name}`, () => {
        fn.call({} as S, { before: beforeAll, test });
      });
      index++;
    }
  }
}

type ScenarioOptions<T = any> = {
  name: string;
  tests: T[];
};

type ScenarioState = Record<string, any>;

type ScenarioFn<S, C = any> = (this: S, args: { before: typeof beforeAll; test: C }) => void;

// ### Steps

export function given(name: string, fn: jest.EmptyFunction): void {
  it(`Given ${name}`, fn);
}

export function when(name: string, fn: jest.EmptyFunction): void {
  it(`When ${name}`, fn);
}

export function then(name: string, fn: jest.EmptyFunction): void {
  it(`Then ${name}`, fn);
}

// ### Utilities

function getDescription(description: string): string {
  const result: string[] = [];
  const lines = description.split("\n");
  for (const line of lines) {
    result.push(line.trim());
  }
  return lines.join("\n");
}
