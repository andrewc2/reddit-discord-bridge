import { config } from "./config.ts";
import fetchSubredditData from "./fetchSubredditData.ts";

const sendToWebhook = async (subreddit: string) => {
	const { title, spoiler, selftext, thumbnail, permalink, author } =
		await fetchSubredditData(subreddit);

	let embed = {
		title: title.length >= 50 ? title.substring(0, 50) + "..." : title,
		description: spoiler
			? "This post is a spoiler"
			: selftext.length >= 200
			? selftext.substring(0, 200) + "..."
			: selftext,
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
	try {
		await fetch(
			config()[0].discord_webhook_url,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					embeds: [
						embed
					],
				}),
			}
		);
	} catch (err) {
		console.error(err);
	}
};

export default sendToWebhook;
