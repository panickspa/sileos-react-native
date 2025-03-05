module.exports = {
  presets: ['module:@react-native/babel-preset'],
  env: {
    production: {
      plugins: [
        'transform-remove-console',
        [
          'module:react-native-dotenv',
          {
            envName: 'APP_ENV',
            moduleName: '@env',
            path: '.env',
            blocklist: null,
            allowlist: null,
            // blacklist: null, // DEPRECATED
            // whitelist: null, // DEPRECATED
            safe: false,
            allowUndefined: true,
            verbose: false,
          },
        ],
      ],
    },
    development: {
      plugins: [
        'transform-remove-console',
        [
          'module:react-native-dotenv',
          {
            envName: 'APP_ENV',
            moduleName: '@env',
            path: '.env',
            blocklist: null,
            allowlist: null,
            // blacklist: null, // DEPRECATED
            // whitelist: null, // DEPRECATED
            safe: false,
            allowUndefined: true,
            verbose: false,
          },
        ],
      ],
    },
  },
};
