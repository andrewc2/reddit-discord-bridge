import fetchSubredditData from './fetchSubredditData.ts';
import sendToWebhook from './sendToWebhook.ts';

const checkLastPost = async (subreddit: string, id: string) => {
	try {
		const data = await Deno.readTextFile('./data/subreddits.json');
		console.log(data);

		const parsed: Map<string, string> = JSON.parse(data);

		if (parsed.get(subreddit) === id) return true;
		else return false;
	} catch (e: any) {
		if (e.code === 'ENOENT') {
			fetchSubredditData(subreddit).then((data: { id: string }) => {
				sendToWebhook(subreddit);
				Deno.writeTextFile(
					'./data/subreddits.json',
					`{"${subreddit}": "${data.id}"}`,
				);
			});
		}
	}
};

export default checkLastPost;
