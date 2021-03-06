const request = require('supertest')
const app = require('../src/app.js')
const Task = require('../src/models/task')
const {userOne, userTwo, taskOneId, setupDatabase} = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should create task for user', async() => {
    const response = await request(app)
                                .post('/tasks')
                                .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                                .send({
                                    description: 'From my test'
                                })
                                .expect(201)
    
    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toBe(false)
})

test('Check number of tasks for user one', async() => {
    const response = await request(app)
                                .get('/tasks')
                                .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                                .send()
                                .expect(200)

    expect(response.body.length).toBe(2)
})

test('Check number of tasks for user two', async() => {
    const response = await request(app)
                                .get('/tasks')
                                .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
                                .send()
                                .expect(200)

    expect(response.body.length).toBe(1)
})

test('Delete task as wrong user should fail', async() => {
    const response = await request(app)
                                .delete('/tasks/' + taskOneId)
                                .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
                                .send()
                                .expect(404)

    const task = await Task.findById(taskOneId)
    expect(task).not.toBeNull()
})