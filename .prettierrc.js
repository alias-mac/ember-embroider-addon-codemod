module.exports = {
  singleQuote: true,
  trailingComma: 'all',
  overrides: [
    {
      files: '*.md',
      options: {
        singleQuote: false,
        proseWrap: 'always',
      },
    },
  ],
};
