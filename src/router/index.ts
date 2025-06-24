import { createRouter, createWebHistory } from 'vue-router'
import {HomeRouter} from "@/router/Routers/HomeRouter.ts";
import {OARouter} from "@/router/Routers/OARouter.ts";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    HomeRouter,
    OARouter,
  ],
})

export default router
