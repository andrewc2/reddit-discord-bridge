import { readFileSync, writeFileSync } from "fs";
import packagejson from "../package.json" assert { type: "json" };
import checkLastPost from "./utils/checkLastPost";
import { config } from "./utils/config";
import fetchSubredditData from "./utils/fetchSubredditData";
import sendToWebhook from "./utils/sendToWebhook";

console.info(`Version: ${packagejson.version}`);

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
