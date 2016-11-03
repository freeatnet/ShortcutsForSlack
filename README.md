# Shortcuts for Slack (Android)
_Open any Slack team or channel directly from your homescreen_

If you use Slack on your phone with multiple teams, you might be familiar
with the painful N-click flow of changing teams and channels. That lengthy
path is kinda silly, if you ask me. Especially considering that Android
enables you to add shortcuts for any app action to your homescreen.

So I built this apps that allows you to put a shortcut to any team or
channel directly onto your homescreen.

<img src="http://imgur.com/R3mfsDk.gif" width="250">

## What it Can Do
  * List teams you add at build time.
  * List channels that are currently active under a team.
  * Let you customize the name of the shortcut.
  * Set the shortcut icon to the team's logo.

## No In-App Authentication

I didn't implement in-app OAuth authentication. Instead, it uses
[development tokens](https://api.slack.com/docs/oauth-test-tokens)
that you can easily generate (and that don't count against the
integrations limits).

You can add the token into [`index.android.js`](index.android.js)'s
aptly-named `DummyTokens`.

If there's demand for in-app authentication, I might add it.

## License
This project's source code is licensed under the
[MIT license](LICENSE.txt). This application is not created by,
affiliated with, or supported by Slack Technologies, Inc.
