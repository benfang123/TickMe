<template>
  <div class="personal-details">
    <div class="personal-details-header">
      <div class="personal-details-avatar">
		  <el-upload
		    class="avatar-uploader"
			name="file"
		    action='http://localhost:3000/api/upload'
			:show-file-list="false"
		    :on-success="handleAvatarSuccess"
		    :before-upload="beforeAvatarUpload"
			:data="{ name:this.name }"
			>
		    <img v-if="form.imageUrl" :src="form.imageUrl" class="avatar avatar-photo ">
		    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
		  </el-upload>
      </div>
      <div class="personal-details-title">Personal Details</div>
    </div>
    <el-form ref="form" :label-position="labelPosition" :model="form" :rules="rules" label-width="120px" class="personal-details-info">
      <el-form-item  label="我的账号" prop="user">
            <el-input placeholder="请输入账号" v-model="form.user" :rules="rules.user"></el-input>
      </el-form-item>
	  <el-form-item  label="我的昵称" prop="screenName">
	        <el-input placeholder="请输入昵称" v-model="form.screenName" :rules="rules.screenName"></el-input>
	  </el-form-item>
      <el-form-item label="我的手机"  prop="phone">
          <el-input placeholder="请输入手机号码" v-model="form.phone"  :rules="rules.phone" ></el-input>
      </el-form-item>
      <el-form-item label="我的邮箱" prop="email">
        <el-input placeholder="请输入邮箱" v-model="form.email" :rules="rules.email"></el-input>
      </el-form-item>
      <el-form-item label="修改密码" prop="password">
        <el-input placeholder="请输入密码" v-model="form.password" show-password :rules="rules.password" ></el-input>
      </el-form-item>
	  <el-form-item class="el-from-item-botton">
	      <el-button  type="primary" @click="submitForm('form')">更改信息</el-button>
	      <!-- <el-button @click="resetForm('ruleForm')">重置</el-button> -->
		</el-form-item>
    </el-form>
    <!-- <div class="personal-details-footer">Footer</div> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
		labelPosition: 'left',
		name:this.$store.state.usersList.name,
		uploadData: {},
      form: {
		screenName:this.$store.state.usersList.screenName,
		user:this.$store.state.usersList.name,
        email: this.$store.state.usersList.email,
		password: this.$store.state.usersList.password,
		phone:this.$store.state.usersList.phone,
		imageUrl: 'http://localhost:3000/images/'+this.$store.state.usersList.name+'-header.jpg'
      },
      rules: {
        email: [
          {  message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
		password: [
		    {  message: '请输入密码', trigger: 'blur' },
		    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
		  ],
		  screenName:[
			  {  message: '请输入昵称', trigger: 'blur' },
			  { min: 1, max: 6, message: '昵称长度在 1 到 6 个字符', trigger: 'blur' }
		  ],
		  user: [
		      {  message: '请输入账户名', trigger: 'blur' },
		      { min: 6, max: 16, message: '长度在6到16个字符', trigger: 'blur' },
		      {
		        validator: (rule, value, callback) => {
		          const pattern = /^[a-zA-Z0-9_]{6,16}$/;
		          if (!pattern.test(value)) {
		            callback(new Error('只能包含字母、数字、下划线'));
		          } else {
		            callback();
		          }
		        },
		        trigger: 'blur'
		      }
		    ],
		  phone: [
			{  message: '请输入手机号码', trigger: 'blur' },
			{
			  validator: (rule, value, callback) => {
				const reg = /^1[3456789]\d{9}$/;
				if (value && !reg.test(value)) {
				  callback(new Error('请输入正确的手机号码'));
				} else {
				  callback();
				}
			  },
			  trigger: 'blur',
			},
		  ],
      }
    }
  },
   methods: {
        submitForm(formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              const requestData={
				  user:this.name,
				  email: this.email,
				  password: this.password,
				  phone:this.phone,
			  }
			  const {user,password,email,phone,screenName}=this.form
			  console.log(screenName)
			  this.$request.post('/api/updata',{user,password,email,phone,screenName});
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        },
		// 文件上传
		 handleAvatarSuccess(res, file) {
		        this.form.imageUrl = URL.createObjectURL(file.raw);
		      },
		  beforeAvatarUpload(file) {
			const isJPG = file.type === 'image/jpeg';
			const isLt2M = file.size / 1024 / 1024 < 2;
	
			if (!isJPG) {
			  this.$message.error('上传头像图片只能是 JPG 格式!');
			}
			if (!isLt2M) {
			  this.$message.error('上传头像图片大小不能超过 2MB!');
			}
			
			return isJPG && isLt2M;
		  }
		
    },
	mounted() {

	}
}
</script>

<style scoped>
::v-deep .el-col {
  font-size: 1.5rem;
  height: 2.5rem;
}

.personal-details {
  /* height: 100vh; */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.personal-details-header {
  display: flex;
  align-items: center;
}

.personal-details-avatar {
  margin-right: 1rem;
}

.personal-details-title {
  font-size: 2rem;
}

.personal-details-info {
  margin-top: 2rem;
  text-align: center;
  width: 80%;
}

.personal-details-footer {
  margin-top: auto;
}
.el-from-item-botton{
	width: 0;
	margin-top: 10px;
}

/* 文件上传 */
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 130px;
    height: 130px;
    line-height: 130px;
    /* text-align: center; */
  }
  .avatar {
    width: 150px;
    height: 150px;
    display: block;
  }
  .avatar-photo{
	  border-radius: 50%;
	  height: 130px;
	  width: 130px;
  }
</style>