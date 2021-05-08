# ember-cli-build


## Usage

```
npx ember-embroider-addon-codemod ember-cli-build path/of/files/ or/some**/*glob.js

# or

yarn global add ember-embroider-addon-codemod
ember-embroider-addon-codemod ember-cli-build path/of/files/ or/some**/*glob.js
```

## Local Usage
```
node ./bin/cli.js ember-cli-build path/of/files/ or/some**/*glob.js
```

## Input / Output

<!--FIXTURES_TOC_START-->
* [basic](#basic)
* [const-assignment](#const-assignment)
* [different-assignment](#different-assignment)
* [without-comment](#without-comment)
<!--FIXTURES_TOC_END-->

<!--FIXTURES_CONTENT_START-->
---
<a id="basic">**basic**</a>

**Input** (<small>[basic.input.js](transforms/ember-cli-build/__testfixtures__/basic.input.js)</small>):
```js
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

  return app.toTree();
};

```

**Output** (<small>[basic.output.js](transforms/ember-cli-build/__testfixtures__/basic.output.js)</small>):
```js
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
  return maybeEmbroider(app);
};

```
---
<a id="const-assignment">**const-assignment**</a>

**Input** (<small>[const-assignment.input.js](transforms/ember-cli-build/__testfixtures__/const-assignment.input.js)</small>):
```js
'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function (defaults) {
  const app = new EmberAddon(defaults, {
    // Add options here
  });

  /*
    This build file specifies the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */

  return app.toTree();
};

```

**Output** (<small>[const-assignment.output.js](transforms/ember-cli-build/__testfixtures__/const-assignment.output.js)</small>):
```js
'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function (defaults) {
  const app = new EmberAddon(defaults, {
    // Add options here
  });

  /*
    This build file specifies the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */

  const { maybeEmbroider } = require('@embroider/test-setup');
  return maybeEmbroider(app);
};

```
---
<a id="different-assignment">**different-assignment**</a>

**Input** (<small>[different-assignment.input.js](transforms/ember-cli-build/__testfixtures__/different-assignment.input.js)</small>):
```js
'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function (defaults) {
  const foo = new EmberAddon(defaults, {
    // Add options here
  });

  return foo.toTree();
};

```

**Output** (<small>[different-assignment.output.js](transforms/ember-cli-build/__testfixtures__/different-assignment.output.js)</small>):
```js
'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function (defaults) {
  const foo = new EmberAddon(defaults, {
    // Add options here
  });

  const { maybeEmbroider } = require('@embroider/test-setup');
  return maybeEmbroider(foo);
};

```
---
<a id="without-comment">**without-comment**</a>

**Input** (<small>[without-comment.input.js](transforms/ember-cli-build/__testfixtures__/without-comment.input.js)</small>):
```js
'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function (defaults) {
  const app = new EmberAddon(defaults, {
    // Add options here
  });

  return app.toTree();
};

```

**Output** (<small>[without-comment.output.js](transforms/ember-cli-build/__testfixtures__/without-comment.output.js)</small>):
```js
'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function (defaults) {
  const app = new EmberAddon(defaults, {
    // Add options here
  });

  const { maybeEmbroider } = require('@embroider/test-setup');
  return maybeEmbroider(app);
};

```
<!--FIXTURES_CONTENT_END-->