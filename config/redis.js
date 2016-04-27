/* istanbul ignore next */
exports.default = {
  redis: function(api){
    var redisDetails = {
      // Which channel to use on redis pub/sub for RPC communication
      channel: 'kanban',
      // How long to wait for an RPC call before considering it a failure
      rpcTimeout: 5000,
      // which redis package should you ise?
      package: 'fakeredis',
      host: 'localhost',
      database: 0,
      options: {
        password: null
      }
    }

    if( process.env.FAKEREDIS === 'false' || process.env.REDIS_HOST !== undefined ){
      redisDetails.package  = 'ioredis';
      // there are many more connection options, including support for cluster and sentinel
      // learn more @ https://github.com/luin/ioredis
      redisDetails.host     = process.env.REDIS_HOST || '127.0.0.1';
      redisDetails.port     = process.env.REDIS_PORT || 6379;
      redisDetails.database = process.env.REDIS_DB   || 0;
      redisDetails.options  = {
        password: (process.env.REDIS_PASS || null),
      };
    }

    return redisDetails;
  }
}

exports.test = {
  redis: function(api){
    var package = 'fakeredis';

    return {
      package: package,
      host: '127.0.0.1',
      port: 6379,
      database: 2,
      options: {},
    }
  }
}