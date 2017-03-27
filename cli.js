#!/usr/bin/env node

var yargs = require('yargs');
var publisher = require('.');
var path = require('path');

var conf = yargs
    .help('help')
    .version()
    .alias('v', 'version')
    .showHelpOnFail(true)
    .usage('Publish a local file to Artifactory (http://www.jfrog.com/artifactory).\nUsage: artifactory-publisher <options>')
    .example('artifactory-publisher -f /path/to/file.ext -t https://artifacts.company.com/repo/file.ext -u user -p pwd')
    .config('c')
    .options('f', {
        alias: 'file',
        describe: 'A path to a file to publish',
        type: 'string',
        demand: true
    })
    .options('t', {
        alias: 'target',
        describe: 'Fully qualified url of artifact in Artifactory (after publish). (https://localhost:8011/artifactory/repo/path/file.ext)',
        demand: true
    })
    .options('u', {
        alias: 'user',
        describe: 'Artifactory user name'
    })
    .options('p', {
        alias: 'password',
        describe: 'Artifactory user password'
    })
    .implies('p', 'u')
    .options('proxy', {
        describe: 'A proxy url to use for sending http requests'
    })
    .options('o', {
        alias: 'overwrite',
        describe: 'Whether or not to overwrite the package if it exists',
    })
    .epilog('Have fun.')
    .argv;

var options = {
    overwrite: !!conf.o
};

if (conf.user) {
    options.credentials = {
        username: conf.user,
        password: conf.password ? conf.password.toString() : null
    };
}

if (conf.proxy) {
    options.proxy = conf.proxy;
}

publisher.publish(conf.file, conf.target, options).then(function (published) {
    if (published) {
        console.log('Upload successfully finished!');
    } else {
        console.log('Upload aborted. File already exists.');
    }
    process.exit(0);
}).catch(function (err) {
    console.log('Upload failed!', err.message);
    process.exit(1);
});