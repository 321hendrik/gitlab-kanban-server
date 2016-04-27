module.exports = {
	loadPriority: 1002,
	startPriority: 1002,
	stopPriority: 1002,
	initialize: function(api, next) {
		next();

	},
	start: function(api, next) {
		// create chat room
		api.chatRoom.exists('defaultRoom', function (err, found) {
			if (err) {
				syncError(err);
				return;
			}
			if (!found) {
				api.chatRoom.add('defaultRoom');
			}
		});

		api.gitlab_url = process.env.GITLAB_URL || 'http://gitlab.xmini.org/';

		// initial setup
		next();

		/**
		 * handle error exceptions
		 * @param {Object} ex
		 */
		function syncError(ex) {
			api.log('Error during setup', 'error', ex);
			process.exit();
		}

	},
	stop: function(api, next) {
		next();
	}
};