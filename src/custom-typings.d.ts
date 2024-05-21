import { GitPullRequest, GitRestClient, PullRequestStatus } from "azure-devops-extension-api/Git";

export declare class CustomExtendedGitRestClient extends GitRestClient {
	getPullRequestsByProject(project: string): Promise<GitPullRequest[]>;
	getPullRequestsByProject(project: string, searchCriteria: CustomExtendedGitPullRequestSearchCriteria, maxCommentLength?: number, skip?: number, top?: number): Promise<GitPullRequest[]>;
}

export interface CustomExtendedGitPullRequestSearchCriteria {
    /**
     * If set, search for pull requests that were created by this identity.
     */
    //creatorId: string;
    /**
     * Whether to include the _links field on the shallow references
     */
    //includeLinks: boolean;
    /**
     * If specified, filters pull requests that created/closed before this date based on the queryTimeRangeType specified.
     */
    //maxTime: Date;
    /**
     * If specified, filters pull requests that created/closed after this date based on the queryTimeRangeType specified.
     */
    //minTime: Date;
    /**
     * The type of time range which should be used for minTime and maxTime. Defaults to Created if unset.
     */
    //queryTimeRangeType: PullRequestTimeRangeType;
    /**
     * If set, search for pull requests whose target branch is in this repository.
     */
    //repositoryId: string;
    /**
     * If set, search for pull requests that have this identity as a reviewer.
     */
    //reviewerId: string;
    /**
     * If set, search for pull requests from this branch.
     */
    //sourceRefName: string;
    /**
     * If set, search for pull requests whose source branch is in this repository.
     */
    //sourceRepositoryId: string;
    /**
     * If set, search for pull requests that are in this state. Defaults to Active if unset.
     */
    status: PullRequestStatus;
    /**
     * If set, search for pull requests into this branch.
     */
    //targetRefName: string;
}
