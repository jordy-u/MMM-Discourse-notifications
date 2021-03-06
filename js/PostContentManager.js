const _ = require("underscore");

/*
This class:
* Loads the content of posts in the background.
* Returns the content of the specified post with getPostContent(threadId, postId);
* Keeps track of which posts needs to be downloaded, stored and deleted.
 */

module.exports =
class PostContentManager {

	/* Construction of postContent collection.
	this.postContent = {
		thread : {
			postId : {data or undefined},
			postId : {data or undefined},
			...
		},
		thread : {
			postId : {data or undefined},
			postId : {data or undefined},
			...
		},
		...
	}
	*/

	requestHandler;
	postContent;
	downloadTimer;
	queuedThreads;


	/**
	 * @param {DiscourseRequestHandler} discourseRequestHandler Connection instance for the Discourse site.
	 */
	constructor(discourseRequestHandler) {
		this.requestHandler = discourseRequestHandler;
		this.postContent = {};
		this.downloadTimer = undefined;
		this.queuedThreads = [];
	}

	/** Define a list of posts that need to be downloaded.
	 * @param {JSON} listOfPosts List of threads that hold postIds in an array.
	 */
	updatePostList(listOfPosts) {
		this.removeReadPosts(listOfPosts);
		this.addUnreadPosts(listOfPosts);
	}

	/**
	 * Load content of the threads in the array order in the background.
	 * By default, only 20 requests per minute can be made. So There is a delay of 3 seconds between requests.
	 * @param {int[]} orderedListOfThreads ThreadIds in the orders they need to be loaded.
	 */
	loadContent(orderedListOfThreads) {
		this.queuedThreads = orderedListOfThreads;

		this.removeLoadedThreads();

		//Stop the last downloadTimer, to be sure there is only one active timer.
		clearInterval(this.downloadTimer);
		this.downloadTimer = setInterval(() => { this.loadNextQueuedThread(); }, 4000);
	}

	/**
	 * Remove threads from this.queuedThreads if all posts have already been loaded, so they are not requested again.
	 */
	removeLoadedThreads() {
		for (const threadId of this.queuedThreads) {
			let allPostsInThreadAreLoaded = true;
			for (const postId in this.postContent[threadId].posts) {
				if (_.isEmpty(this.postContent[threadId].posts[postId])) {
					allPostsInThreadAreLoaded = false;
					break;
				}
			}

			if (allPostsInThreadAreLoaded) this.queuedThreads.splice(threadId);
		}
	}

	/** Download the next thread, if there is unloaded data.
	 */
	async loadNextQueuedThread() {
		//Stop if all queued threads are loaded.
		if (_.isEmpty(this.queuedThreads)) {
			clearInterval(this.downloadTimer);
			return;
		}

		const thread = this.queuedThreads.shift();

		let threadContent;
		try {
			const postToBeLoaded = Object.keys(this.postContent[thread].posts);
			threadContent = await this.requestHandler.getPosts(thread, postToBeLoaded);
		} catch (error) {
			new Error(error);
		}

		for (let post of threadContent.post_stream.posts) {
			this.postContent[thread].posts[post.id] = post;
		}
	}

	/** Stop downloading more content.
	 */
	stopDownloading() {
		clearInterval(this.downloadTimer);
	}

	/**
	 * Remove posts that are not needed anymore.
	 * @param {JSON} listOfUnreadPosts List of threads that hold postIds in an array.
	 */
	removeReadPosts(listOfUnreadPosts) {
		for (let [thread, posts] of Object.entries(listOfUnreadPosts)) {
			console.log(thread);
			console.log(posts);

			if (this.postContent[thread] === undefined) {continue;}

			for (let [postId, postContent] of Object.entries(this.postContent[thread].posts)) {
				const postIdInt = parseInt(postId);
				if (!posts.includes(postIdInt)) {
					delete this.postContent[thread].posts[postId];
				}
			}
			if (_.isEmpty(this.postContent[thread].posts)) {
				delete this.postContent[thread];
			}

		}
	}

	/**
	 * Add posts that need to be downloaded, if they are not already added.
	 * @param {JSON} listOfUnreadPosts List of threads that hold postIds in an array.
	 */
	addUnreadPosts(listOfUnreadPosts) {
		for (let [thread, posts] of Object.entries(listOfUnreadPosts)) {

			if (this.postContent[thread] === undefined) {
				this.postContent[thread] = {posts : {}};
			}

			for (let post of posts) {
				if (this.postContent[thread].posts[post] === undefined) {
					this.postContent[thread].posts[post] = {};
				}

			}
		}
	}
	/**
	 * Get the content of a post, if it is available. Otherwise, throw an error.
	 * @param {int} threadId The thread the post belongs to.
	 * @param {int} postId The post which content is requested.
	 * @return {Object|undefined} The requested content. If it is not downloaded yet, return undefined.
	 */
	getPostContent(threadId, postId) {
		if (this.postContent[threadId] === undefined) { return Error("Thread undefined"); }
		if (this.postContent[threadId].posts[postId] === undefined) { return Error("Post undefined"); }
		if (_.isEmpty(this.postContent[threadId].posts[postId])) { return undefined; }
		return this.postContent[threadId].posts[postId];
	}
};