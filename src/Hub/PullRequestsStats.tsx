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
				titleProps={{ text: `Stats for ${this.typedPullRequests.length} pull requests`, ariaLevel: 2 }}>
				<section>
					<h3>Authors</h3>
					<div>
						{[...pullRequestCreators.keys()].map(prc => {
							let creator = pullRequestCreators.get(prc);
							if (creator) {
								return (
									<div>
										<img src={creator[0].createdByImageUrl} alt="" /> {creator[0].createdByDisplayName} = {creator.length}
									</div>
								);
							} else {
								return null;
							}
						})}
					</div>
					TODO
				</section>
			</Card>
		);
	}

	private getPullRequestCreators(pullRequests: IPullRequest[]): Map<string, IPullRequest[]> {
		const map = new Map();
		pullRequests.forEach((pr) => {
			const key = pr.createdById;
			const collection = map.get(key);
			if (!collection) {
				map.set(key, [pr]);
			} else {
				collection.push(pr);
			}
		});
		return map;
	}
}
