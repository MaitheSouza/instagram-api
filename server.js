const express = require("express")
const { faker } = require("@faker-js/faker")

const app = express()

const createUser = (_, id) => {
    const gender  = faker.person.sex()
    const firstName = faker.person.firstName(gender)
    const lastName = faker.person.lastName()

    return {
        id,
        name: `${firstName} ${lastName}`,
        username: faker.internet.userName({ firstName, lastName }),
        avatarImageUrl: faker.internet.avatar(),
        gender
    }
}

const users = Array.from({ length: 10 }, createUser)

const createPosts = (_, id) => {
    const userId = faker.number.int({ max: users.length - 1 })
    const user = users[userId]

    return {
        id,
        imagePostUrl: faker.image.url({ width: 1080, height: 1080 }),
        description: faker.lorem.words({ min: 2, max: 5 }),
        likes: faker.number.int({ max: 100 }),
        createdAt: faker.date.recent(),
        user,
    }
}

const posts = Array.from({ length: 10 }, createPosts)

const createMessage = (_, id) => {
    return {
        id,
        message: faker.lorem.words({ min: 1, max: 5 }),
        sentAt: faker.date.recent(),
        me: faker.datatype.boolean()
    }
}

const createChat = (_, id) => {
    const userId = faker.number.int({ max: users.length - 1 })
    const user = users[userId]

    const messages = Array.from({ length: faker.number.int({ min: 1, max: 50 }) }, createMessage)

    return {
        id,
        lastMessage: messages.at(-1),
        messages,
        user,
    }
}

const chats = Array.from({ length: faker.number.int({ min: 1, max: users.length }) }, createChat)

app.get("/users", (_, res) => {
    res.json(users).end();
})

app.get("/posts", (_, res) => {
    res.json(posts).end();
})

app.get("/chats", (_, res) => {
    res.json(chats).end();
})

app.get("/user/:id", (req, res) => {
    const id = +req.params.id
    res.json(users[id]).end();
})

app.get("/post/:id", (req, res) => {
    const id = +req.params.id
    res.json(posts[id]).end();
})

app.get("/chat/:id", (req, res) => {
    const id = +req.params.id
    res.json(chats[id]).end();
})

app.listen(3000, () => console.log("Server is running on port 3000"))