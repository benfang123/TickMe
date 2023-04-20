<template>
  <div>
    <div class="vh">
      <div class="wrap">
        <div class="nav">
          <!-- 菜单图表和log和play按钮 -->
          <div class="menu">
            <span class="iconfont icon-caidan"></span>
          </div>
          <div class="logo">
            <img src="@/assets/img/logo.png" alt="" />
          </div>
          <div class="btn">Need help</div>
        </div>
        <div class="content">
          <!-- 文本 -->
          <div class="text">
            <h1>加入我的</h1>
            <h1>待办事项,</h1>
            <h1>高效率处理事务。</h1>
            <h2>List and schedule together</h2>
            <div class="more" @click="goUcc">开始 登录</div>
            <div class="page">
              <span class="iconfont icon-anniu-jiantouxiangyou_o"></span>
              <span>1 —— 5</span>
            </div>
          </div>
          <!-- 视频 -->
          <div class="video">
            <div class="slogan">
              <h1>高效记录一切</h1>
              <h1>Productive task list</h1>
              <div class="more">Set out</div>
            </div>
            <video src="@/assets/img/video.mp4" muted loop autoplay></video>
          </div>
          <img class="star1" src="@/assets/img/qiu1.png" alt="" />
          <img class="star3" src="@/assets/img/qiu2.png" alt="" />
          <img class="star2" src="@/assets/img/qiu3.png" alt="" />
        </div>
      </div>
    </div>
    <div class="vh">
      <div class="wrap">
        <div class="text-box">
          <div class="text-center"><h2>{{this.text[Index]}}</h2></div>
          <div class="text-right">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="任务管理" name="first">
                    个人专属任务大盘 让协作更加轻量
                </el-tab-pane>
                <el-tab-pane label="可视化数据" name="second">
                    多种视图，按需切换 「谁」在「何时」「做什么」一目了然
                </el-tab-pane>
                <el-tab-pane label="角色管理" name="third">
                    任务分配至人，支持自定义设置，实现有始有终的闭环管理
                </el-tab-pane>
                <el-tab-pane label="一站式体验" name="fourth">
                    个人专属任务大盘 让协作更加轻量
                </el-tab-pane>
            </el-tabs>
          </div>
          
        </div>
        <div class="media">
          <img  :src="images[Index]" alt="" />
        </div>
      </div>
    </div>
    <div class="vh">
      <div class="wrap qx">
        <div class="main_two">
          <img class="bj" src="@/assets/img/svg/Cover.png" alt="" />
          <img class="star4" src="@/assets/img/svg/Group 3.png" alt="" />
          <img class="person" src="@/assets/img/svg/Group 6.png" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    data(){
        return{
            activeName: 'first',
            Index: 0,
            images: [
            require('@/assets/img/gif/银弹1.gif'),
            require('@/assets/img/gif/银弹2.gif'),
            require('@/assets/img/gif/银弹1.gif'),
            require('@/assets/img/gif/银弹2.gif'),
            ],
            text:[
                '我的任务 更低门槛',
                '统计分析 把控全局',
                '任务跟踪 有始有终',
                '一键打通 实时群聊'
            ]

        }
    },
  methods: {
    handleClick(tab, event) {
        console.log(tab, event);
        this.Index=tab._uid-8

      },
    goUcc() {
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  color: #23262e;
}

.vh {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

body {
  width: 100%;
  background-color: #f1ede5;
}

.wrap {
  width: 1340px;
  height: 800px;
  background-color: #fff;
  border-radius: 20px;
  box-shadow: 10px 10px 50px rgba(0, 0, 0, 1);
  display: grid;
  grid-template-rows: 100px 1fr;
  overflow: hidden;
}

.nav {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 50px;
  background-color: #fff;
}

.content {
  width: 1240px;
  height: 650px;
  margin: 0 auto;
  position: relative;
  display: flex;
  align-items: center;
}

.video {
  width: 100%;
  height: 100%;
  border-radius: 20px;
  overflow: hidden;
  position: absolute;
  top: 0;
  right: 0;
  transition: 0.5s;
}

.video video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.menu .iconfont {
  font-size: 34px;
}

.btn {
  border: 1px solid #e1e1e0;
  padding: 10px;
  border-radius: 5px;
  font-size: 12px;
}

.text {
  /* 动画效果先将将内容左偏界面外并且改为透明 */
  position: absolute;
  left: -500px;
  transition: 0.5s;
  opacity: 0;
}

.text h1 {
  font-size: 70px;
  line-height: 100%;
}

.text h2 {
  font-size: 32px;
  padding: 30px 0;
  font-weight: 200;
}

.more {
  width: 150px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e46036;
  color: #fff;
  border-radius: 10px;
}

.page {
  margin-top: 80px;
}

.page span {
  font-size: 18px;
}

/* 星球定位的值 */
.star1 {
  position: absolute;
  top: 20%;
  left: 110%;
  z-index: 999;
  transition: 1s;
  animation: bounce 3s infinite;
}

.star2 {
  position: absolute;
  top: 80%;
  left: 110%;
  z-index: 999;
  transition: 1s;
  animation: bounce 3s infinite;
}

.star3 {
  position: absolute;
  top: 50%;
  left: 150%;
  z-index: 999;
  transition: 1s;
  animation: bounce 3s infinite;
}

@keyframes bounce {
  0% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-20px);
  }

  100% {
    transform: translateY(0);
  }
}

.slogan {
  width: 100%;
  text-align: center;
  position: absolute;
  top: 15%;
  left: 0;
  transition: 0.5s;
}

.slogan .more {
  align-items: center;
  margin: 50px auto;
}

.slogan h1 {
  font-size: 70px;
  line-height: 120%;
  color: #fff;
}

/* 光标（鼠标指针）悬停在元素上时触发 */
.content:hover .text {
  position: absolute;
  left: 0;
  opacity: 1;
  z-index: 100;
}

.content:hover .star1 {
  position: absolute;
  top: 20%;
  left: 45%;
  z-index: 100;
}

.content:hover .star2 {
  position: absolute;
  top: 80%;
  left: 42%;
  z-index: 100;
}

.content:hover .star3 {
  position: absolute;
  top: 50%;
  left: 96%;
  z-index: 100;
}

.content:hover .video {
  position: absolute;
  width: 50%;
  right: 0px;
  top: 0px;
}

.content:hover .slogan {
  position: absolute;
  left: -600px;
}

/* 第二个框的css */
.main_two {
  position: relative;
}

.bj {
  position: absolute;
  width: 170%;
  top: 41%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.person {
  position: absolute;
  left: 550px;
  top: 700px;
  opacity: 0;
  transition: 1s;
}

.qx {
  display: grid;
  grid-template-rows: 1fr;
}

/* 星球操作 */
.star4 {
  position: absolute;
  width: 800px;
  height: 800px;
  left: 250px;
  top: 700px;
  opacity: 0;
  transition: 1s;
}
.main_two:hover .star4 {
  left: 250px;
  top: 400px;
  opacity: 1;
}

.main_two:hover .person {
  opacity: 1;
  top: 500px;
}
.media {
  display: flex;
  justify-content: center;
  align-items: center;
}
.media img {
  width: 1240px;
  height: 650px;
  border-radius: 20px;
}
.text-box {
  display: flex;
  justify-content: space-between;
}
.text-center {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.text-right {
    position: relative;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  left: -5%;
  font-size: 12px;
  color: #878787;
}
.text-box h2 {
  line-height: 100px;
  color: #0089ff;
  font-size: 45px;
}

</style>