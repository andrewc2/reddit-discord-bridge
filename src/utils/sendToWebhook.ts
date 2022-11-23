import { config } from "./config.ts";
import fetchSubredditData from "./fetchSubredditData.ts";

const sendToWebhook = async (subreddit: string) => {
	const data = await fetchSubredditData(subreddit);

	if (data) {
		const embed = {
			title:
				data.title.length >= 100
					? data.title.substring(0, 100) + "..."
					: data.title,
			description: data.spoiler
				? "This post is a spoiler"
				: data.selftext.length >= 200
				? data.selftext.substring(0, 200) + "..."
				: data.selftext,
			url: `https://reddit.com${data.permalink}`,
			color: 15158332,
			author: {
				name: `Post from r/RandomActsofSwift by: ${data.author}`,
				url: `https://reddit.com/u/${data.permalink}`
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
