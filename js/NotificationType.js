//Notification types are defined here: https://github.com/discourse/discourse/blob/master/app/models/notification.rb#L90-L113
const NotificationType = {
	"TYPE_DOES_NOT_EXIST":0,
	"mentioned": 1,
	"replied": 2,
	"quoted": 3,
	"edited": 4,
	"liked": 5,
	"private_message": 6,
	"invited_to_private_message": 7,
	"invitee_accepted": 8,
	"posted": 9,
	"moved_post": 10,
	"linked": 11,
	"granted_badge": 12,
	"invited_to_topic": 13,
	"custom": 14,
	"group_mentioned": 15,
	"group_message_summary": 16,
	"watching_first_post": 17,
	"topic_reminder": 18,
	"liked_consolidated": 19,
	"post_approved": 20,
	"code_review_commit_approved": 21,
	"membership_request_accepted": 22,
	"membership_request_consolidated": 23,
	"bookmark_reminder": 24
};

module.exports = NotificationType;