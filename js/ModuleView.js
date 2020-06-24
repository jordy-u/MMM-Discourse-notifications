const fs = require('fs')
var document = require('html-element').document;
let listOfNotifications = {
	privateMessages : [
		{
			id : 3662,
			from : "Jordy",
			avatarURL : "https://www.robotexchange.io/user_avatar/www.robotexchange.io/jordy/120/1385_2.png",
			title : "This is a title1",
			message : "Hallo, @João!",
			timestamp : "2020-06-17T20:12"
		},
		{
			id : 3662,
			from : "Jordy",
			avatarURL : "https://www.robotexchange.io/user_avatar/www.robotexchange.io/jordy/120/1385_2.png",
			title : "This is a title2",
			message : "Hallo, @João!",
			timestamp : "2020-06-17T20:12"
		}
	]
	/*mentions : {},
	likes : {},
	replies : {},
	groupMentionInPrivateThread : {},
	otherNotifications : {}*/
};

module.exports =
class ModuleView {

	postContentManager;
	moduleHTML;


	/**
	 * @param {PostContentManager} postContentManager
	 */
	constructor(postContentManager) {
		this.postContentManager = postContentManager;
		console.log("Moduleview created.");
		this.listOfNotifications = listOfNotifications;
		//HTML script
		console.log(this.listOfNotifications);
	}

	showExample() {

		const notificationContent = this.postContentManager.getPostContent(1240, 3878)
		console.warn(notificationContent);

		/*let htmlstring =
			"<img id=\"thuasLogo\"></img>" +
			"<div id=\"messageContainer\">" +
			" <div id=\"titleContainer\">" +
			"   <img id=\"userAvatar\"></img>" +
			"   <span id=\"userId\"></span>" +
			" </div>" +
			" <div id=\"message\"></div>" +
			"</div>";*/


		// Create my module container
		let moduleContainer = document.createElement("div");
		moduleContainer.setAttribute("id", "myModuleContainer");

		// Create thuas logo
		let logo = document.createElement("img");
		logo.setAttribute("id", "logo");
		// Update logo value
		logo.src = "https://media-exp1.licdn.com/dms/image/C4D0BAQFtr7VqGaVWcQ/company-logo_200_200/0?e=2159024400&v=beta&t=sUoUFDyU6baKqslxF0C2oT5OI8aAbqDnOmpTVbaVoPo";

		// Create message container
		let messageContainer = document.createElement("div");
		messageContainer.setAttribute("id", "messageContainer");

		// Create title container
		let titleContainer = document.createElement("div");
		titleContainer.setAttribute("id", "titleContainer");

		// Create User avatar
		let userAvatar = document.createElement("img");
		userAvatar.setAttribute("id", "userAvatar");
		// Update user avatar value
		userAvatar.src = "https://www.kindpng.com/picc/m/78-786207_user-avatar-png-user-avatar-icon-png-transparent.png";

		// Create Notification Header
		let notificationHeader = document.createElement("div");
		notificationHeader.setAttribute("id", "notificationHeader")
		// Update value for user id
		notificationHeader.innerHTML = "notificationHeader notificationHeader notificationHeader notificationHeader notificationHeader";

		// Create message
		let message = document.createElement("div");
		message.setAttribute("id", "message");
		// Update message value
		message.innerHTML = "message its a message, how long should it be???? Maybe longer... but how longer  Maybe longer... but how longer  Maybe longer... but how longer  Maybe longer... but how longer";


		// Set the children for elements

		moduleContainer.appendChild(logo);
		moduleContainer.appendChild(messageContainer);


		messageContainer.appendChild(titleContainer);
		messageContainer.appendChild(message);

		titleContainer.appendChild(userAvatar);
		titleContainer.appendChild(notificationHeader);



		//messageContainer.append(titleContainer, userAvatar, userId);
		//moduleElement.append(logo, messageContainer, message);

		/*let p = document.createElement("p");
		p.innerHTML = "this is a test";
		element.appendChild(p);
		console.log(element.outerHTML); //output = <div><p>this is a test</p></div>
		console.log(p.outerHTML); //output = <p>this is a test</p>*/
		//this.moduleHTML = this.element;

		/* = "Bonjour thats my id";
		document.getProperty("thuasLogo").src = "https://media-exp1.licdn.com/dms/image/C4D0BAQFtr7VqGaVWcQ/company-logo_200_200/0?e=2159024400&v=beta&t=sUoUFDyU6baKqslxF0C2oT5OI8aAbqDnOmpTVbaVoPo" ;
		getProperty("userAvatar").src = "https://www.kindpng.com/picc/m/78-786207_user-avatar-png-user-avatar-icon-png-transparent.png" ;
		getProperty("message").innerHTML ="This is the message we want to display. This is the message we want to display. This is the message we want to display." ;
		*/
		console.log("SHOW EXAMPLE FUNCTION");

		return moduleContainer.outerHTML;
	};

	showNextNotification() {
	}

	/**
	 * @param {JSON[]} listOfNotifications
	 * @param {JSON[]} listOfLikes
	 */

	/*setListOfNotifications(listOfNotifications, listOfLikes) {
		console.log("listOfNotifications");
		console.log(listOfNotifications);
		console.log("listOfLikes");
		console.log(listOfLikes);
		console.log("setListOfNotifications --end--");
	}*/
	/**
	 * @param {string} message
	 */
	showError(message) {
		console.error("Error!");
		console.error(message);
	}

	/**
	 * @param {JSON} userSession
	 */
	showLoggedInUser(userSession) {
		console.log("userSession");
		console.log(userSession);
	}

	//test function
	logContent() {
		console.log("logContent()");
		console.log(this.postContentManager.getPostContent(1240, 3878));
	}

};



