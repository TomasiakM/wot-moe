import { createStore } from "vuex";

import { ITankList, ITank, INation } from "../types/ITank";

export default createStore({
	state: {
		tankList: {} as ITankList,
		isLoading: true,
		error: false,
		nations: [] as INation[],
	},
	mutations: {
		SET_TANKS(state, { tanks, nations }) {
			state.tankList = tanks;
			state.nations = nations;
			state.isLoading = false;
		},
		FETCH_ERROR(state) {
			state.error = true;
			state.isLoading = false;
		},
		RESET_STATE(state) {
			state.isLoading = true;
			state.error = false;
		},
	},
	actions: {
		fetchTankList({ commit }) {
			commit("RESET_STATE");
			fetch(`/api/tank`)
				.then((e) => e.json())
				.then((e) => {
					if (e.success) {
						const nationsStr = [] as string[];
						const tanks: ITankList = {};

						e.tanks.forEach((e: ITank) => {
							const {
								image,
								name,
								nation,
								tank_id,
								tier,
								type,
							} = e;
							if (!nationsStr.includes(nation)) {
								nationsStr.push(nation);
							}

							tanks[e.tank_id] = {
								image,
								name,
								nation,
								tank_id,
								tier,
								type,
							};
						});

						const nations: INation[] = nationsStr.map((e) => {
							const name =
								e.length < 5
									? e.toUpperCase()
									: e.charAt(0).toUpperCase() + e.slice(1);
							return {
								name,
								value: e,
							};
						});

						commit("SET_TANKS", { tanks, nations });
						return;
					}

					commit("FETCH_ERROR");
				})
				.catch((err) => {
					commit("FETCH_ERROR");
				});
		},
	},
	getters: {
		tanksList: ({ tankList }) => tankList,
		isLoadingTankList: ({ isLoading }) => isLoading,
		errorTankList: ({ error }) => error,
		nations: ({ nations }) => nations,
	},
});
