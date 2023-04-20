const WebSocket = require("ws")
const wss = new WebSocket.Server({
	port: 8083
})
module.exports.listen=()=>{
	const connections = [] 
	console.log("ws已经启动")
	wss.on('connection', client => {
		connections.push(client)
		console.log("ws已经和浏览器连接。")
		
		// 客户端发给服务器的数据
		client.on('message', msg => {
			console.log('我是服务器我收到了前端传输的数据' + msg)
			// 广播发送
			 connections.forEach((conn) => {
			      if (conn.readyState === WebSocket.OPEN) {
			        conn.send(msg);
			      }
			    });
		})
		client.on("close", () => {
		    console.log("ws已经和浏览器断开连接");
		});
	
	})
}



