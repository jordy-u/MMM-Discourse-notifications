const NodeHelper = require("node_helper");

const ApiKeyChecker = require("./js/ApiKeyChecker");
const PostContentManager = require("./js/PostContentManager");
const DiscourseRequestHandler = require("./js/DiscourseRequestHandler");
const NotificationManager = require("./js/NotificationManager");
const ModuleView = require("./js/ModuleView");

module.exports = NodeHelper.create({
	start: function() {
		console.log("start");
		this.sendSocketNotification("ADD_FEED", {"test":"test"});
	},

	/** Handle received socket-notifications.
	 * @param {String} notification socket-notification name.
	 * @param {Object} payload Date Any data to be sent alongside the socket-notification. It can by any data type.
	 */
	socketNotificationReceived: function(notification, payload) {
		console.log("notification: "+notification);
		switch(notification) {
		case "ENABLE_SOCKET_COMMUNICATION":
			this.config = payload.config;

			{ //This { } block gets rid of the ES-Lint error: Disallow lexical declarations in case/default clauses (no-case-declarations)
				const robotExchangeConnection = new DiscourseRequestHandler(this.config.site, this.config.userApiKey);
				const postContentManager = new PostContentManager(robotExchangeConnection);
				const moduleView = new ModuleView(this, postContentManager, this.config.site, this.config.showIcon, payload.id);

				if (this.config.userApiKey === undefined) {
					moduleView.showError("<a id='important'>userApiKey</a> is not defined in config.js. Read the ReadMe for setup instructions.");
					break;
				}
				if (this.config.site === undefined) {
					moduleView.showError("<a id='important'>site</a> is not defined in config.js. Read the ReadMe for setup instructions.");
					break;
				}

				//Check the API key
				const apiKeyChecker = new ApiKeyChecker();
				const apiKeyCheck = apiKeyChecker.checkDiscourseApiKey(this.config.userApiKey);
				if (!apiKeyCheck.success) {
					moduleView.showError(`<a id='important'>Incorrect API key:</a> ${apiKeyCheck.errorMsg}`);
					break;
				}

				const nm = new NotificationManager(robotExchangeConnection, moduleView, postContentManager);
				nm.start();
			}
			break;
		}
	},

	/** Send the new notification to the mirror.
	 * @param {ModuleView} moduleView The viewer that generates the HTML for the next notification.
	 */
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