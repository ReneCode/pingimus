var expect = require ('expect.js');
var Database = require('../routes/db/Database.js');
var User = require('../routes/User.js');

describe('Database init', function() {
	it ('init', function() {
		var db = new Database();
		expect( db.connect ).to.be.a('function');
	});

	it ('connect', function(done) {
		var db = new Database();
		db.connect( function(err) {
			expect( err ).to.be(null);
			done();
		});
	});

});


describe('Database session', function() {
 	var db = new Database();

	beforeEach( function(done) {
		db.connect( function(err){
			db.clearDb();
			done();
		});
	});

	it ('addSession + getSession', function(done) {
		db.addSession("reneId47", function(err,sessionid) {
			expect(err).to.be(null);
			expect(sessionid.length).to.be.above(30);
			db.getSession(sessionid, function(err, userid){
				expect(userid).to.exist;
				expect(userid).to.be('reneId47');
				done();
			});

		});
	});


	it ('addSession + other getSession', function(done) {
		db.addSession("rene", function(err,data) {
			expect(err).to.be(null);
			expect(data.length).to.be.above(20);

			db.getSession(43, function(err, userid){
				expect(userid).to.be(null);
				done();
			});

		});
	});

	it ('getSession of empty', function(done) {
		db.getSession(42, function(err, userid){
			expect(err).to.be('session not found');
			expect(userid).to.be(null);
			done();
		});
	});


	it ('addSession + deleteSession', function(done) {
		db.addSession("rene", function(err,sessionid) {
			db.deleteSession(sessionid, function(err, result) {
				expect(result).to.be(1);

				db.getSession(sessionid, function(err, userid){
					expect(userid).to.be(null);
					done();
				});
			});
		});
	});


	it ('addSession + deleteOtherSession', function(done) {
		db.addSession("rene", function(err,sessionid) {
			db.deleteSession("otherSession", function(err, result) {
				expect(result).to.be(0);	// can not be deleted
				db.getSession(sessionid, function(err, userid){
					expect(userid).to.be("rene");
					done();
				});
			});
		});
	});
});



describe('Database user', function() {
 	var db = new Database();

	beforeEach( function(done) {
		db.connect( function(err){
			db.clearDb();
			done();
		});
	});

	it ('addUser', function(done) {
		db.addUser({key:"abc", age:47}, function(err, user){
			expect(err).to.be(null);
			expect(user.key).to.be("abc");
			expect(user.age).to.be(47);

			db.addUser({key:"xyz", age:66}, function(err, user){
				expect(err).to.be(null);
				expect(user.key).to.be("xyz");
				expect(user.age).to.be(66);

				done();
			});
		});
	});

	it ('addUser + getUser', function(done) {
		db.addUser({key:"abc", age:47}, function(err, user){
			expect(err).to.be(null);
			expect(user.key).to.be("abc");
			expect(user.age).to.be(47);

			db.addUser({key:"xyz", age:66}, function(err, user){
				expect(err).to.be(null);
				expect(user.key).to.be("xyz");
				expect(user.age).to.be(66);

				db.getUser("abc", function(err, u1) {
					expect(err).to.be(null);
					expect(u1.key).to.be("abc");
					expect(u1.age).to.be(47);
	
					db.getUser("xyz", function(err, u2) {
						expect(err).to.be(null);
						expect(u2.key).to.be("xyz");
						expect(u2.age).to.be(66);
			
						done();
					});
				});
			});
		});
	});


	it ('getUser, not existent user', function(done) {
		db.addUser({key:"abc", age:47}, function(err, user){
			expect(err).to.be(null);
			expect(user.key).to.be("abc");
			expect(user.age).to.be(47);

			db.getUser("xyz", function(err, u1) {
				expect(err).to.be(null);
				expect(u1).to.be(null);
				done();
			});
		});
	});




	it ('existsUser', function(done) {
		db.addUser({key:"abc", age:47}, function(err, user){
			expect(err).to.be(null);
			expect(user.key).to.be("abc");
			expect(user.age).to.be(47);

			db.addUser({key:"xyz", age:66}, function(err, u2){
				expect(err).to.be(null);
				expect(u2.key).to.be("xyz");
				expect(u2.age).to.be(66);

				db.existsUser("abc", function(err, r1) {
					expect(r1).to.be(true);

					db.existsUser("123", function(err, r2) {
						expect(r2).to.be(false);

						db.existsUser("xyz", function(err, r3) {
							expect(r3).to.be(true);
							done();
						});
					});
				});
			});
		});
	});



	it ('addFollower', function(done) {
		db.addUser({key:"ab", age:44}, function(err, uAb){
			db.addUser({key:"xy", age:22}, function(err, uXy){
				db.addUser({key:"zz", age:33}, function(err, uZz){
					User.follow(db, uAb.key, uXy.key, function(err, user) {
						User.follow(db, uAb.key, uZz.key, function(err, user) {
							expect(err).to.be(null);
							expect(user.key).to.be("ab");
							expect(user.age).to.be(44);
							expect(user.follower).to.eql(["xy","zz"]);
							done();
						});
					});
				});
			});
		});
	});


	it ('addFollower catch duplicate', function(done) {
		db.addUser({key:"ab", age:44}, function(err, uAb){
			db.addUser({key:"xy", age:22}, function(err, uXy){
				User.follow(db, uAb.key, uXy.key, function(err, user) {
					User.follow(db, uAb.key, uXy.key, function(err, user) {
						expect(err).to.be(null);
						expect(user.key).to.be("ab");
						expect(user.age).to.be(44);
						expect(user.follower).to.eql(["xy"]);
						done();
					});
				});
			});
		});
	});



	it ('addFollower # not existing follower', function(done) {
		db.addUser({key:"ab", age:44}, function(err, uAb){
			db.addUser({key:"xy", age:22}, function(err, uXy){
				User.follow(db, uAb.key, 'abcd', function(err, user) {
					expect(err).to.be("can't find follower");
					expect(user).to.be(null);
					done();
				});
			});
		});
	});


	it ('addFollower # whoIsFollowingMe', function(done) {
		db.addUser({key:"aa", age:44}, function(err, uA){
			db.addUser({key:"bb", age:22}, function(err, uB){
				db.addUser({key:"cc", age:33}, function(err, uC){
					User.follow(db, uA.key, uB.key, function(err, user) {
						User.follow(db, uA.key, uC.key, function(err, user) {
							db.getUser(uA.key, function(err, userA) {
								expect(err).to.be(null);
								expect(userA.key).to.be("aa");
								expect(userA.follower).to.eql(["bb", "cc"]);
								db.getUser(uB.key, function(err, userB) {
									expect(err).to.be(null);
									expect(userB.key).to.be("bb");
									expect(userB.whoIsFollowingMe).to.eql(["aa"]);
									done();
								});
							});
						});	
					});
				});
			});
		});
	});


});



describe('Database sketch', function() {
 	var db = new Database();

	beforeEach( function(done) {
		db.connect( function(err){
			db.clearDb();
			done();
		});
	});


	it ('addSketch', function(done) {
		db.addSketch('abc', {x:46, y:42}, function(err, data) {
			expect(err).to.be(null);
			expect(data).to.eql({x:46, y:42});
			done();
		});
	});

	it ('addSketch & getSketch', function(done) {
		db.addSketch('abc', {x:46, y:42}, function(err, data) {
			db.getSketch('abc', function(err, result) {
				expect(err).to.be(null);
				expect(result).to.eql([{x:46, y:42}]);
				done();
			});
		});
	});

	it ('addSketch & getSketch of other', function(done) {
		db.addSketch('abc', {x:46, y:42}, function(err, data) {
			db.getSketch('xyz', function(err, result) {
				expect(err).to.be(null);
				expect(result).to.eql([]);
				done();
			});
		});
	});

	it ('addSketch more & getSketch', function(done) {
		db.addSketch('abc', {x:46, y:42}, function(err, data) {
			db.addSketch('abc', {x:55, y:22}, function(err, data) {
				db.getSketch('abc', function(err, result) {
					expect(err).to.be(null);
					expect(result).to.eql([{x:46, y:42}, {x:55,y:22}]);
					done();
				});
			});
		});
	});


});

