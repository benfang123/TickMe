<template>
  <div class="com-container">
    <div class="com-chart" ref="hot_ref"></div>
    <span class="iconfont arr-left" @click="toLeft" :style="comStyle">&#xe6ef;</span>
    <span class="iconfont arr-right" @click="toRight" :style="comStyle">&#xe6ed;</span>
    <span class="cat-name" :style="comStyle">{{ catName }}</span>
  </div>
</template>
  
  <script>
  import { mapState } from "vuex";
  import {getThemeValue} from '@/utils/theme_utils'
export default {
  data() {
    return {
      chartInstance: null,
      allData: null,
      currentIndex: 0, //通过点击左右按钮来改变这个值，方能达到图的变化
      titleFontSize:0
    };
  },
  created () {
    this.$socket.registerCallBack('hotData', this.getData)
    console.log("开始进行vue页面解析")
  },
  mounted() {
    console.log(this)
    this.initChart(),
      // this.getData(),
      this.$socket.send({//发送数据给服务器
      action:'getData',
      socketType:'hotData',
      chartName:'hotproduct',
      value:""
    })
      window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
    console.log(this.comStyle)
  },
  destroyed() {
    window.removeEventListener("resize", this.screenAdapter);
    this.$socket.unRegisterCallBack('hotData')
  },
  computed: {
    catName() {
      if (!this.allData) {
        return "";
      } else {
        return this.allData[this.currentIndex].name;
      }
    },
    comStyle(){
        return{
            fontSize:this.titleFontSize+'px',
            color:getThemeValue(this.theme).titleColor
        }
    },
    ...mapState(['theme'])
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.hot_ref, this.theme);
      const initOption = {
        title: {
          text: "▍热销商品的占比",
          left: 20,
          top: 20,
        },
        tooltip: {
          show: true,
          formatter: (arg) => {
            const thirdCategory = arg.data.children;
            let total = 0;
            thirdCategory.forEach((item) => {
              total += item.value;
            });
            let retStr = "";
            thirdCategory.forEach((item) => {
              retStr += `
                        ${item.name}:${
                parseInt((item.value / total) * 100) + "%"
              }<br/>
                    `;
            });
            return retStr;
          },
        },
        legend: {
          top: "15%",
          icon: "circle",
        },
        series: [
          {
            type: "pie",
            label: {
              show: false,
              // position:'inside'
            },
            emphasis: {
              label: {
                show: true,
              },
            },
            labelLine: {
              show: false,
            },
          },
        ],
      };
      this.chartInstance.setOption(initOption);
    },
    // async getData() {
    //   const { data: ret } = await this.axios.get("hotproduct");
    //   this.allData = ret;
    //   console.log(ret);
    //   this.updateChart();
    // },
    getData (ret) {
      this.allData = ret
      console.log(this.allData)
      this.updateChart()
    },
    updateChart() {
      const legendData = this.allData[this.currentIndex].children.map(
        (item) => {
          return item.name;
        }
      );
      const seresData = this.allData[this.currentIndex].children.map((item) => {
        return {
          name: item.name,
          value: item.value,
          children: item.children,
        };
      });
      const dataOption = {
        legend: {
          data: legendData,
        },
        series: [
          {
            data: seresData,
          },
        ],
      };
      this.chartInstance.setOption(dataOption);
    },
    screenAdapter() {
      this.titleFontSize = (this.$refs.hot_ref.offsetWidth / 100) * 3.6;
      const adapterOption = {
        title:{
            textStyle:{
                fontSize:this.titleFontSize
            }, 
        },
        legend: {
          itemWidth: this.titleFontSize ,
          itemHeight: this.titleFontSize,
          itemGap: this.titleFontSize / 2,
          textStyle: {
            fontSize: this.titleFontSize / 2
          }
        },
        series:[
            {
            radius: this.titleFontSize *4.5,
            center: ['50%', '60%']
            }
            ]
      };
      this.chartInstance.setOption(adapterOption);
      this.chartInstance.resize();
    },
    toLeft() {
      this.currentIndex--;
      if (this.currentIndex < 0) {
        this.currentIndex = this.allData.length - 1;
      }
      this.updateChart();
    },
    toRight() {
      this.currentIndex++;
      if (this.currentIndex > this.allData.length - 1) {
        this.currentIndex = 0;
      }
      this.updateChart();
    },
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
  
<style lang="less" scoped>
.arr-left {
  position: absolute;
  left: 10%;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: white;
}
.arr-right {
  position: absolute;
  right: 10%;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: white;
}
.cat-name {
  position: absolute;
  left: 80%;
  bottom: 20px;
  color: white;
}
</style>