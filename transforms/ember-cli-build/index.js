const { getParser } = require('codemod-cli').jscodeshift;

module.exports = function transformer(file, api) {
  const j = getParser(api);
  const { statements } = j.template;
  const root = j(file.source);

  // find nodejs default export
  const defaultExports = root.find(j.ExpressionStatement, {
    expression: {
      type: 'AssignmentExpression',
      operator: '=',
      left: {
        type: 'MemberExpression',
        object: { name: 'module' },
        property: { name: 'exports' },
      },
    },
  });

  // find the variable assigned to `new EmberAddon()`
  const newEmberAddon = defaultExports.find(j.VariableDeclarator, {
    init: {
      type: 'NewExpression',
      callee: { name: 'EmberAddon' },
    },
  });
  if (newEmberAddon.size() > 1) {
    // unexpected ember-cli-build format, don't transform
    return root.toSource();
  }

  // this is needed because of the hack due to the comments in multi-statement
  const maybeEmbroider = defaultExports.find(j.VariableDeclarator, {
    init: {
      type: 'CallExpression',
      callee: { name: 'require' },
      arguments: [{ value: '@embroider/test-setup' }],
    },
  });

  if (maybeEmbroider.size() >= 1) {
    // already using embroider setup, replace code with specific for LI case
    defaultExports
      .find(j.ReturnStatement, {
        argument: {
          type: 'CallExpression',
          callee: {
            type: 'Identifier',
            name: 'maybeEmbroider',
          },
          // not passing options already
          arguments: { length: 1 },
        },
      })
      // and convert them into `maybeEmbroider` calls
      .forEach((p) => {
        j(p).replaceWith(statements`

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

          return maybeEmbroider(${newEmberAddon.paths()[0].value.id.name}, {
            compatAdapters: new Map(adapters),
          });
        `);
      });

    return root.toSource();
  }

  // find the return statements of the default export function
  defaultExports
    .find(j.ReturnStatement, {
      argument: {
        type: 'CallExpression',
        callee: {
          type: 'MemberExpression',
          object: { name: newEmberAddon.paths()[0].value.id.name },
          property: { name: 'toTree' },
        },
      },
    })
    // and convert them into `maybeEmbroider` calls
    .forEach((p) => {
      const comments = p.value.comments;
      // unable to preserve comments with multi-statement, so using a different approach
      const maybeEmbroiderReturn = statements`
        const { maybeEmbroider } = require('@embroider/test-setup');
      `;
      maybeEmbroiderReturn[0].comments = comments;

      j(p).replaceWith(maybeEmbroiderReturn);
    });

  // find the previous transformation done and add code after
  return j(root.toSource())
    .find(j.VariableDeclarator, {
      init: {
        type: 'CallExpression',
        callee: { name: 'require' },
        arguments: [{ value: '@embroider/test-setup' }],
      },
    })
    .forEach((p) => {
      j(p.parent).insertAfter(
        statements`

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

          return maybeEmbroider(${newEmberAddon.paths()[0].value.id.name}, {
            compatAdapters: new Map(adapters),
          });
        `,
      );
    })
    .toSource();
};

module.exports.type = 'js';
