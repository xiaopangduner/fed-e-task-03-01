import Vue from 'vue'
import VueRouter from '../vueRouter/index'
import about from '@/components/AboutPage'
import home from '@/components/HomePage'

Vue.use(VueRouter)

export default new VueRouter({
  mode: 'hash',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: home
    },
    {
      path: '/about',
      name: 'About',
      component: about
    }
  ]
})
