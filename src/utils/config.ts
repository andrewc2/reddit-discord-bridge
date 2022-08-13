import { readFileSync } from "fs";

export type Config = { subreddit_name: string; discord_webhook_url: string };

export const config = () => {
	const path =
		process.env.NODE_ENV === "development"
			? "./data/config.dev.json"
			: "./data/config.json";
	const data: Config[] | Config = JSON.parse(readFileSync(path, "utf8"));

	return process.env.NODE_ENV === "development"
		? ([data] as Config[])
		: (data as Config[]);
};
