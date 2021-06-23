const prismIncludeLanguages = (PrismObject) => {

  if (typeof window !== 'undefined') {
    window.Prism = PrismObject;

    require(`prismjs/components/prism-bash`);

    delete PrismObject.languages.javascript;
    delete PrismObject.languages.typescript;
    delete PrismObject.languages.jsx;
    delete PrismObject.languages.tsx;

    require(`prismjs/components/prism-javascript`);
    // require(`prismjs/components/prism-js-extras`);

    require(`prismjs/components/prism-typescript`);


    (function (Prism) {
      Prism.languages.insertBefore('typescript', 'constant', {
        'known-class-name': [
          {
            // standard built-ins
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects
            pattern: /\b(?:(?:(?:Uint|Int)(?:8|16|32)|Uint8Clamped|Float(?:32|64))?Array|ArrayBuffer|BigInt|Boolean|DataView|Date|Error|Function|Intl|JSON|Math|Number|Object|Promise|Proxy|Reflect|RegExp|String|Symbol|(?:Weak)?(?:Set|Map)|WebAssembly)\b/,
            alias: 'class-name'
          },
          {
            // errors
            pattern: /\b(?:[A-Z]\w*)Error\b/,
            alias: 'class-name'
          }
        ]
      });

      /**
       * Replaces the `<ID>` placeholder in the given pattern with a pattern for general JS identifiers.
       *
       * @param {string} source
       * @param {string} [flags]
       * @returns {RegExp}
       */
      function withId(source, flags) {
        return RegExp(
          source.replace(/<ID>/g, function () { return /(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*/.source; }),
          flags);
      }
      Prism.languages.insertBefore('typescript', 'keyword', {
        'imports': {
          // https://tc39.es/ecma262/#sec-imports
          pattern: withId(/(\bimport\b\s*)(?:<ID>(?:\s*,\s*(?:\*\s*as\s+<ID>|\{[^{}]*\}))?|\*\s*as\s+<ID>|\{[^{}]*\})(?=\s*\bfrom\b)/.source),
          lookbehind: true,
          inside: Prism.languages.typescript
        },
        'exports': {
          // https://tc39.es/ecma262/#sec-exports
          pattern: withId(/(\bexport\b\s*)(?:\*(?:\s*as\s+<ID>)?(?=\s*\bfrom\b)|\{[^{}]*\})/.source),
          lookbehind: true,
          inside: Prism.languages.typescript
        }
      });

      Prism.languages.typescript['keyword'] = [
        {
          pattern: /\b(?:abstract|as|asserts|async|await|break|case|catch|class|const|constructor|continue|debugger|declare|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|is|keyof|let|module|namespace|new|null|of|package|private|protected|public|readonly|return|require|set|static|super|switch|this|throw|try|type|typeof|undefined|var|void|while|with|yield)\b/,
          alias: 'keyword',
        },
      ];

      Prism.languages.typescript['keyword'].unshift(
        {
          pattern: /\b(?:as|default|export|from|import)\b/,
          alias: 'module'
        },
        {
          pattern: /\b(?:await|break|catch|continue|do|else|for|finally|if|return|switch|throw|try|while|yield)\b/,
          alias: 'control-flow'
        },
        {
          pattern: /\bnull\b/,
          alias: ['null', 'nil']
        },
        {
          pattern: /\bundefined\b/,
          alias: 'nil'
        }
      );

      Prism.languages.insertBefore('typescript', 'operator', {
        'spread': {
          pattern: /\.{3}/,
          alias: 'operator'
        },
        'arrow': {
          pattern: /=>/,
          alias: 'operator'
        }
      });

      Prism.languages.insertBefore('typescript', 'punctuation', {
        'property-access': {
          pattern: withId(/(\.\s*)#?<ID>/.source),
          lookbehind: true
        },
        'dom': {
          // this contains only a few commonly used DOM variables
          pattern: /\b(?:document|location|navigator|performance|(?:local|session)Storage|window)\b/,
          alias: 'variable'
        },
        'console': {
          pattern: /\bconsole(?=\s*\.)/,
          alias: 'class-name'
        }
      });
    }(PrismObject));


    require(`prismjs/components/prism-jsx`);
    require(`prismjs/components/prism-tsx`);


    delete window.Prism;
  }
};

export default prismIncludeLanguages;
