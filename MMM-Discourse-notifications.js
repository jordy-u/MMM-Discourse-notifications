/* global Module */
Module.register("MMM-Discourse-notifications", {
	defaults: {
		UserApiKey: "Not defined"
	},

	start: function (){
	},

	getDom: function() {
		let element = document.createElement("div");
		element.innerHTML = "Hello, World! ";
		return element;
	},

	notificationReceived: function(notification, payload, sender) {
		console.log("notification: " + notification);
		switch(notification) {
		case "DOM_OBJECTS_CREATED":
			//Do stuff
			var timer = setInterval(()=>{
				this.sendSocketNotification("DO_YOUR_JOB", this.count);
				this.count++;
			}, 5000);
			break;
		}
	},

	socketNotificationReceived: function(notification, payload) {
		console.log("socketNotificationReceived: " + notification);

		switch(notification) {
		case "I_DID":
			//Do stuff
			console.log("Recieved: I_DID");
			break;
		}
	},

});

