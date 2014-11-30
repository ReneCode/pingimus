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
		db.addSession("reneId47", function(err,data) {
			expect(err).to.be(null);
			expect(data.result).to.be(1);
			var sessionId = data.sessionid;
			db.getSession(sessionId, function(err, data){
				expect(data).to.exist;
				expect(data.userid).to.be('reneId47');
				done();
			});

		});
	});


	it ('addSession + other getSession', function(done) {
		db.addSession("rene", function(err,data) {
			expect(err).to.be(null);
			expect(data.result).to.be(1);
			expect(data.sessionid.length).to.be.above(20);

			db.getSession(43, function(err, user){
				expect(user).to.be(null);
				done();
			});

		});
	});

	it ('getSession of empty', function(done) {
		db.getSession(42, function(err, user){
			expect(err).to.be('session not found');
			expect(user).to.be(null);
			done();
		});
	});


	it ('addNewUser', function(done) {
		db.addNewUser({name:"abc", age:47}, function(err, user){
			expect(err).to.be(null);
			expect(user.name).to.be("abc");
			expect(user.age).to.be(47);
			expect(user.id).to.be(1);

			db.addNewUser({name:"xyz", age:66}, function(err, user){
				expect(err).to.be(null);
				expect(user.name).to.be("xyz");
				expect(user.age).to.be(66);
				expect(user.id).to.be(2);

				done();
			});
		});
	});

	it ('addNewUser + getUserFromId', function(done) {
		db.addNewUser({name:"abc", age:47}, function(err, user){
			expect(err).to.be(null);
			expect(user.name).to.be("abc");
			expect(user.age).to.be(47);
			expect(user.id).to.be(1);

			db.addNewUser({name:"xyz", age:66}, function(err, user){
				expect(err).to.be(null);
				expect(user.name).to.be("xyz");
				expect(user.age).to.be(66);
				expect(user.id).to.be(2);

				db.getUserFromId(1, function(err, user) {
					expect(err).to.be(null);
					expect(user.name).to.be("abc");
					expect(user.age).to.be(47);
					expect(user.id).to.be(1);
	
					db.getUserFromId(2, function(err, user) {
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

