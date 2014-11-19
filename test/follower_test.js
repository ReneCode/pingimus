
var expect = require ('expect.js');
var Follower = require('../follow.js'); 


describe('testing Follower whomDoIFollow', function() {
	it ('add follwer', function() {
		Follower.clear();
		Follower.follow('a', 'b');
		Follower.follow('a', 'c');
		Follower.follow('a', 'd');
		expect(Follower.whomDoIFollow('a')).to.eql(['b', 'c', 'd']);
	});

	it ('add two follwer', function() {
		Follower.clear();
		Follower.follow('a', 'b');
		Follower.follow('a', 'c');
		Follower.follow('a', 'd');
		Follower.follow('x', 'y');
		Follower.follow('x', 'z');
		expect(Follower.whomDoIFollow('a')).to.eql(['b', 'c', 'd']);
		expect(Follower.whomDoIFollow('x')).to.eql(['y', 'z']);
	});

	it ('get illegal user', function() {
		Follower.clear();
		Follower.follow('a', 'b');
		Follower.follow('a', 'c');
		Follower.follow('a', 'd');
		Follower.follow('x', 'y');
		Follower.follow('x', 'z');
		expect(Follower.whomDoIFollow('b')).to.eql([]);
	});

	it ('twice follow', function() {
		Follower.clear();
		Follower.follow('a', 'b');
		Follower.follow('a', 'c');
		Follower.follow('a', 'b');
		Follower.follow('x', 'y');
		Follower.follow('x', 'z');
		expect(Follower.whomDoIFollow('a')).to.eql(['b', 'c']);
	});

});

describe('testing Follower whoIsFollowingMe', function() {
	it ('normal', function() {
		Follower.clear();
		Follower.follow('a', 'b');
		Follower.follow('a', 'c');
		Follower.follow('a', 'd');
		expect(Follower.whoIsFollowingMe('b')).to.eql(['a']);
	});

	it ('more than one', function() {
		Follower.clear();
		Follower.follow('a', 'b');
		Follower.follow('a', 'c');
		Follower.follow('a', 'd');
		Follower.follow('x', 'b');
		Follower.follow('y', 'b');
		Follower.follow('a', 'd');
		expect(Follower.whoIsFollowingMe('b')).to.eql(['a', 'x', 'y']);
		expect(Follower.whoIsFollowingMe('c')).to.eql(['a']);
	});

	it ('no follower', function() {
		Follower.clear();
		Follower.follow('a', 'b');
		Follower.follow('a', 'c');
		Follower.follow('a', 'd');
		Follower.follow('x', 'b');
		Follower.follow('y', 'b');
		Follower.follow('a', 'd');
		expect(Follower.whoIsFollowingMe('a')).to.eql([]);
	});

	it ('twice follower', function() {
		Follower.clear();
		Follower.follow('a', 'b');
		Follower.follow('a', 'c');
		Follower.follow('a', 'b');
		Follower.follow('x', 'b');
		Follower.follow('y', 'b');

		expect(Follower.whoIsFollowingMe('b')).to.eql(['a', 'x', 'y']);
	});

});


