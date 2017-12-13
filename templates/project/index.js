const pkg = require('./package.json')
const services = require('rest-tool-common').services;

// Load services config and service descriptors
services.load(__dirname, 'services');

module.exports = {
    name: pkg.name,
    description: pkg.description,
    version: pkg.version,
    authorName: pkg.author.name,
    authorEmail: pkg.author.email,
    services: services
}
