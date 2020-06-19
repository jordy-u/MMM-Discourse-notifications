const _ = require("underscore");

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

	constructor() {
		this.postContent = {};
		this.order = [0,1,2,3,4];
	}

	updatePostList(listOfPosts) {
		this.removeReadPosts(listOfPosts);
		this.addUnreadPosts(listOfPosts);
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
					this.postContent[thread].posts[post] = {data: undefined};
				}

			}
		}
	}

};