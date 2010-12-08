var argsparserpackage = {
    "name": "argsparser",
    "description": "A tiny command line arguments parser",
    "version": "0.0.2",
    "author": "Oleg Slobodskoi <oleg008@gmail.com>",
    "repository": {
        "type": "git",
        "url": "http://github.com/kof/node-argsparser.git"
    },
    "keywords": [ "arguments", "options", "command line", "parser" ],
    "directories": { "lib": "./lib" },
    "engines": { "node": ">= 0.2.0" },
    "scripts": { "install": "node test/test.js" },
    "licenses": [
        {
            "type": "MIT",
            "url" : "http://www.opensource.org/licenses/mit-license.php"
        }
    ]
};
/***
 Usage Examples
 
 node script.js -> {"node": "script.js"}
 
 node script.js -o -> {"node": "script.js", "-o": true}
 
 node script.js -o test -> {"node": "script.js", "-o": "test"}
 
 node script.js -a testa --b testb -> {node: "script.js", "-a": "testa", "--b": "testb"}
 
 node script.js -paths /test.js /test1.js -> {node: "script.js", "-paths": ["/test.js", "/test1.js"]}

 */ 


/**
* Parser arguments array
* @param {Array} args optional
* @return {Object} opts
*/
var argsParse = function( args ) {
    // args is optional, default is process.argv
    // args = args || process.argv;
    
    var opts = {},
        curSwitch;

    args.forEach( function( arg ) {
        var curValType = typeof opts[curSwitch];
        // its a switch
        if ( /^-|--/.test( arg ) ) {
            opts[arg] = true;
            curSwitch = arg;
        // this arg is some data
        } else if ( curSwitch ) {
            if ( arg === "false" ) {
                arg = false;
            } else if ( arg === "true" ) {
                arg = true;
            } else if ( !isNaN( arg ) ) {
                arg = Number( arg );
            }

            if ( curValType === "boolean" ) {
                opts[curSwitch] = arg;
            } else if ( curValType === "string" ) {
                opts[curSwitch] = [ opts[curSwitch], arg ];
            } else {
                opts[curSwitch].push( arg );
            }
        } else {
            opts[arg] = true;
            curSwitch = arg;
        }
    });
    
    return opts;
};
