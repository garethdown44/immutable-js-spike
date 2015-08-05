var util = require('util');
var settings = require('./settings');
var debug = require('debug')('main');
var diff = require('immutablediff');

debug('1st call to getOrCreateInstance()');
var instance = settings.getOrCreateInstance('APPA');

var state1 = settings.allState().toJS();

debug(util.inspect(instance));

debug('2nd call to getOrCreateInstance()');
var instance = settings.getOrCreateInstance('APPB');
debug(util.inspect(instance));

var state2 = settings.allState().toJS();

debug('states:');
debug(state1);
debug('===');
debug(state2);

var patch = diff(state1, state2);

debug('==========================');
debug('PATCH:');
debug(util.inspect(patch));
debug('==========================');
debug('');
debug('==========================')
debug('PATCH THE FIRST OBJECT WITH THE SECOND');

var jsonpatch = require('fast-json-patch');

//jsonpatch.apply

