const fetchSubredditData = async (subreddit: string) => {
	const response = await fetch(
		`https://www.reddit.com/r/${subreddit}/new.json`
	);
	const json: {
		kind: string;
		data: {
			after: string;
			dist: number;
			children: Array<{
				data: {
					author: string;
					post_hint: string;
					id: string;
					title: string;
					spoiler: boolean;
					selftext: string;
					thumbnail: string;
					permalink: string;
				};
			}>;
		};
	} = await response.json();
	return json.data.children[0].data;
};

export default fetchSubredditData;
