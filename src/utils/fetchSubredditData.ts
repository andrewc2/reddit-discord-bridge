import { z } from "https://deno.land/x/zod@v3.18.0/mod.ts";

export const SubredditData = z.object({
	kind: z.string(),
	data: z.object({
		after: z.string(),
		dist: z.number(),
		children: z.array(
			z.object({
				data: z.object({
					id: z.string(),
					title: z.string(),
					author: z.string(),
					spoiler: z.boolean(),
					selftext: z.string(),
					thumbnail: z.string(),
					permalink: z.string(),
				}),
			})
		),
	}),
});

const fetchSubredditData = async (subreddit: string) => {
	const response = await fetch(
		`https://www.reddit.com/r/${subreddit}/new.json`
	);

	const json = SubredditData.parse(await response.json());

	console.log(json.data.children[0].data.id);

	return json.data.children[0].data;
};

export default fetchSubredditData;
