<template>
  <div v-if="undefinedTanks" class="alert alert-warning text-center mb-2">
    {{ undefinedTanks }}
    {{ undefinedTanks == 1 ? "tank" : "tanks" }}
    are not included!
  </div>
  <div class="row">
    <TankListFilter
      @changeFilter="setFilters"
      :tanks="filteredTanks"
      class="col-md-3 col-xl-2"
    />
    <div class="col-md-9 col-xl-10">
      <h5
        class="
          card-header
          mb-2
          d-flex
          align-items-center
          justify-content-between
        "
      >
        <div class="py-1">Player tanks</div>
        <select
          class="form-control form-control-sm"
          id="inputGroupSelect01"
          v-model="sort"
        >
          <option value="moe">by moe</option>
          <option value="tier">by tier</option>
          <option value="name">by name</option>
        </select>
      </h5>

      <div v-if="!tanks.length" class="alert alert-warning text-center mb-2">
        No tanks to display!
      </div>
      <div class="row mx-0 tank-list">
        <div
          v-for="tank in tankList"
          :key="tank.tank_id"
          class="
            col-6 col-sm-4 col-lg-3 col-xl-2
            card
            border-light
            rounded
            text-light
            bg-dark
            text-center
          "
          data-toggle="modal"
          data-target="#tankStatisticsModal"
          @click="modalTank = tank"
        >
          <div class="card-body p-2">
            <div class="marks" v-if="tank.marksOnGun">
              <span
                class="d-block mb-1 bg-light"
                v-for="e in tank.marksOnGun"
                :key="e"
              ></span>
            </div>
            <img class="card-img mb-1" :src="tank.image" :alt="tank.name" />
            <p class="card-text mb-0">
              {{ tank.name }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <TankModal :tank="modalTank" />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

import { PlayerTank } from "@/types/Tank";

import TankListFilter from "./TankListFilter.vue";
import TankModal from "./TankModal.vue";

export default defineComponent({
  name: "TankList",
  props: {
    tanks: Array as PropType<PlayerTank[]>,
    undefinedTanks: Number as PropType<number>,
  },
  components: {
    TankListFilter,
    TankModal,
  },
  data() {
    return {
      filters: {
        moeFilter: [] as number[],
        tierFilter: [] as number[],
        typeFilter: [] as string[],
        nationFilter: [] as string[],
      },
      filteredTanks: [] as PlayerTank[],
      sort: "moe",
      modalTank: {} as PlayerTank,
    };
  },
  methods: {
    setFilters(value: any) {
      this.filters = value;
    },
    moeSort(a: PlayerTank, b: PlayerTank) {
      if (a.marksOnGun !== b.marksOnGun) return b.marksOnGun - a.marksOnGun;
      return b.tier - a.tier;
    },
    tierSort(a: PlayerTank, b: PlayerTank) {
      if (a.tier !== b.tier) return b.tier - a.tier;
      return b.marksOnGun - a.marksOnGun;
    },
    nameSort(a: PlayerTank, b: PlayerTank) {
      return b.name < a.name ? 1 : -1;
    },
    filterTanks(tanks: PlayerTank[]) {
      const { moeFilter, tierFilter, typeFilter, nationFilter } = this.filters;

      if (moeFilter.length)
        tanks = tanks.filter((e) => moeFilter.includes(e.marksOnGun));
      if (tierFilter.length)
        tanks = tanks.filter((e) => tierFilter.includes(e.tier));
      if (typeFilter.length)
        tanks = tanks.filter((e) => typeFilter.includes(e.type));
      if (nationFilter.length)
        tanks = tanks.filter((e) => nationFilter.includes(e.nation));

      return tanks;
    },
  },
  computed: {
    tankList() {
      let tanks: PlayerTank[] = this.tanks!;

      if (tanks) {
        tanks = this.filterTanks(tanks);
      }

      if (this.sort == "moe") tanks?.sort(this.moeSort);
      else if (this.sort == "tier") tanks?.sort(this.tierSort);
      else if (this.sort == "name") tanks?.sort(this.nameSort);

      this.filteredTanks = tanks;

      return tanks;
    },
  },
});
</script>

<style lang="scss" scoped>
select {
  width: auto;
}

.tank-list {
  display: flex;
  flex-wrap: wrap;

  .card {
    overflow: hidden;
    cursor: pointer;

    img {
      width: auto;
    }
  }
}

.marks {
  position: absolute;
  right: -40px;
  top: 10px;
  transform: rotate(45deg);

  span {
    width: 100px;
    height: 3px;
  }
}
</style>
