<template>
	<div class="com-container">
		<div class="title" :style="comStyle">
			<span>{{ '▎' + showTitle }}</span>
			<span class="iconfont title-icon" :style="comStyle" @click="showChoice = !showChoice">&#xe6eb;</span>
			<div class="select-con" v-show="showChoice" :style="marginStyle">
				<div class="select-item" v-for="item in selectTypes" :key="item.key" @click="handleSelect(item.key)">
					{{ item.text }}
				</div>
			</div>
		</div>
		<div class="com-chart" ref="trend_ref"></div>
	</div>
</template>

<script>
	// import { mapState } from "vuex";
	import {getThemeValue} from '@/utils/theme_utils'
	export default {
		data() {
			return {
				chartInstance: null, //echarts实例
				allData: null, //服务器返回的数据
				showChoice: false,
				choiceType: "map", // 显示的数据类型
				titleFontSize: 0
			};
		},
		mounted() {
			this.initChart(); //初始化图表
			this.getData(); //获取图标数据
			window.addEventListener("resize", this.screenAdapter);
			this.screenAdapter(); //防止初次访问就出现高度太低导致柱状图没有适配的现象
		},
		destroyed() {
			window.removeEventListener("resize", this.screenAdapter);
		},
		computed: {
			selectTypes() {
				if (!this.allData) {
					return [];
				} else {
					return this.allData.type.filter((item) => {
						return item.key !== this.choiceType;
					});
				}
			},
			showTitle() {
				if (!this.allData) {
					return "";
				} else {
					return this.allData[this.choiceType].title;
				}
			},
			// 设置给标题的样式
			comStyle() {
				return {
					fontSize: this.titleFontSize * 1 + 'px',
					'font-weight': 900,
					color:"	#000000"
					// color: getThemeValue(this.theme).titleColor
				}
			},
			marginStyle() {
				return {
					marginLeft: (this.titleFontSize * 0.6) + 'px',
					color:"	#000000"
					// color: getThemeValue(this.theme).titleColor

				}
			},

		},
		methods: {
			initChart() {
				this.chartInstance = this.$echarts.init(this.$refs.trend_ref,'macarons');
				const initOption = {
					grid: {
						top: "35%",
						left: "3%",
						right: "4%",
						bottom: "1%",
						containLabel: true,
					},
					//提示框组件。
					tooltip: {
						trigger: "axis", //触发类型：坐标轴触发。
					},
					legend: {
						left: 20,
						top: "15%",
						icon: "circle", //设置为圆形
					},
					xAxis: {
						type: "category",
						boundaryGap: false,
					},
					yAxis: {
						type: "value",
					},
				};
				this.chartInstance.setOption(initOption);
			},
			// ret服务端发给客户端的图表的数据
			async getData() {
				const {data: ret} = await this.$request.get("/echarts/trend");
				this.allData = ret;
				console.log("getdata" + ret)
				this.updateChart();
			},
			updateChart() {
				// 半透明的颜色值
				const colorArr1 = [
					"rgba(11, 168, 44, 0.5)",
					"rgba(44, 110, 255, 0.5)",
					"rgba(22, 242, 217, 0.5)",
					"rgba(254, 33, 30, 0.5)",
					"rgba(250, 105, 0, 0.5)",
				];
				// 全透明的颜色值
				const colorArr2 = [
					"rgba(11, 168, 44, 0)",
					"rgba(44, 110, 255, 0)",
					"rgba(22, 242, 217, 0)",
					"rgba(254, 33, 30, 0)",
					"rgba(250, 105, 0, 0)",
				];
				const timeArr = this.allData.common.month; //月份
				const valueArr = this.allData[this.choiceType].data; //series下的数据
				const seriesArr = valueArr.map((item, index) => {
					return {
						type: "line",
						name: item.name,
						data: item.data,
						stack: this.choiceType,
						areaStyle: {
							color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
									offset: 0,
									color: colorArr1[index],
								},
								{
									offset: 1,
									color: colorArr2[index],
								},
							]),
						},
					};
				});
				const legendArr = valueArr.map((item) => {
					return item.name;
				});

				// 处理数据
				const dataOption = {
					xAxis: {
						data: timeArr,
					},
					series: seriesArr,
					legend: {
						data: legendArr,
					},
				};
				this.chartInstance.setOption(dataOption);
			},
			screenAdapter() {
				this.titleFontSize = this.$refs.trend_ref.offsetWidth / 100 * 3.6
				const adapterOption = {
					legend: {
						itemWidth: this.titleFontSize,
						itemHeight: this.titleFontSize,
						itemGap: this.titleFontSize,
						textStyle: {
							fontSize: this.titleFontSize / 2
						}
					}
				};
				this.chartInstance.setOption(adapterOption);
				this.chartInstance.resize()
			},
			handleSelect(currentType) {
				this.choiceType = currentType;
				this.updateChart();
				this.showChoice = false;
			},
		},
		watch: {
			theme() {
				this.chartInstance.dispose()
				this.initChart()
				this.screenAdapter()
				this.updateChart()
			}
		},
	};
</script>

<style lang="less" scoped>
	.title {
		position: absolute;
		top: 20px;
		left: 20px;
		z-index: 10;
		color: white;

		.title-icon {
			margin-left: 10px;
			cursor: pointer;
		}

		.select-con {
			background-color: #a2a2a2;
		}
	}

	// ===================
	// html,
	// body,
	// #app {
	// 	width: 100%;
	// 	height: 100%;
	// 	padding: 0;
	// 	margin: 0;
	// 	overflow: hidden;
	// }

	.com-page {
		width: 100%;
		height: 100%;
		overflow: hidden;
	}

	.com-container {
		width: 100%;
		height: 100%;
		overflow: hidden;
	}

	.com-chart {
		width: 100%;
		height: 100%;
		overflow: hidden;
	}

	canvas {
		border-radius: 20px;
	}

	.com-container {
		position: relative;
	}
</style>
