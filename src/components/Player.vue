<template>
  <div>
    <div class="d-flex mb-3">
      <div v-if="clan" class="d-none d-md-flex align-items-center">
        <img class="clan-image mr-3" :src="clan.logo" :alt="clan.tag" />
      </div>

      <div class="d-flex justify-content-center flex-column">
        <h2>{{ info.nickname }}</h2>
        <div v-if="clan">
          <span :style="{ color: clan.color }">{{ clan.tag }}</span>
          {{ clan.name }}
        </div>
      </div>
    </div>

    <div class="row mx-0 mb-3">
      <div
        class="
          col-12 col-md-4
          card
          border-light
          rounded
          text-light
          bg-dark
          text-center
        "
      >
        <div class="card-body">
          <h5 class="card-title">Global rating</h5>
          <h5 class="card-text">{{ info.global_rating }}</h5>
        </div>
      </div>
      <div
        class="
          col-12 col-md-4
          card
          border-light
          rounded
          text-light
          bg-dark
          text-center
        "
      >
        <div class="card-body">
          <h5 class="card-title">Wins</h5>
          <h5 class="card-text">{{ getWR(info.battles, info.wins) }}%</h5>
        </div>
      </div>
      <div
        class="
          col-12 col-md-4
          card
          border-light
          rounded
          text-light
          bg-dark
          text-center
        "
      >
        <div class="card-body">
          <h5 class="card-title">Battles</h5>
          <h5 class="card-text">{{ info.battles }}</h5>
        </div>
      </div>
    </div>

    <div class="row mx-0">
      <BestTankCard
        class="col-12 col-md-6 col-xl-3"
        header="Max kills"
        :tank_id="info.max_frags_tank_id"
        :text="`${info.max_frags} kills`"
      />
      <BestTankCard
        class="col-12 col-md-6 col-xl-3"
        header="Max damage"
        :tank_id="info.max_damage_tank_id"
        :text="`${info.max_damage} damage`"
      />
      <BestTankCard
        class="col-12 col-md-6 col-xl-3"
        header="Max experience"
        :tank_id="info.max_xp_tank_id"
        :text="`${info.max_xp} experience`"
      />
      <BestTankCard
        class="col-12 col-md-6 col-xl-3"
        header="Favorite tank"
        :tank_id="getFavoriteTank.tank_id"
        :text="`${getFavoriteTank.battles || 0} battles`"
      />
    </div>
    <div
      class="
        d-flex
        flex-column flex-sm-row
        align-items-center
        justify-content-between
        mb-4
      "
    >
      <div>Created: {{ getDate(info.created_at) }}</div>
      <div v-if="info.last_battle_time > info.created_at">
        Last battle: {{ getDate(info.last_battle_time) }}
      </div>
    </div>
    <TankList :tanks="tanks" :undefinedTanks="undefinedTanks" />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

import { PlayerInfo, PlayerClan } from "@/types/Player";
import { Tank, PlayerTank } from "@/types/Tank";

import BestTankCard from "./BestTankCard.vue";
import TankList from "./TankList.vue";
import { mapGetters } from "vuex";

export default defineComponent({
  name: "Player",
  components: {
    BestTankCard,
    TankList,
  },
  props: {
    info: Object as PropType<PlayerInfo>,
    clan: Object as PropType<PlayerClan>,
    statistics: Array as PropType<any[]>,
    achievements: Array as PropType<any[]>,
  },
  data() {
    return {
      tanks: [] as PlayerTank[],
      undefinedTanks: 0,
    };
  },
  mounted() {
    this.undefinedTanks = 0;
    const { statistics, achievements } = this;
    let tanks = [] as PlayerTank[];
    let undefinedTanks = 0;
    statistics?.forEach((e: any) => {
      const { all, mark_of_mastery, max_frags, max_xp, tank_id } = e;
      const { battles, damage_dealt, frags, wins, xp } = all;

      const { marksOnGun = 0 } = achievements!.find(
        (e: any) => e.tank_id === tank_id
      )!.achievements;

      const tank: Tank = this.tanksList[tank_id];

      if (tank) {
        const { nation, name, tier, type, image } = tank;

        tanks.push({
          nation,
          name,
          tier,
          type,
          image,
          mark_of_mastery,
          max_frags,
          max_xp,
          tank_id,
          battles,
          damage_dealt,
          frags,
          wins,
          xp,
          marksOnGun,
        });
        return;
      }
      undefinedTanks++;
    });
    this.tanks = tanks;
    this.undefinedTanks = undefinedTanks;
  },
  methods: {
    getWR(battles: number, wins: number) {
      if (!battles) return 0;
      return Math.round((wins / battles) * 10000) / 100;
    },
    getDate(date: number) {
      const d = new Date(date * 1000);
      const month = ("0" + (d.getMonth() + 1)).slice(-2);
      const day = ("0" + d.getDate()).slice(-2);
      const year = d.getFullYear();

      return `${day}.${month}.${year}`;
    },
  },
  computed: {
    ...mapGetters(["tanksList"]),
    getFavoriteTank() {
      if (this.tanks.length) {
        const favTank = this.tanks.reduce(
          (favorite: PlayerTank, tank: PlayerTank) => {
            if (!favorite.battles || tank.battles > favorite.battles)
              return tank;
            return favorite;
          },
          {} as PlayerTank
        );

        return favTank;
      }
      return {};
    },
  },
});
</script>

<style lang="scss" scoped>
.clan-image {
  width: 100px;
}

.card-group > .card {
  margin-bottom: 0;
}
</style>