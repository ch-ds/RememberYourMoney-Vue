import Vue from 'vue'
import {
  Button, Input, Badge, Menu, Submenu, MenuItem, Form, FormItem,
  Cascader, DatePicker, Upload, Dialog, Message, Table, TableColumn,
  MessageBox, Pagination, Select, Option, Checkbox, Tooltip, Card,
  Breadcrumb, BreadcrumbItem, Steps, Step, Tabs, TabPane
} from 'element-ui'

Vue.use(Button)
Vue.use(Input)
Vue.use(Badge)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Cascader)
Vue.use(DatePicker)
Vue.use(Upload)
Vue.use(Dialog)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Pagination)
Vue.use(Select)
Vue.use(Option)
Vue.use(Checkbox)
Vue.use(Tooltip)
Vue.use(Card)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Steps)
Vue.use(Step)
Vue.use(Tabs)
Vue.use(TabPane)

Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$alert = MessageBox.alert
