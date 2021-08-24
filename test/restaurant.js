const restaurantModel  = require('../models/restaurant');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');
let should = chai.should();


chai.use(chaiHttp);
//Our parent block
describe('restaurants', () => {
/*
  * Test the get open restaurants at given datetime /restaurant/open/:dateTime/:page  route
  */
  describe('/GET restaurantsOrDishes', () => {
      it('it should GET the restaurants or dishes list as per our search string', (done) => {
        chai.request(app)
            .get('/restaurant/search/4?searchString=grill and&itemsPerPage=15')
            .end((err, res) => {
                should.exist(res.body);
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            });
      });
  });

});