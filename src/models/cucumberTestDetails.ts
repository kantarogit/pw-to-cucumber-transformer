export type CucumberTestDetails = {
	tags?: Array<IssueTag>;
	name?: string;
	type?: string;
	keyword: string;
	description?: string;
	steps?: Array<Step>;
};

export type IssueTag = {
	name: string;
};

export type Step = {
	keyword: string;
	name: string;
	result: {
		status: string;
		duration: number;
	};
};
