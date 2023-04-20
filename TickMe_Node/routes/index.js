const express=require('express');
// const { uploadImage } = require('../utils/util');
var router = express.Router()
var db=require('../mongodb')
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const xlsxbf=require("../utils/excel_to_json")
db.connect()
// 路由的跳转注册页面
router.post('/register',async(request,response,next)=>{
	try{
		const { name, password, email } = request.body;
		const registerResult = await db.register(name, password, email);
		return response.status(200).json(registerResult);
	}catch(error){
		console.log(error)
		return response.status(400).send(error)
	}
	next()
})
// 路由修改密码
router.post('/reset', async(request,response,next)=>{
	const{name,password}=request.body;
	const resetResult=await db.resetPassword(name,password);
	return response.status(200).json(resetResult)
	next()
})
router.get('/reset', async (request, response, next) => {
  const { name, password } = request.query;
  const resetResult = await db.resetPassword(name, password);
  response.status(200).json(resetResult);
  next();
});
// 登录
router.post('/login',async(request,response,next)=>{
	const { name, password } = request.body;
	const loginResult=await db.islogin(name,password);
	response.status(200).json(loginResult);
	next()
})
// 上传图片
const upload = multer({ dest: 'public/images' }); // 设置上传文件存储目录
router.post('/upload', upload.single('file'), (req, res) => {
  try {
		console.log(req.file); // 打印上传文件的信息
		const name = req.body.name;
		const fileExt = path.extname(req.file.originalname);
		const fileName = `${name}-header${fileExt}`;
		const filePath = path.join(__dirname, '../public/images', fileName);
		fs.renameSync(req.file.path, filePath);
		// 添加图片名称到url
		db.addField("name",req.body.name,"imageUrl",filePath,db.User)
	
    res.status(200).json({
      message: '文件上传成功',
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: 'Error uploading file',
    });
  }
});

// 头像请求这个请求暂时搁置，现在前端的请求方式一律从 /login返回的imageUrl来进行获取 【2023-3-27】
router.get('/avatar', async (request, response,next) => {
	const avatarUrl = await db.findPieceContent("name",request.query.name,'imageUrl',db.User)
	console.log(avatarUrl)
	response.send(avatarUrl.findName).status(200);
	next()
});
// 查询一条数据
router.post('/finddata',async(request, response,next)=>{
	console.log(request.body)
	const resetResult=await db.findPieceContent2("name",request.body.name,'screenName',db.User)
	response.status(200).json(resetResult)
	next()
})
// 更新一条数据
router.post('/updata',async (request,response,next)=>{
	try{
		requestData=request.body 
		// console.log(request.body)
		// 更新密码
		await db.addField("name",requestData.user,"password",requestData.password,db.User)
		// 更新账号
		await db.addField("name",requestData.user,"name",requestData.name,db.User)
		// 更新手机号
		await db.addField("name",requestData.user,"phone",requestData.phone,db.User)
		// 更新邮箱
		await db.addField("name",requestData.user,"email",requestData.email,db.User)
		// 更新网名
		await db.addField("name",requestData.user,"screenName",requestData.screenName,db.User)
		response.status(200).json({
			responseCode: 1,
			msg: '更新成功'
		})
		next();
	}catch(e){
		//TODO handle the exception
		response.status(400).json({message: '更新user信息失败'})
	}
	
})

router.post("/updatachat",async(request,response,next)=>{
	// 更新聊天数据
	try{
		console.log(response.body)
		await db.addField("name","chat","data",request.body,db.ChattingRecord)
		response.status(200).json({responseCode: 1,msg:"更新成功"})
		next()
	}catch(e){
		//TODO handle the exception
	}
})
// 查询聊天记录
router.post("/querydatachat", async (request, response, next) => {
  try {
    // 查询聊天数据
    const data = await db.queryAllTheFields('data', db.ChattingRecord)
    response.status(200).json(data)
	next()
  } catch (err) {
    console.error(err)
    response.status(500).send('服务器错误')
	next()
  }
})
// 上传文件数据
const storageEngine = multer.diskStorage({//使用磁盘存储引擎
  destination: (req, file, cb) => {
    // 设置文件的保存路径
    const dir = './uploads'
    fs.mkdirSync(dir, { recursive: true })
    cb(null, dir)
  },
  filename: (req, file, cb) => {
    // 使用前端传输的文件名作为保存的文件名
    const ext = path.extname(file.originalname)
	console.log(req.body.index)
	switch (parseInt(req.body.index)){
		case 0:
			cb(null, "trend.xlsx")
			break;
		case 1:
			cb(null, `seller${ext}`)
			break;
		case 2:
			cb(null, `maps${ext}`)
			break;
		case 3:
			cb(null, `rank${ext}`)
			break;
		case 4:
			cb(null, `hotproduct${ext}`)
			break;
		case 5:
			cb(null, `stock${ext}`)
			break;
		default:
			break;
	}
  }
})
const storageEngine2 = multer.memoryStorage();//内存存储引擎
const uploadExcel = multer({ storage: storageEngine2 })
router.post('/uploadexcle', uploadExcel.single('file'), async(request, response, next) => {
  console.log(request.file);
  console.log(request.body);
  // 内存引擎使用
  const fileData = request.file.buffer; // 获取文件二进制数据
  const plaintext=xlsxbf.readExcelFile(fileData,request.body.index)
  console.log(plaintext.jsonData)
  // 将收到的数据存储到mongodb数据库中
  await db.addField("name","echarts",plaintext.type,plaintext.jsonData,db.EchartsGraphData)
  response.status(200).json({ status: 'ok' });
  next();
});

// 删除某一个记录中的字段
router.post("/deletedataconditionally",async(request,response,next)=>{
	const result=request.body
	console.log(result)
	const dele=await db.deleteDataConditionally('name',result.name,result.type,db.EchartsGraphData)
	response.status(200).json(dele)
})

module.exports=router
