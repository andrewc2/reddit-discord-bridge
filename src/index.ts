import configData from "../data/config.dev.json" assert { type: "json" };
type Config = typeof configData;
const config = configData as Config;

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
	console.log(json.data.children[0]);
	return json.data.children[0].data;
};

const sendToWebhook = async (subreddit: string) => {
	const { title, spoiler, selftext, thumbnail, permalink, author } =
		await fetchSubredditData(subreddit);

	let embed = {
		title,
		description: spoiler
			? "This post is a spoiler"
			: selftext.substring(0, 1000),
		url: `https://reddit.com${permalink}`,
		color: 0xf78316,
		fields: [
			{
				name: "Post Author",
				value: author,
			},
			{
				name: "Post URL",
				value: `https://reddit.com${permalink}`,
			},
		],
	};

	if (thumbnail.includes("https://")) {
		Object.assign(embed, { thumbnail: { url: thumbnail } });
	}

	await fetch(config.discord_webhook_url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			embeds: [embed],
		}),
	});
};

sendToWebhook(config.subreddit_name);
