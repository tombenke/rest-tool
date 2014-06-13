/*jshint node: true */
'use strict';

(function() {

    var httpProxy = require('http-proxy');
    var proxy = new httpProxy.RoutingProxy();

    var proxyMatch = function(req, uriPattern) {
        var uriRegExp = new RegExp('^' + uriPattern.replace(/\//gi, '\\/'));

        if (req.url.match(uriPattern)) {
            return true;
        }
        return false;
    };

    module.exports = function(serviceUrlPrefix, remoteServices, proxyException) {
        return function(req, res, next) {
            var match = false,
                skip = false,
                i = 0;
            if (proxyException && proxyException.active) {
                proxyException.urlPrefixList.some(function(uri) {
                    ++i;
                    if (proxyMatch(req, serviceUrlPrefix + uri)) {
                        skip = true;
                        return true;
                    }
                });
            }
            if (!skip) {
                console.log(serviceUrlPrefix);
                remoteServices.some(function(remoteService) {
                    if (remoteService.active && proxyMatch(req, serviceUrlPrefix + remoteService.uri)) {
                        match = true;
                        console.log('forwarding ' + req.method + ' ' + req.url + ' request to ' + req.method + ' ' + remoteService.host + ':' + remoteService.port + req.url + '  from ' + req.host + ' - ' + req.ip);
                        var proxyBuffer = httpProxy.buffer(req);
                        proxy.proxyRequest(req, res, {
                            host: remoteService.host,
                            port: remoteService.port,
                            buffer: proxyBuffer
                        });
                        return true;
                    }
                });
            }
            if (!match) {
                next();
            }
        };
    };

})();