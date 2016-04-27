exports.default = {
  app: function(api){
    var config = {

      cache: [process.env.REDIS_HOST || "localhost"],

      email: {
        from: "user@email.com",
        fromname: "Sender",
      }
    };

    return config;
  }
};


exports.test = {};