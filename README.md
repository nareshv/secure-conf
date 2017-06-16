# Securing Node.js Configuration Files

This library makes your application configuration files more secure by providing methods to encrypt at build-time & decrypt at runtime.

## Sample configuration file

```
{
    "production" : {
        "db"    : {
            "database" : "mysql",
            "user"     : "root",
            "password" : "!EDFT#$@%^TSSDFRT"
        },
        "app"   : {
            "port"     : 5555
        }
    }
}
```

## Secure the configuration file using the following node code

```
#!/usr/bin/env node

var SecureConf = require('secure-conf');
var sconf      = new SecureConf();
var pw         = require("pw");

// You can pass it from anywhere you want.
process.stdout.write("Password: ");

pw(function(password){
    sconf.encryptFile(
        "./test.json",
        "./test.json.enc",
        password
        function(err, f, ef, ec) {
            if (err) {
                console.log("failed to encrypt %s, error is %s", f, err);
            } else {
                console.log("encrypt %s to %s complete.", f, ef);
                console.log("encrypted contents are %s", ec);
            }
        }
    );
})

```

## Use encrypted configuration file in your app

When you launch the below program, you will need to enter the password that 
you have used to create the config file `test.json.enc`

```
#!/usr/bin/env node

var SecureConf = require('secure-conf');
var sconf      = new SecureConf();
var ef         = "./test.json.enc";
var express    = require('express');
var app        = express();

// You can pass it from anywhere you want.
process.stdout.write("Password: ");

var pw         = require("pw");

pw(function(password){
    sconf.decryptFile(ef, password, function(err, file, content) {
        if (err) {
            console.log('Unable to retrieve the configuration contents.');
        } else {
            var config = JSON.parse(content);
            app.listen(config.production.app.port);
        }
    });
});

```

NOTE: This module is not a substitute for your server/application security. Passwords are freely available in the RAM,
a determined [Hacker](http://en.wikipedia.org/wiki/Hacker_%28computer_security%29) can get whatever she wants. 

## Example Run

This example shows how to encrypt a sample configuration file using a strong password and use encrypted file in the actual location.

```
[nareshv@nareshv ~]$ cd /tmp
[nareshv@nareshv tmp]$ git clone https://github.com/nareshv/secure-conf
Cloning into 'secure-conf'...
remote: Counting objects: 65, done.
remote: Compressing objects: 100% (7/7), done.
remote: Total 65 (delta 3), reused 5 (delta 2), pack-reused 56
Unpacking objects: 100% (65/65), done.
Checking connectivity... done.
[nareshv@nareshv tmp]$ cd secure-conf/
[nareshv@nareshv secure-conf]$ npm install
secure-conf@0.0.5 /tmp/secure-conf
└── pw@0.0.4
[nareshv@nareshv secure-conf]$ cd examples/
[nareshv@nareshv examples]$ ls
test.js  test.json  test.json.enc
[nareshv@nareshv examples]$ node test.js
======== Supported Encryption Algorithms =======
["CAST-cbc","aes-128-cbc","aes-128-cbc-hmac-sha1","aes-128-cbc-hmac-sha256","aes-128-ccm","aes-128-cfb","aes-128-cfb1","aes-128-cfb8","aes-128-ctr","aes-128-ecb","aes-128-gcm","aes-128-ofb","aes-128-xts","aes-192-cbc","aes-192-ccm","aes-192-cfb","aes-192-cfb1","aes-192-cfb8","aes-192-ctr","aes-192-ecb","aes-192-gcm","aes-192-ofb","aes-256-cbc","aes-256-cbc-hmac-sha1","aes-256-cbc-hmac-sha256","aes-256-ccm","aes-256-cfb","aes-256-cfb1","aes-256-cfb8","aes-256-ctr","aes-256-ecb","aes-256-gcm","aes-256-ofb","aes-256-xts","aes128","aes192","aes256","bf","bf-cbc","bf-cfb","bf-ecb","bf-ofb","blowfish","camellia-128-cbc","camellia-128-cfb","camellia-128-cfb1","camellia-128-cfb8","camellia-128-ecb","camellia-128-ofb","camellia-192-cbc","camellia-192-cfb","camellia-192-cfb1","camellia-192-cfb8","camellia-192-ecb","camellia-192-ofb","camellia-256-cbc","camellia-256-cfb","camellia-256-cfb1","camellia-256-cfb8","camellia-256-ecb","camellia-256-ofb","camellia128","camellia192","camellia256","cast","cast-cbc","cast5-cbc","cast5-cfb","cast5-ecb","cast5-ofb","des","des-cbc","des-cfb","des-cfb1","des-cfb8","des-ecb","des-ede","des-ede-cbc","des-ede-cfb","des-ede-ofb","des-ede3","des-ede3-cbc","des-ede3-cfb","des-ede3-cfb1","des-ede3-cfb8","des-ede3-ofb","des-ofb","des3","desx","desx-cbc","id-aes128-CCM","id-aes128-GCM","id-aes128-wrap","id-aes192-CCM","id-aes192-GCM","id-aes192-wrap","id-aes256-CCM","id-aes256-GCM","id-aes256-wrap","id-smime-alg-CMS3DESwrap","idea","idea-cbc","idea-cfb","idea-ecb","idea-ofb","rc2","rc2-40-cbc","rc2-64-cbc","rc2-cbc","rc2-cfb","rc2-ecb","rc2-ofb","rc4","rc4-40","rc4-hmac-md5","seed","seed-cbc","seed-cfb","seed-ecb","seed-ofb"]
====
Please type in a password to encrypt contents of 'test.json' file .
*****
encrypt ./test.json to ./test.json.enc complete.
encrypted contents are 98579719d144565c48755fce8be2a97cb655892e0ca961652763b88cc1a290fb
decrypt ./test.json.enc complete.
Original contents are { "hello" : "world" }

[nareshv@nareshv examples]$ cat ./test.json.enc
98579719d144565c48755fce8be2a97cb655892e0ca961652763b88cc1a290fb

```

Now you can use `./test.json.enc` in your code like above example, instead of using plain-text configuration files.

## Testing

There is a sample script under `examples` directory. Follow these steps to test the example.

```bash

cd examples
node test.js
<enter password of your choice when asked>

<see that decrypted content is same as what is in 'test.json'>
```

## Inspiration

The way we protect the ssl certs and used on Apache/nginx via startup passphrase.

## Configuration

You can pass the following parameters to the constructor

* `prompt` : Prompt that has to be shown
* `algo`   : Algorithm that should be used for both encryption/decryption (see nodejs docs for supported symmetric algorithms)

## Version

0.0.5

## License

MIT

## Author

- nareshv@

## Contributors

- ugursogukpinar

## Security

Read the code.

## Bugs

Use the software and file them if any.
