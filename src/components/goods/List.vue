<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 栅格系统
      一行24格
      gutter行中每列间距
       -->
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- 搜索与添加 -->
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="queryInfo.query"
            clearable
            @clear="getGoodsList"
          >

            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button>

          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button
            type="primary"
            @click="goAddpage"
          >添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 商品列表 -->
      <el-table
        :data="goodsList"
        border
        stripe
      >
        <el-table-column
          label="#"
          type="index"
        ></el-table-column>
        <el-table-column
          prop="goods_name"
          label="商品名称"
        >
        </el-table-column>
        <el-table-column
          prop="goods_price"
          label="商品价格(元)"
          width="95px"
        >
        </el-table-column>
        <el-table-column
          prop="goods_weight"
          label="商品重量"
          width="70px"
        >
        </el-table-column>
        <el-table-column
          prop="add_time"
          label="创建时间"
          width="140px"
        >
          <template v-slot="scope">
            {{scope.row.add_time  | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="130px"
        >
          <!-- 使用作用域插槽 -->
          <template v-slot="scope">
            <!-- 修改 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope)"
            ></el-button>
            <!-- 删除 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeById(scope)"
            ></el-button>

          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>

    </el-card>
    <!-- 修改用户对话框 -->
    <el-dialog
      title="修改商品信息"
      :visible.sync="editDialogVisible"
      width="30%"
      @close="editDialogVisible=false"
    >
      <el-form
        ref="editFormRef"
        :model="editForm"
        label-width="80px"
        :rules="editFormRules"
      >
        <el-form-item label="商品名称">
          <el-input
            v-model="editForm.goods_name"
          ></el-input>
        </el-form-item>
        
        <el-form-item
          label="商品数量"
        >
          <el-input-number v-model="editForm.goods_number"  :min="1" :max="1000"></el-input-number>
        </el-form-item>
        <el-form-item
          label="商品价格"
        >
          <el-input-number v-model="editForm.goods_price"  :min="1" :max="1000"></el-input-number>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="editUserInfo"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //查询参数
      queryInfo:{
        query:'',
        pagenum:1,//当前页
        pagesize:10//当前每页显示多少条数据
      },
      // 总数据条数
      total:0,
      // 商品数据
      goodsList:[],
     // 修改用户对话框弹出
      editDialogVisible:false,
      // 修改用户时查询数据
      editForm:{},
    }
  },
  methods: {
    async getGoodsList(){
      const { data:res} = await this.$http.get('goods',{
        params:this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('商品列表获取失败！')
      }
      this.total = res.data.total;
      this.goodsList = res.data.goods;
    },
    //监听pagesize改变的事件
    handleSizeChange(newSize){
      this.queryInfo.pagesize = newSize;
      //重新获取数据
      this.getGoodsList();
    },//页码值切换事件
    handleCurrentChange(newNum){
      this.queryInfo.pagenum = newNum;
      //重新获取数据
      this.getGoodsList();
    },
    // 根据id删除用户
    async removeById({row:{goods_id:id}}){
      // 第一个参数为中间文本，第二个参数为标题，第三个参数为配置对象
      const res = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).catch(err=>err)
      // 点击确定返回confirm字符串文本，点击取消抛出异常,通过catch将错误返回让其返回文本字符
      if(res !== 'confirm')
        return this.$message.info("已取消删除")
      // 发出网络请求
      const {data:result} = await this.$http.delete('goods/'+id);
      console.log(result);
      if (result.meta.status!==200) {
        return this.$message.error("删除失败")
      }
      this.$message.success("删除成功")
      this.getGoodsList()
    },
    // 添加商品按钮
    goAddpage(){
      this.$router.push('/goods/add');
    },
    // 修改商品按钮
    async showEditDialog({row:{goods_id:id}}){
      this.editDialogVisible = true;
      const {data:res} = await this.$http.get('goods/'+id)
      console.log(id,res);
      if(res.meta.status!==200) return this.$message.error("查询当前商品失败")
      this.editForm = res.data;
    },
    // 提交修改表单
    async editUserInfo(){
     
      //验证成功发起网络请求
      const {data:res} = await this.$http.put('goods/'+this.editForm.goods_id,this.editForm);
      console.log(res);
      if (res.meta.status!==200) {
        return this.$message.error("更新失败")
      }
        this.$message.success("更新成功")
        this.editDialogVisible = false;
        this.getGoodsList()
      
    },
  },
  created() {
    this.getGoodsList()
  },
}
</script>

<style>

</style>