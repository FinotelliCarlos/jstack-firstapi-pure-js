let users = require('../mocks/users')

module.exports = {
  listUsers(req, res) {
    const order = req.query

    const sortedUsers = users.sort((a, b) => {
      if (order === 'desc') {
        return a.id < b.id ? 1 : -1
      } else {
        return a.id > b.id ? 1 : -1
      }
    })

    res.send(200, sortedUsers)
  },

  getUserById(req, res) {
    let { id } = req.params

    const userExists = users.find(user => user.id === id)

    if (!userExists) {
      return res.send(400, { error: 'User not exists!' })
    }

    return res.send(200, userExists)
  },

  createUser(req, res) {
    const { body } = req

    const lastUserId = users[users.length - 1].id
    const newUser = {
      id: lastUserId + 1,
      name: body.name
    }
    users.push(newUser)

    res.send(200, newUser)
  },

  updateUser(req, res) {
    let { id } = req.params
    const { name } = req.params

    const userExists = users.find(user => user.id === id)

    if (!userExists) {
      return res.send(400, { error: 'User not exists!' })
    }

    users = users.map(user => {
      if (user.id === id) {
        return {
          ...user,
          name
        }
      }

      return user
    })

    res.send(200, { id, name })
  },

  deleteUser(req, res) {
    let { id } = req.params

    users = users.filter(user => user.id !== id)

    res.send(200, { deleted: `User with id: ${id}` })
  }
}
