# reddit-discord-bridge
A reddit to discord bridge. Currently, you may only have one subreddit per instance.

## Motivation
I have been using a reddit bot for a while but it is no longer properly maintained so I decided to create this. The way the bridge works is it polls the Reddit API for new posts and then posts them to a Discord channel using Discord webhooks. I may look at converting this to a bot in the future. Since this has no interface, everything must be done through a config file. You can see a sample config file [here](/data/config.json).