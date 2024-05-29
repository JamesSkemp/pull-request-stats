import * as React from "react";
import "./PullRequestsListing.scss";
import { Card } from "azure-devops-ui/Card";
import { IPullRequest } from "./HubInterfaces";
import { getTypedPullRequest } from "./HubUtil";
import { GitPullRequest } from "azure-devops-extension-api/Git";
import { VoteDisplay } from "./VoteDisplay";

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

		const pullRequestsDisplay = this.typedPullRequests.map(pr => {
			const now = new Date();
			const diffTime = Math.abs(now.getTime() - pr.creationDate.getTime());
			const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
			const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
			const statusClass = pr.isDraft ? 'pr-status-draft' : 'pr-status-active';
			return (
				<div>
					<a href={pr.url.replace('_apis/git/repositories', '_git').replace('/pullRequests/', '/pullrequest/')} target="_blank">{pr.title}</a> ({pr.repositoryName})<br />
					<div className={statusClass + ' pr-status'}>
						<div>
							{pr.isDraft ? 'Draft' : 'Active'}
						</div>
					</div>
					Created {pr.creationDate.toLocaleString()} by {pr.createdByDisplayName}<br />
					{pr.sourceRefName} into {pr.targetRefName}<br />
					Open for {diffTime} milliseconds / {diffHours} hours / {diffDays} days.<br />
					{pr.reviewers.map(r => {
						return <span className="reviewer"><VoteDisplay vote={r.vote} /> <img src={r.imageUrl} alt="" /> {r.displayName} {r.hasDeclined} {r.isFlagged}</span>;
					})}
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
