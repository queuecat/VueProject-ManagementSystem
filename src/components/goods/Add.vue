<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 栅格系统
      一行24格
      gutter行中每列间距
       -->
      <!-- 提示信息 -->
      <el-alert
        title="添加商品信息"
        :closable="false"
        type="info"
        show-icon
        center
      >
      </el-alert>
      <!-- 步骤条 -->
      <el-steps
        :active="activeIndex-0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>

      </el-steps>
      <!-- 表单 -->
      <el-form
        ref="addFormRef"
        :model="addForm"
        label-width="100px"
        :rules="addFormRules"
        label-position="top"
      >
        <!-- 标签页 -->
        <el-tabs
          tab-position="left"
          v-model="activeIndex"
          :before-leave="beforeTabLeave"
          @tab-click="tabClick"
        >
          <el-tab-pane
            label="基本信息"
            name="0"
          >
            <!-- 表单项 -->
            <el-form-item
              label="商品名称"
              prop="goods_name"
            >
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item
              label="商品价格"
              prop="goods_price"
            >
              <el-input
                v-model="addForm.goods_price"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="商品重量"
              prop="goods_weight"
            >
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item
              label="商品数量"
              prop="goods_number"
            >
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>

            <el-form-item
              label="商品分类"
              prop="goods_cat"
            >
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="{ expandTrigger: 'hover',value:'cat_id',label:'cat_name',children:'children'}"
                @change="cateChange"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane
            label="商品参数"
            name="1"
          >
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyTableData"
              :key="item.attr_id"
            >
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="cb"
                  v-for="(cb,i) in item.attr_vals"
                  :key="i"
                  border
                ></el-checkbox>
                <el-tag
                  v-if="item.attr_vals.length===0"
                  type="info"
                >暂无参数</el-tag>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane
            label="商品属性"
            name="2"
          >

          </el-tab-pane>
          <el-tab-pane
            label="商品图片"
            name="3"
          >

          </el-tab-pane>
          <el-tab-pane
            label="商品内容"
            name="4"
          >

          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 步骤条当前项
      activeIndex:0,
      // 添加商品的表单数据对象
      addForm:{
        goods_name:"",
        goods_price:0,
        goods_price:0,
        goods_cat:[]
      },
      // 校验规则
      addFormRules:{
        goods_name:[
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price:[
          { required: true, message: "请输入商品价格", trigger: "blur" }
        ],
        goods_number:[          
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
        goods_weight:[{ required: true, message: "请输入商品重量", trigger: "blur" },],
        goods_cat:[{ required: true, message: "请选择商品分类", trigger: "blur" },]
      },
      // 存储商品分类
      cateList:[],
      // 参数数据列表
      manyTableData:[]
      
    }
  },
  methods: {
    async getCateList(){
      const {data:res} = await this.$http.get('categories');
      if(res.meta.status!==200) return this.$message.error("获取分类信息失败");
      this.cateList = res.data;
    },
    // 选择器变化
    cateChange(){
      if(this.addForm.goods_cat.length!==3)
        this.addForm.goods_cat=[]
    },
    // 标签页切换
    beforeTabLeave(activeName,oldActiveName){
      if (oldActiveName==='0' && this.addForm.goods_cat.length!==3) {
        this.$message.error("请先选择商品分类");
        return false;
      }
    },
    // 标签页点击
    async tabClick(){
      // 访问动态参数面板
      if(this.activeIndex==='1'){
        const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:'many'}});
        if(res.meta.status!==200) return this.$message.error("获取参数信息失败");
        res.data.forEach(item=>{
          item.attr_vals = item.attr_vals? item.attr_vals.split(' ') : [];
        })
       this.manyTableData = res.data;
      console.log(this.manyTableData);
      }
    }
  },
  created() {
    this.getCateList()
  },
  computed:{
    cateId(){
      if(this.addForm.goods_cat.length===3)
        return this.addForm.goods_cat[2];
      else return  null;
    }
  }
}
</script>

<style lang="less">
.el-steps{
  margin: 15px 0;
}
.el-step__title{
  font-size: 13px;
}
.el-checkbox{
  margin: 0 10px 0 0 !important;
}
</style>

