<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="box-card">
          <el-row
            :gutter="20"
            style="margin:0"
          >
            <el-col :span="8">
              <i
                class="el-icon-user-solid"
                style="color:#67C23A;"
              ></i>
            </el-col>
            <el-col
              :span="12"
              class="center"
            >
              <span>浏览量</span>
              <h3>{{animatedNumber(newview)}}</h3>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card">
          <el-row
            :gutter="20"
            style="margin:0"
          >
            <el-col :span="8">
              <i
                class="el-icon-s-comment"
                style="color:#409EFF;"
              ></i>
            </el-col>
            <el-col
              :span="12"
              class="center"
            >
              <span>消息</span>
              <h3>{{animatedNumber(newmessage)}}</h3>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card">
          <el-row
            :gutter="20"
            style="margin:0"
          >
            <el-col :span="8">
              <i
                class="el-icon-s-finance"
                style="color:#F56C6C;"
              ></i>
            </el-col>
            <el-col
              :span="12"
              class="center"
            >
              <span>收益</span>
              <h3>{{animatedNumber(newpurchase)}}</h3>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card">
          <el-row
            :gutter="20"
            style="margin:0"
          >
            <el-col :span="8">
              <i
                class="el-icon-shopping-cart-full"
                style="color:#67C23A;"
              ></i>
            </el-col>
            <el-col
              :span="12"
              class="center"
            >
              <span>交易订单</span>
              <h3>{{animatedNumber(newshopping)}}</h3>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <el-card>
      <div
        id="main"
        style="width: 1000px;height:600px;"
      ></div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import gsap from 'gsap'
export default {
  data() {
    return {
      view:14560,
      message:8456,
      purchase:9280,
      shopping:1360,
      newview:14560,
      newmessage:8456,
      newpurchase:9280,
      newshopping:1360,
    }
  },methods: {
    animatedNumber: function(number) {
      return number.toFixed(0);
    }
  },
  mounted() {
     // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'));
    var option = {
      title: {
        text: '销量报表'
      },
      tooltip: {trigger: 'axis',showContent: false},
      legend: {},
      dataset: {
          source: [
              ['product', '2016', '2017', '2018', '2019', '2020', '2021'],
              ['实际销量', 120, 250, 260, 280, 290, 320],
              ['预期销量', 250, 150, 190, 250, 300, 350],
          ]
      },
      xAxis: {type: 'category'},
      yAxis: {gridIndex: 0},
      series: [
        {type: 'line', smooth: true, seriesLayoutBy: 'row', emphasis: {focus: 'series'}},
        {type: 'line', smooth: true, seriesLayoutBy: 'row', emphasis: {focus: 'series'}},
      ]
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
    // 定时器增加数量
    setInterval(() => {
      this.view += Math.ceil(Math.random()*200); 
      this.message += Math.ceil(Math.random()*50); 
      this.purchase += Math.ceil(Math.random()*1000); 
      this.shopping += Math.ceil(Math.random()*100); 
    }, 3000)
  },
  watch: {
    view: function(newValue) {
      gsap.to(this.$data, { duration: 0.5, newview: newValue });
    },
    message: function(newValue) {
      gsap.to(this.$data, { duration: 0.5, newmessage: newValue });
    },
    purchase: function(newValue) {
      gsap.to(this.$data, { duration: 0.5, newpurchase: newValue });
    },
    shopping: function(newValue) {
      gsap.to(this.$data, { duration: 0.5, newshopping: newValue });
    },
  }
}
</script>

<style lang="less" scoped>

i:before{
  font-size: 70px;
}
.center span{
  color: #848484;
}
.center h3{
  margin: 10px 0 0 0;
}
.center{
  text-align: center;
}

</style>