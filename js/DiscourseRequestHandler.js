const fetch = require("node-fetch");

module.exports =
	class DiscourseRequestHandler {

		constructor(site, userApiKey) {
			this.site = "https://" + site;
			this.userApiKey = userApiKey;

			this.GETRequestParameters = {
				"headers" : {
					"accept" : "application/json",
					"User-Api-Key" : userApiKey
				},
				"method" : "GET"
			};

		}

		/**
		 * Get information of the user which the API key belongs to.
		 * @return {JSON} Response of the session request.
		 */
		async getSessionInformation() {
			
			const sessionInformation = await fetch(this.site + "/session/current", this.GETRequestParameters)
				.catch(error => {
					throw error;
				});

			const sessionInformationJSON = await sessionInformation.json()
				.catch(error => {
					throw error;
				});

			this.username = sessionInformationJSON.current_user.username;

			return sessionInformationJSON;
		}

		/**
		 * Get the notifications of the Discourse user.
		 * @return {JSON} Response of the Notifications request.
		 */
		async getNotifications() {

			//Get the username, if it isn't already defined.
			if (this.username === undefined) {
				await this.getSessionInformation();
			}

			const response = await fetch(this.site + "/notifications?username=" + this.username, this.GETRequestParameters)
				.catch(error => {
					throw error;
				});

			return await response.json()
				.catch(error => {
					throw error;
				});
		}

		/**
		 * Get messages of a thread.
		 * @param {int} threadId ID of the thread that contains the messages to be read.
		 * @param {int[]} postIds Array of postIds. If an empty array is given, return the first 20 posts in the thread.
		 * @return {JSON} Response of the get-Posts request.
		 */
		async getPosts(threadId, postIds) {

			let url = new URL(this.site + "/t/" + threadId.toString() + "/posts");

			//Combine all the postIds for the GET request.
			let postIdsForRequest = [];
			postIds.forEach((postId) => {
				postIdsForRequest.push(["post_ids[]", postId.toString()]);
			});
			url.search = new URLSearchParams(postIdsForRequest).toString();

			const response = await fetch(url, this.GETRequestParameters)
				.catch(error => {
					throw error;
				});

			return await response.json()
				.catch(error => {
					throw error;
				});
		}
	};
