'use strict'
const bcrypt = require('bcryptjs')
const faker = require('faker')
module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.bulkInsert(
      'Users',
      [
        {
          email: 'root@example.com',
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          name: 'root',
          avatar: faker.image.avatar(),
          introduction: faker.lorem.text(),
          role: "admin",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          email: 'user1@example.com',
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          name: 'user1',
          avatar: faker.image.avatar(),
          introduction: faker.lorem.text(),
          role: "user",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          email: 'user2@example.com',
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          name: 'user2',
          avatar: faker.image.avatar(),
          introduction: faker.lorem.text(),
          role: "user",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          email: 'user3@example.com',
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          name: 'user3',
          avatar: faker.image.avatar(),
          introduction: faker.lorem.text(),
          role: "user",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          email: 'user4@example.com',
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          name: 'user4',
          avatar: faker.image.avatar(),
          introduction: faker.lorem.text(),
          role: "user",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          email: 'user5@example.com',
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          name: 'user5',
          avatar: faker.image.avatar(),
          introduction: faker.lorem.text(),
          role: "user",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    )
    queryInterface.bulkInsert(
      'Tweets',
      Array.from({ length: 10 }).map(d => ({
        UserId: Math.floor(Math.random() * 6 + 1),
        description: faker.lorem.text(),
        createdAt: new Date(),
        updatedAt: new Date()
      })),
      {}
    )
    return queryInterface.bulkInsert(
      'Followships',
      Array.from({ length: 10 }).map(d => ({
        followerId: Math.floor(Math.random() * 6 + 1),
        followingId: Math.floor(Math.random() * 6 + 1),
        createdAt: new Date(),
        updatedAt: new Date()
      })),
      {}
    )
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.bulkDelete('Users', null, {})
    queryInterface.bulkDelete('Tweets', null, {})
    return queryInterface.bulkDelete('Followships', null, {})
  }
}
