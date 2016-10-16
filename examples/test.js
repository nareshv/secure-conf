#!/usr/bin/env node

var SecureConf = require('../index.js');
var sconf      = new SecureConf();

var pw = require('pw');

console.log("======== Supported Encryption Algorithms =======");
console.log(JSON.stringify(sconf.getCiphers()));
console.log("====");

console.log("Please type in a password to encrypt contents of 'test.json' file .");


pw(function (password) {
    sconf.encryptFile(
        "./test.json",
        "./test.json.enc",
        password,
        function(err, f, ef, ec) {
            if (err) {
                console.log("failed to encrypt %s, error is %s", f, err);
            } else {
                console.log("encrypt %s to %s complete.", f, ef);
                console.log("encrypted contents are %s", ec);
                sconf.decryptFile(ef, password, function(err, file, content) {
                    if (err) {
                        console.log('Failed to decrypt %s, error is %s', file, err);
                    } else {
                        console.log("decrypt %s complete.", file);
                        console.log("Original contents are %s", content);
                    }
                });
            }
        }
    );
});
