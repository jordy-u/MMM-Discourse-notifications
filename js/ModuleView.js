module.exports =
class ModuleView {

	postContentManager;

	/**
	 * @param {PostContentManager} postContentManager
	 */
	constructor(postContentManager) {
		this.postContentManager = postContentManager;
		console.log("Moduleview created.");
	}

	showNextNotification() {
	}

	/**
	 * @param {JSON[]} listOfNotifications
	 * @param {JSON[]} listOfLikes
	 */
	setListOfNotifications(listOfNotifications, listOfLikes) {
		console.log("listOfNotifications");
		console.log(listOfNotifications);
		console.log("listOfLikes");
		console.log(listOfLikes);
		console.log("setListOfNotifications --end--");
		this.logContent();
		setTimeout(() => this.logContent(), 3000);
	}

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

	logContent() {
		console.log("logContent()");
		console.log(this.postContentManager.getPostContent(6194, 3878));
	}

};