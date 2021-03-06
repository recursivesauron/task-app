const request = require('supertest')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const app = require('../src/app.js')
const User = require('../src/models/user')
const {userOneId, userOne, setupDatabase} = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should signup a new user', async () => {
    const response = await request(app).post('/users').send({
        name: 'Ryan',
        email: 'r.trudeau124@gmail.com',
        password: 'MyPass777!'
    }).expect(201)

    // Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    // Assertions about the response
    expect(response.body).toMatchObject({
        user: {
            name: 'Ryan',
            email: 'r.trudeau124@gmail.com'
        },
        token: user.tokens[0].token
    })

    expect(user.password).not.toBe('MyPass777!')
})

test('Should login existing user', async() => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email, 
        password: userOne.password
    }).expect(200)

    const returnedUser = await User.findById(userOneId)
    expect(response.body.token).toBe(returnedUser.tokens[1].token)
})

test('Should not login, non-existent user', async() => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: 'wrong password'
    }).expect(400)
})

test('Should fetch user profile', async() => {
    await request(app)
            .get('/users/me')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send()
            .expect(200)
})

test('Should not get profile for unauthenticated user', async() => {
    await request(app)
            .get('/users/me')
            .send()
            .expect(401)
})

test('Should delete user profile if authenticated', async() => {
    await request(app)
            .delete('/users/me')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send()
            .expect(200)

    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

test('Should not delete user profile when not authenticated', async() => {
    await request(app)
            .delete('/users/me')
            .send()
            .expect(401)
})

test('Should upload avatar image', async() => {
    await request(app)
            .post('/users/me/avatar')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .attach('avatar', 'tests/fixtures/profile-pic.jpg')
            .expect(200)
    
    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fields', async() => {
    const changingFields = {
        name: 'Mike',
        email: 'mike@fakeemail.com'
    }

    await request(app)
            .patch('/users/me')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send(changingFields)
            .expect(200)

    const returnedUser = await User.findById(userOneId)
    expect(returnedUser.name).toBe('Mike')
    expect(returnedUser.email).toBe('mike@fakeemail.com')
})

test('Should not update invalid user fields', async() => {
    const changingFields = {
        location: 'Canada'
    }

    await request(app)
            .patch('/users/me')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send(changingFields)
            .expect(400)
})