const _ = require("underscore");

const NotificationType = require("./NotificationType");
const ModuleView = require("./ModuleView");

module.exports =
	class NotificationManager {
		requestHandler;
		viewer;
		postContentManager;
		lastNotificationId;
		lastAmountOfUnreadNotifications;
		unreadNotifications;
		unreadLikes;
		postsToBeDownloaded;
		interestingNotificationTypes;
		justCreated = true;

		/**
		 * @param {DiscourseRequestHandler} discourseRequestHandler Connection instance for the Discourse site.
		 * @param {ModuleView} viewer Notifications are passed to this viewer.
		 * @param {PostContentManager} postContentManager The instance that update
		 * @param {int[]|undefined} interestedNotificationTypes The user only wants to see notifications of these types.
		 * @param {int[]|undefined} uninterestedNotificationTypes The user does not want to see notifications of these types.
		 */
		constructor(discourseRequestHandler, viewer, postContentManager, interestedNotificationTypes=undefined, uninterestedNotificationTypes=undefined) {
			this.requestHandler = discourseRequestHandler;
			this.viewer = viewer;
			this.postContentManager = postContentManager;
			this.lastNotificationId = 0;
			this.lastAmountOfUnreadNotifications = 0;
			this.unreadNotifications = [];
			this.unreadLikes = [];
			this.postsToBeDownloaded = {}; // A lists of threads and their posts that need to be loaded. Multiple posts of a single thread can be loaded at the same time.


			//Filter which notification types the user wants to see.
			if (interestedNotificationTypes === undefined) {
				this.interestingNotificationTypes = Array.from({length:24},(v,k)=>k+1); //All 24 notification types.
			}
			else {
				this.interestingNotificationTypes = interestedNotificationTypes;
			}
			if (uninterestedNotificationTypes !== undefined) {
				this.interestingNotificationTypes = _.difference(this.interestingNotificationTypes, uninterestedNotificationTypes);
			}
		}

		/**
		 * Start the notification manager. It keeps itself running from now on.
		 */
		async start() {
			this.checkForUnseenNotifications();
		}

		/**
		 * Check for notifications. Check again later when there are no notifications.
		 */
		async checkForUnseenNotifications() {
			//Check for unread notifications.
			let sessionInformation;
			try {
				sessionInformation = await this.requestHandler.getSessionInformation();
			} catch (error) {
				this.showRequestError(error);
			}

			if (this.justCreated) {
				//Show current amount of notification while waiting for the first notification to show up.
				this.viewer.showLoggedInUser(sessionInformation);
				this.justCreated = false;
			}

			//Check if there are any unread notifications at all.
			if (
				sessionInformation.current_user.unread_notifications === 0 &&
				sessionInformation.current_user.unread_private_messages === 0
			) {
				//No notifications. Check again later.
				this.lastNotificationId = sessionInformation.seen_notification_id;
				this.viewer.showLoggedInUser(sessionInformation);
				setTimeout(() => this.checkForUnseenNotifications(), 10000);
				return;
			}

			//Check for new unread notifications.
			if (
				this.lastNotificationId !== sessionInformation.seen_notification_id ||
				this.lastAmountOfUnreadNotifications !== sessionInformation.unread_notifications
			) {
				this.updateListOfNotifications();
				this.lastNotificationId = sessionInformation.seen_notification_id;
				this.lastAmountOfUnreadNotifications = sessionInformation.unread_notifications;
			} else {
				//Don't update the Viewer.
				setTimeout(() => this.checkForUnseenNotifications(), 10000);
			}
		}

		/**
		 * Create a list of all unread notifications.
		 */
		async updateListOfNotifications() {
			//Save list of notifications + load notifications in the background + lastReadNotificationsId
			let notifications;
			try {
				notifications = await this.requestHandler.getNotifications();
				console.log("await getNotifications()....");
			} catch (error) {
				this.showRequestError(error);
				return;
			}

			//Copy unread notifications.
			for (const notification of notifications.notifications) {
				if (notification.read === false) {
					if (!this.notificationIsInteresting(notification)) {continue;}

					//Notifications and likes are separated. Likes can be combined per post.
					if (notification.notification_type === NotificationType.liked) {
						if (this.unreadLikes[notification.topic_id] === undefined) this.unreadLikes[notification.topic_id] = {};
						if (this.unreadLikes[notification.topic_id][notification.data.original_post_id] === undefined) this.unreadLikes[notification.topic_id][notification.data.original_post_id] = [];
						this.unreadLikes[notification.topic_id][notification.data.original_post_id].push(notification);
					} else {
						this.unreadNotifications.push(notification);
					}

					//If the post has a message, add it to the download list.
					if (notification.topic_id !== null) {
						if (this.postsToBeDownloaded[notification.topic_id] === undefined) {this.postsToBeDownloaded[notification.topic_id] = [];}
						this.postsToBeDownloaded[notification.topic_id].push(notification.data.original_post_id);
					}
				}
			}

			this.postContentManager.updatePostList(this.postsToBeDownloaded);
			this.postContentManager.loadContent(Object.keys(this.postsToBeDownloaded));

			this.viewer.setListOfNotifications(this.unreadNotifications, this.unreadLikes)
			setTimeout(() => this.checkForUnseenNotifications(), 10000);

		}

		/** Check if the user wants to see this notification.
		 * @param {JSON} notification
		 */
		notificationIsInteresting(notification) {
			return this.interestingNotificationTypes.includes(notification.notification_type);
		}

		/** Show an error on the viewer
		 * @param {Error} error
		 */
		showRequestError(error) {
			//FIXME Try to catch specific errors, like: "413: Too many requests", "403: Forbidden source" or "5xx: Internal server error".
			this.viewer.showError(error.message);
		}

	};
