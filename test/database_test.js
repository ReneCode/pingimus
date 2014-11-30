var expect = require ('expect.js');
var Database = require('../routes/db/Database.js');

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


describe('Database connect', function() {
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


	it ('addUser', function(done) {
		db.addUser({name:"abc", age:47}, function(err, user){
			expect(err).to.be(null);
			expect(user.name).to.be("abc");
			expect(user.age).to.be(47);
			expect(user.id).to.be(1);

			db.addUser({name:"xyz", age:66}, function(err, user){
				expect(err).to.be(null);
				expect(user.name).to.be("xyz");
				expect(user.age).to.be(66);
				expect(user.id).to.be(2);

				done();
			});
		});
	});

	it ('addUser + getUser', function(done) {
		db.addUser({name:"abc", age:47}, function(err, user){
			expect(err).to.be(null);
			expect(user.name).to.be("abc");
			expect(user.age).to.be(47);
			expect(user.id).to.be(1);

			db.addUser({name:"xyz", age:66}, function(err, user){
				expect(err).to.be(null);
				expect(user.name).to.be("xyz");
				expect(user.age).to.be(66);
				expect(user.id).to.be(2);

				db.getUser(1, function(err, user) {
					expect(err).to.be(null);
					expect(user.name).to.be("abc");
					expect(user.age).to.be(47);
					expect(user.id).to.be(1);
	
					db.getUser(2, function(err, user) {
						expect(err).to.be(null);
						expect(user.name).to.be("xyz");
						expect(user.age).to.be(66);
						expect(user.id).to.be(2);
			
						done();
					});
				});
			});
		});
	});


});

