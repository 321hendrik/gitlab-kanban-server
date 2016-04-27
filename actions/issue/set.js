exports.action = {
	name: 'issue/set',
	description: 'update an issue. data can have following properties (title, description, assignee_id, milestone_id, labels(comma-separated list of names), state_event("close"|"reopen"))',
	authenticate: false,
	outputExample:{
		"updatedissue": "the updated issue object"
	},
	inputs: {
		token: {
			required: true,
			validator: function(param) {
				var re = /^[0-9a-zA-Z]{20}$/i;
				if (re.test(param)) {
					return true;
				} else {
					return new Error('that is not a valid token');
				}
			}
		},
		projectid: {
			required: true,
			validator: function(param) {
				var re = /[0-9]+/i;
				if (re.test(param)) {
					return true;
				} else {
					return new Error('that is not a valid project id');
				}
			}
		},
		issueid: {
			required: true,
			validator: function(param) {
				var re = /[0-9]+/i;
				if (re.test(param)) {
					return true;
				} else {
					return new Error('that is not a valid issue id');
				}
			}
		},
		data: {
			required: true
		}
	},

	run: function(api, data, next){
		try {
			var gitlab = require('gitlab')({
				url: api.gitlab_url,
				token: data.params.token
			});

			gitlab.issues.edit(data.params.projectid, data.params.issueid, data.params.data, function(updatedIssue) {
				data.response.updatedissue = updatedIssue;
				// notify clients
				api.chatRoom.broadcast(data.connection, 'defaultRoom', {action: 'updateView', payload: updatedIssue}, function() {
					next();
				});
			});
		} catch (err) {
			next(err);
		}
	}
};