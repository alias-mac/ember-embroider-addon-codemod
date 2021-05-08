'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function (defaults) {
  const foo = new EmberAddon(defaults, {
    // Add options here
  });

  return foo.toTree();
};
