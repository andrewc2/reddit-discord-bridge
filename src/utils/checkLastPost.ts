import { readFileSync, writeFileSync } from "fs";
import fetchSubredditData from "./fetchSubredditData";
import sendToWebhook from "./sendToWebhook";

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

export default checkLastPost;
