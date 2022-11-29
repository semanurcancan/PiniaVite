import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    name: "ProductListView",
    path: "/d", 
    component: () => import("../views/ProductView.vue"),
    children:[
      {
        name: "ProductListOne",
        path: "",
        component: () => import("../components/ProductListOne.vue"),
      },
      {
        name: "Detail",
        path: "detail/:id",
        component: () => import("../components/Detail.vue"),
      },
     
    ]
  },
  {
    name: "Hello",
    path: "/hello", 
    props: true,
    component: () => import("../components/BasketComp.vue"), 
  },
];
const router = createRouter({
  routes: routes,
  // history: createWebHistory(),
  history: createWebHistory(),
});

export default router;