import Vue from 'vue'
import Router from 'vue-router'
import myHome from '@/components/home/home'
import myLogin from '@/components/login/login'
import myForgetPassword from '@/components/forgetPassword/forgetPassword'
import myRegister from '@/components/register/register'
import myContract from '@/components/register/contract'
import myTabs from '@/components/tabs/tabs'
import myFavorite from '@/components/favorite/favorite'
import myPersonalAssets from '@/components/personalAssets/personalAssets'
import myNoAssets from '@/components/noAssets/noAssets'
import myCheckOrder from '@/components/checkOrder/checkOrder'
import myOrderHistory from '@/components/orderHistory/orderHistory'
import mySecurityCenter from '@/components/securityCenter/securityCenter'
import myPublicityPage from '@/components/publicityPage/publicityPage'
import myTransferPlatform from '@/components/transferPlatform/transferPlatform'
import myYuanBeanPage from '@/components/yuanBeanPage/yuanBeanPage'
import mySeller from '@/components/seller/seller'
import myTransferDetails from '@/components/transferDetails/transferDetails'
Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: "/",
      redirect: "/home"
    },
    {
      path: '/home',
      name: 'home',
      component: myHome
    },
    {
      path: '/login',
      name: 'login',
      component: myLogin
    },
    {
      path: '/forgetPassword',
      name: 'forgetPassword',
      component: myForgetPassword
    },
    {
      path: '/register',
      name: 'register',
      component: myRegister
    },
    {
      path: '/contract',
      name: 'contract',
      component: myContract
    },
    {
      path: '/tabs',
      component: myTabs,
      children: [
        {
          path: '',
          redirect:"/favorite",
        },
        {
          path: '/personalAssets',
          name: 'personalAssets',
          component: myPersonalAssets
        },
        {
          path: '/noAssets',
          name: 'noAssets',
          component: myNoAssets
        },
        {
          path: '/favorite',
          name: 'favorite',
          component: myFavorite
        },
        {
          path: '/orderHistory',
          name: 'orderHistory',
          component: myOrderHistory
        },
        {
          path: '/securityCenter',
          name: 'securityCenter',
          component: mySecurityCenter
        },
        {
          path: '/checkOrder',
          name: 'checkOrder',
          component: myCheckOrder
        },
      ]
    },
    {
      path: '/publicityPage',
      name: 'publicityPage',
      component: myPublicityPage
    },
    {
      path: '/yuanBeanPage',
      name: 'yuanBeanPage',
      component: myYuanBeanPage
    },
    {
      path: '/transferPlatform',
      name: 'transferPlatform',
      component: myTransferPlatform
    },
    {
      path: '/seller',
      name: 'seller',
      component: mySeller
    },
    {
      path: '/transferDetails',
      name: 'transferDetails',
      component: myTransferDetails
    },
  ]
})
