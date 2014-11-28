var expect = require ('expect.js');
var SessionHandler = require('../routes/SessionHandler.js');

describe('SessionHandler init', function() {
	it ('create', function() {
		var sh = new SessionHandler();
//		sh.checkIfLoggedId(1,2);
		expect( sh['checkIfLoggedIn'] ).to.be.a('function');
		expect( sh['showLoginPage'] ).to.be.a('function');
	});



});

