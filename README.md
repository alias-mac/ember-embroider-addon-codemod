# ember-embroider-addon-codemod

A collection of codemods for ember-embroider-addon-codemod.

The codemods provided by this package are based on
[@embroider/test-setup documentation](https://github.com/embroider-build/embroider/tree/master/packages/test-setup#maybeembroiderapp-embroideroptions)

## Usage

To run a specific codemod from this project, you would run the following:

```
npx ember-embroider-addon-codemod <TRANSFORM NAME> path/of/files/ or/some**/*glob.js

# or

yarn global add ember-embroider-addon-codemod
ember-embroider-addon-codemod <TRANSFORM NAME> path/of/files/ or/some**/*glob.js
```

## Local Usage

```
node ./bin/cli.js <TRANSFORM NAME> path/of/files/ or/some**/*glob.js
```

## Transforms

<!--TRANSFORMS_START-->
* [ember-cli-build](transforms/ember-cli-build/README.md)
<!--TRANSFORMS_END-->

## Contributing

### Installation

- clone the repo
- change into the repo directory
- `yarn`

### Running tests

- `yarn test`

### Update Documentation

- `yarn update-docs`
