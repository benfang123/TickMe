const express = require('express');
const router = express.Router();
const path = require('path');
const fileUtils = require('../utils/file_utils');
var db=require('../mongodb')

router.use(async (req, res, next) => {
    // 根据请求的url来读取
    const url = req.url;
    let filePath = url.replace('/api', ''); //将获取到的url地址中api切片变成空
	let filePath2 = url.replace('/api/', ''); 
    filePath = '../data' + filePath + '.json';
    filePath = path.join(__dirname, filePath);
	const slicedUrl = req.url.slice(1);
     try {
		const sqldata=await db.findPieceContent2("name",'echarts',slicedUrl,db.EchartsGraphData)
		console.log()
		if(sqldata[slicedUrl]===undefined){
			const ret = await fileUtils.getFileJsonData(filePath);
			res.send(ret);
		}else{
			console.log(sqldata[slicedUrl])
			res.send(sqldata[slicedUrl])
		}
        
    } catch (err) {
        const errorMsg = {
            message: '路径不存在',
            status: 404

        }
        res.status(404).send(JSON.stringify(errorMsg));
    }
    next();
});

module.exports = router;