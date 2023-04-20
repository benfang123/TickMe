<template>
	<div class="login-wrapper">
		<el-card class="box-card">
		 <div slot="header" class="clearfix">
		   <span>登录</span>
		   <el-button style="float: right; padding: 3px 0" type="text"><router-link to='/Login/signin'>我要注册</router-link></el-button>
		 </div>
		  <!-- 表单 -->
		  <el-form label-position="right" label-width="80px" :model="formLabelAlign" :rules="rules" ref="ruleForm">
		    <el-form-item label="用户名" prop='name'>
		      <el-input v-model="formLabelAlign.name"></el-input>
		    </el-form-item>
		    <el-form-item label="密码" prop='password'>
		      <el-input type="password" v-model="formLabelAlign.password" ></el-input>
		    </el-form-item>
			<el-form-item class="btn-localtion">
			   <el-button type="primary"  @click="submitForm('ruleForm')">登录</el-button>
			   <el-button @click="resetForm('ruleForm')">重置</el-button>
			</el-form-item>
		  </el-form>
		</el-card>
	</div>
</template>

<script>
	export default{
		name:'SignUp',
		data() {
			return{
				formLabelAlign: {
					name: '',
					password: '',
					status:'',
					},
				rules: {
				          name: [{ required: true, message: '请输入账号', trigger: 'blur' },{ min: 5, max: 10, message: '长度在 5 到 10 个字符', trigger: 'blur' }],
						  password:[{ required: true, message: '您还没有输入密码', trigger: 'blur' },{ min: 0, max: 20, message: '长度在 0 到 20 个字符', trigger: 'blur' }]
						  },
			}
		},
		
		methods:{
			// 校验的提示信息卡片
			loginPromptError() {
			        this.$message.error("账号或密码错误");
			      },
			loginPromptMessage() {
			        this.$message({
			          message: '账户登录成功☺',
			          type: 'success'
			        });
			      },
			// 登录请求
			async submitForm() {
			      try {
			        await this.$refs.ruleForm.validate();
			        const { name, password } = this.formLabelAlign;
			        const response = await this.$request.post('/api/login', { name, password });
					console.log(response)
			        if (response.status === 200&&response.data.responseCode==1) {
						// 将请求的数据体存储到vuex的usersList
						this.$store.state.usersList.name=response.data.name
						this.$store.state.usersList.password=response.data.password
						this.$store.state.usersList.imageUrl=response.data.imageUrl
						this.$store.state.usersList.email=response.data.email
						this.$store.state.usersList.phone=response.data.phone
						this.$store.state.usersList.screenName=response.data.screenName
			          // 登录成功，重定向到首页
					  this.loginPromptMessage()
			          this.$router.push('/homepage');
			        } else {
						this.loginPromptError()
			        }
			      } catch (error) {
			        console.log(error);
			      }
			},
			resetForm(){ this.$refs.ruleForm.resetFields();}
		},
	}
</script>

<style scoped>
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