exports.default = { 
  jwtauth: function(api){
    return {
      enabled: {
        web: true,
        websocket: true,
        socket: false,
        testServer: false
      },
      secret: api.config.general.serverToken,
      algorithm: 'HS512',
      enableGet: true
    }
  }
}