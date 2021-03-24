<template>
  <el-container>
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img
          src="../assets/heima.png"
          alt="加载错误"
        >
        <span>电商后台管理系统</span>
      </div>
      <el-button
        type="success"
        @click="loginOut"
      >退出登录</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏区域 -->
      <el-aside :width="isCollapse?'64px':'200px'">
        <div
          class="toggle-button"
          @click="toggleCollapse"
        >|||</div>
        <!-- 侧边栏菜单区 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          :router='true'
          :default-active='NavState'
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="item.id.toString()"
            v-for="item in menulist"
            :key="item.id"
          >
            <!-- 这个 template 是一级菜单的内容模板 -->
            <template slot="title">
              <!-- i标签指定图标 -->
              <i :class="iconList[item.id]"></i>
              <!-- span指定显示文字 -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 在一级菜单中，可以嵌套二级菜单 -->
            <el-menu-item
              :index="'/'+subItem.path.toString()"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState('/'+subItem.path)"
            >
              <template slot="title">
                <!-- i标签指定图标 -->
                <i class="el-icon-menu"></i>
                <!-- span指定显示文字 -->
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧主体区域 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
  export default {
    data() {
      return {
        menulist:[],//菜单列表
        iconList:{//菜单图标名称
          "125":'iconfont icon-user',
          "103":'iconfont icon-tijikongjian',
          "101":'iconfont icon-shangpin',
          "102":'iconfont icon-danju',
          "145":'iconfont icon-baobiao',
        },//是否折叠
        isCollapse:false,//当前菜单选项
        NavState:''
      }
    },
    // 生命周期钩子，在Vue创建时渲染菜单数据
    created() {
      this.getMenuList();
      this.NavState = window.sessionStorage.getItem('NavState');
    },
    methods: {
      loginOut() {
        // 清空token
        window.sessionStorage.clear();

        // 跳转到登录页
        this.$router.push("/login");
      },
      async getMenuList(){//调用API获取菜单信息
        const {data:res}=await this.$http.get('menus')
        console.log(res);
        if (res.meta.status!==200) this.$message.console.error(res.meta.msg);
        this.menulist = res.data
      },
      // 点击按钮收起菜单
      toggleCollapse(){
        // console.log(2);
        this.isCollapse = !this.isCollapse;
      },//点击保存路由地址
      saveNavState(path){
        window.sessionStorage.setItem('NavState',path);
        this.NavState = path;
      }
    },
    
}
</script>
<style lang="less" scoped>
.el-container{
  height: 100%;
}
.el-header{
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left:0 ;
  align-items: center;
  color: #fff;
  font-size: 20px;
  div{
    display: flex;
    align-items: center;
  }
  span{
    margin-left: 15px;
  }
}
.el-aside{
  background-color: #333744;
  .el-menu{
    border-right: 0;
  }
  .toggle-button{
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    cursor: pointer;
    letter-spacing: 0.2em;
  }
}
.el-main{
  background-color: #eaedf1;
}
.iconfont{
  margin-right: 10px;
}
</style>