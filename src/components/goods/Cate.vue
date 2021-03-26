<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 栅格系统
      一行24格
      gutter行中每列间距
       -->
      <el-row>
        <el-button
          type="primary"
          @click="addDialogVisible = true"
        >添加分类</el-button>
      </el-row>
      <!-- 表格区域 -->
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
      >
        <!-- 显示是否有效图标 -->
        <template v-slot:isok="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted===false"
          ></i>
          <i
            class="el-icon-error"
            v-else
          ></i>
        </template>
        <!-- 排序标签 -->
        <template v-slot:order="scope">
          <el-tag
            size="mini"
            v-if="scope.row.cat_level===0"
          >一级</el-tag>
          <el-tag
            type="success"
            size="mini"
            v-else-if="scope.row.cat_level===1"
          >二级</el-tag>
          <el-tag
            type="warning"
            size="mini"
            v-else
          >三级</el-tag>
        </template>
        <!-- 操作标签 -->
        <template v-slot:opt="scope">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
          >编辑</el-button>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-error"
          >删除</el-button>
        </template>
      </tree-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3,5,10,15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 添加分类对话框显示
      addDialogVisible:false,
      // 商品分类数据列表
      cateList:[],
      // 查询条件
      queryInfo:{
        type:3,
        pagenum:1,
        pagesize:5
      },
      // 数据总条数
      total:0,
      // 为table指定每一列的定义
      columns:[
        {
          label:'分类名称',
          prop:'cat_name'
        },
        {
          label:'是否有效',
          // 定义当前列为模板列
          type:'template',
          // 定义该模板列使用的模板名称
          template:'isok'
        },
        {
          label:'排序',
          // 定义当前列为模板列
          type:'template',
          // 定义该模板列使用的模板名称
          template:'order'
        },
        {
          label:'操作',
          // 定义当前列为模板列
          type:'template',
          // 定义该模板列使用的模板名称
          template:'opt'
        }
      ]
    }
  },
  methods: {
    async getCateList(){
      const {data:res} = await this.$http.get('categories',{params:this.queryInfo});
        if (res.meta.status!==200) return this.$message.console.error("获取商品分类失败");
      this.cateList = res.data.result;
      this.total = res.data.total;
      console.log(res);
    },
    // 监听pagesize变化属性
    handleSizeChange(newSize){
      this.queryInfo.pagesize = newSize;
      this.getCateList()
    },
    // 监听页码改变
    handleCurrentChange(newPage){
      this.queryInfo.pagenum = newPage;
      this.getCateList()
    }
  },
  created() {
    this.getCateList()
  },
}
</script>

<style>

</style>