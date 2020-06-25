[![Build Status](https://travis-ci.org/jordy-u/MMM-Discourse-notifications.svg?branch=master)](https://travis-ci.org/jordy-u/MMM-Discourse-notifications)
# MMM-Discourse-notifications
**Status**: Working and development.
## What is MagicMirror and what is Discourse?
**MagicMirror²** is an open source modular smart mirror platform,
which allows you to convert your hallway or bathroom mirror into your personal assistant.
https://magicmirror.builders/


**Discourse** is an open source Internet forum and mailing list management software application.
It allows communities to have civilised discussions. A few examples of sites that use this, can be viewed here:
https://www.discourse.org/customers

## What will this module do?
This modules integrates Discourse into the MagicMirror. Notifications can be displayed to the user on the mirror.
These notifications can also be viewed on `https://{Discourse site}/u/{your username}/notifications`.
By showing notifications on the mirror, you are always updated. Even when you don't check your mail.

![Alt text](/docs/images/module_preview.png?raw=true "Module preview")

## Setup
You can install the module in one of the 2 ways.
### A: Install using NPM
The NPM package comes soon. For now, use the other method.
### B: Install using Git clone
Go to your modules folder: `{MagicMirrorPath}/modules/` and use:
```
git clone https://github.com/jordy-u/MMM-Discourse-notifications.git
```
### Configuration
Add the following code to `config.json` in `modules[ ... ]`:
```javascript
{
	module: "MMM-Discourse-notifications",
	position: "top_left",
	config: {
		site: "sub.example.com", //If the website does not use a subdomain, try adding 'www.' when the module does not work. 
		userApiKey: "<YOUR API KEY>",
		useIcon: true,
		showDurationSeconds : 6,
		updateNotificationsAfterSeconds : 60,
	}
},
```
### Get an User-Api-Key
To generate a key, install Ruby and follow this tutorial to get one:
https://meta.discourse.org/t/generating-user-api-keys-for-testing/145744

Don't confuse User-Api-Key with Api-Key, which is a key for admins.
Generating User-Api-Keys is allowed by default. If it is not allowed, contact your site admin. 