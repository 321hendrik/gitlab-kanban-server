var should = require('should');
var fs = require('fs');

process.env.NODE_ENV = 'test';
process.env.GITLAB_URL = 'http://gitlab.com/';
var actionheroPrototype = require('actionhero').actionheroPrototype;
var actionhero = new actionheroPrototype();
var api;

var testToken = 'qSyUTosLdgm2ag8AHxh4';

describe('Gitlab-Kanban Tests', function() {
    this.timeout(60000);

    before(function(done) {
        actionhero.start(function(err, a) {
            api = a;
            done();
        });
    });

    after(function(done) {
        actionhero.stop(function(err) {
            done();
        });
    });


    describe('Server', function () {

        it('should have test gitlab url in environment and set to api object', function (done) {

            should.exist(api.gitlab_url);
            process.env.GITLAB_URL.should.equal(api.gitlab_url);
            done();

        });

        it('should show an API documentation', function (done) {

            api.specHelper.runAction('internal/documentation', {}, function(response) {
                should.not.exist(response.error);
                should.exist(response.documentation);
                done();
            });

        });

        it('should report its status', function (done) {

            api.specHelper.runAction('internal/status', {}, function(response) {
                should.not.exist(response.error);
                should.exist(response.id);
                should.exist(response.version);
                should.exist(response.uptime);
                done();
            });

        });

    });

    describe('Validation', function () {

        it('should not validate without token', function (done) {

            api.specHelper.runAction('validate', {}, function(response) {
                should.exist(response.error);
                done();
            });

        });

        it('should validate the test token', function (done) {
            api.specHelper.runAction('validate', {
                token: testToken
            }, function(response) {
                should.not.exist(response.error);
                should.exist(response.user);
                done();
            });
        });

    });

    describe('Project', function () {

        describe('> List', function () {

            it('should not list projects without token', function (done) {

                api.specHelper.runAction('project/list', {}, function(response) {
                    should.exist(response.error);
                    done();
                });

            });

            it('should return a list of projects', function (done) {

                api.specHelper.runAction('project/list', {
                    token: testToken
                }, function(response) {
                    should.exist(response.projects);
                    done();
                });

            });

        });

        describe('> Show', function () {

            it('should not show project info without token', function (done) {

                api.specHelper.runAction('project/show', {
                    projectid: 606178
                }, function(response) {
                    should.exist(response.error);
                    done();
                });

            });

            it('should not show project info without projectid', function (done) {

                api.specHelper.runAction('project/show', {
                    token: testToken
                }, function(response) {
                    should.exist(response.error);
                    done();
                });

            });

            it('should return project information', function (done) {

                api.specHelper.runAction('project/show', {
                    projectid: 606178,
                    token: testToken
                }, function(response) {
                    should.exist(response.project);
                    done();
                });

            });

        });

    });

    describe('Issue', function () {

        describe('> List', function () {

            it('should not list issues without token', function (done) {

                api.specHelper.runAction('issue/list', {
                    projectid: 606178
                }, function(response) {
                    should.exist(response.error);
                    done();
                });

            });

            it('should not list issues without projectid', function (done) {

                api.specHelper.runAction('issue/list', {
                    token: testToken
                }, function(response) {
                    should.exist(response.error);
                    done();
                });

            });

            it('should return a list of issues for a given projectid', function (done) {

                api.specHelper.runAction('issue/list', {
                    token: testToken,
                    projectid: 606178
                }, function(response) {
                    should.exist(response.issues);
                    done();
                });

            });

        });

        describe('> Set', function () {

           it('should not set an issue without token', function (done) {

               api.specHelper.runAction('issue/set', {
                   projectid: 606178,
                   issueid: 1
               }, function(response) {
                   should.exist(response.error);
                   done();
               });

           });

           it('should not set an issue without projectid', function (done) {

               api.specHelper.runAction('issue/set', {
                   token: testToken,
                   issueid: 1
               }, function(response) {
                   should.exist(response.error);
                   done();
               });

           });

           it('should not set an issue without issueid', function (done) {

               api.specHelper.runAction('issue/set', {
                   projectid: 606178,
                   token: testToken
               }, function(response) {
                   should.exist(response.error);
                   done();
               });

           });

        });

    });

});