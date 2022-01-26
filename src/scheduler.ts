import { reportFail, reportPass } from "./reporter";

const passTemplate = document.createElement("template");
passTemplate.innerHTML = `<details class="pass"><summary></summary><output></output></details>`;
const failTemplate = document.createElement("template");
failTemplate.innerHTML = `<details class="fail" open><summary></summary><output></output></details>`;

const suiteContext = {
  suiteName: "",
  specs: [] as any[],
};

export function describe(name: string, collectSpecs: () => void) {
  const runSuite = async () => {
    suiteContext.suiteName = name;
    suiteContext.specs = [];

    collectSpecs();

    for (let spec of suiteContext.specs) {
      await spec();
    }
  };

  return runSuite;
}

export function it(name: string, task: () => Promise<any>) {
  suiteContext.specs.push(async () => {
    try {
      await task();
      reportPass(`${suiteContext.suiteName}/${name}`);
    } catch (e: any) {
      console.error(e);
      reportFail(`${suiteContext.suiteName}/${name}`, e);
    }
  });
}
