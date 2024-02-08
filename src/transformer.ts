//the source in report.json should be read
//and then transformed to the format found in report_cucumber.json

//write a function to this transformation

import * as fs from 'fs';
import { CucumberTest } from './models/cucumberTest';
import { CucumberTestDetails } from './models/cucumberTestDetails';

export function transformReport() {
	//read the report.json file
	const report = fs.readFileSync('src/report.json', 'utf8');

	//init a a new object to store the transformed data
	const reportObj = JSON.parse(report);

	for (const suite of reportObj.suites) {
		// let cucumberTestDetails: CucumberTestDetails = {
		// 	keyword: 'Scenario Outline',
		// 	type: 'scenario',
		// 	tags: [],
		// 	steps: [],
		// };

		let cucumberReport: CucumberTest = {
			elements: [],
		};

		//iterate through the suites.specs and set the title
		for (const spec of suite.specs) {
			const cucumberTestDetails: CucumberTestDetails = {
				keyword: 'Scenario Outline',
				type: 'scenario',
				name: spec.title,
				tags: [],
				steps: [],
			};

			for (const tag of spec.tests[0].annotations) {
				cucumberTestDetails.tags?.push({
					//concatenate ths symbol @
					name: '@' + tag.description,
				});
			}

			for (const step of spec.tests[0].results[0].steps) {
				if (step.title.startsWith('GIVEN')) {
					step.keyword = 'Given';
				} else if (step.title.startsWith('WHEN')) {
					step.keyword = 'When';
				} else if (step.title.startsWith('THEN')) {
					step.keyword = 'Then';
				} else if (step.title.startsWith('AND')) {
					step.keyword = 'And';
				} else if (step.title.startsWith('BUT')) {
					step.keyword = 'But';
				}

				const stepStatus = step.error ? 'failed' : 'passed';

				cucumberTestDetails.steps?.push({
					keyword: step.keyword,
					name: step.title,
					result: {
						status: stepStatus,
						duration: step.duration,
					},
				});
			}

			// console.log(cucumberTestDetails);
			cucumberReport.elements.push(cucumberTestDetails);
			// console.log(JSON.stringify(cucumberReport));
		}
		// console.log(cucumberReport);
		console.log(JSON.stringify(cucumberReport));
	}
}

transformReport();
