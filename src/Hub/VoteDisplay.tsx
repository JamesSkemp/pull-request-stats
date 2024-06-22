import * as React from "react";
import "./VoteDisplay.scss";

export interface VoteDisplayProps {
	vote: number;
}

export function VoteDisplay(props: VoteDisplayProps): JSX.Element {
	const vote = props.vote;
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
				<svg className={'vote-' + vote} height="16" role="img" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg"><desc>No review yet</desc><circle cx="8" cy="8" r="7" fill="#fff"></circle><path fillRule="evenodd" clipRule="evenodd" d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm0-1.5a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13z"></path></svg>
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
