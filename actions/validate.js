exports.action = {
    name: 'validate',
    description: 'validate a gitlab private token, responds with error when token is invalid',
    outputExample:{
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
        }
    },

    run: function(api, data, next){
        try {
            var gitlab = require('gitlab')({
                url: api.gitlab_url,
                token: data.params.token
            });

            gitlab.users.current(function (user) {
                data.response.user = user;
                next();
            });
        } catch (err) {
            next(err);
        }
    }
};