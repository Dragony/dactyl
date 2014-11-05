var yaml = require('js-yaml');

module.exports = new function(){
    this.readConfigs = function(folder){
        var routing = yaml.safeLoad(fs.readFileSync(folder + '/routing.yml', 'utf8'));
        var socketEvents = yaml.safeLoad(fs.readFileSync(folder + '/socket_events.yml', 'utf8'));
    }
};