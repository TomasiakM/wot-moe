<template>
  <div class="mb-3">
    <h5 class="card-header mb-md-2">
      <div class="py-1">Filters</div>
    </h5>

    <header
      class="
        card-header
        collapsed
        d-flex
        align-items-center
        justify-content-between
        filter-header
      "
      data-toggle="collapse"
      data-target="#collapse_filter1"
      data-abc="true"
      aria-expanded="false"
    >
      <h6 class="mb-0">Moe</h6>
      <i class="bi bi-caret-down-fill"></i>
    </header>

    <div class="filter-content collapse border-bottom" id="collapse_filter1">
      <div class="card-body p-2">
        <div
          class="custom-control custom-checkbox"
          v-for="e in moeList"
          :key="e.value"
        >
          <input
            type="checkbox"
            class="custom-control-input"
            :id="e.value"
            :value="e.value"
            v-model="moeFilter"
          />
          <label class="custom-control-label" :for="e.value">
            {{ e.name }}
            <span class="text-secondary">
              ({{ getAmountOfTanks.moe[e.value] || 0 }})
            </span>
          </label>
        </div>
      </div>
    </div>

    <header
      class="
        card-header
        collapsed
        d-flex
        align-items-center
        justify-content-between
        filter-header
      "
      data-toggle="collapse"
      data-target="#collapse_filter2"
      data-abc="true"
      aria-expanded="false"
    >
      <h6 class="mb-0">Tier</h6>
      <i class="bi bi-caret-down-fill"></i>
    </header>

    <div class="filter-content collapse border-bottom" id="collapse_filter2">
      <div class="card-body p-2">
        <div
          class="custom-control custom-checkbox mb-1"
          v-for="e in tierList"
          :key="e.name"
        >
          <input
            type="checkbox"
            class="custom-control-input"
            :id="e.name"
            :value="e.value"
            v-model="tierFilter"
          />
          <label class="custom-control-label" :for="e.name">
            Tier {{ e.name }}
            <span class="text-secondary">
              ({{ getAmountOfTanks.tiers[e.value] || 0 }})
            </span>
          </label>
        </div>
      </div>
    </div>

    <header
      class="
        card-header
        collapsed
        d-flex
        align-items-center
        justify-content-between
        filter-header
      "
      data-toggle="collapse"
      data-target="#collapse_filter3"
      data-abc="true"
      aria-expanded="false"
    >
      <h6 class="mb-0">Type</h6>
      <i class="bi bi-caret-down-fill"></i>
    </header>

    <div class="filter-content collapse border-bottom" id="collapse_filter3">
      <div class="card-body p-2">
        <div
          class="custom-control custom-checkbox mb-1"
          v-for="e in typeList"
          :key="e.value"
        >
          <input
            type="checkbox"
            class="custom-control-input"
            :id="e.value"
            :value="e.value"
            v-model="typeFilter"
          />
          <label class="custom-control-label" :for="e.value">
            {{ e.name }}
            <span class="text-secondary">
              ({{ getAmountOfTanks.types[e.value] || 0 }})
            </span>
          </label>
        </div>
      </div>
    </div>

    <header
      class="
        card-header
        collapsed
        d-flex
        align-items-center
        justify-content-between
        filter-header
      "
      data-toggle="collapse"
      data-target="#collapse_filter4"
      data-abc="true"
      aria-expanded="false"
    >
      <h6 class="mb-0">Nation</h6>
      <i class="bi bi-caret-down-fill"></i>
    </header>

    <div class="filter-content collapse border-bottom" id="collapse_filter4">
      <div class="card-body p-2">
        <div
          class="custom-control custom-checkbox mb-1"
          v-for="e in nations"
          :key="e.value"
        >
          <input
            type="checkbox"
            class="custom-control-input"
            :id="e.value"
            :value="e.value"
            v-model="nationFilter"
          />
          <label class="custom-control-label" :for="e.value">
            {{ e.name }}
            <span class="text-secondary">
              ({{ getAmountOfTanks.nations[e.value] || 0 }})
            </span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { PlayerTank } from "@/types/Tank";
import { defineComponent, Prop, PropType } from "vue";
import { mapGetters } from "vuex";

export default defineComponent({
  name: "TankListFilter",
  data() {
    return {
      moeList: [
        { name: "3 MoE", value: 3 },
        { name: "2 MoE", value: 2 },
        { name: "1 MoE", value: 1 },
        { name: "0 MoE", value: 0 },
      ],
      tierList: [
        { name: "X", value: 10 },
        { name: "IX", value: 9 },
        { name: "VIII", value: 8 },
        { name: "VII", value: 7 },
        { name: "VI", value: 6 },
        { name: "V", value: 5 },
        { name: "IV", value: 4 },
        { name: "III", value: 3 },
        { name: "II", value: 2 },
        { name: "I", value: 1 },
      ],
      typeList: [
        { name: "Heavy Tank", value: "heavyTank" },
        { name: "Medium tank", value: "mediumTank" },
        { name: "Light tank", value: "lightTank" },
        { name: "Tank destroyer", value: "AT-SPG" },
        { name: "SPG", value: "SPG" },
      ],
      moeFilter: [],
      tierFilter: [],
      typeFilter: [],
      nationFilter: [],
      sort: "moe",
    };
  },
  props: {
    tanks: Array as PropType<PlayerTank[]>,
  },
  watch: {
    moeFilter() {
      this.emitData();
    },
    tierFilter() {
      this.emitData();
    },
    typeFilter() {
      this.emitData();
    },
    nationFilter() {
      this.emitData();
    },
  },
  methods: {
    emitData() {
      const { moeFilter, tierFilter, typeFilter, nationFilter } = this;

      this.$emit("changeFilter", {
        moeFilter,
        tierFilter,
        typeFilter,
        nationFilter,
      });
    },
  },
  computed: {
    ...mapGetters(["nations"]),
    getAmountOfTanks() {
      const { tanks } = this;

      interface Obj {
        [key: string]: number;
      }

      let nations = {} as Obj;
      let tiers = {} as Obj;
      let types = {} as Obj;
      let moe = {} as Obj;

      tanks?.forEach((tank: PlayerTank) => {
        const { nation, tier, type, marksOnGun } = tank;

        if (!nations[nation]) nations[nation] = 0;
        nations[nation]++;

        if (!tiers[tier]) tiers[tier] = 0;
        tiers[tier]++;

        if (!types[type]) types[type] = 0;
        types[type]++;

        if (!moe[marksOnGun]) moe[marksOnGun] = 0;
        moe[marksOnGun]++;
      });

      return { nations, tiers, types, moe };
    },
  },
});
</script>


<style lang="scss" scoped>
.card {
  height: 100%;
}

select {
  width: auto;
}

label {
  font-size: 14px;
  cursor: pointer;
}

.filter-header {
  cursor: pointer;
}
</style>