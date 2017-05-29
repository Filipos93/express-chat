var req = require('supertest');
var app = require('./app');

describe('Requests to root path', function(){

	it('Returns a 200 status code', function(done){

		req(app)
		.get('/')
		.expect(200, done);

	});

});