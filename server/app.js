const express = require('express')
// 导入中间件
const bodyParser = require('body-parser')
// 导入路由
const userRouter = require('./router/user')
const incomeRouter = require('./router/income')
const expendRouter = require('./router/expend')

const app = express()

// 设置跨域请求
app.all('*', (req, res, next) => {
  // 设置允许跨域的域名， *代表允许任意域名跨域
  res.header('Access-Control-Allow-Origin', '*')
  // 允许的header类型
  res.header('Access-Control-Allow-Headers', 'content-type')
  // 跨域允许的请求方式
  res.header('Access-Control-Allow-Methods', 'DELETE,PUT,POST,GET,OPTIONS')
  if (req.method.toLowerCase == 'options')
    res.send(200)
  else
    next()
})

// 引入 express-jwt 解析 token
const expressJWT = require('express-jwt')
const { PRIVATE_KEY } = require('./config/store')

// 配置中间件
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// token中间件
// app.use(expressJWT({
//   secret: PRIVATE_KEY,
//   algorithms: ['HS256']
// }).unless({
//   path:['/login']
// }))

// 路由挂载
app.use(userRouter)
app.use(incomeRouter)
app.use(expendRouter)

const server = app.listen(8081,() => {

  const port = server.address().port

  console.log('服务器开启，访问端口为:' + port)
})