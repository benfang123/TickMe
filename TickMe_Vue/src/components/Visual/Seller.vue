<template>
  <div class="com-container">
    <div class="com-chart" ref="seller_ref"></div>
  </div>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";
export default {
  data() {
    return {
      chartInstance: null,
      allData: [], //服务器返回的数据
      currentPage: 1, //当前多少页
      totalPage: 0, // 一共有多少页
      timerId: null, // 定时器的标识
    };
  },
  created () {
    // 在组件创建完成之后 进行回调函数的注册
    this.$socket.registerCallBack('sellerData', this.getData)
  },
  mounted() {
    this.initChart();
    // this.getDate();
    this.$socket.send({//发送数据给服务器
      action:'getData',
      socketType:'sellerData',
      chartName:'seller',
      value:""
    })
    // window.onresize=this.chartInstance.resize
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter()//防止初次访问就出现高度太低导致柱状图没有适配的现象
  },
  destroyed() {
    clearInterval(this.timerId);
    window.removeEventListener('resize',this.screenAdapter),
    this.$socket.unRegisterCallBack('sellerData')
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.seller_ref, this.theme);
      const initOption = {
        title: {
          show: true,
          text: "▍商家销售量统计",
          left: 20,
          top: 20,
          
        },
        grid: {
          top: "20%",
          left: "3%",
          right: "6%",
          bottom: "3%",
          containLabel: true,
        },
        tooltip: {
          show: true,
          trigger: "axis",
          axisPointer: {
            z: 0,
            type: "line",
            lineStyle: {
              color: "#2D3443",
            },
          },
        },
        xAxis: {
          type: "value",
        },
        yAxis: {
          type: "category",
        },
        series: [
          {
            type: "bar",
            label: {
              show: true,
              position: "right",
              color: "rgba(255, 255, 255, 255)",
            },
            itemStyle: {
              //柱状颜色
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: "#5052EE" }, // 0%的颜色状态
                { offset: 1, color: "#AB6EE5" }, // 100%的颜色状态
              ]),
            },
          },
        ],
      };
      this.chartInstance.setOption(initOption);
      this.chartInstance.on("mouseover", () => {
        clearInterval(this.timerId);
      });
      this.chartInstance.on("mouseout", () => {
        this.startInterval();
      });
    },
     // 获取服务器的数据
     getData (ret) {
      this.allData = ret
      // 对数据排序
      this.allData.sort((a, b) => {
        return a.value - b.value // 从小到大的排序
      })
      // 每5个元素显示一页
      this.totalPage = this.allData.length % 5 === 0 ? this.allData.length / 5 : this.allData.length / 5 + 1
      this.updataChart()
      // 启动定时器
      this.startInterval()
    },
    // async getDate() {
    //   // http://localhost:8090/api/seller
    //   const { data: ret } = await this.axios.get("seller"); //解构将里面的data拿出来赋值给ret
    //   this.allData = ret.sort((a, b) => {
    //     return a.value - b.value; //a-b 从大到小
    //   });
    //   //   每五个数据显示一页，一共有多少页。
    //   this.totalPage =
    //     this.allData.length % 5 === 0
    //       ? this.allData.length / 5
    //       : this.allData.length / 5 + 1;
    //   // 渲染图表
    //   this.updataChart();
    //   this.startInterval();
    // },
    updataChart() {
      const start = (this.currentPage - 1) * 5;
      const end = this.currentPage * 5;
      const showData = this.allData.slice(start, end);
      const sellerNames = showData.map((item) => {
        return item.name;
      });
      const sellerValue = showData.map((item) => {
        return item.value;
      });
      const dataOption = {
        yAxis: { data: sellerNames },
        series: [{ data: sellerValue }],
      };
      this.chartInstance.setOption(dataOption);
    },
    startInterval() {
      this.timerId ? clearInterval(this.timerId) : null;
      this.timerId = setInterval(() => {
        // 每三秒增加一下页数，然后执行一次渲染图标，实现翻页的功能
        this.currentPage++;
        if (this.currentPage > this.totalPage) {
          this.currentPage = 1;
        }
        this.updataChart();
      }, 3000);
    },
    // 屏幕适配
    screenAdapter() {
      const titleFontSize = (this.$refs.seller_ref.offsetWidth / 100) * 3.6;
      // 更改分辨率后整合的option
      const adapterOption = {
        title: {
          show: true,
          textStyle: {
            fontSize: titleFontSize,
          },
        },
        tooltip: {
          axisPointer: {
            lineStyle: {
              width: titleFontSize,
            },
          },
        },
        series: [
          {
            barWidth: titleFontSize,
            itemStyle: {
              barBorderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0], // （顺时针左上，右上，右下，左下）
            },
          },
        ],
      };
      this.chartInstance.setOption(adapterOption);
      this.chartInstance.resize()
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
      // this.updateChart() 
    }
  },
};
</script>

<style>
</style>