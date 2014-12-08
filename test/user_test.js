
var expect = require ('expect.js');
var User = require('../routes/user');


describe('user', function() {
	it ('create', function(done) {

		User.create("name", "123", function(err, user){
			expect(user.key).to.be("name");
			expect(user.password.length).to.be.above(128);
			expect(user.salt).to.exist;

			done();
		});
	});

	it ('create & validate', function(done) {
		var pw = "48bldf";
		User.create("name", pw, function(err, user){
			expect(user.key).to.be("name");
			User.validatePassword(user, pw, function(err, result) {
				expect(result).to.be(true);
				done();
			});
		});
	});

});


