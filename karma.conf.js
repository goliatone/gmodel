// Karma configuration
// Generated on Sun Mar 31 2013 21:59:25 GMT+0200 (CEST)


// base path, that will be used to resolve files and exclude
basePath = '';


// list of files / patterns to load in the browser
files = [
    JASMINE,
    JASMINE_ADAPTER,
    REQUIRE,
    REQUIRE_ADAPTER,

    {pattern: 'lib/gpub/src/gpub.js', included: false},
    {pattern: 'lib/requirejs/require.js', included: false},
    {pattern: 'src/*.js', included: false},
    {pattern: 'test/spec/*-spec.js', included: false},

    // helpers & fixtures for jasmine-jquery
    { pattern: 'test/helpers/*.js', included: true },

    'test/test-main.js',
];


// list of files to exclude
exclude = [];


// test results reporter to use
// possible values: 'dots', 'progress', 'junit'
reporters = ['progress'];


// web server port
port = 9876;


// cli runner port
runnerPort = 9898;


// enable / disable colors in the output (reporters and logs)
colors = true;


// level of logging
// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
logLevel = LOG_INFO;


// enable / disable watching file and executing tests whenever any file changes
autoWatch = true;


// Start these browsers, currently available:
// - Chrome
// - ChromeCanary
// - Firefox
// - Opera
// - Safari (only Mac)
// - PhantomJS
// - IE (only Windows)
browsers = ['Chrome'];


// If browser does not capture in given timeout [ms], kill it
captureTimeout = 60000;


// Continuous Integration mode
// if true, it capture browsers, run tests and exit
singleRun = false;
