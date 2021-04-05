<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
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
        >添加角色</el-button>
      </el-row>
      <!-- 权限列表 -->
      <el-table
        :data="roleList"
        border
        stripe
      >
        <!-- 点击展开具体权限信息 -->
        <el-table-column type="expand">
          <!-- 使用作用域插槽获取行信息,并渲染 -->
          <template v-slot="scope">
            <!-- 栅格系统 一行24格 -->
            <el-row
              class="bdbottom bdtop"
              v-if="!scope.row.children.toString()"
            >
              <el-tag type="info">
                角色暂无权限
              </el-tag>
            </el-row>
            <el-row
              v-for="(item1,i1) in scope.row.children"
              :key="item1.id"
              :class="['bdbottom',i1===0?'bdtop':'','vcenter']"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRightById(scope.row,item1.id)"
                >{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级权限和三级权限 -->
              <el-col :span="19">
                <el-row
                  v-for="(item2,i2) in item1.children"
                  :key="item2.id"
                  :class="[i2===0?'':'bdtop','vcenter']"
                >
                  <!-- 渲染二级权限 -->
                  <el-col>
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row,item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 渲染三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      type="warning"
                      closable
                      @close="removeRightById(scope.row,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>

                </el-row>

              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column
          label="#"
          type="index"
        ></el-table-column>
        <el-table-column
          prop="roleName"
          label="角色名称"
        >
        </el-table-column>
        <el-table-column
          prop="roleDesc"
          label="角色描述"
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
              @click="removeRoleById(scope)"
            >删除</el-button>
            <!-- 分配权限 -->
            <el-button
              type="info"
              icon="el-icon-setting"
              size="mini"
              @click="showSetRightDialog(scope.row)"
            >分配权限</el-button>

          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 点击添加用户按钮弹出对话框 -->
    <el-dialog
      title="新增角色"
      :visible.sync="addDialogVisible"
      width="30%"
      @close="addDialogClosed"
    >
      <!-- 内容主题区域 -->
      <el-form
        :rules="addFormRules"
        :model="addForm"
        label-width="80px"
        ref="addFormRef"
      >
        <el-form-item
          label="角色名称"
          prop="roleName"
        >
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item
          label="角色描述"
          prop="roleDesc"
        >
          <el-input v-model="addForm.roleDesc"></el-input>
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
          @click="addRoles"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 点击编辑弹出编辑对话框 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="editDialogVisible"
      width="30%"
      @close="editDialogClosed"
    >
      <!-- 内容主题区域 -->
      <el-form
        :rules="addFormRules"
        :model="editForm"
        label-width="80px"
        ref="editFormRef"
      >
        <el-form-item
          label="角色名称"
          prop="roleName"
        >
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item
          label="角色描述"
          prop="roleDesc"
        >
          <el-input v-model="editForm.roleDesc"></el-input>
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
    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="30%"
      @close="setRightDialogClosed"
    >
      <!-- 
      树形控件区域 
      属性:
        data表示绑定的数据源
        props为如何将数据源展开成树的描述对象(对象类型:children表示子节点名,label表示结点提示文本)
        show-checkbox	节点是否可被选择
        default-checked-keys	默认勾选的节点的 key 的数组
        node-key	每个树节点用来作为唯一标识的属性，整棵树应该是唯一的
        default-expand-all	是否默认展开所有节点
      方法:
        getCheckedKeys	若节点可被选择（即 show-checkbox 为 true），则返回目前被选中的节点的 key 所组成的数组
        getHalfCheckedNodes	若节点可被选择（即 show-checkbox 为 true），则返回目前半选中的节点所组成的数组
        getHalfCheckedKeys	若节点可被选择（即 show-checkbox 为 true），则返回目前半选中的节点的 key 所组成的数组
      -->
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      >

      </el-tree>
      <!-- 底部区域 -->
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="allotRights"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 所有角色列表
      /*
        第一层为角色信息
        第二层为角色说明，一共三层权限（通过children属性嵌套，最后一层权限没有children属性）
      */
      roleList:[],
      // 新增对话框弹出
      addDialogVisible:false,
      // 修改对话框弹出
      editDialogVisible:false,
      // 分配权限对话框的显示与隐藏
      setRightDialogVisible:false,
      // 权限信息
      rightsList:[],
      //添加角色表单数据
      addForm:{
        roleName:"",
        roleDesc:""
      },
      // 修改角色表单数据
      editForm:{},
      //添加表单的验证规则
      addFormRules:{
        roleName:[{ required: true, message: "请输入用户名", trigger: "blur" },
        {
          min: 2,
          max: 10,
          message: "长度在 2 到 10 个字符",
          trigger: "blur",
        },],
        roleDesc:[{ required: true, message: "请输入密码", trigger: "blur" },
        {
          min:2,
          max: 15,
          message: "长度在 2 到 15 个字符",
          trigger: "blur",
        },],
      },
      // 树形控件的属性绑定对象
      treeProps:{
        children: 'children',
        label: 'authName'
      },
      // 树形控件默认勾选选项数组
      defKeys:[],
      // 当前即将分配权限的id
      roleID:""
    }
  },created() {
    this.getRoleList()
  },
  methods: {
    // 获取权限列表
    async getRoleList(){
      const {data:res} = await this.$http.get('roles');
      if(res.meta.status !== 200) return this.$message.error('获取角色列表失败');
      this.roleList = res.data;
      console.log(this.roleList);
    },
    // 添加用户表单关闭事件，关闭后重置表单
    addDialogClosed(){
      //函数中this指向当前vm实例对象
      this.$refs.addFormRef.resetFields()
      //resetFields	element-ui内置组件方法 对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
    },
    // 提交表单
    addRoles(){
        // 表单预校验
      this.$refs.addFormRef.validate(async valid=>{
        if (!valid) return false;
        //验证成功发起网络请求
        const {data:res} = await this.$http.post('roles',this.addForm);
        if (res.meta.status!==201) {
          return this.$message.error("添加失败")
        }
        this.$message.success("添加成功")
        this.addDialogVisible = false;
        this.getRoleList()
      })
    } ,
    // 根据id删除用户
    async removeRoleById({row:{id}}){
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
      const {data:result} = await this.$http.delete('roles/'+id);
      console.log(result);
      if (result.meta.status!==200) {
        return this.$message.error("删除失败")
      }
      this.$message.success("删除成功")
      this.getRoleList()
    },
    //显现修改用户对话框，同时查询数据并渲染
    async showEditDialog({row:{id}}){
      const {data:res} = await this.$http.get('roles/'+id)
      if(res.meta.status!==200) return this.$message.error("查询当前角色失败")
      this.editForm = res.data;
      this.editDialogVisible = true;
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
        const {data:res} = await this.$http.put('roles/'+this.editForm.roleId,{
          roleName:this.editForm.roleName,
          roleDesc:this.editForm.roleDesc
        });
        console.log(res.meta.status);
        if (res.meta.status!==200) {
          return this.$message.error("更新失败")
        }
          this.$message.success("更新成功")
          this.editDialogVisible = false;
          this.getRoleList()
      })
    },
    // 点击权限x号,删除权限
    async removeRightById(role,rightId){
      // 弹窗提示是否删除
      // 第一个参数为中间文本，第二个参数为标题，第三个参数为配置对象
      const res = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).catch(err=>err)
      // 点击确定返回confirm字符串文本，点击取消抛出异常,通过catch将错误返回让其返回文本字符
      if(res !== 'confirm')
        return this.$message.info("已取消删除")
      // 发出网络请求
      const {data:result} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`);
      // console.log(result);
      if (result.meta.status!==200) {
        return this.$message.error("删除失败")
      }
      // this.$message.success("删除成功")
      role.children = result.data
      
    },
    // 分配权限对话框
    async showSetRightDialog(role){
      // 获取所有权限数据
      this.roleID = role.id;
      const {data:res} = await this.$http.get('rights/tree')
      if(res.meta.status !==200)
        return this.$message.error("权限数据获取失败")
      this.rightsList = res.data;
      this.getLeafKeys(role,this.defKeys);
      this.setRightDialogVisible = true;
    },
    // 递归的获取角色下三级权限
    getLeafKeys(node,arr){
      if(!node.children)
        return arr.push(node.id)
      node.children.forEach(element => {
        this.getLeafKeys(element,arr)
      });
    },
    // 关闭权限分配对话框
    setRightDialogClosed(){
      this.defKeys = []
    },
    // 权限分配表单提交
    async allotRights(){
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      console.log(this.$refs.treeRef.getCheckedKeys());
      console.log(this.$refs.treeRef.getHalfCheckedKeys());
      console.log(idStr);
      const {data:res} = await this.$http.post(`roles/${this.roleID}/rights`,{rids:idStr})
      if(res.meta.status !==200)
        return this.$message.error("权限分配失败")
      this.$message.success("权限分配成功")
      this.getRoleList();
      this.setRightDialogVisible = false;
      
    }
  },
}
</script>

<style lang="less" scoped>
.el-tag{
  margin: 7px;
}
.bdtop{
  border-top: 1px solid #eee;
}
.bdbottom{
  border-bottom: 1px solid #eee;
}
.vcenter{
  display: flex;
  align-items: center;
}
</style>