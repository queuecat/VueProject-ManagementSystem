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
              <template v-slot="scope">
                <el-tag
                  v-if="!scope.row.attr_vals.toString()"
                  type="info"
                >
                  暂无参数
                </el-tag>
                <el-tag
                  v-for="(item,i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i,scope.row)"
                >{{item}}</el-tag>
                <!-- 动态切换文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>

              </template>
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
              <template v-slot="scope">
                <el-tag
                  v-if="!scope.row.attr_vals.toString()"
                  type="info"
                >
                  暂无参数
                </el-tag>
                <el-tag
                  v-for="(item,i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i,scope.row)"
                >{{item}}</el-tag>
                <!-- 动态切换文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>

              </template>
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
    <!-- 点击修改按钮弹出对话框 -->
    <el-dialog
      title="修改"
      :visible.sync="editDialogVisible"
      width="50%"
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
          :label="titleText"
          prop="attr_name"
        >
          <el-input v-model="editForm.attr_name"></el-input>
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
          @click="editParams"
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
        },
         // 修改参数表单数据
        editForm:{
          attr_name:""
        },
        // 修改对话框弹出
        editDialogVisible:false,
        // // 控制按钮与文本框的显示
        // inputVisible:false,
        // // 文本框中的内容
        // inputValue:""
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
      this.getParamsData();
    },
    // 获取参数列表数据
    async getParamsData(){
      if(this.selectedKeys.length!==3){
        this.selectedKeys=[];
        this.manyTableData = [];
        this.onlyTableData = [];
        return;
      }
      // 当前选中为三级分类,获取参数
      const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:this.activeName}});
      if(res.meta.status!==200) return this.$message.error("获取参数信息失败");
      // 将attr_vals字符串转换为数组
      res.data.forEach(item=>{
        item.attr_vals = item.attr_vals? item.attr_vals.split(' ') : [];
        // if (item.attr_vals.length===1 && item.attr_vals[0]==='') {
        //   item.attr_vals=[]
        // }

        // 为对象添加文本框显示变量
        item.inputVisible = false;
        // 文本框中输入的值
        item.inputValue="";
      })
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
        if(res.meta.status!==201) return this.$message.error("添加参数信息失败");
        this.$message.success("参数添加成功");
        this.addDialogVisible = false;
        this.getParamsData()
      })
    },
    // 点击修改按钮，弹出修改对话框
    async showEditDialog({row}){
      const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes/${row.attr_id}`,{attr_sel:this.activeName});
      if(res.meta.status!==200) return this.$message.error("查询参数信息失败");
      this.editForm = res.data;
      this.editDialogVisible = true;
    },
    // 关闭修改对话框
    editDialogClosed(){
      this.$refs.editFormRef.resetFields()
    },
    // 修改对话框提交
    editParams(){
      this.$refs.editFormRef.validate(async valid=>{
        if(!valid) return;
        const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,{attr_sel:this.activeName,attr_name:this.editForm.attr_name});
        if(res.meta.status!==200) return this.$message.error("更新参数信息失败");
        this.$message.success("参数修改成功");
        this.getParamsData()
        this.editDialogVisible = false;

      })
    },
    // 点击删除按钮，显示确定框
    async removeManyById({row}){
      // 第一个参数为中间文本，第二个参数为标题，第三个参数为配置对象
      const res = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).catch(err=>err)
      // 点击确定返回confirm字符串文本，点击取消抛出异常,通过catch将错误返回让其返回文本字符
      if(res !== 'confirm')
        return this.$message.info("已取消删除")
      // 发出网络请求
      const {data:result} = await this.$http.delete(`categories/${this.cateId}/attributes/${row.attr_id}`);
      console.log(result);
      if (result.meta.status!==200) {
        return this.$message.error("删除失败")
      }
      this.$message.success("删除成功")
      this.getParamsData()
    },
    // 文本框显示事件
    showInput(row){
      row.inputVisible = true;
      // 文本框获得焦点
      // $nextTick为当页面中的元素被重新渲染后，才会执行
      this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 文本框结束事件
    async handleInputConfirm(row){
      if (row.inputValue.trim().length===0) {
        row.inputValue='';
        row.inputVisible=false;
        return;
      }
      // 若输入不为空，进行预校验
      row.attr_vals.push(row.inputValue);
      row.inputValue='';
      // 发起网络请求添加参数
      const {data:result} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
        attr_name: row.attr_name,
        attr_vals: row.attr_vals.join(' '),
        attr_sel: row.attr_sel,
      });
      // console.log(result,row.attr_vals.join(' '));
      if (result.meta.status!==200) {
        row.inputValue='';
        row.inputVisible=false;
        row.attr_vals.splice(row.attr_vals.length-1,1);
        return this.$message.error("修改失败")
      }
      row.inputVisible=false;
      this.$message.success("修改成功")
    },
    // 删除参数
    async handleClose(i,row){
      var out = row.attr_vals.splice(i,1);
      // 发起网络请求添加参数
      const {data:result} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
        attr_name: row.attr_name,
        attr_vals: row.attr_vals.join(' '),
        attr_sel: row.attr_sel,
      });
      // console.log(result,row.attr_vals.join(' '));
      if (result.meta.status!==200) {
        row.attr_vals.splice(i,0,out[0]);
        return this.$message.error("修改失败")
      }
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
  width: 222px !important;
}
.el-tag{
  margin: 10px;
}
.input-new-tag{
  width: 120px !important;
}
</style>