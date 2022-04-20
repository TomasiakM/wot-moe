<template>
    <div
        v-if="undefinedTanks && showInfo"
        class="alert alert-warning text-center mb-2"
    >
        {{ undefinedTanks }}
        {{ undefinedTanks == 1 ? " tank " : " tanks " }}
        cannot be displayed!
        <button type="button" class="close" @click="showInfo = false">
            <span class="d-block">&times;</span>
        </button>
    </div>
    <div class="row">
        <TankListFilter
            @changeFilter="setFilters"
            :tanks="sortedTankList"
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
                <div class="d-flex align-items-center">
                    <div class="d-flex align-items-center mr-2">
                        <List
                            style="width: 20px"
                            :class="[
                                listType === 'row' && 'text-primary',
                                'mr-1 ',
                            ]"
                            @click="listType = 'row'"
                            role="button"
                        />
                        <Grid
                            style="width: 20px"
                            :class="listType === 'grid' && 'text-primary'"
                            @click="listType = 'grid'"
                            role="button"
                        />
                    </div>

                    <select class="form-control form-control-sm" v-model="sort">
                        <option value="moe">by moe</option>
                        <option value="tier">by tier</option>
                        <option value="name">by name</option>
                    </select>
                </div>
            </h5>

            <div
                v-if="!tanks.length"
                class="alert alert-warning text-center mb-2"
            >
                Player does not have any tanks!
            </div>
            <div
                v-else-if="sortedTankList.length === 0"
                class="alert alert-warning text-center mb-2"
            >
                Choose other filters to see tanks!
            </div>
            <div v-if="listType === 'grid'" class="row mx-0 tank-list">
                <div
                    v-for="tank in sortedTankList"
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
                        <div class="tier bg-secondary">
                            {{ getRomanNumber(tanksList[tank.tank_id]?.tier) }}
                        </div>
                        <div class="marks" v-if="tank.marksOnGun">
                            <span
                                class="d-block mb-1 bg-light"
                                v-for="e in tank.marksOnGun"
                                :key="e"
                            ></span>
                        </div>
                        <img
                            v-if="tanksList[tank.tank_id]"
                            class="card-img mb-1"
                            :src="tanksList[tank.tank_id].image"
                            :alt="tanksList[tank.tank_id].name"
                        />
                        <Unkwnow v-else />
                        <p class="card-text mb-0">
                            {{ tanksList[tank.tank_id].name || "unknown" }}
                        </p>
                    </div>
                </div>
            </div>
            <div v-else>
                <div
                    v-for="tank in sortedTankList"
                    :key="tank.tank_id"
                    class="
                        d-flex
                        align-items-center
                        justify-content-between
                        border-bottom border-dark
                        p-1
                        tank-list-element
                    "
                    @click="modalTank = tank"
                    role="button"
                    data-toggle="modal"
                    data-target="#tankStatisticsModal"
                >
                    <div class="d-flex align-items-center">
                        <div
                            class="badge badge-primary text-center"
                            style="width: 30px"
                        >
                            {{ getRomanNumber(tanksList[tank.tank_id]?.tier) }}
                        </div>
                        <div class="mx-2">
                            <img
                                v-if="tanksList[tank.tank_id]"
                                class="mb-1"
                                :src="tanksList[tank.tank_id].image"
                                :alt="tanksList[tank.tank_id].name"
                            />
                            <Unkwnow v-else />
                        </div>
                        <p class="card-text mb-0">
                            {{ tanksList[tank.tank_id].name || "unknown" }}
                        </p>
                    </div>
                    <div class="d-flex">
                        <Star
                            style="color: 'var(--dark)'"
                            class="ml-1"
                            v-for="e in tank.marksOnGun"
                            :key="e"
                        />
                    </div>
                </div>
            </div>
        </div>
        <TankModal :tank="modalTank" />
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

import { mapGetters } from "vuex";
import { IPlayerTank } from "@/types/IPlayer";

import TankListFilter from "./TankListFilter.vue";
import TankModal from "./TankModal.vue";
import Unkwnow from "@/icons/Unknown.vue";
import Grid from "@/icons/Grid.vue";
import List from "@/icons/List.vue";
import Star from "@/icons/Star.vue";

export default defineComponent({
    name: "TankList",
    props: {
        tanks: {
            type: Array as PropType<IPlayerTank[]>,
            required: true,
        },
    },
    components: {
        TankListFilter,
        TankModal,
        Unkwnow,
        Grid,
        List,
        Star,
    },
    data() {
        return {
            showInfo: true,
            undefinedTanks: 0,
            filters: {
                moeFilter: [] as number[],
                tierFilter: [] as number[],
                typeFilter: [] as string[],
                nationFilter: [] as string[],
            },
            sortedTankList: [] as IPlayerTank[],
            sort: "moe",
            listType: "row",
            modalTank: {} as IPlayerTank,
        };
    },
    mounted() {
        this.sortTankList();
        this.tanks.forEach((tank) => {
            if (!this.tanksList[tank.tank_id]) this.undefinedTanks++;
        });
    },
    watch: {
        filters() {
            this.sortTankList();
        },
        sort() {
            this.sortTankList();
        },
    },
    methods: {
        setFilters(value: any) {
            this.filters = value;
        },
        moeSort(a: IPlayerTank, b: IPlayerTank) {
            if (a.marksOnGun != b.marksOnGun)
                return b.marksOnGun - a.marksOnGun;

            const aTank = this.tanksList[a.tank_id];
            const bTank = this.tanksList[b.tank_id];
            if (aTank.tier != bTank.tier) return bTank.tier - aTank.tier;
            return this.nameSort(a, b);
        },
        tierSort(a: IPlayerTank, b: IPlayerTank) {
            const aTank = this.tanksList[a.tank_id];
            const bTank = this.tanksList[b.tank_id];

            if (aTank.tier != bTank.tier) return bTank.tier - aTank.tier;
            if (b.marksOnGun != a.marksOnGun)
                return b.marksOnGun - a.marksOnGun;
            return this.nameSort(a, b);
        },
        nameSort(a: IPlayerTank, b: IPlayerTank) {
            return this.tanksList[b.tank_id].name.toLowerCase() <
                this.tanksList[a.tank_id].name.toLowerCase()
                ? 1
                : -1;
        },
        filterTanks(tanks: IPlayerTank[]) {
            const { moeFilter, tierFilter, typeFilter, nationFilter } =
                this.filters;

            tanks = tanks.filter((e) => {
                if (!this.tanksList[e.tank_id]) return false;

                if (moeFilter.length && !moeFilter.includes(e.marksOnGun)) {
                    return false;
                }

                if (
                    tierFilter.length &&
                    !tierFilter.includes(this.tanksList[e.tank_id].tier)
                ) {
                    return false;
                }

                if (
                    typeFilter.length &&
                    !typeFilter.includes(this.tanksList[e.tank_id].type)
                ) {
                    return false;
                }

                if (
                    nationFilter.length &&
                    !nationFilter.includes(this.tanksList[e.tank_id].nation)
                ) {
                    return false;
                }

                return true;
            });

            return tanks;
        },
        getRomanNumber(e: number) {
            const romanNumbers: { [key: string]: string } = {
                10: "X",
                9: "IX",
                8: "VIII",
                7: "VII",
                6: "VI",
                5: "V",
                4: "IV",
                3: "III",
                2: "II",
                1: "I",
            };

            return romanNumbers[e];
        },
        sortTankList() {
            let tanks: IPlayerTank[] = this.filterTanks(this.tanks);

            if (this.sort == "moe") tanks?.sort(this.moeSort);
            else if (this.sort == "tier") tanks?.sort(this.tierSort);
            else if (this.sort == "name") tanks?.sort(this.nameSort);

            this.sortedTankList = tanks;
        },
    },
    computed: {
        ...mapGetters(["tanksList"]),
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

.tier {
    position: absolute;
    left: -25px;
    top: -25px;
    width: 50px;
    height: 50px;
    font-size: 12px;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    transform: rotate(-45deg);
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

.tank-list-element:hover {
    transition: all 0.1s ease-out;
    background: rgba($color: #000000, $alpha: 0.05);
}
</style>
