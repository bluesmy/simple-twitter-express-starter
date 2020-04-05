# Simple Twitter

A simple web app with simple features similar to Twitter. Built with Node.js, Express, and MySQL.

## Prerequisites

* [npm](https://www.npmjs.com/get-npm)
* [Node.js](https://nodejs.org/en/download/)
* [MySQL](https://dev.mysql.com/downloads/mysql/)
* [MySQL Workbench](https://dev.mysql.com/downloads/workbench/)

## Installing and execution

### Clone

**Clone this repository to your local machine**

```
git clone https://github.com/bluesmy/simple-twitter-express-starter.git
```

### Setup Database

**Create and use ac_twitter_workspace database via MySQL Workbench**

> Run the following code

```
drop database if exists ac_twitter_workspace;
create database ac_twitter_workspace;
use ac_twitter_workspace;
```

### Setup App

**1. Open terminal, change directory to the project folder**

```
$ cd simple-twitter-express-starter
```

**2. Install npm packages**

```
$ npm install
```

**3. Create .env file**

```
$ touch .env
```

**4. Store API Key in .env file and save**

> /.env
```
IMGUR_CLIENT_ID=<YOUR_IMGUR_CLIENT_ID>
```

**5. Edit password in config.json file and delete  "operatorsAliases": false**

> /config/config.json
```
"development": {
  "username": "root",
  "password": "<YOUR_WORKBENCH_PASSWORD>",
  "database": "ac_twitter_workspace",
  "host": "127.0.0.1",
  "dialect": "mysql"
}
```

**6. Create models in database**

> Run the following code in console
```
$ npx sequelize db:migrate
```

**7. Running seeds in database**

> Run the following code in console
```
$ npx sequelize db:seed:all
```

**8. Change chatroom link in views/layouts/main.handlebars**

> /views/layouts/main.handlebars line 28

Change
```
onclick="window.open('https://simple-twitter-express-demo.herokuapp.com/chat', 'Chatroom', config='height=900, width=600')"
```
to
```
onclick="window.open('http://localhost:3000/chat', 'Chatroom', config='height=900, width=600')"
```

**9. Activate the server**

```
$ npm run dev
```

**10. Activation success if you find the message**

```
> Example app listening on port 3000!
```

You may visit the application on browser with the URL: [http://localhost:3000](http://localhost:3000)

## Features

- User can register an account
- User can view all tweets
- User can create tweets
- User can like & unlike tweets
- User can follow other users
- User can reply to tweets
- User can view each user's tweets, followers, followings, likes
- User can edit his/her own profile
- User can view the most followed 10 users
- User can share others' tweets
- User can chat in public chatroom
- Admin can view all tweets
- Admin can delete tweets
- Admin can view all users' data including number of tweets, followings, followers, likes received

## Test Accounts & Passwords

| Email             | Password | role  |
| ----------------- | -------- | ----- |
| root@example.com  | 12345678 | admin |
| user1@example.com | 12345678 | user  |
| user2@example.com | 12345678 | user  |

## Built with

* [Bcryptjs ^2.4.3](https://www.npmjs.com/package/bcryptjs) - Password hashing function used
* [Body-Parser ^1.18.3](https://www.npmjs.com/package/body-parser) - Parse incoming request bodies in a middleware before handlers
* [Chai ^4.2.0](https://www.chaijs.com/) - A BDD / TDD assertion library for node and the browser that can be delightfully paired with any javascript testing framework
* [Connect-Flash ^0.1.1](https://www.npmjs.com/package/connect-flash) - Display flash message to user
* [Dotenv ^8.2.0](https://www.npmjs.com/package/dotenv) - Load environment variables from .env file into process.env
* [Express ^4.16.4](https://expressjs.com) - The web framework used
* [Express-Handlebars ^3.0.0](https://www.npmjs.com/package/express-handlebars) - The template engine used
* [Express-Session ^1.15.6](https://www.npmjs.com/package/express-session) - Enable session in express
* [Faker ^4.1.0](https://www.npmjs.com/package/faker) - Generate massive amounts of fake data in the browser and node.js
* [Imgur-Node-Api ^0.1.0](https://www.npmjs.com/package/imgur-node-api) - Imgur anonymous upload in nodejs using the imgur api
* [Method-Override ^3.0.0](https://www.npmjs.com/package/method-override) - Enable usage of HTTP verbs such as PUT or DELETE
* [Mocha ^6.0.2](https://mochajs.org/) - A feature-rich JavaScript test framework
* [Moment ^6.0.2](https://momentjs.com/) - Parse, validate, manipulate, and display dates and times in JavaScript
* [Multer ^1.4.2](https://github.com/expressjs/multer) - A node.js middleware for handling multipart/form-data
* [MySQL2 ^1.6.4](https://www.npmjs.com/package/mysql2) - A relational database management system
* [Node.js](https://nodejs.org/)- A JavaScript runtime built on Chrome's V8 JavaScript engine
* [Passport ^0.4.0](https://www.npmjs.com/package/passport)- Authentication middleware for Node.js
* [Passport-Local ^1.0.0](http://www.passportjs.org/packages/passport-local/) - Passport strategy for authenticating with a username and password
* [Sequelize ^4.42.0](https://sequelize.org/) - A promise-based Node.js ORM for MySQL
* [Sequelize-CLI ^5.5.0](https://github.com/sequelize/cli) - The Sequelize Command Line Interface (CLI)
* [Sequelize-Test-Helpers ^1.0.7](https://www.npmjs.com/package/sequelize-test-helpers) - A collection of utilities to help with unit-testing Sequelize models and code that needs those models
* [Sinon ^7.2.3](https://sinonjs.org/) - Standalone test spies, stubs and mocks for JavaScript
* [Sinon-Chai ^3.3.0](https://www.npmjs.com/package/sinon-chai) - Provide a set of custom assertions for using the Sinon.JS spy, stub, and mocking framework with the Chai assertion library
* [Socket.io ^2.3.0](https://socket.io/) - Enable real-time, bidirectional and event-based communication
* [Supertest ^3.3.0](https://www.npmjs.com/package/supertest) - HTTP assertions made easy via superagent
* [Visual Studio Code](https://code.visualstudio.com/) - The integrated development environment used


## Contributor

* **Sheri Su** - [bluesmy](https://github.com/bluesmy)
* **Emily** - [a62262002](https://github.com/a62262002)