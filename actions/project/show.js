exports.action = {
	name: 'project/show',
	description: 'show project information',
	authenticate: false,
	outputExample:{
		"project": "project data object"
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
		}
	},

	run: function(api, data, next){
		try {
			var gitlab = require('gitlab')({
				url: api.gitlab_url,
				token: data.params.token
			});

			gitlab.projects.show(data.params.projectid, function(project) {
				data.response.project = project;
				next();
			});
		} catch (err) {
			next(err);
		}
	}
};