"use strict";

exports.__esModule = true;

const webpackConfig = require("./test.webpack.config.js");
const tsconfig = require("./test.tsconfig.json");
const path = require("path");
const testRecursivePath = "test/visualTest.ts";
const srcOriginalRecursivePath = "src/**/*.ts";
const coverageFolder = "coverage";

process.env.CHROME_BIN = require("puppeteer").executablePath();

module.exports = function (config) {
    let files = undefined;
    config.set({
        browserNoActivityTimeout: 100000,
        browsers: ["ChromeHeadless"],
        colors: true,
        frameworks: ["jasmine"],
        reporters: ["progress", "junit", "coverage-istanbul"],
        junitReporter: {
            outputDir: path.join(__dirname, coverageFolder),
            outputFile: "TESTS-report.xml",
            useBrowserName: false,
        },
        coverageReporter: {
            dir: path.join(__dirname, coverageFolder),
            reporters: [
                // reporters not supporting the `file` property
                { type: "html", subdir: "html-report" },
                { type: "lcov", subdir: "lcov" },
                // reporters supporting the `file` property, use `subdir` to directly
                // output them in the `dir` directory
                { type: "cobertura", subdir: ".", file: "cobertura-coverage.xml" },
                { type: "lcovonly", subdir: ".", file: "report-lcovonly.txt" },
                { type: "text-summary", subdir: ".", file: "text-summary.txt" },
            ],
        },
        coverageIstanbulReporter: {
            reports: ["html", "lcovonly", "text-summary", "cobertura"],
            dir: path.join(__dirname, coverageFolder),
            "report-config": {
                html: {
                    subdir: "html-report",
                },
            },
            combineBrowserReports: true,
            fixWebpackSourcePaths: true,
            verbose: false,
        },
        singleRun: true,
        plugins: [
            "karma-coverage",
            "karma-typescript",
            "karma-webpack",
            "karma-jasmine",
            "karma-sourcemap-loader",
            "karma-chrome-launcher",
            "karma-junit-reporter",
            "karma-coverage-istanbul-reporter",
        ],
        files: [
            "node_modules/jquery/dist/jquery.min.js",
            "node_modules/jasmine-jquery/lib/jasmine-jquery.js",
            testRecursivePath,
            {
                pattern: srcOriginalRecursivePath,
                included: false,
                served: true,
            },
            {
                pattern: "./capabilities.json",
                watched: false,
                served: true,
                included: false,
            },
        ],
        preprocessors: ((files = {}), (files[testRecursivePath] = ["webpack", "coverage"]), files),
        typescriptPreprocessor: {
            options: tsconfig.compilerOptions,
        },
        mime: {
            "text/x-typescript": ["ts", "tsx"],
        },
        webpack: webpackConfig,
        webpackMiddleware: {
            stats: "errors-only",
        },
    });
};
