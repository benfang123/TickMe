<template>
  <div class="container">
    <div class="box" v-for="(inputPlaceholder,index) in inputPlaceholders" :key="index" v-on:click="selectedIndex = index">
	  <el-upload
	    ref="upload"
	    class="upload-demo"
	    action="http://localhost:3000/api/uploadexcle"
		:before-upload="beforeUpload"
	    :on-preview="handlePreview"
	    :on-remove="handleRemove"
	    :before-remove="beforeRemove"
		:on-error="uploadErr"
	    multiple
	    :limit="1"
	    :on-exceed="handleExceed"
	    :file-list="fileList"
		:data="DataFrom"
		>
	    <el-button class="button_sc" size="small" type="primary">点击上传</el-button>
	    <div slot="tip" class="el-upload__tip">只能上传"{{inputPlaceholders[index]}}".xlsx的文件</div>
	  </el-upload>
    </div>
  </div>
</template>
<script>
export default {
  name: "Upload",
  data() {
        return {
			selectedIndex:0,
			fileList: [],
			inputPlaceholders: [
					  '折叠面积图',
					  'X方向动态柱状图',
					  '地理坐标分布图',
					  'y轴动态柱状图',
					  '多标签饼图',
					  '动态环形图'
					],
			uploadFormData: null,
			DataFrom:{
				name:null,
				index:null
			}
				
        }
      },
	   methods: {
		   beforeUpload(file) {
		       this.DataFrom.name=this.inputPlaceholders[this.selectedIndex]
			   this.DataFrom.index=this.selectedIndex
		   },
	        handleRemove(file, fileList) {
	          console.log(file, fileList);
	        },
	        handlePreview(file) {
	          console.log(file);
	        },
			uploadErr(err, file, fileList){
				console.log(err)
			},
	        handleExceed(files, fileList) {
	          this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length } 个文件`);
	        },
	        beforeRemove(file, fileList) {
	          return this.$confirm(`确定移除 ${ file.name }？`);
	        },
	      }
	  
  
};
</script>
<style scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.box {
  flex-basis: calc(33.33% - 10px);
  height: 300px;
  /* width: 100px; */
  margin: 100px;
  background-color: var(--Theme-5);
  display:flex;
  justify-content: center;
  align-items: center;
  background-image: url('../../assets/img/aliicon/数据.png');
  background-size: cover; /* 将背景图片缩放到足够大以覆盖整个背景区域 */
  background-repeat: no-repeat; /* 禁止背景图片重复 */
  background-position: center center; /* 将背景图片置于背景区域中心位置 */
  border-radius: 16px;
}
.box span{
	font-size: 1.25rem;
}
.button_sc{
	position: relative;
	background-color: var(--Theme-8);
	/* left: 100%; */
}
.el-upload__tip{
	font-size: 20px;
	
}
</style>