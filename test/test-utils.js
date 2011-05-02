var Utils = require('../lib/utils').Utils,
    sys = require('sys'),
    debug = sys.debug,
    inspect = sys.inspect;

exports['random integer between 1 and 33'] = function(test) {
  for(var i=0; i<100; i++) {
  var random = Utils.randomInt(32, 1);
    test.ok((1<=random) && (random<=33));
  }
  test.done();
};
