import { PullRequestAsyncStatus, PullRequestStatus } from "azure-devops-extension-api/bin/Git";

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
	title: string;
	sourceRefName: string;
	targetRefName: string;
	isDraft: boolean;
	reviewers: IPullRequestReviewer[];
	url: string;
	mergeStatus: PullRequestAsyncStatus;
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
