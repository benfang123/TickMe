<template>
  <el-container class="personal-main">
    <el-header>
      <el-col :span="12" class="personal-main-mes">
		  <img class="head-portrait " src="../assets/img/head_portrait1.jpg" alt="">
		  <div class="personal-main-mes-right">
			  <h1>奔放</h1>
			  <p>我的个性签名</p>
		  </div>
	  </el-col>
      <el-col :span="12" class="user-info">User Info</el-col>
    </el-header>
    <el-main>
      <el-row>
        <el-col :span="6"  >
			<el-row :span="24" class="security-list ">
				<i class="el-icon-user-solid" ></i>
				我的信息
			</el-row>
			<el-row :span="24" class="security-list">
				<i class="el-icon-s-platform"></i>
				修改密码
			</el-row>
			<el-row :span="24" class="security-list">
				<i class="el-icon-star-on"></i>
				二次认证
			</el-row>
			<el-row :span="24" class="security-list">
				<i class="el-icon-s-promotion"></i>
				我的记录
			</el-row>
			<el-row :span="24" class="security-list"></el-row>
		</el-col>
        <el-col :span="12">Column 2</el-col>
        <el-col :span="6">Column 3</el-col>
      </el-row>
    </el-main>
	
  </el-container>
  
  
  
</template>

<style scoped>
	::v-deep .el-header {
	    border-bottom: 1px solid rgb(221, 221, 221);
	  }
  .personal-main {
    /* height: 100vh; */
    width: 70%;
    box-shadow: 0 2px 4px rgb(0 0 0 / 14%);
    border: 1px solid #e1e2e5;
    margin: 0px auto 0px;
	
  }
  .user-info {
    text-align: right;
  }
  .head-portrait{
	  width: 48px;
	  height: 48px;
	  border-radius: 50%;
	  object-fit: cover;
	  margin-right: 15px;
  }
  .personal-main-mes{
	  display: flex;
	  flex-direction: row;
	       
  }
  .security-list{
	  /* width: 150px; */
	  height: 60px;
	  line-height: 2rem;
	  margin-bottom: 1rem;
	  color: var(--Gray-7);
	  /* background-color: aqua; */
  }
</style>