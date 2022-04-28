'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function (defaults) {
  const foo = new EmberAddon(defaults, {
    // Add options here
  });

  const { maybeEmbroider } = require('@embroider/test-setup');

  const { compatAdapters } = require('@linkedin/pemberly-embroider/src');
  const adapters = compatAdapters();

  return maybeEmbroider(foo, {
    compatAdapters: new Map(adapters),
  });
};
