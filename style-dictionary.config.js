module.exports = {
  // style dictionaryが参照するファイル
  source: ["dist/output.json"],

  // ファイル生成する
  platforms: {
    ts: {
      buildPath: "dist/tokens/",
      transformGroup: "js",
      files: [
        {
          format: "customFormat", // ここで自身で定義したformat の関数名を指定する
          destination: "tokens.ts",
        },
      ],
    },
  },

  /**
   * カスタムフォーマット
   * https://github.com/amzn/style-dictionary/blob/main/examples/advanced/variables-in-outputs/sd.config.js
   */
  format: {
    // Adding a custom format to show how to get an alias's name.
    customFormat: function ({ dictionary, options }) {
      const all = dictionary.allTokens
        .map((token) => {
          let value = JSON.stringify(token.value);
          // new option added to decide whether or not to output references
          if (options.outputReferences) {
            // the `dictionary` object now has `usesReference()` and
            // `getReferences()` methods. `usesReference()` will return true if
            // the value has a reference in it. `getReferences()` will return
            // an array of references to the whole tokens so that you can access
            // their names or any other attributes.
            if (dictionary.usesReference(token.original.value)) {
              const refs = dictionary.getReferences(token.original.value);
              refs.forEach((ref) => {
                value = value.replace(ref.value, function () {
                  return `${ref.name}`;
                });
              });
            }
          }
          const comment = !token.description ? "" : ` // ${token.description}`;

          // type + name で名前を構築する
          return `export const ${token.type}${token.name} = ${value};${comment}`;
        })
        .join(`\n`);

      console.log(all);
      return all;
    },
  },
};
