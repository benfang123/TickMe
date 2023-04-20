<template>
  <div class="com-container">
    <div class="com-chart" ref="map_ref"></div>
  </div>
</template>
  
  <script>
import { mapState } from "vuex";
import axiosLocal from "axios";
import {getProvinceMapInfo} from '@/utils/map_utils'
export default {
  data() {
    return {
      chartInstance: null,
      allData: null,
      titleFontSize:0,
      mapData:{}//省份地图适量数据的缓存
    };
  },
  created () {
    // 在组件创建完成之后 进行回调函数的注册
    this.$socket.registerCallBack('mapData', this.getData)
  },
  mounted() {
    this.initChart();
    // this.getDate()
    this.$socket.send({//发送数据给服务器
      action:'getData',
      socketType:'mapData',
      chartName:'map',
      value:""
    })
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter(); //防止初次访问就出现高度太低导致柱状图没有适配的现象
  },
  destroyed() {
    clearInterval(this.timerId);
    window.removeEventListener("resize", this.screenAdapter);
    this.$socket.unRegisterCallBack('mapData')
    
  },
  methods: {
    async initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.map_ref, this.theme);
      //   获取本地地图矢量数据
      const ret = await axiosLocal.get(
        "http://localhost:8080/static/map/china.json"
      );
      this.$echarts.registerMap('china', ret.data);
      const initOption = {
        title:{
            text:'▍商家分布',
            left:20,
            top:20
        },
        legend:{
            left:'5%',
            bottom:'5%',
            orient: "vertical"
        },
        geo:[{
                map:'china',
                type:'map',
                top:'5%',
                buttom:'5%',
                itemStyle:{areaColor:'#2E72BF', borderColor:'#333'},
            }]
        
      };
      this.chartInstance.setOption(initOption);
      this.chartInstance.on('click',async (arg)=>{
        const provinceInfo=getProvinceMapInfo(arg.name);
        if(!this.mapData[provinceInfo.key]){//判断是否是当前点击的省份的名称
            if(typeof provinceInfo.key==='undefined'){this.mapData={};return;}
            const ret=await axiosLocal.get('http://localhost:8080'+provinceInfo.path).catch((error)=>{
                if(typeof provinceInfo.key==='undefined'){ 
                }else{
                    console.log('Error', error.message);
                }
            })
            this.$echarts.registerMap(provinceInfo.key, ret.data)
            this.mapData[provinceInfo.key] = ret.data
        }
        console.log(provinceInfo.key)
        const changeOption = {
          geo: {
            map: provinceInfo.key
          },
        };
        this.chartInstance.setOption(changeOption)
      })
      this.chartInstance.on('dblclick',()=>{
        const changeOption = {
          geo: {
            map: 'china'
          },
        };
        this.chartInstance.setOption(changeOption)
      })
    },
    // async getDate() {
    //   const { data: ret } = await this.axios.get("map");
    //   this.allData = ret;
    //   this.updataChart()
    // },
    getData (ret) {
      this.allData = ret
      this.updataChart()
    },
    updataChart() {
        const legendArr = this.allData.map(item => {
            return item.name
        })
        const seriesArr=this.allData.map(item=>{
            // 一个类别的的所有散点数据
            return{
                type:'effectScatter',
                name:item.name,
                data:item.children,
                coordinateSystem:'geo',
                rippleEffect :{
                    scale:5,
                    brushType: "stroke"
                }
            }
        })
      const dataOption = {
        // series:seriesArr
        series: seriesArr,
        legend:{
            data:legendArr
        },

      };
      this.chartInstance.setOption(dataOption);
    },
    screenAdapter() {
        const titleFontSize = this.$refs.map_ref.offsetWidth / 100 * 3.6
      const adapterOption = {
        title:{
            textStyle:{
                fontSize:titleFontSize
            }
        },
        legend:{
            itemWidth:titleFontSize/2,
            itemHeight:titleFontSize/2,
            itemGap: titleFontSize / 2,
            textStyle:{
                fontSize:titleFontSize/2
            }
        }
      };
      this.chartInstance.setOption(adapterOption);
      this.chartInstance.resize();
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
      this.updataChart()
    }
  },
};
</script>
  
  <style>
</style>