import { GitPullRequest, IdentityRefWithVote } from "azure-devops-extension-api/Git";
import { IPullRequest, IPullRequestReviewer } from "./HubInterfaces";

export function getTypedPullRequest(pr: GitPullRequest): IPullRequest {
	return {
		repositoryId: pr.repository?.id,
		repositoryName: pr.repository?.name,
		pullRequestId: pr.pullRequestId,
		status: pr.status,
		createdByDisplayName: pr.createdBy?.displayName,
		createdById: pr.createdBy?.id,
		createdByImageUrl: pr.createdBy?.imageUrl,
		creationDate: pr.creationDate,
		closedDate: pr.closedDate,
		title: pr.title,
		sourceRefName: pr.sourceRefName,
		targetRefName: pr.targetRefName,
		isDraft: pr.isDraft,
		reviewers: pr.reviewers.map(r => getTypedPullRequestReviewer(r)),
		url: pr.url,
		mergeStatus: pr.mergeStatus
	};
}

export function getTypedPullRequestReviewer(reviewer: IdentityRefWithVote): IPullRequestReviewer {
	return {
		reviewerUrl: reviewer.url,
		vote: reviewer.vote,
		hasDeclined: reviewer.hasDeclined,
		isFlagged: reviewer.isFlagged,
		displayName: reviewer.displayName,
		id: reviewer.id,
		uniqeName: reviewer.uniqueName,
		imageUrl: reviewer.imageUrl
	};
}
