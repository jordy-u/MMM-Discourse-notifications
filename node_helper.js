var NodeHelper = require("node_helper")

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
				this.sendSocketNotification("I_DID", payload);
				break
		}
	},

})