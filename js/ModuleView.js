const _ = require('underscore')
var document = require('html-element').document;
const Node_Helper = require("./../node_helper");
const NotificationType = require("./NotificationType");
const GetFavicons = require('get-website-favicon')

module.exports =
class ModuleView {

	node_helper;
	postContentManager;
	nextNotificationTimer;
	site;
	id;

	//List of all notifications and likes to be shown.
	listOfNotifications;
	listOfLikes;

	//List of notifications and likes that have not been shown already.
	queuedNotifications;
	queuedLikes;

	//HTML element
	moduleContainer;
	notificationHeader;
	message;
	userAvatar;


	/**
	 * @param {Node_Helper} node_helper
	 * @param {PostContentManager} postContentManager
	 * @param {String} site
	 * @param {boolean} showIcon When true, the favicon of the website is shown next to the notifications.
	 * @param {String} id Random generated ID. Now multiple instances of the module can be used.
	 * @param {int} showDurationSeconds How long a notification should stay on the screen before being refreshed.
	 */
	constructor(node_helper, postContentManager, site, showIcon, id, showDurationSeconds) {
		this.node_helper = node_helper;
		this.postContentManager = postContentManager;
		this.site = site;
		this.id = id;
		this.showDurationSeconds = showDurationSeconds;

		// Create my module container
		this.moduleContainer = document.createElement("div");
		this.moduleContainer.setAttribute("id", "myModuleContainer");

		let logo;
		if (showIcon) {
			logo = document.createElement("img");
			logo.setAttribute("id", "logo");
			GetFavicons(site).then(data=>{
				logo.src = data.icons[1].src;
				this.node_helper.displayNewNotification(this);
			});
		}

		// Create message container
		let messageContainer = document.createElement("div");
		messageContainer.setAttribute("id", "messageContainer");

		// Create title container
		let titleContainer = document.createElement("div");
		titleContainer.setAttribute("id", "titleContainer");

		// Create User avatar
		this.userAvatar = document.createElement("img");
		this.userAvatar.setAttribute("id", "userAvatar");

		// Create Notification Header
		this.notificationHeader = document.createElement("div");
		this.notificationHeader.setAttribute("id", "notificationHeader")
		// Update value for user id
		this.notificationHeader.innerHTML = "...";

		// Create message
		this.message = document.createElement("div");
		this.message.setAttribute("id", "message");
		this.message.innerHTML = "...";

		// Set the children for elements
		if (showIcon) this.moduleContainer.appendChild(logo);
		this.moduleContainer.appendChild(messageContainer);
		messageContainer.appendChild(titleContainer);
		messageContainer.appendChild(this.message);
		titleContainer.appendChild(this.userAvatar);
		titleContainer.appendChild(this.notificationHeader);
	}
	/** Return the HTML-string of the current notification
	 */
	getNotificationHTML() {
		return {
			id : this.id,
			HTML: this.moduleContainer.outerHTML
		};
	};

	/** Prepare the next notification and show it on the viewer.
	 */
	showNextNotification() {

		if (_.isEmpty(this.queuedNotifications)) {
			//Copy all notifications to the queue.
			this.queuedNotifications = [...this.listOfNotifications];
		}

		let avatarUrl = "";
		let notificationHeaderText = "header";
		let messageText = "text";

		const nextNotification = this.queuedNotifications[0];
		let notificationContent;
		if (nextNotification.topic_id !== null) {
			notificationContent = this.postContentManager.getPostContent(nextNotification.topic_id, nextNotification.data.original_post_id);
			if (typeof notificationContent !== "object") {
				return;
			}
			avatarUrl = this.prepareAvatarUrl(notificationContent.avatar_template);
		}

		//Remove notification from queue.
		this.queuedNotifications.shift();

		switch(nextNotification.notification_type) {
		case NotificationType.mentioned:
			notificationHeaderText = `<a id='username'>${nextNotification.data.original_username}</a> mentioned you in: <a id='important'>${nextNotification.data.topic_title}</a>`;
			messageText = notificationContent.cooked.replace(/<\/?[^>]+(>|$)/g, "");
			break;
		case NotificationType.private_message:
			notificationHeaderText = `<a id='username'>${nextNotification.data.original_username}</a> sent you a message in: <a id='important'>${nextNotification.data.topic_title}</a>`;
			messageText = notificationContent.cooked.replace(/<\/?[^>]+(>|$)/g, "");
			break;
		case NotificationType.posted:
			notificationHeaderText = `<a id='username'>${nextNotification.data.original_username}</a> posted a message in: <a id='important'>${nextNotification.data.topic_title}</a>`;
			messageText = notificationContent.cooked.replace(/<\/?[^>]+(>|$)/g, "");
			break;
		case NotificationType.granted_badge:
			avatarUrl = `https://${this.site}/user_avatar/${this.site}/discobot/45/1_2.png`;
			notificationHeaderText = `You earned a badge!: <a id='important'>${nextNotification.data.badge_name}</a>`;
			messageText = "";
			break;

		case NotificationType.group_mentioned:
			notificationHeaderText = `<a id='username'>${nextNotification.data.original_username}</a> mentioned <a id='username'>${nextNotification.data.group_name}</a> in: <a id='important'>${nextNotification.data.topic_title}</a>`;
			messageText = notificationContent.cooked.replace(/<\/?[^>]+(>|$)/g, "");
			break;
		case NotificationType.liked_consolidated:
			//No avatar, because avatars URL's are only stored in posts. This could be fixed by getting the url from request: https://{site}/users/{user} --> user.avatar_template
			notificationHeaderText = `<a id='username'>${nextNotification.data.original_username}</a> liked <a id='important'>${nextNotification.data.count}</a> of your posts.`;
			messageText = `For example, in this thread: <a id='important'>${nextNotification.data.topic_title}</a>`;
			break;
		default:
			notificationHeaderText = `You've got a new notification.`
			const notificationType = (_.invert(NotificationType))[nextNotification.notification_type];
			messageText = `Notification type: ${notificationType}`;
			break;
		}

		this.userAvatar.src = avatarUrl;
		this.notificationHeader.innerHTML = notificationHeaderText;
		this.message.innerHTML = messageText;

		this.node_helper.displayNewNotification(this);
	}

	/**
	 * @param {JSON[]} listOfNotifications
	 * @param {JSON[]} listOfLikes
	 */
	setListOfNotifications(listOfNotifications, listOfLikes) {
		this.listOfNotifications = listOfNotifications;
		this.listOfLikes = listOfLikes;

		//Stop the last timer, to be sure there is only one active timer.
		clearInterval(this.nextNotificationTimer);
		this.nextNotificationTimer = setInterval(() => { this.showNextNotification(); }, this.showDurationSeconds * 1000);
	}

	/**
	 * @param {string} message
	 */
	showError(message) {
		console.error("Error!");
		console.error(message);
		this.userAvatar.src = ``;
		this.notificationHeader.innerHTML = `<a id='errorMessage'>An error occurred!</a>`;
		this.message.innerHTML = message;
		this.moduleContainer.setAttribute("style","max-width: 55vw")

		this.node_helper.displayNewNotification(this);
	}

	/**
	 * @param {JSON} userSession
	 */
	showLoggedInUser(userSession) {
		clearInterval(this.nextNotificationTimer);

		this.userAvatar.src = this.prepareAvatarUrl(userSession.current_user.avatar_template);


		this.notificationHeader.innerHTML = `Logged in as <a id='username'>${this.prepareUsername(userSession.current_user)}</a>`;

		this.message.innerHTML = `Unread notifications: ${userSession.current_user.unread_notifications}, unread high priority notifications: ${userSession.current_user.unread_high_priority_notifications}<br>unread messages: ${userSession.current_user.unread_private_messages}.`;

		this.node_helper.displayNewNotification(this);
	}

	/** Generate a valid URL for the avatar.
	 * @param {string} avatarUrl
	 */
	prepareAvatarUrl(avatarUrl) {
		//Sometimes, the full url (including the domain name) is provided.
		if (!(avatarUrl.startsWith("https://") || avatarUrl.startsWith("https://"))) {
			avatarUrl = `https://${this.site}${avatarUrl}`;
		}
		return avatarUrl.replace("{size}", "45");
	}

	/** Return the display name if it is defined. Otherwise, display the username.
	 * @param {JSON} data Either userSession or post. It should contain 'username' and 'name'.
	 */
	prepareUsername(data) {
		let name = data.name;
		if (name === "") {
			name = data.username;
		}
		return name;
	}
};



