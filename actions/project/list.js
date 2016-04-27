var Q = require('q');
exports.action = {
	name: 'project/list',
	description: 'list all available projects',
	authenticate: false,
	outputExample:{
		"projects": "array of project objects"
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
		stats: {
			required: false
		},
		withissues: {
			required: false
		},
		milestoneonly: {
			required: false
		}
	},

	run: function(api, data, next){
		var emoticonMapping = {
			":hammer:": "workinprogress",
			":question:": "readytest",
			":microscope:": "testinprogress",
			":ballot_box_with_check:": "readycustomer",
			":checkered_flag:": "waitingforclearance"
		};

		/**
		 * Get the column key from an issue's title by matching first emoticon
		 * @param  {String} issueTitle
		 * @return {String}            mapped column key from emoticonMapping
		 */
		function matchColumn (issueTitle) {
			var re = /^:[a-z0-9_]+:/;
			var columnEmoticon = issueTitle.match(re);
			if (columnEmoticon) {
				return emoticonMapping[columnEmoticon[0]];
			} else {
				return 'backlog';
			}
		}

		/**
		 * Generate a column's issue statistic grouped by milestone
		 * @param  {Object} project
		 * @return {Object}        statistics
		 *
		 * Example:
		 * {
		 * 	"without_milestone": {
		 * 		backlog: 4,
		 * 		workinprogress: 2,
		 * 		testinprogress: 1
		 * 	},
		 * 	"My first Milestone": {
		 * 		backlog: 5,
		 * 		readytest: 1
		 * 	}
		 * }
		 *
		 */
		function generateStats (project) {
			var deferred = Q.defer();

			try {
				gitlab.projects.issues.list(project.id, {state: 'opened'}, function(issues) {
					var stats = {};
					var overallStats = {count: 0};
					project.issuecount = issues.length;

					if (!project.issuecount) {
						deferred.resolve();
						return deferred.promise;
					}

					for (var i = 0; i < issues.length; i++) {
						var milestoneKey = (issues[i].milestone) ? issues[i].milestone.title : 'without_milestone';
						var columnKey = matchColumn(issues[i].title);

						overallStats.count += 1;

						// create milestone entry in stats
						if (!stats[milestoneKey]) {
							stats[milestoneKey] = {count: 1};
						} else {
							stats[milestoneKey].count += 1;
						}

						// count issues per column on project level
						if (overallStats[columnKey]) {
							overallStats[columnKey] += 1;
						} else {
							overallStats[columnKey] = 1;
						}

						// count issues per column on milestone level
						if (stats[milestoneKey][columnKey]) {
							stats[milestoneKey][columnKey] += 1;
						} else {
							stats[milestoneKey][columnKey] = 1;
						}
					}

					project.overallStats = overallStats;
					project.stats = stats;

					deferred.resolve();
				});
			} catch (error) {
				deferred.reject(error);
			}

			return deferred.promise;
		}

		function stripProjectsWitoutIssues (projects) {
			var projectsWithIssues = [];

			for (var i = 0; i < projects.length; i++) {
				if (projects[i].issuecount) {
					projectsWithIssues.push(projects[i]);
				}
			}

			return projectsWithIssues;
		}

		function stripProjectsWitoutMilestones (projects) {
			var projectsWithMilestones = [];

			for (var i = 0; i < projects.length; i++) {
				var milestones = Object.keys(projects[i].stats);
				for (var j = 0; j < milestones.length; j++) {
					if (milestones[j] != 'without_milestone') {
						projectsWithMilestones.push(projects[i]);
						break;
					}
				}
			}

			return projectsWithMilestones;
		}

		try {
			var gitlab = require('gitlab')({
				url: api.gitlab_url,
				token: data.params.token
			});

			gitlab.projects.all({order_by: 'last_activity_at', sort: 'desc'}, function(projects) {
				if (!!data.params.stats) {
					var promises = [];

					for (var i = 0; i < projects.length; i++) {
						var promise = generateStats(projects[i]);
						promises.push(promise);
					}

					Q.all(promises)
						.then(function () {
							if (!!data.params.withissues) {
								projects = stripProjectsWitoutIssues(projects);
							}
							if (!!data.params.milestoneonly) {
								projects = stripProjectsWitoutMilestones(projects);
							}
							return true;
						})
						.then(function () {
							data.response.projects = projects;
							next();
						})
						.catch(function (error) {
							next(err);
						})
					;
				} else {
					data.response.projects = projects;
					next();
				}
			});
		} catch (err) {
			next(err);
		}
	}
};