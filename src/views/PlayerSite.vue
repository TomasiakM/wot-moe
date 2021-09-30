<template>
  <div>
    <div v-if="error || errorTankList" class="alert alert-danger" role="alert">
      {{ error || tanks.error }}
    </div>
    <div
      v-else-if="isLoading || isLoadedTankList"
      class="d-flex justify-content-center"
    >
      <div
        class="spinner-border"
        style="width: 3rem; height: 3rem"
        role="status"
      >
        <span class="sr-only">Loading...</span>
      </div>
    </div>
    <div v-else>
      <Player
        :info="player.info"
        :clan="player.clan"
        :statistics="player.statistics"
        :achievements="player.achievements"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import Player from "@/components/Player.vue";

import { PlayerInfo, PlayerClan } from "@/types/Player";

import { mapActions, mapGetters } from "vuex";

export default defineComponent({
  name: "PlayerSide",
  components: {
    Player,
  },
  data() {
    return {
      error: null as string | null,
      player: {
        info: {} as PlayerInfo,
        clan: {} as PlayerClan | null,
        statistics: [],
        achievements: [],
      },
      isLoading: true,
    };
  },
  watch: {
    "$route.params"() {
      this.fetchUserData();
    },
  },
  mounted() {
    this.fetchUserData();
  },
  methods: {
    ...mapActions(["fetchTankList"]),
    async fetchUserData() {
      this.error = null;
      this.player.clan = null;
      this.player.statistics = [];
      this.player.achievements = [];
      this.isLoading = true;
      const { username } = this.$route.params;

      const findUserUrl = `https://api.worldoftanks.eu/wot/account/list/?application_id=${process.env.VUE_APP_API_ID}&search=${username}`;
      const user = await fetch(findUserUrl)
        .then((e) => e.json())
        .then((e) => {
          if (e.error) return { error: `Server error: ${e.error.message}` };
          return e.data[0] || { error: "User not found!" };
        })
        .catch((err) => {
          return { error: "Something went wrong, try again..." };
        });

      if (user.error) {
        this.error = user.error;
        this.isLoading = false;
        return;
      }
      const { account_id } = user;

      Promise.all([
        this.fetchUserInfo(account_id),
        this.fetchTanksStatistics(account_id),
        this.fetchTanksAchievements(account_id),
      ])
        .then(async (e: any[]) => {
          this.setPlayerInfo(e[0].data[account_id]);
          this.player.statistics = e[1].data[account_id];
          this.player.achievements = e[2].data[account_id];

          const { clan_id } = e[0].data[account_id];

          if (clan_id) {
            const clan = await this.fetchClanInfo(clan_id);
            this.setClanInfo(clan.data[clan_id]);
          }
        })
        .catch((err) => {
          console.log(err);
          this.error = "Something went wrong, try again...";
        })
        .finally(() => (this.isLoading = false));
    },
    async fetchTanksStatistics(id: number) {
      const url = `https://api.worldoftanks.eu/wot/tanks/stats/?application_id=${process.env.VUE_APP_API_ID}&account_id=${id}`;

      return await fetch(url).then((e) => e.json());
    },
    async fetchTanksAchievements(id: number) {
      const url = `https://api.worldoftanks.eu/wot/tanks/achievements/?application_id=${process.env.VUE_APP_API_ID}&account_id=${id}`;

      return await fetch(url).then((e) => e.json());
    },
    async fetchUserInfo(id: number): Promise<object> {
      const url = `https://api.worldoftanks.eu/wot/account/info/?application_id=${process.env.VUE_APP_API_ID}&account_id=${id}`;

      return await fetch(url).then((e) => e.json());
    },
    async fetchClanInfo(id: number) {
      const url = `https://api.worldoftanks.eu/wot/clans/info/?application_id=${process.env.VUE_APP_API_ID}&clan_id=${id}`;

      return fetch(url).then((e) => e.json());
    },
    setPlayerInfo(player: any) {
      const {
        account_id,
        clan_id,
        created_at,
        global_rating,
        last_battle_time,
        nickname,
        statistics,
      } = player;
      const {
        battles,
        frags,
        wins,
        max_damage,
        max_damage_tank_id,
        max_frags,
        max_frags_tank_id,
        max_xp,
        max_xp_tank_id,
      } = statistics.all;

      this.player.info = {
        account_id,
        clan_id,
        created_at,
        global_rating,
        last_battle_time,
        nickname,
        battles,
        max_damage,
        max_damage_tank_id,
        max_frags,
        max_frags_tank_id,
        max_xp,
        max_xp_tank_id,
        frags,
        wins,
      };
    },
    setClanInfo(clan: any) {
      const { clan_id, color, name, tag } = clan;
      const logo = clan.emblems.x195.portal;

      this.player.clan = { clan_id, color, name, tag, logo };
    },
  },
  computed: {
    ...mapGetters(["tanksList", "isLoadedTankList", "errorTankList"]),
  },
});
</script>