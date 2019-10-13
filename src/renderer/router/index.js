import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Ebook',
      component: require('@/components/Ebook').default
    },
    {
      path: '/preferences',
      name: 'Preferences',
      component: require('@/components/Preferences').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
