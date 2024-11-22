import { createRouter, createWebHashHistory } from 'vue-router'

export const routes =  [
    {
        path: "/",
        name: "首页",
        component: () => import('@/page/home.vue')
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router