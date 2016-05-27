module.exports = function() {
    var client = './client/';
    var clientApp = client + 'app/';
    var server = './api/';
    var dist = 'dist';


    var config = {
        alljs: [
            "app.module.js",
            "core/*.js",
            "home/*.js",
            "room/*.js",
            "game/*.js",
            "pgn/*.js",
            "app.run.js",
            "app.config.js",
            "main.js",
          ], 
        assets: [
            client + "/app/**/*.html",
            client + "/dist/all.min.js",
            client + "/img/**/*", 
            client + "/styles/css/**.css", 
        ],
        client : client,
        clientApp : clientApp,
        index : client + 'index.html',
        dist : dist

    };


    return config;
};