var debug = require('debug')('settings');
var Immutable = require('immutable');

// var map1 = Immutable.Map({ a:1, b:2, c:3 });
// var map2 = map1.set('b', 50);

// console.log(map1.get('b'));
// console.log(map2.get('b'));

settings = module.exports;

var _state = Immutable.Map();

settings.getOrCreateInstance = function(appKey) {
  
  var app = _state.get(appKey);
  if (!app) {

    debug('ADDING A NEW APP');

    var instance = createDefaultInstance(appKey, 0);
    var appInfo = createAppInfo(appKey, instance);

    _state = _state.set(appKey, appInfo);
  } else {

    debug('ADDING ANOTHER INSTANCE');

    // add another running instance
    var app = _state.get(appKey);
    var instance = createDefaultInstance(appKey, app.get('runningInstances').count());

    debug('pushing another instance onto runningInstances...');
    var runningInstances = app.get('runningInstances');
    runningInstances = runningInstances.push(instance.InstanceKey);

    app = app.set('runningInstances', runningInstances);

    debug('app now looks like this:');
    debug(app);

    debug('adding another availableInstance');
    var availableInstances = app.get('availableInstances');
    availableInstances = availableInstances.set(instance.InstanceKey, instance);

    app = app.set('availableInstances', availableInstances);

    debug('app looks like this now: ');
    debug(app);

    _state = _state.set(appKey, app);
  }

  var app = _state.get(appKey);
  var currentInstanceKey = app.get('runningInstances').peek();

  debug('currentInstanceKey is ' + currentInstanceKey);

  debug('state looks like this: ');
  debug(_state);
  debug(_state.get(appKey));

  return app.get('availableInstances').get(currentInstanceKey);
};

settings.saveInstance = function(instance) {
  var appKey = instance.AppKey;
  var instanceKey = instance.InstanceKey;  
};

settings.allState = function() {
  return _state;
};

function createDefaultInstance(appKey, instanceNumber) {

  var instanceKey = appKey + '_' + instanceNumber;

  return { 
      AppKey: appKey, 
      InstanceKey: instanceKey,
      Width: 600,
      Height: 400 };
};

function createAppInfo(appKey, instance) {

  debug('createAppInfo');
  var instanceKey = instance.InstanceKey;

  var inst = Immutable.Map();
  inst = inst.set(instanceKey, instance);

  debug(instanceKey);

  return Immutable.Map({runningInstances: Immutable.Stack([instanceKey]), availableInstances: inst });
};



// instead of the way it's working now it could just 
// create instances and then delete them whenever they are closed

// this could work but if any of them had state
// then it wouldn't work

// Q. do any of them actually have state that needs to be
// restored?
//    A. none of the web apps do, that's absolutely for sure.

// Q. does anyone actually want it to restore apps in the previous
// position as you open them?
//   A. maybe. it might be useful if you close one, you don't want
//      to have to reposition it again

// could have a button on the launcher saying 
// 'save window layout'
// 'restore window layout'