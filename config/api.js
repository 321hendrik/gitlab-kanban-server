exports.default = {
  general: function(api){
    return {
      apiVersion: '1.0.0',
      serverName: 'KANBAN',
      serverToken: 'f4ec5cc6f57e4477a9f9f4a30e053217',
      // The welcome message seen by TCP and webSocket clients upon connection
      welcomeMessage: 'Hello! Welcome to the kanban application api server',
      // the redis prefix for actionhero's cache objects
      cachePrefix: 'kanban:cache:',
      // the redis prefix for actionhero's cache/lock objects
      lockPrefix: 'kanban:lock:',
      // how long will a lock last before it exipres (ms)?
      lockDuration: 1000 * 10, // 10 seconds
      // Watch for changes in actions and tasks, and reload/restart them on the fly
      developmentMode: true,
      // Should we run each action within a domain? Makes your app safer but slows it down
      actionDomains: true,
      // How many pending actions can a single connection be working on
      simultaneousActions: 5,
      // allow connections to be created without remoteIp and remotePort (they will be set to 0)
      enforceConnectionProperties: true,
      // disables the whitelisting of client params
      disableParamScrubbing: false,
      // params you would like hidden from any logs
      filteredParams: [],
      // values that signify missing params
      missingParamChecks: [null, '', undefined],
      // The default filetype to server when a user requests a directory
      directoryFileType : 'index.html',
      // The default priority level given to middleware of all types (action, connection, and say)
      defaultMiddlewarePriority : 100,
      // configuration for your actionhero project structure
      paths: {
        'action':      [ __dirname + '/../actions'      ] ,
        'task':        [ __dirname + '/../tasks'        ] ,
        'public':      [ __dirname + '/../public'       ] ,
        'pid':         [ __dirname + '/../pids'         ] ,
        'log':         [ __dirname + '/../log'          ] ,
        'server':      [ __dirname + '/../servers'      ] ,
        'initializer': [ __dirname + '/../initializers' ] ,
        'plugin':      [ __dirname + '/../node_modules' ]
      },
      // hash containing chat rooms you wish to be created at server boot
      startingChatRooms: {
      }
    }
  }
}

exports.test = {
  general: function(api){
    return {
      id: 'test-server',
      developmentMode: true,
      actionDomains: true,
      startingChatRooms: {
      },
    }
  }
}

/* istanbul ignore next */
exports.production = {
  general: function(api){
    return {
      developmentMode: false
    }
  }
}