<template>
    <div class="mb-3">
        <h6
            class="
                mb-1
                d-flex
                card-header
                align-items-center
                justify-content-between
            "
        >
            <div class="d-flex align-items-center" style="gap: 2px">
                <span class="mr-1">Tanks</span>
                <Star
                    v-for="i in Number(select)"
                    :key="i"
                    style="fill: var(--dark)"
                />
            </div>

            <div>
                <select class="form-control form-control-sm" v-model="select">
                    <option value="3">3 moe</option>
                    <option value="2">2 moe</option>
                    <option value="1">1 moe</option>
                </select>
            </div>
        </h6>
        <ClanTanksCarousel :select="select" :moeData="getTanksMoe" />
        <div class="row" v-if="getTanksMoe.tanks.length">
            <div class="col-12 col-lg-6">
                <ClanTanksPie :data="getTanksMoe.countByTier" type="tier" />
            </div>
            <div class="col-12 col-lg-6">
                <ClanTanksPie :data="getTanksMoe.countByNation" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { mapGetters } from "vuex";

import ClanTanksCarousel from "./ClanTanksCarousel.vue";
import ClanTanksPie from "./ClanTanksPie.vue";
import Star from "../icons/Star.vue";
import { IClanMarks } from "@/types/IClan";
import { INation, ITank } from "@/types/ITank";
import { IClanCarousel } from "@/types/IClanCarousel";

export default defineComponent({
    name: "ClanTanks",
    props: {
        tanks: {
            type: Object as PropType<IClanMarks>,
            required: true,
        },
    },
    data() {
        return {
            select: "3" as "3" | "2" | "1",
        };
    },
    components: {
        ClanTanksCarousel,
        ClanTanksPie,
        Star,
    },
    methods: {
        getNationValue(e: string): string {
            const nations = {
                ussr: "USSR",
                china: "CHN",
                usa: "USA",
                poland: "PL",
                sweden: "SE",
                czech: "CZ",
                uk: "UK",
                germany: "DE",
                italy: "IT",
                japan: "JP",
                france: "FR",
            } as { [key: string]: string };

            return nations[e];
        },
    },
    computed: {
        ...mapGetters(["tanksList", "isLoadingTankList", "nations"]),

        getTanksMoe() {
            const nations = {} as { [key: string]: number };
            this.nations.forEach((e: INation) => {
                const nation = this.getNationValue(e.value);
                nations[nation] = 0;
            });

            const data = {
                tanks: this.tanks[this.select],
                countByTier: {} as { [key: string]: number },
                countByNation: nations,
            } as IClanCarousel;

            const tanks = {} as { [key: string]: number };
            this.tanks[this.select].forEach((tank) => {
                const { tank_id, amount } = tank;

                const tankData: ITank = this.tanksList[tank_id];
                if (tankData) {
                    const { tier, nation } = tankData;
                    if (data.countByTier[tier] == null)
                        data.countByTier[tier] = 0;
                    data.countByTier[tier] += amount;

                    if (data.countByNation[this.getNationValue(nation)] == null)
                        data.countByNation[this.getNationValue(nation)] = 0;
                    data.countByNation[this.getNationValue(nation)] += amount;
                }

                if (!tanks[tank_id]) tanks[tank_id] = 0;
                tanks[tank_id] += amount;
            });

            return data;
        },
    },
});
</script>

<style lang="scss" scoped>
h5 img {
    max-width: 40px;
}
.tank-count {
    position: absolute;
    left: 0;
    top: 0;
    width: 30px;
    height: 30px;
}
</style>