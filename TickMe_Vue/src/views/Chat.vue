<template>
	<div id="appChat">
		<div class="title"><h2>聊天室
		</h2></div>
		<div class="chat-box" id="window_hight" ref="chatContent">
			<ul class="messages">
				<li class="message-single" v-for="message in messages" :class="getMessageClass(message)">
					<div :class="message.screenName === userAndData.screenName?'info-time':'info-time-left'">
						<span>{{message.screenName}}</span>
						<span>{{getCurrentTime()}}</span>
						<span><img :src=message.imageUrl alt=""></span>
					</div>
					<span class="message-text">{{ message.text }}</span>
				</li>
			</ul>
		</div>
		<div class="input-box">
			<input class="inputs" v-model="userAndData.text" type="text" placeholder="请输入内容" />
			<button class="sendButtom" @click="sendMessage">
				<img src="@/assets/img/emoji/rocket.png" alt="">
			</button>
		</div>
	</div>
</template>

<script>
	import {
		animation
	} from "@/utils/util";
	import {
		getCurrentTime
	} from "@/utils/util";
	export default {
		data() {
			return {
				messages: [],//websocket收到的消息数据存在这里，里面是一个一个的对象。
				userAndData: {
					screenName:'',
					text: "",
					imageUrl: 'http://localhost:3000/images/'+this.$store.state.usersList.name+'-header.jpg'
				},

				socket: null

			};
		},
		methods: {
			connect() {
				// Create WebSocket connection.
				this.socket = new WebSocket('ws://localhost:8083');
				// onopen简历好连接后进行处理
				this.socket.onopen = () => {
					console.log("浏览器已经和ws建立好连接")
				}

				this.socket.binaryType = 'arraybuffer'; // 设置接收二进制数据类型的消息
				this.socket.onmessage = (event) => {
					if (event.data instanceof ArrayBuffer) {
						const decoder = new TextDecoder('utf-8');
						const str = decoder.decode(event.data);
						this.messages.push(str)
					} else {
						console.log(JSON.parse(event.data))
						this.messages.push(JSON.parse(event.data))
					}
					this.scrollBottom()

				};



				// 断开连接
				this.socket.onclose = () => {
					console.log("浏览器已经断开ws连接")
				}
				// 连接错误
				this.socket.onerror = (error) => {
					console.log('WebSocket error: ', error);
				}

			},
			// 发送数据
			sendMessage() {
				this.socket.send(JSON.stringify(this.userAndData));
				this.userAndData.text = ''
			},
			// 根据消息的发送者返回不同的样式类
			getMessageClass(message) {
				if (message.screenName === this.userAndData.screenName) {
					return 'message-right';
				} else {

					return 'message-left ';
				}
			},
			// 下拉滚动条
			scrollBottom() {
			  this.$nextTick(() => {
			    const scrollDom = this.$refs.chatContent;
			    if (scrollDom) {
			      animation(scrollDom, scrollDom.scrollHeight - scrollDom.offsetHeight);
			    }
			  });
			},
			getCurrentTime() {
				var date = new Date();
			 var year = date.getFullYear();
			 var month = date.getMonth() + 1;
				var day = date.getDate();
				var hour = date.getHours();
				var minute = date.getMinutes();
				var second = date.getSeconds();
				let currentTime = hour + ':' + minute + ':' + second;
				return currentTime
			}


		},
		mounted() {
			this.$emit('hideSearchBar', true)//给homepage传值用来判断是否显示搜索框
			this.connect()//连接ws
			
			const name=this.$store.state.usersList.name
			const respName=this.$request.post("/api/finddata",{name:name})
			respName.then(response => {
			    this.userAndData.screenName = response.data.screenName;
			  });
			// 将vuex的聊天数据加载进来，返回的是preomise
			this.$request.post("/api/querydatachat").then((response)=>{
				console.log(response.data[0].data)
				this.messages=Object.values(response.data[0].data)
			})
			this.messages=this.$store.state.messages
			
		},
		
		destroyed() {
			// 销毁之前将聊天记录保存到数据库当中
			if(this.messages.length>0){//if判断防止网络有问题的时候（this.messages的数据还没有加载好）将数据库内的聊天记录给替换掉。
				this.$request.post("/api/updatachat",this.messages)
			}
			
		}
	};
</script>

<style scoped>
	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}
	#appChat {
		display: flex;
		margin: 0 2rem;
		height: 100vh;
		flex-direction: column;

	}
	h2 {
	  display: inline;
	  color: var(--Gray-8);
	  font-size: 1.5rem;
	  line-height: 2rem;
	  font-weight: 600;
	}
	.title {
		height: 10%;
		/* background-color: var(--BG); */
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-radius: 16px 16px 16px 16px;
	}

	.chat-box {
		height: 80%;
		background-color: var(--BG);
		border-bottom: 0.0625rem solid #d9d9e3;
		/* 加上这一行就可以显示滚动条 */
		overflow-y: auto;
		border-radius: 16px 16px 0 0;
	}

	.messages {
		display: flex;
		list-style-type: none;
		flex-direction: column;
	}

	.message-single {
		margin: 10px;
	}

	.input-box {
		height: 10%;
		background-color: var(--BG);
		margin-bottom: 0.625rem;
	}

	.message-left {
		align-self: flex-start;
	}

	.message-left .message-text {
		margin: 10px;
		padding: 15px;
		border-radius: 10px 16px;
		background-color: #f0f0f0;
		max-width: fit-content;
	}

	.message-right {

		align-self: flex-end;
	}

	.message-right .message-text {
		margin: 10px;
		padding: 10px 16px;
		color: rgba(255, 255, 255, 1);
		border-radius: 10px 16px;
		background-image: linear-gradient(90deg, #2870EA 10.79%, #1B4AEF 87.08%);
		max-width: fit-content;
	}

	.message-text {
		display: flex;
		min-width: 10px;

	}

	.input-box {
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 0 0 16px 16px;
	}

	.inputs {
		border: 2px solid #2287e1;
		width: 80%;
		height: 3.125rem;
		border-radius: 15px;
		font-size: 1.25rem;
		font-weight: 6.25rem;
	}

	.sendButtom {
		background-color: #1d90f5;
		border: 0;
		box-shadow: 0 0 2px 0 #08f;
		width: 100px;
		height: 50px;
		border-radius: 15px;
		margin-left: 1.2rem;
		position: relative;
	}

	.sendButtom img {
		width: 40px;
		height: 40px;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}
	.info-time{
		display: flex;
		/* flex-direction: row-reverse; */
		justify-content: flex-end;
	}
	.info-time-left{
		display: flex;
		flex-direction: row-reverse;
		justify-content: flex-end;
		
	}
	
	
	/* 左边右边的头像网名排序的css样式 */
	/* 左边 */
	.info-time-left span {
		margin-right: 0.625rem;
	}
	
	.info-time-left:nth-child(1) {
		color: #656873;
	}
	
	.info-time-left img {
		width: 30px;
		height: 30px;
		border-radius: 50%;
		vertical-align: middle;
	}
	/* 右边 */
	.info-time span {
		margin-right: 0.625rem;
	}

	.info-time:nth-child(1) {
		color: #656873;
	}

	.info-time img {
		width: 30px;
		height: 30px;
		border-radius: 50%;
		vertical-align: middle;
	}
</style>
