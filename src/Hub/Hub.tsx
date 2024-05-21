import "azure-devops-ui/Core/override.css";
import "./Hub.scss";

import * as React from "react";
import * as SDK from "azure-devops-extension-sdk";

import { showRootComponent } from "../Common";

import { Page } from "azure-devops-ui/Page";
import { Header } from "azure-devops-ui/Header";
import { CommonServiceIds, IGlobalMessagesService, IProjectInfo, IProjectPageService, getClient } from "azure-devops-extension-api";
import { GitPullRequestSearchCriteria, GitRestClient, PullRequestStatus } from "azure-devops-extension-api/Git";
import { CustomExtendedGitRestClient } from "../custom-typings";
import { IPullRequest } from "./HubInterfaces";
import { getTypedPullRequest } from "./HubUtil";



interface IHubContentState {

}

class HubContent extends React.Component<{}, IHubContentState> {
	private project: IProjectInfo | undefined;

	constructor(props: {}) {
		super(props);

		this.state = {};
	}

	public componentDidMount(): void {
		SDK.init();
		this.getCustomData();
	}

	public render(): JSX.Element {
		return (
			<Page>
				<Header title="Pull Request Stats" />
				TODO
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

		console.log(this.project);

		const gitClient = getClient(GitRestClient) as CustomExtendedGitRestClient;
		let openPullRequests = await gitClient.getPullRequestsByProject(this.project.id);
		// TODO will need to pull and loop through more results.
		let thing2 = await gitClient.getPullRequestsByProject(this.project.id, { status: PullRequestStatus.All }, undefined, undefined, 50);

		if (!openPullRequests) {
			this.showToast('No open pull requests found for this project.');
		}
		if (!thing2) {
			this.showToast('No pull requests found for this project.');
		}

		if (!openPullRequests && !thing2) {
			return;
		}

		console.log(openPullRequests);
		console.table(openPullRequests);
		console.log(thing2);

		const typedPullRequests: IPullRequest[] = thing2.map(pr => getTypedPullRequest(pr));
		console.log(typedPullRequests);
		console.table(typedPullRequests);

		//const repoService = await SDK.getService<IRepo

		//CommonServiceIds.

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
