[![Build Status](https://travis-ci.org/jordy-u/MMM-Discourse-notifications.svg?branch=master)](https://travis-ci.org/jordy-u/MMM-Discourse-notifications)
# MMM-Discourse-notifications
For a list of bugs and future features, take a look at [the wiki](https://github.com/jordy-u/MMM-Discourse-notifications/wiki/Bugs-&-coming-features).

## What is MagicMirror and what is Discourse?
**MagicMirror²** is an open source modular smart mirror platform,
which allows you to convert your hallway or bathroom mirror into your personal assistant.
https://magicmirror.builders/


**Discourse** is an open source Internet forum and mailing list management software application.
It allows communities to have civilised discussions. A few examples of sites that use this, can be viewed here:
https://www.discourse.org/customers

## What will this module do?
This module integrates Discourse into the MagicMirror. Notifications can be displayed to the user on the mirror.
These notifications can also be viewed on `https://{Discourse site}/u/{your username}/notifications`.
By showing notifications on the mirror, you are always updated. Even when you don't check your mail.

![Alt text](/docs/images/module_preview.png?raw=true "Module preview")

## Setup
### Update to Node v12+
Check which version of NodeJS you have got with:
```
node --version
```
If you do not have Node V12 or above, you need to update it to make this module work.
For Ubuntu (and Raspbian), to the following ([source]([https://askubuntu.com/questions/426750/how-can-i-update-my-nodejs-to-the-latest-version](https://askubuntu.com/questions/426750/how-can-i-update-my-nodejs-to-the-latest-version))):
```
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
sudo apt-get install -y nodejs
```
### Install the module
You can install the module in one of the 2 ways.
#### A: Install using NPM
The NPM package comes soon. For now, use the other method.
#### B: Install using Git clone
Go to your modules folder: `{MagicMirrorPath}/modules/` and use the follow commands to download the module and its dependencies.
```
git clone https://github.com/jordy-u/MMM-Discourse-notifications.git
cd MMM-Discourse-notifications
npm install
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
		showIcon: true,
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
