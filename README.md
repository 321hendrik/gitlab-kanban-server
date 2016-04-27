# Simple Kanban Backend for Gitlab
Gitlab based Kanban Board Backend

* ActionHero Based (WebSocket Communication)
* Enter api token to auth (save with local storage)
* Use [node gitlab api](https://github.com/node-gitlab/node-gitlab)
* Set issue & milestone state with gitlab emoticons
* [Angular Material Frontend](https://github.com/hendrikelsner/gitlab-kanban-gui)

## Run
* `npm install`
* `npm test`
* `GITLAB_URL=http://gitlab.com/ PORT=1234 npm start`

## API Documentation
* can be aquired with http://YOUR_SERVER_IP:PORT/internal/documentation