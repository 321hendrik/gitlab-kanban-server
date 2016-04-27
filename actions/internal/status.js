exports.status = {
  name: 'internal/status',
  description: 'some basic information about the API',
  autosession: false,
  outputExample:{
    "id":"192.168.2.11",
    "version":"9.4.1",
    "uptime":10469,
    "serverInformation":{
      "serverName":"kanban API",
      "apiVersion":"0.0.1",
      "requestDuration":12,
      "currentTime":1420953679624
    }
  },

  run: function(api, data, next){
    data.response.id                = api.id;
    data.response.version           = api.actionheroVersion;
    data.response.uptime            = new Date().getTime() - api.bootTime;

    next();
  }
};