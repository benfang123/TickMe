<template>
	<!-- 登录组件 -->
	<div class="login-wrapper">
		<el-card class="box-card">
		 <div slot="header" class="clearfix">
		   <span>注册</span>
		   <el-button style="float: right; padding: 3px 0" type="text"><router-link to='/Login/signup'>我要登录</router-link></el-button>
		 </div>
		  <!-- 表单 -->
		  <el-form label-position="right" status-icon  label-width="80px" :model="formLabelAlign" :rules="rules" ref="ruleForm"  class="demo-ruleForm">
		    <el-form-item label="用户名" prop='name'>
		      <el-input v-model="formLabelAlign.name"></el-input>
		    </el-form-item>
			<el-form-item label="密码" prop="password">
			  <el-input type="password" v-model="formLabelAlign.password" autocomplete="off"></el-input>
			</el-form-item>
			<el-form-item label="确认密码" prop="checkPassword">
			  <el-input type="password" v-model="formLabelAlign.checkPassword" autocomplete="off"></el-input>
			</el-form-item>
			
			<el-form-item prop="email" label="邮箱">
			    <el-input v-model="formLabelAlign.email"></el-input>
			</el-form-item>
			
			
			
			<el-form-item class="btn-localtion">
			   <el-button type="primary"  @click="submitForm('ruleForm')">注册</el-button>
			   <el-button @click="resetForm('ruleForm')">重置</el-button>
			</el-form-item>
		  </el-form>
		</el-card>
		<!-- <slot></slot> -->
		
	    
	</div>
</template>

<script>
	export default{
		name:'SignIn',
		data() {
			var validatePass = (rule, value, callback) => {
			        if (value === '') {
			          callback(new Error('请输入密码'));
			        } else {
			          if (this.formLabelAlign.checkPassword !== '') {
			            this.$refs.ruleForm.validateField('checkPassword');
			          }
			          callback();
			        }
			      };
			      var validatePass2 = (rule, value, callback) => {
			        if (value === '') {
			          callback(new Error('请再次输入密码'));
			        } else if (value !== this.formLabelAlign.password) {
			          callback(new Error('两次输入密码不一致!'));
			        } else {
			          callback();
			        }
			      };
			return{
				formLabelAlign: {
				name: '',
				password: '',
				checkPassword:'',
				email:'',
				},
				rules: {
				          name: [
				            { required: true, message: '请输入账号', trigger: 'blur' },
				            { min: 5, max: 10, message: '长度在 5 到 10 个字符', trigger: 'blur' }
				          ],
						  password:[
							  { required: true, message: '您还没有输入密码', trigger: 'blur' },
							  { min: 0, max: 20, message: '长度在 0 到 20 个字符', trigger: 'blur' },
							  { validator: validatePass, trigger: 'blur' }
						  ],
						  
						   checkPassword: [
							   { validator: validatePass2, trigger: 'blur' },
							   { required: true, message: '您还没有输入密码', trigger: 'blur' },
							   { min: 0, max: 20, message: '长度在 0 到 20 个字符', trigger: 'blur' },
						   ],
						   email:[
							   { required: true, message: '请输入邮箱地址', trigger: 'blur' },
							   { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
						   ]
						},
			}
		},
		
		// methods:{
		// async submitForm(){
		// 		try{
		// 			await this.$refs.ruleForm.validate()
		// 		}catch(error){
		// 			console.log("登录错误666")
		// 		}	
		// 	},
		// resetForm(){ this.$refs.ruleForm.resetFields();}
			
		// },
		methods: {
			// 校验的提示信息卡片
			loginPromptError() {
			        this.$message.error("注册校验错误，请重新检查你要注册的账号密码");
			      },
			loginPromptMessage() {
			        this.$message({
			          message: '账户注册成功，马上登录吧！',
			          type: 'success'
			        });
			      },
		      submitForm(formName) {
		        this.$refs[formName].validate(async (valid) => {
		          if (valid) {
					  // 校验正确后执行
					  const { name, password,email } = this.formLabelAlign;
					  const response = await this.$request.post('/api/register', { name, password,email });
					  if (response.status === 200&&response.data.responseCode) {
					    // 登录成功，重定向到首页
					    this.loginPromptMessage()
					    // this.$router.push('/homepage');
					  } else {
					  	this.loginPromptError()
					  }
		          } else {
					  this.loginPromptError()
		            console.log('error submit!!');
		            return false;
		          }
		        });
		      },
		      resetForm(formName) {
		        this.$refs[formName].resetFields();
		      }
		    }

	}
</script>

<style scoped>
	/* 卡片注册页面 */
	.clearfix span{
			/* color: white; */
		    font-size: 1.5rem;
		    font-weight: 600;
		    line-height: 1.5rem;
	}
	.el-card__header {
	    background-color: #409EFF;
		text-align: center;
	}
	.box-card{
		width: 30vw;
	}
	.btn-localtion{
		text-align: center;
	}
	.clearfix sapn{
		color: #fff;
		}
</style>