var yaml = require('js-yaml');
var fs = require('fs');

module.exports = new function(){
    this.readConfigs = function(folder){
        var routing = yaml.safeLoad(fs.readFileSync(folder + '/routing.yml', 'utf8'));
        var socketEvents = yaml.safeLoad(fs.readFileSync(folder + '/socket_events.yml', 'utf8'));
        var general = yaml.safeLoad(fs.readFileSync(folder + '/config.yml', 'utf8'));
        return {
            routing: routing,
            socket_events: socketEvents,
            general: general
        };
    }
};