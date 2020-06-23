module.exports =
	class NotificationManager {

		/**
		 * @param {DiscourseRequestHandler} discourseRequestHandler Connection instance for the Discourse site.
		 */
		constructor(discourseRequestHandler) {
			this.requestHandler = discourseRequestHandler;
			this.lastNotificationId = 0;
			this.allNotifications = {
				privateMessages : {},
				mentions : {},
				likes : {},
				replies : {},
				groupMentionInPrivateThread : {},
				otherNotifications : {}
			};
			this.postsNotLoaded = {}; // A lists of threads and their posts that need to be loaded. Multiple posts of a single thread can be loaded at the same time.
			this.postsLoaded = {}; //A list of posts that already have been loaded.
		}

		/**
		 * Start the notification manager. It keeps itself running from now on.
		 */
		async start() {
			this.checkForUnseenNotificationsFirstTime();
		}

		/**
		 * Check for notifications. Check again later when there are no notifications.
		 */
		async checkForUnseenNotificationsFirstTime() {
			//Check if there are unread notifications.
			let sessionInformation;
			try {
				sessionInformation = await this.requestHandler.getSessionInformation();
			} catch (error) {
				this.showRequestError(error);
			}

			if (
				sessionInformation.current_user.unread_notifications === 0 &&
				sessionInformation.current_user.unread_private_messages === 0
			) {
				//No notifications. Check again later.
				setTimeout(() => this.checkForUnseenNotificationsFirstTime(), 60000);
			} else {
				//There are notifications.
				this.UpdateListOfNotifications();
			}
		}

		async UpdateListOfNotifications() {
			//Save list of notifications + load notifications in the background + lastReadNotificationsId
			let notifications;
			try {
				notifications = await this.requestHandler.getNotifications();
			} catch (error) {
				this.showRequestError(error);
			}

			//Loop through notifications
			for (const notification in notifications.notifications) {
				console.log(notification);
			}

			setTimeout(() => this.CheckForNewUnseenNotifications(), 60000);

		}

		CheckForNewUnseenNotifications() {

		}

		/**
		 * @param {Error} error
		 */
		showRequestError(error) {
			//FIXME Try to catch specific errors, like: "413: Too many requests", "403: Forbidden source" or "5xx: Internal server error".
			//ModuleView.showError("Something went wrong:" + error.toString());
		}

	};
