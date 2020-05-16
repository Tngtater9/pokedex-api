const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../pokedex.js');

describe('testing pokedex api', () => {
    const token = process.env.API_TOKEN
    it('returns all pokemon without a query',() => {
        return supertest(app)
            .get('/pokemon')
            .set('Authorization', 'bearer ' + token)
            .expect(200)
            .expect('Content-type', /json/)
            .then(res =>{
                expect(res.body).to.be.an('array'),
                expect(res.body[0]).to.be.an('object'),
                expect(res.body[0]).to.include.all.keys(['id','num','name','img','type'])
                })
    })
    it('returns 401 Unauthorized without token',() => {
        return supertest(app)
            .get('/pokemon')
            .expect(401)
    })
    it('returns all types', () => {
        return supertest(app)
            .get('/types')
            .set('Authorization', 'bearer ' + token)
            .expect(200)
            .expect('Content-type', /json/)
            .then(res =>{ 
                expect(res.body).to.be.an('array'),
                expect(res.body[0]).to.be.a('string')
                })
    })
    it('returns a pokemon by name', () => {
        return supertest(app)
            .get('/pokemon')
            .set('Authorization', 'bearer ' + token)
            .query({name: 'bulbasaur'})
            .expect(200)
            .expect('Content-type', /json/)
            .then(res =>{
                expect(res.body).to.be.an('array'),
                expect(res.body[0]).to.be.a('object'),
                expect(res.body[0].name).to.equal('Bulbasaur')
                })
    })
    it('returns a pokemon by type', () => {
        return supertest(app)
            .get('/pokemon')
            .set('Authorization', 'bearer ' + token)
            .query({type: 'Grass'})
            .expect(200)
            .expect('Content-type', /json/)
            .then(res =>{
                expect(res.body).to.be.an('array'),
                expect(res.body[0]).to.be.a('object'),
                expect(res.body[0].type).to.include('Grass')
                })
    })
})