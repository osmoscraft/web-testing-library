# Web Testing Library

Minimalist testing library that runs in the browser.

- <del>JSDOM</del><ins>Real DOM</ins>
- What you test is what you get

Note: This library is in experimental stage. It does not integrate with any CI/CD yet. This library only exports TypeScript. So you will need a modern compiler to use it. Currently only supporting [vite](https://vitejs.dev/) and [esbuild](https://esbuild.github.io/).

## Get started

```sh
npm i -D @osmoscraft/web-testing-library
```

```TypeScript
// my-test.ts
import { describe, expect, it } from "@osmoscraft/web-testing-library";

export const testAddition = describe("Browser API", () => {
  it("Indexed DB/Has indexedDB", async () => {
    await expect(1+1).toEqual(2);
  });
});
```

Please make sure to use `await` in frontend of each `expect` or the error reporting may not be able to surface all failed tests

```TypeScript
// run-tests.ts
import { reportSummary } from "@osmoscraft/web-testing-library";
import { testAddition } from "./my-test";

async function testAll() {
  await testAddition();
  reportSummary();
}

testAll();
```

Reference the `run-tests.ts` using your preferred bundler.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="stylesheet" href="tests.css" />
    <title>test page</title>
  </head>
  <body>
    <!-- Include other dependencies of your testing code here -->

    <script type="module" src="run-tests.ts"></script>
  </body>
</html>
```
