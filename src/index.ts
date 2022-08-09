import { readFileSync, writeFileSync } from "fs";
import packagejson from "../package.json" assert { type: "json" };

type Config = { subreddit_name: string; discord_webhook_url: string };

const config = () => {
	const path =
		process.env.NODE_ENV === "development"
			? "./data/config.dev.json"
			: "./data/config.json";
	const data: Config[] | Config = JSON.parse(readFileSync(path, "utf8"));

	return process.env.NODE_ENV === "development"
		? ([data] as Config[])
		: (data as Config[]);
};

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

const sendToWebhook = async (subreddit: string) => {
	const { title, spoiler, selftext, thumbnail, permalink, author } =
		await fetchSubredditData(subreddit);

	let embed = {
		title,
		description: spoiler
			? "This post is a spoiler"
			: (selftext.length >= 200 ? selftext.substring(0, 200) + "..." : selftext),
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

	await fetch(config()[0].discord_webhook_url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			embeds: [embed],
		}),
	}).catch(console.error);
};

const checkLastPost = async (subreddit: string, id: string) => {
	try {
		const data = await readFileSync("./data/subreddits.json", "utf8");

		let parsed: Map<string, string> = JSON.parse(data);

		if (parsed.get(subreddit) === id) return true;
		else return false;
	} catch (e: any) {
		if (e.code === "ENOENT") {
			fetchSubredditData(subreddit).then(async (data) => {
				sendToWebhook(subreddit);
				writeFileSync(
					"./data/subreddits.json",
					`{"${subreddit}": "${data.id}"}`,
					"utf8"
				);
			});
		}
	}
};

console.info(`Version: ${packagejson.version}`);

fetchSubredditData(config()[0].subreddit_name).then(async (data) => {
	if (await checkLastPost(config()[0].subreddit_name, data.id)) {
		await sendToWebhook(config()[0].subreddit_name);
		writeFileSync(
			"./data/subreddits.json",
			JSON.stringify({
				[config()[0].subreddit_name]: data.id,
			})
		);
	}
});

setInterval(() => {
	fetchSubredditData(config()[0].subreddit_name).then(async (data) => {
		if (await checkLastPost(config()[0].subreddit_name, data.id)) {
			await sendToWebhook(config()[0].subreddit_name);
			writeFileSync(
				"./data/subreddits.json",
				JSON.stringify({
					[config()[0].subreddit_name]: data.id,
				})
			);
		}
	});
}, 60000);
