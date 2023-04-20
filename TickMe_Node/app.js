const express=require('express');
const app=express()
const router=require('./routes/index')
const bodyParser = require('body-parser');
const cors = require('cors')
app.use(cors())

// 配置 body-parser 中间件
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 跨域问题
app.use(cors({
  origin: '*', // 允许来自http://localhost:8080的请求访问
  methods: ['GET', 'POST'], // 允许的请求方法
  allowedHeaders: ['Content-Type', 'Authorization'] // 允许的请求头
}))

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.status(200)
  console.log("发起了请求")
  next();
});

// 设置静态资源目录
app.use(express.static('public'));

app.get('/', function (req, res) {
  res.status(200).send('OK')
})
// 路由
app.use('/api', router);
 
// 对于echarts数据的请求
const respDataMiddleware=require("./middleware/koa_response_data")
app.use('/echarts',respDataMiddleware)

// 服务区启动
app.listen(3000,()=>{
	console.log("express服务器启动起来了")
})

// websocket
const webSocketService=require('./websocketp')
webSocketService.listen()


