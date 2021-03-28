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
          @click="showDialog"
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
            style="color: chartreuse;"
            class="el-icon-success"
            v-if="scope.row.cat_deleted===false"
          ></i>
          <i
            style="color:tomato;"
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
            @click="showEditDialog(scope.row)"
          >编辑</el-button>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-error"
            @click="removeRoleById(scope)"
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
    <!-- 添加分类对话框 -->
    <el-dialog
      title="新增分类"
      :visible.sync="addDialogVisible"
      width="30%"
      @close="addDialogClosed"
    >
      <!-- 内容主题区域 -->
      <el-form
        :rules="addFormRules"
        :model="addForm"
        label-width="100px"
        ref="addFormRef"
      >
        <el-form-item
          label="分类名称："
          prop="cat_name"
        >
          <el-input v-model="addForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="分类归属：">
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="{ expandTrigger: 'hover',value:'cat_id',label:'cat_name',children:'children',checkStrictly:true }"
            @change="parentCateChange"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="addCate"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 点击编辑弹出编辑对话框 -->
    <el-dialog
      title="编辑分类"
      :visible.sync="editDialogVisible"
      width="30%"
      @close="editDialogClosed"
    >
      <!-- 内容主题区域 -->
      <el-form
        :rules="addFormRules"
        :model="editForm"
        label-width="100px"
        ref="editFormRef"
      >
        <el-form-item
          label="分类名称："
          prop="cat_name"
        >
          <el-input v-model="editForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
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
      ],
      // 控制新增分类对话框显示
      addDialogVisible:false,
      // 新增分类表单对象
      addForm:{
        cat_name:"",
        cat_pid:0,
        cat_level:0
      },
      // 新增表单验证规则
      addFormRules:{
        cat_name:[
          { required: true, message: "请输入分类名称", trigger: "blur" },
          {
            min:2,
            max: 15,
            message: "长度在 2 到 15 个字符",
            trigger: "blur",
          }
        ]
      },
      // 父级分类列表
      parentCateList:[],
      // 选中的父级分类ID数组
      selectedKeys:[],
      // 修改角色表单数据
      editForm:{
        cat_name:""
      },
       // 修改对话框弹出
      editDialogVisible:false,
      
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
    },
    // 点击新增按钮显示对话框
    showDialog(){
      // 获取父级分类列表
      this.getParentCatList();
      this.addDialogVisible = true;

    },
    // 新增分类对话框关闭事件
    addDialogClosed(){
      this.$refs.addFormRef.resetFields()
      this.selectedKeys = [];
      this.addForm.cat_pid = 0;
      this.addForm.cat_level = 0;
    },
    // 获取父级分类的数据列表
    async getParentCatList(){
      const {data:res} = await this.$http.get('categories',{params:{type:2}});
      if(res.meta.status!==200) return this.$message.error("获取分类归属信息失败");
      this.parentCateList = res.data;
    },
    // 级联改变
    parentCateChange(){
      if (this.selectedKeys.length>0) {
        this.addForm.cat_pid = this.selectedKeys[this.selectedKeys.length-1];
        this.addForm.cat_level = this.selectedKeys.length;
      }else{
        this.addForm.cat_pid = 0;
        this.addForm.cat_level = 0;
      }
      
    },
    // 提交新建分类选择框
    async addCate(){
      // 预验证
      this.$refs.addFormRef.validate(async valid=>{
        if (!valid) return false;
        const {data:res} = await this.$http.post('categories',this.addForm);
        if(res.meta.status!==201) return this.$message.error("添加分类失败");
        this.$message.success("添加分类成功");
        this.getCateList();
        this.addDialogVisible = false;
      })
    },
    //显现修改用户对话框，同时查询数据并渲染
    async showEditDialog(cate){
      const {data:res} = await this.$http.get('categories/'+cate.cat_id)
      if(res.meta.status!==200) return this.$message.error("查询当前角色失败")
      this.editForm = res.data;
      this.editDialogVisible = true;
    },
    //修改表单关闭重置验证规则
    editDialogClosed(){
      this.$refs.editFormRef.resetFields();
    },
    // 提交修改表单
    editUserInfo(){
      // 表单预校验
      this.$refs.editFormRef.validate(async valid=>{
        if (!valid) return false;
        //验证成功发起网络请求
        const {data:res} = await this.$http.put('categories/'+this.editForm.cat_id,{
          cat_name:this.editForm.cat_name,
        });
        if (res.meta.status!==200) {
          return this.$message.error("更新失败")
        }
          this.$message.success("更新成功")
          this.editDialogVisible = false;
          this.getCateList()
     })
    },
    // 根据id删除用户
    async removeRoleById({row}){
      // 第一个参数为中间文本，第二个参数为标题，第三个参数为配置对象
      const res = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).catch(err=>err)
      // 点击确定返回confirm字符串文本，点击取消抛出异常,通过catch将错误返回让其返回文本字符
      if(res !== 'confirm')
        return this.$message.info("已取消删除")
      // 发出网络请求
      const {data:result} = await this.$http.delete('categories/'+row.cat_id);
      console.log(result);
      if (result.meta.status!==200) {
        return this.$message.error("删除失败")
      }
      this.$message.success("删除成功")
      this.getCateList()
    },
  },
  created() {
    this.getCateList()
  },
}
</script>

<style>
.el-cascader{
  width: 100%;
}
.el-cascader-menu__wrap{
  height: 204px !important;
}
.el-row{
  margin-bottom: 15px;
}
</style>