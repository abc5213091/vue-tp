import Vue from 'vue'
import VueRouter from 'vue-router'

import index from '../pages/index'
import login from '../pages/login'

Vue.use(VueRouter)

const router = new VueRouter({
     mode: 'hash',
    base: __dirname,
    routes: [
        /*主路由，子路由*/
        {  path: '/', component: index ,
            children:[
                // {  path: 'login', component: login }
            ]
        },
        {  path: '/index.html', component: index },
        {  path: '/login', component: login },
        /*分块加载*/
        {  path: '/list', component: resolve => require(['../pages/list'],resolve) },
    ]
})

export default router
