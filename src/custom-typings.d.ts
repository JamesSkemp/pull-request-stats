import { GitPullRequest, GitRestClient } from "azure-devops-extension-api/Git";

export declare class CustomExtendedGitRestClient extends GitRestClient {
	getPullRequestsByProject(project: string): Promise<GitPullRequest[]>;
}
