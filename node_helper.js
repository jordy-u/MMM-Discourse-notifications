const NodeHelper = require("node_helper");

const ApiKeyChecker = require("./js/ApiKeyChecker");
const PostContentManager = require("./js/PostContentManager");
const DiscourseRequestHandler = require("./js/DiscourseRequestHandler");
const NotificationManager = require("./js/NotificationManager");
const ModuleView = require("./js/ModuleView");
//------

const userApiKey = "8be955bf6d546c5757bf814e59ca5c51";
let apiKeyChecker = new ApiKeyChecker();
const apiKeyCheck = apiKeyChecker.checkDiscourseApiKey(userApiKey);
if (!apiKeyCheck.success) {
	//ModuleView.showError(apiKeyCheck.errorMsg);
}

const robotExchangeConnection = new DiscourseRequestHandler("www.robotexchange.io", userApiKey);

const postContentManager = new PostContentManager(robotExchangeConnection);

const moduleView = new ModuleView(postContentManager);

//Check if there are unread notifications.
const nm = new NotificationManager(robotExchangeConnection, moduleView, postContentManager);
nm.start();

module.exports = NodeHelper.create({
	start: function() {
		console.log("start");

		this.sendSocketNotification("ADD_FEED", {"test":"test"});
	},

	socketNotificationReceived: function(notification, payload) {
		console.log("notification: "+notification);
		switch(notification) {
		case "DO_YOUR_JOB":
			console.log("Recieved: DO_YOUR_JOB");
			this.sendSocketNotification("I_DID", moduleView.showExample());
			//this.sendSocketNotification("I_DID", moduleView.testFuntionForCall());
			break;
		}
	},
	/*sendSocketNotification(){
		if (this.sendSocketNotification("I_DID")) {
			console.log("send notification I DID case");
		} else if (this.sendSocketNotification("I_DID")) {
			console.log("case ADD FEED");
		} else { console.log("None of the cases");
		}
	} */
});