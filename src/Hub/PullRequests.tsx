import * as React from "react";
import "./PullRequests.scss";
import { IPullRequest } from "./HubInterfaces";

export interface PullRequestsProps {
	pullRequests: IPullRequest[];
	heading: string;
}

export class PullRequests extends React.Component<PullRequestsProps> {
	private typedPullRequests: IPullRequest[] = [];

	constructor(props: PullRequestsProps) {
		super(props);
	}

	public render(): JSX.Element | null {
		if (this.props.pullRequests.length) {
			this.typedPullRequests = this.props.pullRequests;
		} else {
			this.typedPullRequests = [];
		}

		if (!this.typedPullRequests.length) {
			return null;
		}

		const pullRequestsDisplay = this.typedPullRequests.map(pr => {
			return (
				<div>
					{pr.pullRequestId}
				</div>
			)
		});

		return (
			<div>
				<h3>{this.props.heading}</h3>
				{pullRequestsDisplay}
			</div>
		);
	}
}
