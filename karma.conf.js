// Karma configuration
// Generated on Thu May 18 2017 10:47:12 GMT+0300 (+03)

const path = require('path');

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai', 'sinon'],


    // list of files / patterns to load in the browser
    files: [
      './framework/*.spec.js'
    ],


    // list of files to exclude
    exclude: [],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      '**/*.spec.js': ['webpack']
    },

    // webpack configuration
    webpack: {
      devtool: 'inline-source-map',
      module: {
      rules: [
          {
            test: /\.js$/,
            use: [{
              loader: 'babel-loader',
              options: { presets: ['es2015'] },
            }],
          },
          // instrument only testing sources with Istanbul 
          {
            test: /\.js$/,
            exclude: /(node_modules|\.spec\.ts$)/,
            loader: 'istanbul-instrumenter-loader',
            enforce: 'post',
            options: {
              esModules: true
            }
          }
        ]
      }
    },

    webpackServer: {
      noInfo: true //please don't spam the console when running in karma!
    },

    webpackMiddleware: {
      stats: 'errors-only',
      noInfo: true
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: [ 'progress', 'coverage-istanbul' ],

    plugins: [
      'karma-phantomjs-launcher',
      'karma-coverage-istanbul-reporter',
      'karma-mocha',
      'karma-chai',
      'karma-sinon',
      'karma-webpack'
    ],

    // any of these options are valid: https://github.com/istanbuljs/istanbul-api/blob/47b7803fbf7ca2fb4e4a15f3813a8884891ba272/lib/config.js#L33-L38
    coverageIstanbulReporter: {
      reports: ['lcov'],
      dir: path.join(__dirname, 'coverage', 'html')
    },
    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN ||
    // config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  });
};
