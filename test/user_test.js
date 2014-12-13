
var expect = require ('expect.js');
var User = require('../routes/user');
var Database = require('../routes/db/database');

/*
describe('User', function() {
	it ('User#create', function(done) {

		User.create("name", "123", function(err, user){
			expect(user.key).to.be("name");
			expect(user.password.length).to.be.above(128);
			expect(user.salt).to.exist;

			done();
		});
	});

	it ('User#create & #validate', function(done) {
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
*/


describe('User & database', function() {
 	var db = new Database();

	beforeEach( function(done) {
		db.connect( function(err){
			db.clearDb();
			done();
		});
	});


	it ('user#whoIsFollowingMe', function(done) {
		db.addUser({key:"aa", age:44}, function(err, uA){
			db.addUser({key:"bb", age:22}, function(err, uB){
				db.addUser({key:"cc", age:33}, function(err, uC){
					User.follow(db, uA.key, uB.key, function(err, user) {
						User.follow(db, uA.key, uC.key, function(err, user) {
							User.whoIsFollowingMe(db, uB.key, function(err, userList) {
								expect(err).to.be(null);
								expect(userList).not.to.be(null);
								expect(userList).to.eql(['aa']);
								done();
							});
						});
					});
				});
			});
		});
	});



});



