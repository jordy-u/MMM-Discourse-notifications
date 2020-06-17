module.exports =
	class NotificationManager {

		/**
		 * @param {DiscourseRequestHandler} discourseRequestHandler Connection instance for the Discourse site.
		 */
		constructor(discourseRequestHandler) {
			this.requestHandler = discourseRequestHandler;
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

	};
