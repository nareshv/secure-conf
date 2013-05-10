var SecureConf = function() {
    this.pw = require('pw');
    this.fs = require('fs');
    this.crypto = require('crypto');
};
SecureConf.prototype.encryptContent = function(content, pass) {
    var self = this, cipher, encrypted;
    try {
        cipher = self.crypto.createCipher('aes-128-ecb', pass);
        encrypted = cipher.update(content, 'utf8', 'hex');
        encrypted += cipher.final('hex');
    } catch(ex) {}
    return encrypted;
};
SecureConf.prototype.decryptContent = function(content, pass) {
    var self = this, decipher, decrypted;
    try {
        decipher = self.crypto.createDecipher('aes-128-ecb', pass);
        decrypted = decipher.update(content, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
    } catch(ex) {}
    return decrypted;
};
SecureConf.prototype.decryptFile = function(file, callback) {
    var self = this, dec;
    process.stdout.write('File Password: ');
    this.pw(function (password) {
        dec = self.decryptContent(self.fs.readFileSync(file),password);
        if (dec === undefined) {
            callback('Decryption Failed', file);
        } else {
            callback(null, file, dec);
        }
    });
};
SecureConf.prototype.encryptFile = function(file, encfile, callback) {
    var self = this, enc;
    process.stdout.write('File Password: ');
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
module.exports = SecureConf;
