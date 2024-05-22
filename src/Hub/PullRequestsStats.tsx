import * as React from "react";
import "./PullRequestsStats.scss";
import { GitPullRequest } from "azure-devops-extension-api/Git";
import { IPullRequest } from "./HubInterfaces";
import { Card } from "azure-devops-ui/Card";
import { getTypedPullRequest } from "./HubUtil";

export interface PullRequestsStatsProps {
	pullRequests: GitPullRequest[];
}

export class PullRequestsStats extends React.Component<PullRequestsStatsProps> {
	private typedPullRequests: IPullRequest[] = [];

	constructor(props: PullRequestsStatsProps) {
		super(props);
	}

	public render(): JSX.Element | null {
		if (this.props.pullRequests.length) {
			this.typedPullRequests = this.props.pullRequests.map(pr => getTypedPullRequest(pr));
		} else {
			this.typedPullRequests = [];
		}

		if (!this.typedPullRequests.length) {
			return null;
		}

		console.table(this.typedPullRequests);

		return (
			<Card className="pull-requests-stats"
				titleProps={{ text: 'Stats', ariaLevel: 2 }}>
				<section>
					TODO
				</section>
			</Card>
		);
	}
}
