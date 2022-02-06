let chai = require('chai');
let chaiHttp = require('chai-http');
const expect = require('chai').expect;

chai.use(chaiHttp);
const url = 'http://localhost:3000/api/v1';

let userId;

describe('Register: ', () => {
    it('should register successfully', (done) => {
    chai.request(url)
      .post('/auth/register')
      .send({username: "testUsername", password: "testPassword"})
      .end(function(err,res) {
        userId = res.body.userId;
        expect(res).to.have.status(200);
        done();
      });
    });
});

describe('Login: ', () => {
  it('should login successfully', (done) => {
  chai.request(url)
    .post('/auth/login')
    .send({username: "testUsername", password: "testPassword"})
    .end(function(err,res) {
      expect(res).to.have.status(200);
      done();
    });
  });
});

describe('Delete user: ', () => {
  it('should delete the users created on the previous tests', (done) => {
    chai.request(url)
    .delete('/users/' + userId)
    .end(function(err,res) {
      expect(res).to.have.status(200);
      done();
    });
  });
});