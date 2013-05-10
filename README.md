# Secure Node.js Configuration Files

Use this module to secure your configuration files.

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

sconf.encryptFile(
    "./test.json",
    "./test.json.enc",
    function(err, f, ef, ec) {
        if (err) {
            consoel.log("failed to encrypt %s, error is %s", f, err);
        } else {
            console.log("encrypt %s to %s complete.", f, ef);
            console.log("encrypted contents are %s", ec);
        }
    }
);
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

sconf.decryptFile(ef, function(err, file, content) {
    if (err) {
        console.log('Unable to retrieve the configuration contents.');
    } else {
        var config = JSON.parse(content);
        app.listen(config.production.app.port);
    }
});
```

NOTE: This module is not a substitute for your server encryption. Its just inspired by the way
we encrypt the ssl certs and use them while launching apache/nginx, etc.

## Configuration

You can pass the following parameters to the constructor

* `prompt` : Prompt that has to be shown
* `algo`   : Algorithm that should be used for both encryption/decryption (see nodejs docs for supported symmetric algorithms)

## License

MIT

## Author

nareshv@
