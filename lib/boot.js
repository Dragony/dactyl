var parseSignedCookies = require('connect').utils.parseSignedCookies
    MemoryStore = express.session.MemoryStore
    sessionStore = new MemoryStore()
    Session = require('connect').middleware.session.Session
    cookie = require("cookie")
;

module.exports = {
    express: function(app){
        app.use(express.static(global.base + '/assets'));
        app.use(express.json());
        app.use(express.urlencoded());
        app.set('views', global.get('views'));
        app.set("twig options", {
            strict_variables: false
        });
        app.use(express.cookieParser(global.sessionSecret));
        app.use(express.session({
            store: sessionStore,
            secret: global.sessionSecret,
            key: 'express.sid',
            cookie:{
                maxAge: 2592000 // One month,
            }
        }));
        return app;
    },
    socketio: function(io){
        io.set('log level', 2);
        io.set('browser client minification', true);
        io.set('authorization', function (data, accept) {
            if(data.headers.cookie){
                data.cookie = cookie.parse(data.headers.cookie);
                data.cookie = parseSignedCookies(data.cookie, global.sessionSecret);
                data.sessionID = data.cookie['express.sid'];
                // save the session store to the data object
                // (as required by the Session constructor)
                data.sessionStore = sessionStore;
                sessionStore.get(data.sessionID, function (err, session) {
                    if(err || !session){
                        // Session could not be loaded
                        data.session = null;
                        // This should never happen if the user visits our page first
                        // but we need to check for this anyway to avoid crashing the server
                        accept('Session could not be fetched from express', false);
                    }else{
                        data.session = new Session(data, session);
                        accept(null, true);
                    }
                });
            }else{
                accept('No Cookie', false)
            }
        });
        return io;
    }
}