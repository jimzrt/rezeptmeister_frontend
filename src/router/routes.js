//import RecipeOverview from 'components/RecipeOverview.vue'

const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("components/RecipeSearch.vue") },
      {
        path: "/rezept/:recipeSeoTitle",
        name: "recipe",

        component: () => import("components/RecipeOverview.vue"),
        props: true
      },
    ],
  },


  // Always leave this as last one,
  // but you can also remove it
  {
    path: "*",
    component: () => import("pages/Error404.vue"),
  },
];

export default routes;
