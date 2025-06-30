/* eslint-disable react/jsx-no-target-blank */
import * as React from "react";
import "./PullRequests.scss";
import { IPullRequest } from "./HubInterfaces";
import { VoteDisplay } from "./VoteDisplay";
import { PullRequestStatus } from "azure-devops-extension-api/Git";
import { Icon } from "azure-devops-ui/Icon";

export interface PullRequestsProps {
	pullRequests: IPullRequest[] | undefined;
	heading: string;
}

export class PullRequests extends React.Component<PullRequestsProps> {
	private typedPullRequests: IPullRequest[] = [];

	constructor(props: PullRequestsProps) {
		super(props);
	}

	getClosedDateDisplay(pullRequest: IPullRequest): JSX.Element | null {
		const closedDate = pullRequest.closedDate;
		const mergeStatus = pullRequest.status;

		if (mergeStatus == PullRequestStatus.Abandoned) {
			return (
				<React.Fragment>
					<div className="pr-status pr-status-abandoned"><div>Abandoned</div></div> {closedDate ? closedDate.toLocaleString() : ''}<br />
				</React.Fragment>
			);
		} else if (pullRequest.isDraft) {
			return (
				<React.Fragment>
					<div className="pr-status pr-status-draft"><div>Draft</div></div><br />
				</React.Fragment>
			);
		} else if (mergeStatus === PullRequestStatus.Active) {
			return (
				<React.Fragment>
					<div className="pr-status pr-status-active"><div>Active</div></div><br />
				</React.Fragment>
			);
		} else if (!closedDate) {
			return null;
		}
		return (
			<React.Fragment>
				<div className="pr-status pr-status-completed"><div>Completed</div></div> {closedDate.toLocaleString()}<br />
			</React.Fragment>
		);
	}

	public render(): JSX.Element | null {
		if (this.props.pullRequests?.length) {
			this.typedPullRequests = this.props.pullRequests;
		} else {
			this.typedPullRequests = [];
		}

		if (!this.typedPullRequests.length) {
			return null;
		}

		const pullRequestsDisplay = this.typedPullRequests.map(pr => {
			return (
				<div key={pr.pullRequestId}>
					<a href={pr.url.replace('_apis/git/repositories', '_git').replace('/pullRequests/', '/pullrequest/')} target="_blank">{pr.title}</a> ({pr.repositoryName})<br />
					Created {pr.creationDate.toLocaleString()} by <span className="creator"><img src={pr.createdByImageUrl} alt="" /> {pr.createdByDisplayName}</span><br />
					{this.getClosedDateDisplay(pr)}
					<span><Icon iconName="OpenSource" /> {pr.sourceRefName.replace('refs/heads/', '')} into <Icon iconName="GitGraph" /> {pr.targetRefName.replace('refs/heads/', '')}</span><br />
					{pr.reviewers.map(r => {
						return <span className="reviewer" key={r.id}><VoteDisplay vote={r.vote} /> <img src={r.imageUrl} alt="" /> {r.displayName} {r.hasDeclined} {r.isFlagged}</span>;
					})}
				</div>
			)
		});

		return (
			<div>
				<h3>{this.props.heading}</h3>
				<section className="pull-requests">
					{pullRequestsDisplay}
				</section>
			</div>
		);
	}
}
