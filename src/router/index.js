import Vue from 'vue'
import VueRouter from 'vue-router'
const Index = () => import('../views/Index.vue')
const SignIn = () => import('../views/SignIn.vue')
const Login = () => import('../components/LoginAndRegister/Login.vue')
const Register = () => import('../components/LoginAndRegister/Register.vue')
const Demo = () => import('../views/Demo.vue')
const Home = () => import('../components/Home.vue')
const AddIncome = () => import('../components/addBill/AddIncome.vue')
const AddExpend = () => import('../components/addBill/AddExpend.vue')
const DetailIncome = () => import('../components/bill/DetailIncome.vue')
const DetailExpend = () => import('../components/bill/DetailExpend.vue')
const IncomeType = () => import('../components/setUp/IncomeType.vue')
const ExpendType = () => import('../components/setUp/ExpendType.vue')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/SignIn'
  },
  {
    path: '/demo',
    component: Demo
  },
  {
    path: '/signIn',
    component: SignIn,
    redirect: '/login',
    children: [
      { path: '/login', component: Login },
      { path: '/register', component: Register }
    ]
  },
  {
    path: '/index',
    name: 'Index',
    component: Index,
    redirect: '/home',
    meta: { title: '我是你爸爸' },
    children: [
      { path: '/home', component: Home },
      { path: '/addBill/income', component: AddIncome },
      { path: '/addBill/expend', component: AddExpend },
      { path: '/detailBill/income', component: DetailIncome },
      { path: '/detailBill/expend', component: DetailExpend },
      { path: '/setup/incomeType', component: IncomeType },
      { path: '/setup/expendType', component: ExpendType }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
