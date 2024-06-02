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

	getClosedDateDisplay(closedDate: Date | undefined, mergeStatus: PullRequestStatus): JSX.Element | null {
		if (!closedDate) {
			return null;
		}
		if (mergeStatus == PullRequestStatus.Abandoned) {
			return (
				<React.Fragment>
					Abandoned {closedDate.toLocaleString()}<br />
				</React.Fragment>
			);
		}
		return (
			<React.Fragment>
				Completed {closedDate.toLocaleString()}<br />
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
				<div>
					<a href={pr.url.replace('_apis/git/repositories', '_git').replace('/pullRequests/', '/pullrequest/')} target="_blank">{pr.title}</a> ({pr.repositoryName})<br />
					Created {pr.creationDate.toLocaleString()} by <span className="creator"><img src={pr.createdByImageUrl} alt="" /> {pr.createdByDisplayName}</span><br />
					{this.getClosedDateDisplay(pr.closedDate, pr.status)}
					<Icon iconName="OpenSource" /> {pr.sourceRefName.replace('refs/heads/', '')} into <Icon iconName="GitGraph" /> {pr.targetRefName.replace('refs/heads/', '')}<br />
					{pr.reviewers.map(r => {
						return <span className="reviewer"><VoteDisplay vote={r.vote} /> <img src={r.imageUrl} alt="" /> {r.displayName} {r.hasDeclined} {r.isFlagged}</span>;
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
