module.exports = function (grunt) {
    var fs = require('fs');
    var path = require("path");
    var pkg = require("./package.json");
    var _ = require('lodash');

    // Path to the client src
    var srcPath = path.resolve(__dirname, "src");

    // Constants
    var NW_VERSION = "0.8.4";

    // Load grunt modules
    grunt.loadNpmTasks('hr.js');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-node-webkit-builder');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // Init GRUNT configuraton
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        hr: {
            build: {
                // Base directory for the application
                "base": srcPath,

                // Application name
                "name": "Codebox",

                // Mode debug
                "debug": true,

                // Main entry point for application
                "main": "main",
                "index": grunt.file.read(path.resolve(srcPath, "index.html")),

                // Build output directory
                "build": path.resolve(__dirname, "build"),

                // Static files mappage
                "static": {
                    "images": path.resolve(srcPath, "resources", "images"),
                    "fonts": path.resolve(srcPath, "resources", "fonts")
                },

                // Stylesheet entry point
                "style": path.resolve(srcPath, "resources/stylesheets/main.less"),

                // Modules paths
                'paths': {},
                "shim": {},
                'args': {},
                'options': {}
            }
        },
        nodewebkit: {
            mac: {
                options: {
                    build_dir: './appBuilds',
                    mac: true,
                    win: false,
                    linux32: false,
                    linux64: false,
                    mac_icns: "./desktop/icons/mac.icns",
                    credits: "./desktop/credits.html",
                    version: NW_VERSION,
                    zip: false
                },
                src: [
                    "./**",

                    // grunt.file.copy duplicates symbolic and hard links
                    // so we need to copy it with the shell
                    "!./extras/**",
                ]
            },
            linux: {
                options: {
                    build_dir: './appBuilds',
                    mac: false,
                    win: false,
                    linux32: true,
                    linux64: false,
                    version: NW_VERSION,
                    zip: false
                },
                src: [
                    ".tmp/**"
                ]
            }
        },
        exec: {
            nwbuild: {
                command: "./scripts/nwbuild.sh "+NW_VERSION,
                cwd: './',
                stdout: true,
                stderr: true
            },
            build_extras: {
                command: "./scripts/build_extras.sh",
                cwd: './',
                stdout: true,
                stderr: true
            },
            copy_extras: {
                // Copy and preserve symbolic links
                command: "mv ./extras ./appBuilds/releases/Codebox/mac/Codebox.app/Contents/Resources/app.nw/extras",
                cwd: '.',
                stdout: true,
                stderr: true
            },
            build_mac_release: {
                command: "./scripts/build_mac_dmg.sh",
                cwd: './',
                stdout: true,
                stderr: true
            },
            build_linux_release: {
                command: "./scripts/build_linux_tar.sh",
                cwd: './',
                stdout: true,
                stderr: true
            }
        },
        clean: {
            tmp: ['.tmp/']
        }
    });

    // Build
    grunt.registerTask('build', [
        'hr'
    ]);

    grunt.registerTask('default', [
        'build'
    ]);
};