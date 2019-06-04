import Vue from 'vue'
import Router from 'vue-router'
import myTabs from '@/components/tabs/tabs'
import myFavorite from '@/components/favorite/favorite'
import myPersonalAssets from '@/components/personalAssets/personalAssets'
import myNoAssets from '@/components/noAssets/noAssets'
import myCheckOrder from '@/components/checkOrder/checkOrder'
import myOrderHistory from '@/components/orderHistory/orderHistory'
import mySecurityCenter from '@/components/securityCenter/securityCenter'
import myHome from '@/components/home/home'
import mySeller from '@/components/seller/seller'
import myInfoPublicity from '@/components/infoPublicity/infoPublicity'
import myTransferDetails from '@/components/transferDetails/transferDetails'
import myHomeDetails from '@/components/homeDetails/homeDetails'
import myDeveloper from '@/components/developer/developer'
Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: "/",
      redirect: "/home"
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
      path:'/home',
      name:'home',
      component:myHome
    },
    {
      path: '/infoPublicity',
      name: 'infoPublicity',
      component: myInfoPublicity
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
    {
      path: '/homeDetails',
      name: 'homeDetails',
      component: myHomeDetails
    },
    {
      path:'/developer',
      name:'developer',
      component: myDeveloper
    },
  ]
})
