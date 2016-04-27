exports.action = {
	name: 'issue/list',
	description: 'list project issues',
	authenticate: false,
	outputExample:{
		"issues": "array of the project's issues"
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
		state: {
			required: false,
			validator: function(param) {
				if (['opened', 'closed'].indexOf(param) != -1) {
					return true;
				} else {
					return new Error('that is not a valid issue state');
				}
			}
		}
	},

	run: function(api, data, next){
		function removeClosedMilestones (issues) {
			var filtered = [];
			for (var i = 0; i < issues.length; i++) {
				if (issues[i].milestone) {
					if (issues[i].milestone.state != 'closed') {
						filtered.push(issues[i]);
					}
				} else {
					filtered.push(issues[i]);
				}
			}

			return filtered;
		}

		try {
			var gitlab = require('gitlab')({
				url: api.gitlab_url,
				token: data.params.token
			});

			var filter = {};

			if (data.params.state) {
				filter.state = data.params.state;
			}

			gitlab.projects.issues.list(data.params.projectid, filter, function(issues) {
				data.response.issues = removeClosedMilestones(issues);
				next();
			});
		} catch (err) {
			next(err);
		}
	}
};