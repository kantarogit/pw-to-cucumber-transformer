# Json-to-Cucumber

## Description

Json-to-Cucumber is a utility package that transforms standard JSON reports generated from Playwright test runner, into Cucumber JSON reports that can be easily imported to test management platforms like Xray. It's designed in cases you dont want to implement full layer of Cucumber framework in your test automation, but you still want to have the scnearios documented in Gherkin syntax.

## Installation

To install CucumberizeJson, run the following command in your project directory:

```bash
npm install cucumberize-json
```

This command will look for a report.json file in the src/ directory of your project, transform it into a Cucumber JSON report, and output the result.

## Usage

The tests should be organized using Playwright built-in steps, something like this:

```ts
test('Should do something'), async () => {
	test.info().annotations.push({
		type: 'Jira',
		description: 'PROJECT-8134',
	});

	await test.step(`GIVEN a contact is created`, async () => {
		//your GIVEN code here
	});

	await test.step(`WHEN a product is purchased`, async () => {
		//your WHEN code here
	});

	await test.step(`THEN policy is created`, async () => {
		//your THEN code here
	});
});
```

Each test should have annotation as well, that will be used later to map the test to the existing Xray feature file.

Playwright should be configured to generate Json report

```ts
//playwright.config.ts
reporter: [['json', { outputFile: 'report.json' }]],
```

assuming the `src` directory under the project root (meaning report would have the path `src/report.json`).

Then you create a npm script in your project:

```json
//package.json
...
"scripts": {
		"cucumberize": "cucumberizeJson"
	},
...
```

Once Playwright report generated, you can run `npm run cucumberize` and it will transform the original json report to Cucumber json report (in the `src/output` directory) including all the steps and annotations.

You can easily integrate this results in Xray now 😀
