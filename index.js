var SecureConf = function(options) {
    options      = options || {};
    this.options = {
        prompt : 'File Password : ',
        algo   : 'aes-128-ecb',
        file   : {
            encoding : 'utf8',
            out_text : 'hex'
        }
    };
    this.options.prompt = options.prompt ? options.prompt : this.options.prompt;
    this.options.algo   = options.algo   ? options.algo   : this.options.algo;
    this.options.file.encoding = options.file_encoding ? options.file_encoding : this.options.file.encoding;
    this.options.file.out_text = options.file_out_text ? options.file_out_text : this.options.file.out_text;
    this.pw = require('pw');
    this.fs = require('fs');
    this.crypto = require('crypto');
};
SecureConf.prototype.encryptContent = function(content, pass) {
    var self = this, cipher, encrypted;
    try {
        cipher = self.crypto.createCipher(self.options.algo, pass);
        encrypted  = cipher.update(content, self.options.file.encoding, self.options.file.out_text);
        encrypted += cipher.final(self.options.file.out_text);
    } catch(ex) {}
    return encrypted;
};
SecureConf.prototype.decryptContent = function(content, pass) {
    var self = this, decipher, decrypted;
    try {
        decipher = self.crypto.createDecipher(self.options.algo, pass);
        decrypted = decipher.update(content, self.options.file.out_text, self.options.file.encoding);
        decrypted += decipher.final(self.options.file.encoding);
    } catch(ex) {}
    return decrypted;
};
SecureConf.prototype.decryptFile = function(file, callback) {
    var self = this, dec;
    process.stdout.write(self.options.prompt);
    this.pw(function (password) {
        dec = self.decryptContent(self.fs.readFileSync(file, { encoding : self.options.file.encoding }),password);
        if (dec === undefined) {
            callback('Decryption Failed', file);
        } else {
            callback(null, file, dec);
        }
    });
};
SecureConf.prototype.encryptFile = function(file, encfile, callback) {
    var self = this, enc;
    process.stdout.write(self.options.prompt);
    this.pw(function (password) {
        enc = self.encryptContent(self.fs.readFileSync(file), password);
        if (enc === undefined) {
            callback('Encryption Failed', file, encfile, enc);
        } else {
            self.fs.writeFileSync(encfile, enc);
            callback(null, file, encfile, enc);
        }
    });
};
SecureConf.prototype.getCiphers = function() {
    return this.crypto.getCiphers();
}
module.exports = SecureConf;
