<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像 -->
      <div class="avatar_box">
        <img
          src="../assets/logo.png"
          alt=""
        />
      </div>
      <!-- 登录表单 
        label-width设置label文字长度
        rules绑定验证规则，用于验证输入信息是否合格
      -->
      <el-form
        class="login-form"
        :model="loginForm"
        :rules="loginFormRules"
        label-width="0px"
        ref="loginFormRef"
      >
        <!-- label设置label标签内容 
        rules绑定验证规则，并将 Form-Item 的 prop 属性设置为需校验的字段名
        -->
        <el-form-item
          label=""
          prop="username"
        >
          <!-- 用户名 -->
          <el-input
            placeholder="请输入用户名"
            v-model="loginForm.username"
            clearable
            prefix-icon="iconfont icon-user"
          >
          </el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            placeholder="请输入密码"
            v-model="loginForm.password"
            show-password
            prefix-icon="iconfont icon-3702mima"
          ></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button
            type="primary"
            @click="login"
          >登录</el-button>
          <el-button @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //表单数据
      loginForm: {
        username: "admin",
        password: "123456",
      },
      //验证规则
      loginFormRules: {
        // 验证用户名是否合法
        username: [
          // required 是否必填 message 错误信息 trigger 触发检验事件
          { required: true, message: "请输入登录名称", trigger: "blur" },
          // min 最小长度 max 最大长度
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],

        // 验证密码是否合法
        password: [
          { required: true, message: "请输入登录密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
    }
  },
  methods: {
    //点击重置按钮，重置登录表单
    resetLoginForm() {
      //函数中this指向当前vm实例对象
      this.$refs.loginFormRef.resetFields()
      //resetFields	element-ui内置组件方法 对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
    },
    //点击登录进行表单验证
    login() {
      //validate element-ui内置组件方法  使用定义的验证规则对整个表单进行校验的方法
      //  参数为一个回调函数 该回调函数会在校验结束后被调用，并传入两个参数：是否校验成功和未通过校验的字段。若不传入回调函数，则会返回一个 promise
      this.$refs.loginFormRef.validate(async (valid) => {
        // valid表示验证是否通过
        if (!valid) return
        //当验证通过，使用挂在在实例对象上的axios进行请求
        const { data: res } = await this.$http.post("login", this.loginForm)
        //用户名密码错误弹出信息提示
        if (res.meta.status !== 200)
          return this.$message.error("用户名或密码错误")

        // 提示登录成功：使用element-ui Message组件
        this.$message.success("登陆成功")

        // 把登录成功的token保存到sessionStorage
        window.sessionStorage.setItem("token", res.data.token)
        // 通过编程式导航跳转后台主页
        this.$router.push("/home")
      })
    },
  },
}
</script>
<style lang="less" scoped>
/* 背景 */
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #ccc;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: #eee;
    }
  }
  .login-form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
  .btns {
    display: flex;
    justify-content: flex-end;
  }
}
</style>