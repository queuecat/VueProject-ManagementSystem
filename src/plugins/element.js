import Vue from 'vue'
import {
  Button,
  Form,
  Input,
  FormItem,
  Container,
  Aside,
  Main,
  Header,
  Menu,
  Submenu,
  MenuItem,
  BreadcrumbItem,
  Breadcrumb,
  Card,
  Row,
  Col,
  Table,
  TableColumn,
  Switch,
  Tooltip,
  Pagination,
  Dialog,
  MessageBox,
  Tag,
  Tree,
  Select,
  Option
} from 'element-ui'
//导入信息提示组件
import { Message } from 'element-ui'
Vue.use(Button)
Vue.use(Form)
Vue.use(Input)
Vue.use(FormItem)
Vue.use(Container)
Vue.use(Aside)
Vue.use(Header)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)




//将消息提示组件挂载到vue实例上
Vue.prototype.$message = Message
//将弹框组件挂在到Vue原型
Vue.prototype.$confirm = MessageBox.confirm