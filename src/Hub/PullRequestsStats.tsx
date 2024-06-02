import * as React from "react";
import * as SDK from "azure-devops-extension-sdk";
import "./PullRequestsStats.scss";
import { GitPullRequest, GitRestClient, PullRequestStatus } from "azure-devops-extension-api/Git";
import { IPullRequest } from "./HubInterfaces";
import { Card } from "azure-devops-ui/Card";
import { getTypedPullRequest } from "./HubUtil";
import { PullRequests } from "./PullRequests";
import { CustomExtendedGitRestClient } from "../custom-typings";
import { CommonServiceIds, IGlobalMessagesService, IProjectInfo, getClient } from "azure-devops-extension-api";
import { Dropdown } from "azure-devops-ui/Dropdown";
import { IListBoxItem } from "azure-devops-ui/ListBox";
import { ListSelection } from "azure-devops-ui/List";

export interface PullRequestsStatsProps {
	project: IProjectInfo | undefined;
}

interface IPullRequestsStatsState {
	pullRequests: GitPullRequest[];
	creatorPullRequests: IPullRequest[];
	repositoryPullRequests: IPullRequest[];
	finalReviewerPullRequests: IPullRequest[];
	totalReviewerPullRequests: IPullRequest[];
	closeTimePullRequests: IPullRequest[];
	selectedFilterId: string;
	selectedFilterText: string;
}

export class PullRequestsStats extends React.Component<PullRequestsStatsProps, IPullRequestsStatsState> {
	private typedPullRequests: IPullRequest[] = [];
	private filteredPullRequests: IPullRequest[] = [];
	private filterSelection = new ListSelection();

	constructor(props: PullRequestsStatsProps) {
		super(props);

		this.state = {
			pullRequests: [],
			creatorPullRequests: [],
			repositoryPullRequests: [],
			finalReviewerPullRequests: [],
			totalReviewerPullRequests: [],
			closeTimePullRequests: [],
			selectedFilterId: '',
			selectedFilterText: ''
		}
	}

	public componentDidMount(): void {
		SDK.init();
		this.getPullRequests();
	}

	public render(): JSX.Element | null {
		if (this.state.pullRequests.length) {
			this.typedPullRequests = this.state.pullRequests.map(pr => getTypedPullRequest(pr));
		} else {
			this.typedPullRequests = [];
		}

		if (!this.typedPullRequests.length) {
			return null;
		}

		const currentDate = new Date();

		switch (this.state.selectedFilterId) {
			case "c100":
				this.filteredPullRequests = this.typedPullRequests.slice(0, 100);
				break;
			case "c200":
				this.filteredPullRequests = this.typedPullRequests.slice(0, 200);
				break;
			case "c500":
				this.filteredPullRequests = this.typedPullRequests.slice(0, 500);
				break;
			case "c1000":
				this.filteredPullRequests = this.typedPullRequests.slice(0, 1000);
				break;
			case "t7days":
				this.filteredPullRequests = this.typedPullRequests
					.filter(pr => pr.creationDate >= new Date(new Date().setDate(currentDate.getDate() - 7)));
				break;
			case "t14days":
				this.filteredPullRequests = this.typedPullRequests
					.filter(pr => pr.creationDate >= new Date(new Date().setDate(currentDate.getDate() - 14)));
				break;
			case "t30days":
				this.filteredPullRequests = this.typedPullRequests
					.filter(pr => pr.creationDate >= new Date(new Date().setDate(currentDate.getDate() - 30)));
				break;
			case "t60days":
				this.filteredPullRequests = this.typedPullRequests
					.filter(pr => pr.creationDate >= new Date(new Date().setDate(currentDate.getDate() - 60)));
				break;
			case "t90days":
				this.filteredPullRequests = this.typedPullRequests
					.filter(pr => pr.creationDate >= new Date(new Date().setDate(currentDate.getDate() - 90)));
				break;
			case "t1year":
				this.filteredPullRequests = this.typedPullRequests
					.filter(pr => pr.creationDate >= new Date(new Date().setFullYear(currentDate.getFullYear() - 1)));
				break;
			case "all":
				this.filteredPullRequests = [...this.typedPullRequests];
				break;
			default:
				this.filteredPullRequests = this.typedPullRequests.slice(0, 100);
				break;
		}

		function filterOptions(): Array<IListBoxItem<{}>> {
			return [
				{ id: "c100", text: "Last 100 pull requests" },
				{ id: "c200", text: "Last 200 pull requests" },
				{ id: "c500", text: "Last 500 pull requests" },
				{ id: "c1000", text: "Last 1000 pull requests" },
				{ id: "t7days", text: "Last 7 days" },
				{ id: "t14days", text: "Last 14 days" },
				{ id: "t30days", text: "Last 30 days" },
				{ id: "t60days", text: "Last 60 days" },
				{ id: "t90days", text: "Last 90 days" },
				{ id: "t1year", text: "Last year" },
				{ id: "all", text: "All pull requests" },
			];
		}

		const pullRequestCreators = this.getPullRequestCreators(this.filteredPullRequests);
		const pullRequestRepositories = this.getPullRequestRepositories(this.filteredPullRequests);
		const pullRequestFinalReviewers = this.getPullRequestFinalReviewers(this.filteredPullRequests);
		const pullRequestTotalReviewers = this.getPullRequestTotalReviewers(this.filteredPullRequests);
		const pullRequestCloseTimes = this.getPullRequestCloseTimes(this.filteredPullRequests);

		return (
			<Card className="pull-requests-stats"
				titleProps={{ text: `Stats for ${this.filteredPullRequests.length} pull requests`, ariaLevel: 2 }}>
				<div>
					<p>Filter stats by the following. <strong>Last X days</strong> filters are based upon creation date.</p>
					<Dropdown
						ariaLabel="Select a filter"
						placeholder="Select a filter"
						items={filterOptions()}
						selection={this.filterSelection}
						onSelect={this.handleFilterSelection}
						dismissOnSelect={true}
						/>
				</div>
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
											<img src={creator[0].createdByImageUrl} alt="" /> <span onClick={() => this.setState({ creatorPullRequests: creator! })}>{creator[0].createdByDisplayName}</span> = {creator.length}
										</div>
									);
								} else {
									return null;
								}
							})}
						</div>
					</section>
					<section>
						<PullRequests pullRequests={this.state.creatorPullRequests} heading="Author Pull Requests"></PullRequests>
					</section>
					<section>
						<h3>Repositories</h3>
						<div>
							{[...pullRequestRepositories.keys()].map(repo => {
								let repository = pullRequestRepositories.get(repo);
								if (repository) {
									return (
										<div>
											<span onClick={() => this.setState({ repositoryPullRequests: repository! })}>{repository[0].repositoryName}</span> = {repository.length}
										</div>
									);
								} else {
									return null;
								}
							})}
						</div>
					</section>
					<section>
						<PullRequests pullRequests={this.state.repositoryPullRequests} heading="Repository Pull Requests"></PullRequests>
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
											<span onClick={() => this.setState({ finalReviewerPullRequests: prs! })}>{reviewer}</span> = {prs.length}
										</div>
									);
								} else {
									return null;
								}
							})}
						</div>
					</section>
					<section>
						<PullRequests pullRequests={this.state.finalReviewerPullRequests} heading="Final Reviewer Pull Requests"></PullRequests>
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
											<span onClick={() => this.setState({ totalReviewerPullRequests: count! })}>{reviewerCount} reviewers</span> = {count.length}
										</div>
									);
								} else {
									return null;
								}
							})}
						</div>
					</section>
					<section>
						<PullRequests pullRequests={this.state.totalReviewerPullRequests} heading="Total Reviewer Pull Requests"></PullRequests>
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
												<span onClick={() => this.setState({ closeTimePullRequests: closeTimes! })}>&lt; {closeTime} day(s)</span> = {closeTimes.length}
											</div>
										);
									} else {
										return (
											<div>
												<span onClick={() => this.setState({ closeTimePullRequests: closeTimes! })}>&lt; {Math.floor(closeTime * 100)} hour(s)</span> = {closeTimes.length}
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
						<PullRequests pullRequests={this.state.closeTimePullRequests} heading="Close Time Pull Requests"></PullRequests>
					</section>
				</section>
			</Card>
		);
	}

	private async getPullRequests() {
		let projectId = '';
		if (this.props.project) {
			projectId = this.props.project.id;
		} else {
			return;
		}

		await SDK.ready();

		const gitClient = getClient(GitRestClient) as CustomExtendedGitRestClient;

		// Number of pull requests to pull from the API at once.
		let pullRequestsToPullAtOnce = 250;

		let allPullRequests = await gitClient.getPullRequestsByProject(projectId, { status: PullRequestStatus.All }, undefined, undefined, pullRequestsToPullAtOnce);

		if (!allPullRequests) {
			this.showToast('No pull requests found for this project.');
		} else {
			if (allPullRequests.length === pullRequestsToPullAtOnce) {
				// Set this to false for faster development. Otherwise set to true to pull all pull requests.
				let getMorePrs = true;
				let additionalPullRequests: GitPullRequest[] = [];
				while (getMorePrs) {
					additionalPullRequests = await gitClient.getPullRequestsByProject(projectId, { status: PullRequestStatus.All }, undefined, allPullRequests.length, pullRequestsToPullAtOnce);
					if (additionalPullRequests) {
						getMorePrs = additionalPullRequests.length === pullRequestsToPullAtOnce;
						allPullRequests.push(...additionalPullRequests);
					} else {
						getMorePrs = false;
					}
				}
			}

			this.setState({ pullRequests: allPullRequests });
		}
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

	private handleFilterSelection = (_events: React.SyntheticEvent<HTMLElement>, item: IListBoxItem<{}>): void => {
		this.setState({
			selectedFilterId: item.id
		});
		this.setState({
			selectedFilterText: item.text ?? ''
		});

		this.setState({ creatorPullRequests: [] });
		this.setState({ repositoryPullRequests: [] });
		this.setState({ finalReviewerPullRequests: [] });
		this.setState({ totalReviewerPullRequests: [] });
		this.setState({ closeTimePullRequests: [] });
	}

	private showToast = async (message: string): Promise<void> => {
		const globalMessageSvc = await SDK.getService<IGlobalMessagesService>(CommonServiceIds.GlobalMessagesService);
		globalMessageSvc.addToast({
			duration: 3000,
			message: message
		});
	}
}
