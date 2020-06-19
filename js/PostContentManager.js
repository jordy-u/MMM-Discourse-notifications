const _ = require("underscore");
const sleep = require('util').promisify(setTimeout);

/*
Deze class:
* Laadt content van posts in de achtergrond
* Geeft content van een gevraagde post terug getPostContent(threadId, postId);
* Houdt bij of er postContent verwijderd mag worden
	--> verwijderd postContent

 */

const ContentLoadState = {
	"QUEUED_FOR_LOADING" : 0,
	"LOADED" : 1
};

module.exports =
class PostContentManager {

	//Example of loadedPosts

	requestHandler;
	postContent;
	currentlyDownloading = false;

	/**
	 * @param {DiscourseRequestHandler} discourseRequestHandler Connection instance for the Discourse site.
	 */
	constructor(discourseRequestHandler) {
		this.requestHandler = discourseRequestHandler;
		this.postContent = {};
		this.order = [0,1,2,3,4];
	}

	updatePostList(listOfPosts) {
		this.removeReadPosts(listOfPosts);
		this.addUnreadPosts(listOfPosts);
	}

	/**
	 * Load content of the threads in the array order in the background.
	 * By default, only 20 requests per minute can be made. So There is a delay of 3 seconds between requests.
	 * @param {int[]} orderedListOfThreads ThreadIds in the orders they need to be loaded.
	 */
	async loadContent(orderedListOfThreads) {

		for (const thread of orderedListOfThreads) {
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

			await sleep( 3000);
		}

	}

	stopDownloading() {

	}

	removeReadPosts(listOfUnreadPosts) {
		for (let [thread, posts] of Object.entries(listOfUnreadPosts)) {
			console.log(thread);
			console.log(posts);

			if (this.postContent[thread] === undefined) {continue;}

			for (let [postId, postContent] of Object.entries(this.postContent[thread].posts)) {
				if (!posts.includes(postId)) {
					delete this.postContent[thread].posts[postId];
				}
			}
			if (_.isEmpty(this.postContent[thread].posts)) {
				delete this.postContent[thread];
			}

		}
	}

	addUnreadPosts(listOfUnreadPosts) {
		for (let [thread, posts] of Object.entries(listOfUnreadPosts)) {

			if (this.postContent[thread] === undefined) {
				this.postContent[thread] = {posts : {}, loadState: ContentLoadState.QUEUED_FOR_LOADING};
			}

			for (let post of posts) {
				if (this.postContent[thread].posts[post] === undefined) {
					this.postContent[thread].posts[post] = {};
				}

			}
		}
	}

};