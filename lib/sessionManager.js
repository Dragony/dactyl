var sessionManager = new function(){

    var sessions = {};

    function set(_vars, id, key){
        var vars = _vars || {};
        if(id == undefined){
            var newId = getId();
            while(exists(newId)){
                newId = getId();
            }
            return set(vars, newId);
        }
        if(key == undefined){
            vars.id = id;
            sessions[id] = vars;
        }else{
            sessions[id][key] = vars;
        }
        return id;
    }

    function spawn(id){
        return set({}, id);
    }

    function get(id, key){
        if(key == undefined){
            return sessions[id];
        }
        return sessions[id][value];
    }

    function exists(id){
        return !sessions[id] == undefined;
    }

    function getId(){
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    }

    this.set = set;
    this.spawn = spawn;
    this.get = get;
    this.exists = exists;
    this.getId = getId;
};

module.exports = sessionManager;