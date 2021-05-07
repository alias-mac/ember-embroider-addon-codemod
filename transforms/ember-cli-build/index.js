const { getParser } = require('codemod-cli').jscodeshift;

module.exports = function transformer(file, api) {
  const j = getParser(api);
  const { statement, statements } = j.template;
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

  // find the the variable assigned to `new EmberAddon()`
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
    // already transformed
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
        statement`return maybeEmbroider(${
          newEmberAddon.paths()[0].value.id.name
        });`,
      );
    })
    .toSource();
};

module.exports.type = 'js';
