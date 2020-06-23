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
		this.element.innerHTML = "Hello, getDom! ";
		return this.element;
	},

	notificationReceived: function(notification, payload, sender) {
		console.log("notification: " + notification);
		switch(notification) {
		case "DOM_OBJECTS_CREATED":
			//Do stuff
			var timer = setInterval(()=>{
				this.sendSocketNotification("DO_YOUR_JOB", this.count);
				this.count++;
			}, 6000);
			break;
		}
	},

	socketNotificationReceived: function(notification, payload) {
		console.log("socketNotificationReceived: " + notification);

		switch(notification) {
		case "I_DID":
			//Do stuff

			console.log("Recieved: I_DID");
			this.element.innerHTML = payload;

			break;
		}
	},

});

