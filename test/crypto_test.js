
var expect = require ('expect.js');
var crypto = require('crypto');


describe('crypt', function() {
	it ('crypt#pdkdf2', function(done) {

		var pw = "abc";
		var hashes = crypto.getHashes();
		var salt = crypto.randomBytes(128).toString('base64');
		var cryptPw = "";
		//console.dir(salt);
		crypto.pbkdf2(pw, salt, 10000, 128, function(err, key) {
			cryptPw = key.toString('base64');

			crypto.pbkdf2(pw, salt, 10000, 128, function(err, key) {
				var newPw = key.toString('base64');
				expect(newPw).to.be(cryptPw);

				done();
			});
		});

	});


});

