<template>
  <div class="com-container">
    <!-- 地区销售排行榜图表 -->
    <div class="com-chart" ref="rank_ref"></div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      chartInstance: null,
      allData: null,
      startValue:0,
      endValue:9,
      trmerId:null//定时器的标识，好用来清除定时器用的。
    };
  },
  mounted() {
    this.initChart(),
      this.getData(),
      window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },
  destroyed() {
    window.removeEventListener("resize", this.screenAdapter);
    clearInterval(this.trmerId)
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.rank_ref, this.theme);
      const initOption = {
        title: {
          text: "▍地区销售排行",
          left: 20,
          top: 20,
        },
        grid: {
          top: "40%",
          left: "5%",
          right: "5%",
          bottom: "5%",
          containLabel: true,
        },
        tooltip: {
          show: true,
        },
        xAxis: {
          type: "category",
        },
        yAxis: {
          type: "value",
        },
        series: [{ type: "bar" }],
      };
      this.chartInstance.setOption(initOption);
      this.chartInstance.on('mouseover',()=>{
        clearInterval(this.trmerId)
      })
      this.chartInstance.on('mouseout',()=>{
       this.startInterval()
    })
    },
    async getData() {
      const { data: ret } = await this.$request.get("/echarts/rank");
      this.allData = ret;
	  console.log(ret)
      this.allData.sort((min, max) => {
        return max.value - min.value; //从小到大
      });
      console.log(this.allData);
      this.updateChart();
      this.startInterval()
    },
    updateChart() {
        const colorArr = [
        ['#0BA82C', '#4FF778'],
        ['#2E72BF', '#23E5E5'],
        ['#5052EE', '#AB6EE5']
      ]
      // 所有省份的数组
      const provinceArr = this.allData.map((item) => {
        return item.name;
      });
      // 省份销售金额 在对象中的value属性上
      const valueArr = this.allData.map((item) => {
        return item.value;
      });
      const dataOption = {
        xAxis: {
          data: provinceArr,
        },
        
        dataZoom:[
            {
                type:'slider',
                show:false,//隐藏了下面的滑轮柱子
                startValue:this.startValue,
                endValue:this.endValue
            }
        ],
        series: [
          {
            data: valueArr,
            itemStyle: {
              color: (arg) => {
                let  targetColorArr=null;
                if(arg.value>300){
                    targetColorArr=colorArr[0]
                    return new echarts.graphic.LinearGradient(0,0,0,1,[
                        { offset: 0, color: targetColorArr[0] }, // 0%的颜色状态
                        { offset: 1, color: targetColorArr[1] }, // 100%的颜色状态
                    ])
                }else if(arg.value>200){
                    targetColorArr=colorArr[1]
                    return new echarts.graphic.LinearGradient(0,0,0,1,[
                        { offset: 0, color: targetColorArr[0] }, // 0%的颜色状态
                        { offset: 1, color: targetColorArr[1] }, // 100%的颜色状态
                    ])
                }else{
                    targetColorArr=colorArr[2]
                    return new echarts.graphic.LinearGradient(0,0,0,1,[
                        { offset: 0, color: targetColorArr[0] }, // 0%的颜色状态
                        { offset: 1, color: targetColorArr[1] }, // 100%的颜色状态
                    ])
                }
              },
            },
          },
        ],
      };
      this.chartInstance.setOption(dataOption);
    },
    screenAdapter() {
        const titleFontSize=this.$refs.rank_ref.offsetWidth/100*3.6
      const adapterOption = {
        title:{
            textStyle:{
                fontSize:titleFontSize
            }
        },
        series:[{
            barWidth:titleFontSize/0.8,
            itemStyle:{
                barBorderRadius:[titleFontSize/2,titleFontSize/2,0,0]
            }
        }]
      };
      this.chartInstance.setOption(adapterOption);
      this.chartInstance.resize();
    },
    // 定时改变startvalue和endvalue的数值
    startInterval(){
        this.trmerId?clearInterval(this.trmerId):this.trmerId=null;
        this.trmerId=setInterval(()=>{
            this.startValue++;
            this.endValue++;
            if(this.endValue>this.allData.length-1){
                this.startValue=0;
                this.endValue=9
            }
            this.updateChart()
        },2000)
    },
  },
  computed:{
    ...mapState(['theme'])
  },
  watch: {
    theme(){
      this.chartInstance.dispose()
      this.initChart()
      this.screenAdapter()
      this.updateChart() 
    }
  },
};
</script>

<style scoped>
	/* html,body,#app{
		    width: 100%;
		    height: 100%;
		    padding: 0;
		    margin: 0;
		    overflow: hidden;
		} */
		.com-page{
		    width: 100%;
		    height: 100%;
		    overflow: hidden;
		}
		.com-container{
		    width: 100%;
		    height: 100%;
		    overflow: hidden;
		}
		.com-chart{
		    width: 100%;
		    height: 100%;
		    overflow: hidden;
		}
		canvas{
		    border-radius: 20px;
		}
		.com-container{
		    position: relative;
		}
</style>