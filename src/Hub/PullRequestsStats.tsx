import * as React from "react";
import "./PullRequestsStats.scss";
import { GitPullRequest } from "azure-devops-extension-api/Git";
import { IPullRequest } from "./HubInterfaces";
import { Card } from "azure-devops-ui/Card";
import { getTypedPullRequest } from "./HubUtil";
import { PullRequests } from "./PullRequests";

export interface PullRequestsStatsProps {
	pullRequests: GitPullRequest[];
}

export class PullRequestsStats extends React.Component<PullRequestsStatsProps> {
	private typedPullRequests: IPullRequest[] = [];
	private creatorPullRequests: IPullRequest[] = [];
	private repositoryPullRequests: IPullRequest[] = [];
	private finalReviewerPullRequests: IPullRequest[] = [];
	private totalReviewerPullRequests: IPullRequest[] = [];
	private closeTimePullRequests: IPullRequest[] = [];

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


		const pullRequestCreators = this.getPullRequestCreators(this.typedPullRequests);
		const pullRequestRepositories = this.getPullRequestRepositories(this.typedPullRequests);
		const pullRequestFinalReviewers = this.getPullRequestFinalReviewers(this.typedPullRequests);
		const pullRequestTotalReviewers = this.getPullRequestTotalReviewers(this.typedPullRequests);
		const pullRequestCloseTimes = this.getPullRequestCloseTimes(this.typedPullRequests);

		return (
			<Card className="pull-requests-stats"
				titleProps={{ text: `Stats for ${this.typedPullRequests.length} pull requests`, ariaLevel: 2 }}>
				<section className="stat-blocks">
					<section>
						<h3>Authors</h3>
						<p>This tracks who created pull requests.</p>
						<div>
							{[...pullRequestCreators.keys()].sort((a, b) => a.localeCompare(b)).map(prc => {
								let creator = pullRequestCreators.get(prc);
								if (creator) {
									return (
										<div>
											<img src={creator[0].createdByImageUrl} alt="" /> <span>{creator[0].createdByDisplayName}</span> = {creator.length}
										</div>
									);
								} else {
									return null;
								}
							})}
						</div>
					</section>
					<section>
						<PullRequests pullRequests={this.creatorPullRequests} heading="Author Pull Requests"></PullRequests>
					</section>
					<section>
						<h3>Repositories</h3>
						<div>
							{[...pullRequestRepositories.keys()].map(repo => {
								let repository = pullRequestRepositories.get(repo);
								if (repository) {
									return (
										<div>
											<span>{repository[0].repositoryName}</span> = {repository.length}
										</div>
									);
								} else {
									return null;
								}
							})}
						</div>
					</section>
					<section>
						<PullRequests pullRequests={this.repositoryPullRequests} heading="Repository Pull Requests"></PullRequests>
					</section>
					<section>
						<h3>Final Reviewers</h3>
						<p>This tracks how often an individual voted on a closed pull request. This does not track if they ever voted on it, only if they had voted when it was closed.</p>
						<div>
							{[...pullRequestFinalReviewers.keys()].sort((a, b) => a.localeCompare(b)).map(reviewer => {
								let prs = pullRequestFinalReviewers.get(reviewer);
								if (prs) {
									return (
										<div>
											<span>{reviewer}</span> = {prs.length}
										</div>
									);
								} else {
									return null;
								}
							})}
						</div>
					</section>
					<section>
						<PullRequests pullRequests={this.finalReviewerPullRequests} heading="Final Reviewer Pull Requests"></PullRequests>
					</section>
					<section>
						<h3>Total Reviewers</h3>
						<p>This tracks the number of reviewers who were marked as voting on a closed pull request, when it was closed.</p>
						<div>
							{[...pullRequestTotalReviewers.keys()].sort((a, b) => a - b).map(reviewerCount => {
								let count = pullRequestTotalReviewers.get(reviewerCount);
								if (count) {
									return (
										<div>
											<span>{reviewerCount} reviewers</span> = {count.length}
										</div>
									);
								} else {
									return null;
								}
							})}
						</div>
					</section>
					<section>
						<PullRequests pullRequests={this.totalReviewerPullRequests} heading="Total Reviewer Pull Requests"></PullRequests>
					</section>
					<section>
						<h3>Close Time</h3>
						<p>This tracks the amount of time a pull request was open before it was closed. Times are rounded down.</p>
						<div>
							{[...pullRequestCloseTimes.keys()].sort((a, b) => a - b).map(closeTime => {
								let closeTimes = pullRequestCloseTimes.get(closeTime);
								if (closeTimes) {
									if (closeTime >= 1) {
										return (
											<div>
												<span>&lt; {closeTime} day(s)</span> = {closeTimes.length}
											</div>
										);
									} else {
										return (
											<div>
												<span>&lt; {Math.floor(closeTime * 100)} hour(s)</span> = {closeTimes.length}
											</div>
										);
									}
								} else {
									return null;
								}
							})}
						</div>
					</section>
					<section>
						<PullRequests pullRequests={this.closeTimePullRequests} heading="Close Time Pull Requests"></PullRequests>
					</section>
				</section>
			</Card>
		);
	}

	private getPullRequestCreators(pullRequests: IPullRequest[]): Map<string, IPullRequest[]> {
		const map = new Map();
		pullRequests.forEach((pr) => {
			const key = pr.createdByDisplayName;
			const collection = map.get(key);
			if (!collection) {
				map.set(key, [pr]);
			} else {
				collection.push(pr);
			}
		});
		return map;
	}

	private getPullRequestRepositories(pullRequests: IPullRequest[]): Map<string, IPullRequest[]> {
		const map = new Map();
		pullRequests.forEach((pr) => {
			const key = pr.repositoryId;
			const collection = map.get(key);
			if (!collection) {
				map.set(key, [pr]);
			} else {
				collection.push(pr);
			}
		});
		return map;
	}

	private getPullRequestFinalReviewers(pullRequests: IPullRequest[]): Map<string, IPullRequest[]> {
		const map = new Map();
		pullRequests.forEach((pr) => {
			const voters = pr.reviewers.filter(r => r.vote !== 0);
			voters.forEach(v => {
				const collection = map.get(v.displayName);
				if (!collection) {
					map.set(v.displayName, [pr]);
				} else {
					collection.push(pr);
				}
			});
		});
		return map;
	}

	private getPullRequestTotalReviewers(pullRequests: IPullRequest[]): Map<number, IPullRequest[]> {
		const map = new Map();
		pullRequests.forEach((pr) => {
			const voters = pr.reviewers.filter(r => r.vote !== 0);
			const key = voters.length;
			const collection = map.get(key);
			if (!collection) {
				map.set(key, [pr]);
			} else {
				collection.push(pr);
			}
		});
		return map;
	}

	private getPullRequestCloseTimes(pullRequests: IPullRequest[]): Map<number, IPullRequest[]> {
		const map = new Map();
		pullRequests.filter(pr => pr.closedDate !== undefined).forEach(pr => {
			const diffTime = Math.abs(pr.closedDate!.getTime() - pr.creationDate.getTime());
			const msInOneHour = 1000 * 60 * 60;
			const msInOneDay = msInOneHour * 24;
			const diffHours = Math.ceil(diffTime / msInOneHour);
			const diffDays = Math.ceil(diffTime / msInOneDay);
			const key = diffTime >= msInOneDay ? diffDays : diffHours / 100;
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
