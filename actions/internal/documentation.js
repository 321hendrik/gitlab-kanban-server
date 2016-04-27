exports.documentation = {
  name: 'internal/documentation',
  description: 'return API documentation',
  autosession: false,

  outputExample:{
    "documentation":{  
      "internal/status": {  
        "1": {  
          "name": "internal/status",
          "version": 1,
          "description": "some basic information about the API",
          "inputs": {  
          }
        }
      }
    }
  },

  run: function(api, data, next){    
    data.response.documentation = api.documentation.documentation;
    next();
  }
};