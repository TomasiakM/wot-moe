import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";
import PlayerPage from "../views/PlayerPage.vue";
import ClanPage from "../views/ClanPage.vue";

const routes: Array<RouteRecordRaw> = [
	{
		path: "/",
		name: "Home",
		component: Home,
	},
	{
		path: "/player/:username",
		name: "PlayerSite",
		component: PlayerPage,
	},
	{
		path: "/clan/:clan",
		name: "ClanPage",
		component: ClanPage,
	},
];

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes,
});

export default router;
