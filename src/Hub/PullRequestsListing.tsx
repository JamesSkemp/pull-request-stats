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

	getVoteDisplay(vote: number): JSX.Element {
		/*
			10 - approved
			5 - approved with suggestions
			0 - no vote
			-5 - waiting for author
			-10 - rejected
		*/
		switch (vote) {
			case 0:
				return (
					<svg className={'vote-' + vote} height="16" role="img" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg"><desc>No review yet</desc><circle cx="8" cy="8" r="7" fill="#fff"></circle><path fill-rule="evenodd" clip-rule="evenodd" d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm0-1.5a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13z"></path></svg>
				);
			case 5:
				return (
					<svg className={'vote-' + vote} height="16" role="img" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg"><desc>Approved with suggestions</desc><circle cx="8" cy="8" r="8"></circle><path d="M6.062 11.144l-.003-.002-1.784-1.785A.937.937 0 1 1 5.6 8.031l1.125 1.124 3.88-3.88A.937.937 0 1 1 11.931 6.6l-4.54 4.54-.004.004a.938.938 0 0 1-1.325 0z" fill="#fff"></path></svg>
				);
			case 10:
				return (
					<svg className={'vote-' + vote} height="16" role="img" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg"><desc>Approved</desc><circle cx="8" cy="8" r="8"></circle><path d="M6.062 11.144l-.003-.002-1.784-1.785A.937.937 0 1 1 5.6 8.031l1.125 1.124 3.88-3.88A.937.937 0 1 1 11.931 6.6l-4.54 4.54-.004.004a.938.938 0 0 1-1.325 0z" fill="#fff"></path></svg>
				);
			case -5:
				return (
					<svg className={'vote-' + vote} height="16" role="img" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg"><desc>Waiting for author</desc><circle cx="8" cy="8" r="8"></circle><path d="M8 3.5a.9.9 0 0 1 .9.9v3.325l2.002 2.001A.9.9 0 1 1 9.629 11L7.408 8.778A.898.898 0 0 1 7.1 8.1V4.4a.9.9 0 0 1 .9-.9z" fill="#fff"></path></svg>
				);
			case -10:
				return (
					<svg className={'vote-' + vote} height="16" role="img" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg"><desc>Rejected</desc><circle cx="8" cy="8" r="8"></circle><path d="M10.984 5.004a.9.9 0 0 1 0 1.272L9.27 7.99l1.74 1.741a.9.9 0 1 1-1.272 1.273l-1.74-1.741-1.742 1.74a.9.9 0 1 1-1.272-1.272l1.74-1.74-1.713-1.714a.9.9 0 0 1 1.273-1.273l1.713 1.713 1.714-1.713a.9.9 0 0 1 1.273 0z" fill="#fff"></path></svg>
				);
			default:
				return (
					<span>{vote.toString()}</span>
				);
		}
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
						return <span className="reviewer">{this.getVoteDisplay(r.vote)} <img src={r.imageUrl} alt="" /> {r.displayName} {r.hasDeclined} {r.isFlagged}</span>;
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
