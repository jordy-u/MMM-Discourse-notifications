const NodeHelper = require("node_helper");

const ApiKeyChecker = require("./js/ApiKeyChecker");
const PostContentManager = require("./js/PostContentManager");
const DiscourseRequestHandler = require("./js/DiscourseRequestHandler");
const NotificationManager = require("./js/NotificationManager");
const ModuleView = require("./js/ModuleView");
//------
//FIXME make the userApiKey a config.json option
const userApiKey = "8be955bf6d546c5757bf814e59ca5c51";
let apiKeyChecker = new ApiKeyChecker();
const apiKeyCheck = apiKeyChecker.checkDiscourseApiKey(userApiKey);
if (!apiKeyCheck.success) {
	//ModuleView.showError(apiKeyCheck.errorMsg);
}

const site = "meta.discourse.org";
//const site = "www.robotexchange.io";

const robotExchangeConnection = new DiscourseRequestHandler(site, userApiKey);

const postContentManager = new PostContentManager(robotExchangeConnection);

let moduleView;
let nm;

module.exports = NodeHelper.create({
	start: function() {
		console.log("start");

		moduleView = new ModuleView(this, postContentManager, site);
		nm = new NotificationManager(robotExchangeConnection, moduleView, postContentManager);

		this.sendSocketNotification("ADD_FEED", {"test":"test"});
	},

	socketNotificationReceived: function(notification, payload) {
		console.log("notification: "+notification);
		switch(notification) {
		case "DO_YOUR_JOB":
			console.log("Recieved: DO_YOUR_JOB");
			nm.start();
			this.sendSocketNotification("I_DID", "");
			//this.sendSocketNotification("I_DID", moduleView.testFuntionForCall());
			break;
		}
	},

	displayNewNotification: function (moduleView) {
		this.sendSocketNotification("NEXT_NOTIFICATION", moduleView.getNotificationHTML());

	}
	/*sendSocketNotification(){
		if (this.sendSocketNotification("I_DID")) {
			console.log("send notification I DID case");
		} else if (this.sendSocketNotification("I_DID")) {
			console.log("case ADD FEED");
		} else { console.log("None of the cases");
		}
	} */
});