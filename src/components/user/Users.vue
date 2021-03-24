<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 栅格系统
      一行24格
      gutter行中每列间距
       -->
      <el-row :gutter="20">
        <el-col :span="7">
          <!-- 搜索与添加 -->
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >

            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>

          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button
            type="primary"
            @click="addDialogVisible = true"
          >添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表 -->
      <el-table
        :data="UserList"
        border
        stripe
      >
        <el-table-column
          label="#"
          type="index"
        ></el-table-column>
        <el-table-column
          prop="username"
          label="姓名"
        >
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
        >
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="电话"
        >
        </el-table-column>
        <el-table-column
          prop="role_name"
          label="角色"
        >
        </el-table-column>
        <el-table-column label="状态">
          <!-- 使用作用域插槽 -->
          <template v-slot="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="userStateChanged(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="180px"
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
              @click="removeUserById(scope)"
            ></el-button>
            <!-- 分配权限 -->
            <el-tooltip
              effect="dark"
              content="权限分配"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="info"
                icon="el-icon-setting"
                size="mini"
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
        :page-sizes="[2, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 点击添加用户按钮弹出对话框 -->
    <el-dialog
      title="新增用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 内容主题区域 -->
      <el-form
        :rules="addFormRules"
        :model="addForm"
        label-width="70px"
        ref="addFormRef"
      >
        <el-form-item
          label="用户名"
          prop="username"
        >
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item
          label="密码"
          prop="password"
        >
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item
          label="邮箱"
          prop="email"
        >
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item
          label="手机"
          prop="mobile"
        >
          <el-input v-model="addForm.mobile"></el-input>
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
          @click="addUser"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        ref="editFormRef"
        :model="editForm"
        label-width="80px"
        :rules="editFormRules"
      >
        <el-form-item label="用户名称">
          <el-input
            v-model="editForm.username"
            disabled=""
          ></el-input>
        </el-form-item>
        <el-form-item
          label="邮箱"
          prop="email"
        >
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item
          label="手机"
          prop="mobile"
        >
          <el-input v-model="editForm.mobile"></el-input>
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
    // 自定义校验规则
    var checkEmail = (rule,value,cb)=>{
      // 邮箱正则
      const regEmail = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      //验证
      if (regEmail.test(value)) {
        return cb()
      }
      
      cb(new Error("邮箱不合法"))
      
    }
     var checkMobile = (rule,value,cb)=>{
      // 手机正则
      const regMobile =  /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      //验证
      if (regMobile.test(value)) {
        return cb()
      }
      
      cb(new Error("手机号不合法"))

    }
    return {
      // 用户信息
      UserList:[],
      // 总数据条数
      total:0,
      //查询参数
      queryInfo:{
        query:'',
        pagenum:1,//当前页
        pagesize:2//当前每页显示多少条数据
      },
      // 新增对话框弹出
      addDialogVisible:false,
      // 修改用户对话框弹出
      editDialogVisible:false,
      //添加用户表单数据
      addForm:{
        username:'',
        password:'',
        email:'',
        mobile:''
      },
      //添加表单的验证规则
      addFormRules:{
        username:[{ required: true, message: "请输入用户名", trigger: "blur" },
        {
          min: 3,
          max: 10,
          message: "长度在 3 到 10 个字符",
          trigger: "blur",
        },],
        password:[{ required: true, message: "请输入密码", trigger: "blur" },
        {
          min:6,
          max: 15,
          message: "长度在 6 到 15 个字符",
          trigger: "blur",
        },],
        email:[
          { required: true, message: "请输入邮箱", trigger: "blur" },
          // {
          //   min:6,
          //   max: 15,
          //   message: "长度在 6 到 15 个字符",
          //   trigger: "blur",
          // },
          {validator:checkEmail,trigger: "blur"}
        ],
        mobile:[{ required: true, message: "请输入手机号", trigger: "blur" },
        // {
        //   min:6,
        //   max: 15,
        //   message: "长度在 6 到 15 个字符",
        //   trigger: "blur",
        // },
        {validator:checkMobile,trigger: "blur"}

        ],
      },
      // 修改用户时查询数据
      editForm:{},
      // 修改用户表单验证规则
      editFormRules:{
       email:[
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {validator:checkEmail,trigger: "blur"}
        ],
        mobile:[{ required: true, message: "请输入手机号", trigger: "blur" },
        {validator:checkMobile,trigger: "blur"}

        ],
      }
    }
  },
  methods: {
    async getUserList(){
      const { data:res} = await this.$http.get('users',{
        params:this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('用户列表获取失败！')
      }
      this.UserList = res.data.users;
      this.total = res.data.total;
    },//监听pagesize改变的事件
    handleSizeChange(newSize){
      this.queryInfo.pagesize = newSize;
      //重新获取数据
      this.getUserList();
    },//页码值切换事件
    handleCurrentChange(newNum){
      this.queryInfo.pagenum = newNum;
      //重新获取数据
      this.getUserList();
    },//监听开关的开关状态
    async userStateChanged(userinfo){
     const {data:res} = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
      if (res.meta.status!==200) {
        this.$message.error("更新用户状态失败");
        userinfo.mg_state = !userinfo.mg_state;
      }
        this.$message.success("更新用户状态成功");
    },
    // 添加用户表单关闭事件，关闭后重置表单
    addDialogClosed(){
       //函数中this指向当前vm实例对象
      this.$refs.addFormRef.resetFields()
      //resetFields	element-ui内置组件方法 对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
    },
    //点击添加用户表单种确定按钮，添加表单
    addUser(){
      // 表单预校验
      this.$refs.addFormRef.validate(async valid=>{
        if (!valid) return false;
        //验证成功发起网络请求
        const {data:res} = await this.$http.post('users',this.addForm);
        if (res.meta.status!==201) {
          this.$message.error("添加失败")
        }
          this.$message.success("添加成功")
          this.addDialogVisible = false;
          this.getUserList()
      })
    },
    //显现修改用户对话框
    async showEditDialog({row:{id}}){
      this.editDialogVisible = true;
      const {data:res} = await this.$http.get('users/'+id)
      if(res.meta.status!==200) return this.$message.error("查询当前用户失败")
      this.editForm = res.data;
    },
    //修改表单关闭重置验证规则
    editDialogClosed(){
      this.$refs.editFormRef.resetFields()
    },
    // 提交修改表单
    editUserInfo(){
      // 表单预校验
      this.$refs.editFormRef.validate(async valid=>{
        if (!valid) return false;
        //验证成功发起网络请求
        const {data:res} = await this.$http.put('users/'+this.editForm.id,{
          email:this.editForm.email,
          mobile:this.editForm.mobile
        });
        if (res.meta.status!==201) {
          this.$message.error("更新失败")
        }
          this.$message.success("更新成功")
          this.editDialogVisible = false;
          this.getUserList()
      })
    },
    // 根据id删除用户
    async removeUserById({row:{id}}){
      // 第一个参数为中间文本，第二个参数为标题，第三个参数为配置对象
      const res = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).catch(err=>err)
      // 点击确定返回confirm字符串文本，点击取消抛出异常,通过catch将错误返回让其返回文本字符
      if(res !== 'confirm')
        return this.$message.info("已取消删除")
      // 发出网络请求
      const {data:result} = await this.$http.delete('users/'+id);
      console.log(result);
      if (result.meta.status!==200) {
        this.$message.error("删除失败")
      }
      this.$message.success("删除成功")
      this.getUserList()
    }
    
  },
  created() {
    this.getUserList()
  },
}
</script>

<style>

</style>