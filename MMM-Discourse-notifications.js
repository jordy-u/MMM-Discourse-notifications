/* global Module */
Module.register("MMM-Discourse-notifications", {
	defaults: {
		UserApiKey: "Not defined"
	},

	start: function (){
		this.element = document.createElement("div");
		this.element.innerHTML = "Hello, World! ";
	},

	getStyles: function() {
		return ["style.css"];
	},

	getDom: function() {
		this.element.innerHTML = "Loading...";
		return this.element;
	},

	/** Handle received MagicMirror-notifications.
	 * @param {String} notification socket-notification name.
	 * @param {Object} payload Date Any data to be sent alongside the socket-notification. It can by any data type.
	 */
	notificationReceived: function(notification, payload, sender) {
		console.log("notification: " + notification);
		switch(notification) {
		case "DOM_OBJECTS_CREATED":
			//Enable socket communication
			this.sendSocketNotification("DO_YOUR_JOB", this.count);
			break;
		}
	},
	/** Handle received socket-notifications.
	 * @param {String} notification socket-notification name.
	 * @param {Object} payload Date Any data to be sent alongside the socket-notification. It can by any data type.
	 */
	socketNotificationReceived: function(notification, payload) {
		console.log("socketNotificationReceived: " + notification);

		switch(notification) {
		case "I_DID":
			//Socket communication enabled
			console.log("received: I_DID");
			break;

		case "NEXT_NOTIFICATION":
			console.log("received: NEXT_NOTIFICATION");
			this.element.innerHTML = payload;

			break;
		}
	},

});

