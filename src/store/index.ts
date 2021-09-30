import { createStore } from 'vuex'

import { TankList, Nation } from "../types/Tank"

export default createStore({
  state: {
    tankList: {} as TankList,
    isLoading: true,
    error: null as string | null,
    nations: [] as Nation[],
  },
  mutations: {
    SET_TANKS(state, { tankList, nations }){
      state.tankList = tankList;
      state.nations = nations;
      state.isLoading = false;
    },
    FETCH_ERROR(state, err){
      state.error = err;
      state.isLoading = false;
    }
  },
  actions: {
    fetchTankList({ commit }){
      const url = `https://api.worldoftanks.eu/wot/encyclopedia/vehicles/?application_id=${process.env.VUE_APP_API_ID}`
      fetch(url).then(e=> e.json()).then(e => {
        if(e.error){
          return commit('FETCH_ERROR', `Server error: ${e.error.message}`)
        }

        let nations = [] as Nation[];

        const tankList = Object.values(e.data).reduce((list: TankList, value: any) => {
          const { nation, short_name: name, tank_id, tier, type } = value
          const image = value.images.contour_icon;

          if(!nations.find((e: any) => e.value == nation)){
            nations.push({ name: nation.charAt(0).toUpperCase() + nation.slice(1), value: nation })
          }

          return {...list, [tank_id]: {nation, name, tank_id, tier, image, type}}
        }, {});


        commit('SET_TANKS', { tankList, nations });
      })
    }
  },
  getters: {
    tanksList: ({tankList}) => tankList,
    isLoadedTankList: ({ isLoading }) => isLoading,
    errorTankList: ({ error }) => error,
    nations: ({ nations }) => nations,
  }
})
