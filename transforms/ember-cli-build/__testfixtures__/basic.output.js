'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function (defaults) {
  let app = new EmberAddon(defaults, {
    // Add options here
  });

  /*
    This build file specifies the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */

  const { maybeEmbroider } = require('@embroider/test-setup');

  // temporary adapters for embroider build at LI
  const { compatAdapters } = require('@linkedin/pemberly-embroider/src');
  const adapters = compatAdapters();

  // Making sure to use classic build when not running embroider test scenarios.
  // maybeEmbroider turns on Embroider when @embroider/core is installed, and
  // we have to install @embroider/core because it's a peerDep of
  // @embroider/compat, which is a peerDep of @linkedin/pemberly-embroider.
  if (!process.env.EMBROIDER_TEST_SETUP_OPTIONS) {
    return app.toTree();
  }

  return maybeEmbroider(app, {
    compatAdapters: new Map(adapters),
  });
};
