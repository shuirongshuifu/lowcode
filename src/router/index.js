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

// // 去除重复路由报错的问题
// const originalPush = router.push
// router.push = function push(location) {
//     return originalPush.call(this, location).catch((err) => err)
// }

export default router