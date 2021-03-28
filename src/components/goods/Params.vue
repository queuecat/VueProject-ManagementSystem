<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 栅格系统
      一行24格
      gutter行中每列间距
       -->

      <!-- 提示信息 -->
      <el-alert
        title="注意：只允许选择为第三级分类设置相关属性！"
        :closable="false"
        type="warning"
        show-icon
      >
      </el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 商品分类区域 -->
          <el-cascader
            v-model="selectedKeys"
            :options="cateList"
            :props="{ expandTrigger: 'hover',value:'cat_id',label:'cat_name',children:'children'}"
            @change="cateChange"
            clearable
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- 页签区域 -->
      <el-tabs
        v-model="activeName"
        @tab-click="handleTabClick"
      >
        <!-- 添加动态参数面板 -->
        <el-tab-pane
          label="动态参数"
          name="many"
        >
          <!-- 添加参数按钮 -->
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible=true"
          >添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table
            :data="manyTableData"
            border
            stripe
          >
            <!-- 展开行 -->
            <el-table-column type="expand">
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column
              label="#"
              type="index"
            >
            </el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            >
            </el-table-column>
            <el-table-column
              label="操作"
              width="300px"
            >
              <!-- 使用作用域插槽 -->
              <template v-slot="scope">
                <!-- 修改 -->
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope)"
                >编辑</el-button>
                <!-- 删除 -->
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeManyById(scope)"
                >删除</el-button>

              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性面板 -->
        <el-tab-pane
          label="静态属性"
          name="only"
        >
          <!-- 添加属性按钮 -->
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible=true"
          >添加属性</el-button>
          <!-- 静态属性表格 -->
          <el-table
            :data="onlyTableData"
            border
            stripe
          >
            <!-- 展开行 -->
            <el-table-column type="expand">
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column
              label="#"
              type="index"
            >
            </el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            >
            </el-table-column>
            <el-table-column
              label="操作"
              width="300px"
            >
              <!-- 使用作用域插槽 -->
              <template v-slot="scope">
                <!-- 修改 -->
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope)"
                >编辑</el-button>
                <!-- 删除 -->
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeManyById(scope)"
                >删除</el-button>

              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 点击添加参数/属性按钮弹出对话框 -->
    <el-dialog
      :title="titleText"
      :visible.sync="addDialogVisible"
      width="50%"
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
          :label="titleText"
          prop="attr_name"
        >
          <el-input v-model="addForm.attr_name"></el-input>
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
          @click="addParams"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    this.getCateList();
  },
  data() {
    return {
        // 存储商品分类
        cateList:[],
        // 级联选择器分类ID数组
        selectedKeys:[],
        // 当前展示页签名称
        activeName:'many',
        // 动态参数数据
        manyTableData:[],
        // 静态属性数据
        onlyTableData:[],
        // 新增对话框的显示与隐藏
        addDialogVisible:false,
        // 新增表单对象
        addForm:{
          attr_name:""
        },
        addFormRules:{
         attr_name:[
            { required: true, message: "请输入分类名称", trigger: "blur" },
            {
              min:2,
              max: 15,
              message: "长度在 2 到 15 个字符",
              trigger: "blur",
            }
          ]
        }
    }
  },
  methods: {
    // 获取所有商品分类列表
    async getCateList(){
      const {data:res} = await this.$http.get('categories');
      if(res.meta.status!==200) return this.$message.error("获取分类信息失败");
      this.cateList = res.data;
    },
    // 选择框选择事件
    cateChange(){
      this.getParamsData()
    },
    // 获取参数列表数据
    async getParamsData(){
      if(this.selectedKeys.length!==3){
        this.selectedKeys=[]
        return;
      }
      // 当前选中为三级分类,获取参数
      const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:this.activeName}});
      if(res.meta.status!==200) return this.$message.error("获取参数信息失败");
      if (this.activeName==='many') {
        this.manyTableData = res.data;
      }else{
          this.onlyTableData = res.data;
      }
    },
    // 页签点击事件
    handleTabClick(){
      this.getParamsData()
    },
    // 新增对话框关闭事件
    addDialogClosed(){
      this.$refs.addFormRef.resetFields()
    },
    // 新增表单提交事件
    async addParams(){
      // 预验证
      this.$refs.addFormRef.validate(async valid=>{
        if(!valid) return;
        const {data:res} = await this.$http.post(`categories/${this.cateId}/attributes`,{attr_sel:this.activeName,attr_name:this.addForm.attr_name});
        console.log(res,this.activeName,this.addForm.attr_name);
        if(res.meta.status!==201) return this.$message.error("添加参数信息失败");
        this.$message.success("参数添加成功");
        this.addDialogVisible = false;
        this.getParamsData()
      })
    }
  },
  computed:{
    // 如果按钮需要被禁用，返回true
    isBtnDisabled(){
      return this.selectedKeys.length!==3;
    },
    // 当前选中得分类ID
    cateId(){
      return this.selectedKeys.length===3?this.selectedKeys[2]:null;
    },
    // 确定新增对话框标题
    titleText(){
      return this.activeName==='many'?'动态参数':'静态属性';
    }
  }
}
</script>

<style>
.cat_opt{
  margin: 15px 0;
}
.el-cascader{
  width: 222px;
}
</style>