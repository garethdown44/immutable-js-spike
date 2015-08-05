var util = require('util');
var settings = require('./settings');
var debug = require('debug')('main');
var diff = require('immutablediff');

debug('1st call to getOrCreateInstance()');
var instance = settings.getOrCreateInstance('APPA');

var state1 = settings.allState();

debug(util.inspect(instance));

debug('2nd call to getOrCreateInstance()');
var instance = settings.getOrCreateInstance('APPA');
debug(util.inspect(instance));

var state2 = settings.allState();

debug('state1:');
debug(state1);
debug('state2');
debug(state2);

var state3 = state1.toJS();
var state4 = state2.toJS();

debug('state3:');
debug(util.inspect(state3));
debug('state4:');
debug(util.inspect(state4));

var patch = diff(state3, state4).toJS();

debug('==========================');
debug('PATCH:');
debug(util.inspect(patch));
debug('==========================');
debug('');
debug('==========================')
debug('PATCH THE FIRST OBJECT WITH THE SECOND');

var jsonpatch = require('fast-json-patch');

jsonpatch.apply(state3, jsonpatch);

debug('state3');
debug(state3);
