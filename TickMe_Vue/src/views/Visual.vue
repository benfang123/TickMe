<template>
	<div class="screen-container" :style="screenBackground">
		<header class="screen-header">
			<span class="upload">
				<img @click="openUploadPage" src="@/assets/img/aliicon/文件夹.png" alt="文件数据上传" title="上传可视化图表的数据" />
				<img :plain="true" @click="clearData" src="@/assets/img/aliicon/清除.png" alt="清除上传的数据" />
			</span>
			<span class="title">数据大屏可视化监控</span>
			<div class="title-right">
				<span class="datetime">{{time}}</span>
			</div>
		</header>
		<div class="screen-body">
			<section class="screen-left">
				<div id="left-top" :class="[fullScreenStatus.trend?'fullscreen':'']">
					<!-- 销量趋势图表 -->
					<Trend ref="trend"></Trend>
					<div class="resize">
						<div @click="changeSize('trend')"
							:class="[fullScreenStatus.trend?'el-icon-remove-outline':'el-icon-circle-plus-outline']">
						</div>
					</div>
				</div>
				<div id="left-bottom" :class="[fullScreenStatus.seller?'fullscreen':'']">
					<!-- 商家销售金额图表 -->
					<Sellers ref="seller"></Sellers>
					<div class="resize">
						<div @click="changeSize('seller')"
							:class="[fullScreenStatus.seller?'el-icon-remove-outline':'el-icon-circle-plus-outline']">
						</div>
					</div>
				</div>
			</section>
			<section class="screen-middle">
				<div :class="[fullScreenStatus.map?'fullscreen':'']" id="middle-top">
					<!-- 商家分布图表 -->
					<Map ref="map"></Map>
					<div class="resize">
						<div @click="changeSize('map')"
							:class="[fullScreenStatus.map?'el-icon-remove-outline':'el-icon-circle-plus-outline']">
						</div>
					</div>
				</div>
				<div id="middle-bottom" :class="[fullScreenStatus.rank?'fullscreen':'']">
					<!-- 地区销量排行图表 -->
					<Rank ref="rank"></Rank>
					<div class="resize">
						<div @click="changeSize('rank')"
							:class="[fullScreenStatus.rank?'el-icon-remove-outline':'el-icon-circle-plus-outline']">
						</div>
					</div>
				</div>
			</section>
			<section class="screen-right">
				<div id="right-top" :class="[fullScreenStatus.hot?'fullscreen':'']">
					<!-- 热销商品占比图表 -->
					<Hot ref="hot"></Hot>
					<div class="resize">
						<div @click="changeSize('hot')"
							:class="[fullScreenStatus.hot?'el-icon-remove-outline':'el-icon-circle-plus-outline']">
						</div>
					</div>
				</div>
				<div id="right-bottom" :class="[fullScreenStatus.stock?'fullscreen':'']">
					<Stocks ref="stock"></Stocks>
					<div class="resize">
						<div @click="changeSize('stock')"
							:class="[fullScreenStatus.stock?'el-icon-remove-outline':'el-icon-circle-plus-outline']">
						</div>
					</div>
				</div>
			</section>
		</div>
		<el-dialog :visible.sync="dialogTableVisible" width="80%" height="50%" center :modal-append-to-body='false'>
			<Upload></Upload>
		</el-dialog>
	</div>
</template>
<script>
	import '@/assets/font/iconfont.css'
	import Trend from "@/components/Echarts/Trend.vue"
	import Stocks from "@/components/Echarts/Stocks.vue"
	import Sellers from "@/components/Echarts/Seller.vue"
	import Rank from "@/components/Echarts/Rank.vue"
	import Map from "@/components/Echarts/Map.vue"
	import Hot from "@/components/Echarts/Heat.vue"
	import Seller from '../components/Echarts/Seller.vue'
	import Upload from "@/components/Echarts/Upload.vue"
	import {
		getThemeValue
	} from '@/utils/theme_utils'
	import {
		mapState
	} from 'vuex'
	export default {
		components: {
			Trend: Trend,
			Stocks,
			Sellers,
			Rank,
			Map,
			Hot,
			Seller,
			Upload
		},
		data() {
			return {
				dialogTableVisible: false, //判断是否显示上传，默认不显示
				time: "1970-01-01 12:00:00:00",
				turnoverTime: null,
				// 定义每一个图表全屏状态
				fullScreenStatus: {
					trend: false,
					seller: false,
					map: false,
					rank: false,
					hot: false,
					stock: false
				}
			}
		},
		mounted() {
			this.$emit('hideSearchBar', true) //不显示搜索框
			this.updateTime()
		},
		destroyed() {
			clearInterval(this.turnoverTime)
		},
		methods: {
			openUploadPage() {
				this.dialogTableVisible = !this.dialogTableVisible
			},
			changeSize(chartName) {
				this.fullScreenStatus[chartName] = !(this.fullScreenStatus[chartName])
				this.$nextTick(() => {
					this.$refs[chartName].screenAdapter()
				})
				const targetValue = !(this.fullScreenStatus[chartName])
			},
			// 接收到全屏之后的处理
			// recvData(data){ 
			//   // 哪个图表需要切换
			//   const chartName=data.chartName
			//   // 切换成什么状态
			//   const targetValue=data.value
			//   this.fullScreenStatus[chartName] =targetValue
			//   this.$nextTick(()=>{
			//     this.$refs[chartName].screenAdapter()
			//   })
			// },
			recvThemeChange() {
				this.$store.commit("changeTheme")
			},
			// 更新当前时间
			updateTime() {
				this.turnoverTime = setInterval(() => {
					const now = this.dayjs();
					this.time = now.format("YYYY-MM-DD HH:mm:ss"); // 格式化时间并更新到data中
				}, 1000)
			},
			// 清除数据库中的json图表数据
			clearData() {
				//将sql的字段传过去将这些字段的值都进行清空. 
				this.$request.post('/api/deletedataconditionally',{
					name:'echarts',
					type:['trend','seller','map','rank','hot','stock']
				})
				this.$message({
					message: '数据清除成功!',
					type: 'success'
				});
			}
		},
		computed: {
			...mapState(['echartsTheme']),
			screenBackground() {
				return {
					backgroundColor: getThemeValue(this.echartsTheme).backgroundColor,
					color: getThemeValue(this.echartsTheme).titleColor
				}
			}
		}
	}
</script>
<style lang="less" scoped>
	.fullscreen {
		position: fixed !important;
		top: 0 !important;
		left: 0 !important;
		width: 100% !important;
		height: 100% !important;
		margin: 0 !important;
		z-index: 100;
	}

	.screen-container {
		width: 100%;
		height: 100vh;
		padding: 0 20px;
		background-color: #f1f2f6;
		color: #000000;
		box-sizing: border-box;
	}

	.screen-header {
		width: 100%;
		height: 64px;
		font-size: 20px;
		position: relative;

		>div {
			img {
				width: 100%;
			}
		}

		.title {
			position: absolute;
			left: 50%;
			top: 50%;
			font-size: 20px;
			transform: translate(-50%, -50%);
		}

		.title-right {
			display: flex;
			align-items: center;
			position: absolute;
			right: 0px;
			top: 50%;
			transform: translateY(-80%);
		}

		.qiehuan {
			width: 28px;
			height: 21px;
			cursor: pointer;
		}

		.datetime {
			font-size: 15px;
			margin-left: 10px;
		}

		.upload {
			position: absolute;
			left: 0px;
			top: 50%;

			// transform: translateY(-80%);
			img {
				height: 30px;
				width: 30px;
				margin-right: 30px;
			}

			img:hover {
				cursor: pointer;
			}

		}
	}

	.screen-body {
		width: 100%;
		height: 100%;
		display: flex;
		margin-top: 10px;

		.screen-left {
			height: 100%;
			width: 27.6%;

			#left-top {
				height: 53%;
				background-color: #eff6ff;
				border-radius: 16px;
				position: relative;
			}

			#left-bottom {
				height: 31%;
				margin-top: 25px;
				background-color: #eff6ff;
				border-radius: 16px;
				position: relative;
			}
		}

		.screen-middle {
			height: 100%;
			width: 41.5%;
			margin-left: 1.6%;
			margin-right: 1.6%;

			#middle-top {
				width: 100%;
				height: 56%;
				background-color: #eff6ff;
				border-radius: 16px;
				position: relative;
			}

			#middle-bottom {
				margin-top: 25px;
				width: 100%;
				height: 28%;
				background-color: #eff6ff;
				border-radius: 16px;
				position: relative;
			}
		}

		.screen-right {
			height: 100%;
			width: 27.6%;

			#right-top {
				height: 46%;
				background-color: #eff6ff;
				border-radius: 16px;
				position: relative;
			}

			#right-bottom {
				margin-top: 30px;
				height: 38%;
				background-color: #eff6ff;
				border-radius: 16px;
				position: relative;
			}
		}
	}

	.resize {
		position: absolute;
		right: 20px;
		top: 20px;
		cursor: pointer;
		// width: 30px;
		// height: 30px;
		// top: -95%;
		// left: 90%;
		// background-color: rebeccapurple;
	}

	// 修改图标大小
	.el-icon-remove-outline {
		font-size: 50px;
	}

	.el-icon-circle-plus-outline {
		font-size: 20px;
	}

	// 上传页面
	.el-dialog {
		background-color: rebeccapurple;
	}
</style>
