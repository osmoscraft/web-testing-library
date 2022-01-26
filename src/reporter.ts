const passTemplate = document.createElement("template");
passTemplate.innerHTML = `<details class="pass"><summary></summary><output></output></details>`;
const failTemplate = document.createElement("template");
failTemplate.innerHTML = `<details class="fail" open><summary></summary><output></output></details>`;

const reportingContext = {
  passCount: 0,
  failCount: 0,
};

export function reportFail(name: string, error: any) {
  const messageElement = failTemplate.content.cloneNode(true) as DocumentFragment;
  messageElement.querySelector("summary")!.innerText = `[FAIL] ${name}`;
  messageElement.querySelector("output")!.innerText = [error?.name, error?.message].filter((str) => !!str).join(" ");
  reportingContext.failCount++;
  document.body.appendChild(messageElement);
}
export function reportPass(name: string) {
  const messageElement = passTemplate.content.cloneNode(true) as DocumentFragment;
  messageElement.querySelector("summary")!.innerText = `[PASS] ${name}`;
  reportingContext.passCount++;
  document.body.appendChild(messageElement);
}
export function reportSummary() {
  const summaryTemplate = document.createElement("template");
  const { passCount, failCount } = reportingContext;
  summaryTemplate.innerHTML = `<div>${passCount} passed | ${failCount} failed </div>`;
  document.body.prepend(summaryTemplate.content.cloneNode(true));
}
