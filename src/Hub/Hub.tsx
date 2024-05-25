import "azure-devops-ui/Core/override.css";
import "./Hub.scss";

import * as React from "react";
import * as SDK from "azure-devops-extension-sdk";

import { showRootComponent } from "../Common";

import { Page } from "azure-devops-ui/Page";
import { Header } from "azure-devops-ui/Header";
import { CommonServiceIds, IGlobalMessagesService, IProjectInfo, IProjectPageService, getClient } from "azure-devops-extension-api";
import { GitPullRequest, GitRestClient, PullRequestStatus } from "azure-devops-extension-api/Git";
import { CustomExtendedGitRestClient } from "../custom-typings";
import { PullRequestsListing } from "./PullRequestsListing";
import { PullRequestsStats } from "./PullRequestsStats";

interface IHubContentState {
	project: IProjectInfo | undefined;
	openPullRequests: GitPullRequest[];
	allPullRequests: GitPullRequest[];
}

class HubContent extends React.Component<{}, IHubContentState> {
	private project: IProjectInfo | undefined;

	constructor(props: {}) {
		super(props);

		this.state = {
			project: undefined,
			openPullRequests: [],
			allPullRequests: []
		};
	}

	public componentDidMount(): void {
		SDK.init();
		this.getCustomData();
	}

	public render(): JSX.Element {
		return (
			<Page className="pull-request-stats flex-grow">
				<Header title="Pull Request Stats" />
				{this.state.project && <h2>Pull Requests for {this.state.project.name}</h2>}
				<PullRequestsListing pullRequests={this.state.openPullRequests} title="Open Pull Requests" />
				<PullRequestsStats pullRequests={this.state.allPullRequests} />
			</Page>
		);
	}

	private async getCustomData() {
		await SDK.ready();

		const projectService = await SDK.getService<IProjectPageService>(CommonServiceIds.ProjectPageService);
		this.project = await projectService.getProject();

		if (!this.project) {
			this.showToast('No projects found.');
			return;
		}
		this.setState({ project: this.project });

		const gitClient = getClient(GitRestClient) as CustomExtendedGitRestClient;
		let openPullRequests = await gitClient.getPullRequestsByProject(this.project.id);

		if (!openPullRequests) {
			this.showToast('No open pull requests found for this project.');
		} else {
			this.setState({ openPullRequests: openPullRequests });
		}

		// Number of pull requests to pull from the API at once.
		const pullRequestsToPullAtOnce = 100;
		let allPullRequests = await gitClient.getPullRequestsByProject(this.project.id, { status: PullRequestStatus.All }, undefined, undefined, pullRequestsToPullAtOnce);

		if (!allPullRequests) {
			this.showToast('No pull requests found for this project.');
		} else {
			if (allPullRequests.length === pullRequestsToPullAtOnce) {
				let getMorePrs = true;
				let additionalPullRequests: GitPullRequest[] = [];
				while (getMorePrs) {
					additionalPullRequests = await gitClient.getPullRequestsByProject(this.project.id, { status: PullRequestStatus.All }, undefined, allPullRequests.length, pullRequestsToPullAtOnce);
					if (additionalPullRequests) {
						getMorePrs = additionalPullRequests.length === pullRequestsToPullAtOnce;
						allPullRequests.push(...additionalPullRequests);
					} else {
						getMorePrs = false;
					}
				}
			}

			this.setState({ allPullRequests: allPullRequests });
		}
	}

	private showToast = async (message: string): Promise<void> => {
		const globalMessageSvc = await SDK.getService<IGlobalMessagesService>(CommonServiceIds.GlobalMessagesService);
		globalMessageSvc.addToast({
			duration: 3000,
			message: message
		});
	}
}

showRootComponent(<HubContent />);
