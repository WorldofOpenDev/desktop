define([], function(_, hr) {
    var CodeboxIO = node.require("codebox-io").Client;

    return function(token) {
        return new CodeboxIO({
            'host': "http://localhost:5000",
            'token': token
        });
    }
});