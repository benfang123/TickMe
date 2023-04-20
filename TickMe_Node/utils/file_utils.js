// 读取文件工具方法
const fs=require('fs')
module.exports.getFileJsonData=(filePath)=>{
    // 根据文件路径读取文件内容
    return new Promise((resolve,reject)=>{
        fs.readFile(filePath,'utf-8',(err,data)=>{
            if(err){
                // 失败
                reject(err)
            }else{
                resolve(data)
            }
        })
    })
    
}