import { PullRequestStatus } from "azure-devops-extension-api/Git";

export interface IPullRequest {
	repositoryId: string;
	repositoryName: string;
	pullRequestId: number;
	status: PullRequestStatus;
	createdByDisplayName: string;
	createdById: string;
	createdByImageUrl: string;
	creationDate: Date;
	closedDate: Date | undefined;
	sourceRefName: string;
	targetRefName: string;
	isDraft: boolean;
	reviewers: IPullRequestReviewer[];
	url: string;
}

export interface IPullRequestReviewer {
	reviewerUrl: string;
	vote: number;
	hasDeclined: boolean;
	isFlagged: boolean;
	displayName: string;
	id: string;
	uniqeName: string;
	imageUrl: string;
}
