import { config } from "./config.ts";
import fetchSubredditData from "./fetchSubredditData.ts";

const sendToWebhook = async (subreddit: string) => {
	const data = await fetchSubredditData(subreddit);

	if (data) {
		const embed = {
			title:
				data.title.length >= 50
					? data.title.substring(0, 50) + "..."
					: data.title,
			description: data.spoiler
				? "This post is a spoiler"
				: data.selftext.length >= 200
				? data.selftext.substring(0, 200) + "..."
				: data.selftext,
			url: `https://reddit.com${data.permalink}`,
			color: 0xf78316,
			fields: [
				{
					name: "Post Author",
					value: data.author,
				},
				{
					name: "Post URL",
					value: `https://reddit.com${data.permalink}`,
				},
			],
			author: {
				name: "Reddit-Discord Bridge",
				url: "https://rdb.ludoviko.ch"
			}
		};

		if (data.thumbnail.includes("https://")) {
			Object.assign(embed, { thumbnail: { url: data.thumbnail } });
		}
		try {
			await fetch(config()[0].discord_webhook_url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					embeds: [embed],
				}),
			});
		} catch (err) {
			console.error(err);
		}
	}
};

export default sendToWebhook;
