/* global Module */
Module.register("MMM-Discourse-notifications", {
	defaults: {
		showIcon: true,
		showDurationSeconds : 6,
		updateNotificationsAfterSeconds : 60,
	},

	start: function (){
		this.element = document.createElement("div");
		//A unique ID is needed, so multiple instances of this module can be used.
		this.id = Math.random().toString(36).substr(2, 9);
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
			{
				const newPayload = {
					id : this.id,
					config : this.config
				};
				this.sendSocketNotification("ENABLE_SOCKET_COMMUNICATION", newPayload);
			}
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
		case "NEXT_NOTIFICATION":
			console.log("received: NEXT_NOTIFICATION");
			if (payload.id === this.id) {
				this.element.innerHTML = payload.HTML;
			}
			break;
		}
	},

});

