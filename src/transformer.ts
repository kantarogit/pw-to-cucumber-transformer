#!/usr/bin/env node

import * as fs from 'fs';
import { CucumberTest } from './models/cucumberTest';
import { CucumberTestDetails } from './models/cucumberTestDetails';
import * as path from 'path';

export function transformReport() {
	//read the report.json file
	const reportPath = path.join(process.cwd(), 'src', 'report.json');
	const report = fs.readFileSync('src/report.json', 'utf8');

	//init a a new object to store the transformed data
	const reportObj = JSON.parse(report);

	let cucumberReport: CucumberTest = {
		elements: [],
	};

	for (const suite of reportObj.suites) {
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
					step.title = step.title.replace('GIVEN ', '');
				} else if (step.title.startsWith('WHEN')) {
					step.keyword = 'When';
					step.title = step.title.replace('WHEN ', '');
				} else if (step.title.startsWith('THEN')) {
					step.keyword = 'Then';
					step.title = step.title.replace('THEN ', '');
				} else if (step.title.startsWith('AND')) {
					step.keyword = 'And';
					step.title = step.title.replace('AND ', '');
				} else if (step.title.startsWith('BUT')) {
					step.keyword = 'But';
					step.title = step.title.replace('BUT ', '');
				}

				const stepStatus = step.error ? 'failed' : 'passed';

				cucumberTestDetails.steps?.push({
					keyword: step.keyword,
					name: step.title,
					result: {
						status: stepStatus,
						duration: step.duration * 1000000,
					},
				});
			}

			cucumberReport.elements.push(cucumberTestDetails);
		}
		console.log(JSON.stringify(Array.of(cucumberReport)));

		fs.writeFileSync(
			'output/report_cucumber.json',
			JSON.stringify(Array.of(cucumberReport))
		);
	}
}

transformReport();
