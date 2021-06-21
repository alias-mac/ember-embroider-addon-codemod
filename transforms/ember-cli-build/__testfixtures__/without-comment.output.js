'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function (defaults) {
  const app = new EmberAddon(defaults, {
    // Add options here
  });

  const { maybeEmbroider } = require('@embroider/test-setup');

  // temporary adapters for embroider build at LI
  const { compatAdapters } = require('@linkedin/pemberly-embroider/src');
  const adapters = compatAdapters();

  return maybeEmbroider(app, {
    compatAdapters: new Map(adapters),
  });
};
