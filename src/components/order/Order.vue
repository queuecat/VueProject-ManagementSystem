<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 栅格系统
      一行24格
      gutter行中每列间距
       -->
      <el-row :gutter="20">

        <!-- 搜索与添加 -->
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="queryInfo.query"
            clearable
            @clear="getOrderList"
          >

            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getOrderList"
            ></el-button>

          </el-input>
        </el-col>
      </el-row>
      <!-- 用户列表 -->
      <el-table
        :data="OrderList"
        border
        stripe
      >
        <el-table-column
          label="#"
          type="index"
        ></el-table-column>
        <el-table-column
          prop="order_number"
          label="订单变化"
        >
        </el-table-column>
        <el-table-column
          prop="order_price"
          label="订单价格"
        >
        </el-table-column>
        <el-table-column
          prop="pay_status"
          label="是否付款"
        >
          <template v-slot="scope">
            <el-tag
              v-if="scope.row.pay_status===1"
              type="success"
            >已付款</el-tag>
            <el-tag
              v-else
              type="danger"
            >未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="is_send"
          label="是否发货"
        >
        </el-table-column>
        <el-table-column
          prop="create_time"
          label="下单时间"
        >
          <template v-slot="scope">
            {{scope.row.create_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="130px"
        >
          <!-- 使用作用域插槽 -->
          <template v-slot="scope">
            <!-- 修改 -->
            <el-tooltip
              effect="dark"
              content="修改订单地址"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditDialog(scope)"
              ></el-button>
            </el-tooltip>
            <!-- 定位 -->
            <el-tooltip
              effect="dark"
              content="修改地址"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="success"
                icon="el-icon-location"
                size="mini"
                @click="setRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 修改地址对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="addressDialogVisible"
      width="30%"
      @close="editDialogClosed"
    >
      <el-form
        ref="addressFormRef"
        :model="addressForm"
        label-width="100px"
        :rules="addressFormRules"
      >
        <el-form-item
          label="省市区/县"
          prop="address1"
        >
          <el-cascader
            v-model="addressForm.address1"
            :options="cityData"
            :props="{ expandTrigger: 'hover',value,label,children:'children'}"
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item
          label="详细地址"
          prop="address2"
        >
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="addressDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="editInfo"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import cityData from './citydata'
export default {
  data() {
    return {
      // 查询信息
      queryInfo:{
        query:'',
        pagenum:1,//当前页
        pagesize:10//当前每页显示多少条数据
      },
      // 总数据条数
      total:0,
      // 订单数据
      OrderList:[],
      // 修改地址对话框
      addressDialogVisible:false,
      // 修改地址对象
      addressForm:{
        address1:[],
        address2:""
      },
      // 修改验证规则
      addressFormRules:{
        address1:[
          { required: true, message: "请选择省市区/县", trigger: "blur" }
        ],
        address2:[
          { required: true, message: "请输入详细地址", trigger: "blur" }
        ]
      },
      // 地址数据
      cityData,
    }
  },
  methods: {
    async getOrderList(){
      const { data:res} = await this.$http.get('orders',{
        params:this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('订单列表获取失败！')
      }
      this.OrderList = res.data.goods;
      this.total = res.data.total;
    },
    //监听pagesize改变的事件
    handleSizeChange(newSize){
      this.queryInfo.pagesize = newSize;
      //重新获取数据
      this.getOrderList();
    },
    //页码值切换事件
    handleCurrentChange(newNum){
      this.queryInfo.pagenum = newNum;
      //重新获取数据
      this.getOrderList();
    },
    // 点击地址修改打开对话框
    showEditDialog(){
      this.addressDialogVisible = true;
    },
    // 修改表单提交
    editInfo(){
      
    },
    // 修改对话框关闭
    editDialogClosed(){
      this.$refs.addressFormRef.resetFields()
    }
  },
  created() {
    this.getOrderList()
  },
}
</script>

<style>
.el-cascader{
  width: 100%;
}
</style>