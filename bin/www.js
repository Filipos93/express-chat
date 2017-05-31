#!/usr/bin/env node
var application = require('./../app');


var server  = application.app.listen(3000, function(){console.log('listening on port 3000')});
application.io.listen(server);