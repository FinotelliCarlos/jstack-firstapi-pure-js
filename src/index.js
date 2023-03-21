const http = require('http')
const routes = require('./routes')
const { URL } = require('url')

const bodyParser = require('./helpers/bodyParser')

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(`http://localhost:3000${req.url}`)
  console.log(`Request method: ${req.method} | Endpoint: ${parsedUrl.pathname}`)

  let { pathname } = parsedUrl
  let id = null

  const splitEndpoint = pathname
    .split('/')
    .filter(routeItem => Boolean(routeItem))

  if (splitEndpoint.lengh > 1) {
    pathname = `/${splitEndpoint[0]}/:id`
    id = splitEndpoint[1]
  }

  const route = routes.find(
    routeObj => routeObj.endpoint === pathname && routeObj.method === req.method
  )

  if (route) {
    req.query = Object.fromEntries(parsedUrl.searchParams)
    req.params = { id }

    res.send = (statusCode, body) => {
      res.writeHead(statusCode, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(body))
    }

    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
      bodyParser(req, () => route.handler(req, res))
    } else {
      route.handler(req, res)
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/html' })
    res.end(`Cannot ${req.method} ${parsedUrl.pathname}`)
  }
})

server.listen(3000, () => {
  console.log('Server started at http://localhost:3000')
})
