import * as React from "react";
import "./PullRequestsListing.scss";
import { Card } from "azure-devops-ui/Card";
import { IPullRequest } from "./HubInterfaces";
import { getTypedPullRequest } from "./HubUtil";
import { GitPullRequest } from "azure-devops-extension-api/Git";

export interface PullRequestsListingProps {
	pullRequests: GitPullRequest[];
	title: string;
}

export class PullRequestsListing extends React.Component<PullRequestsListingProps> {
	private typedPullRequests: IPullRequest[] = [];

	constructor(props: PullRequestsListingProps) {
		super(props);
	}

	public render(): JSX.Element {
		if (this.props.pullRequests.length) {
			this.typedPullRequests = this.props.pullRequests.map(pr => getTypedPullRequest(pr));
		} else {
			this.typedPullRequests = [];
		}

		if (!this.typedPullRequests?.length) {
			return (
				<Card className="pull-request-listing"
					titleProps={{ text: this.props.title, ariaLevel: 2 }}>
					<section>
						<p>There are no matching pull requests.</p>
					</section>
				</Card>
			);
		}

		console.table(this.typedPullRequests);

		const pullRequestsDisplay = this.typedPullRequests.map(pr => {
			return (
				<div>
					<a href={pr.url.replace('_apis/git/repositories', '_git').replace('/pullRequests/', '/pullrequests/')}>{pr.title}</a>
				</div>
			);
		});

		return (
			<Card className="pull-request-listing"
				titleProps={{ text: this.props.title, ariaLevel: 2 }}>
				<section>
					{pullRequestsDisplay}
				</section>
			</Card>
		);
	}
}
