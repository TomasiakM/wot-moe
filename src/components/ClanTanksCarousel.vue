<template>
    <div v-if="sortedTanks.length" class="mb-3">
        <Carousel ref="slider" :settings="settings" :breakpoints="breakpoints">
            <Slide
                v-for="({ tank_id, amount }, i) in sortedTanks"
                :key="i"
                style="min-height: 100px; overflow: hidden"
                class="px-1 text-light"
            >
                <div
                    style="min-height: 100px; overflow: hidden"
                    class="d-flex justify-content-center card bg-dark w-100"
                >
                    <span
                        class="
                            position-absolute
                            tank-count
                            bg-primary
                            rounded-circle
                            d-flex
                            justify-content-center
                            align-items-center
                        "
                        >{{ amount }}</span
                    >
                    <img
                        v-if="tanksList[tank_id]"
                        :src="tanksList[tank_id].image"
                        :alt="tanksList[tank_id].name"
                        class="d-block mx-auto"
                    />
                    <UnknownIcon v-else />
                    <div class="text-center">
                        {{ tanksList[tank_id]?.name || "unknown" }}
                    </div>
                </div>
            </Slide>
            <template #addons>
                <Navigation />
            </template>
        </Carousel>
    </div>
    <div v-else>
        <div class="alert alert-warning">
            Clan does not own tanks with {{ select }} moe.
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { mapGetters } from "vuex";
import UnknownIcon from "@/icons/Unknown.vue";
import { IClanCarousel } from "@/types/IClanCarousel";

import { Carousel, Navigation, Slide } from "vue3-carousel";
import "vue3-carousel/dist/carousel.css";

export default defineComponent({
    name: "TanksCarousel",
    props: {
        select: {
            type: String as PropType<"3" | "2" | "1">,
            required: true,
        },
        moeData: {
            type: Object as PropType<IClanCarousel>,
            required: true,
        },
    },
    mounted() {
        this.sortTanks();
    },
    data() {
        return {
            sortedTanks: [] as { tank_id: number; amount: number }[],
            settings: {
                snapAlign: "start",
            },
            breakpoints: {
                300: {
                    itemsToShow: 2,
                    itemsToScroll: 2,
                },
                768: {
                    itemsToShow: 3,
                    itemsToScroll: 3,
                },
                1024: {
                    itemsToShow: 5,
                    itemsToScroll: 5,
                },
                1300: {
                    itemsToShow: 6,
                    itemsToScroll: 6,
                },
            },
        };
    },
    components: {
        UnknownIcon,
        Carousel,
        Navigation,
        Slide,
    },
    watch: {
        select() {
            this.sortTanks();
            if (this.sortedTanks.length) (this.$refs.slider as any)?.slideTo(0);
        },
    },
    methods: {
        sortTanks() {
            const tanks = [...this.moeData.tanks];
            const sorted = tanks.sort((a, b) => {
                if (a.amount === b.amount) {
                    const aTank = this.tanksList[a.tank_id];
                    const bTank = this.tanksList[b.tank_id];

                    if (!aTank || !bTank) return (!aTank && 1) || -1;
                    if (aTank.tier === bTank.tier)
                        return bTank.name < aTank.name ? 1 : -1;
                    return bTank.tier - aTank.tier;
                }

                return b.amount - a.amount;
            });

            const sliced = sorted.slice(0, 25);

            this.sortedTanks = sliced;
        },
    },
    computed: {
        ...mapGetters(["tanksList"]),
    },
});
</script>

<style lang="scss">
button.carousel__prev,
button.carousel__next {
    background-color: white;

    svg {
        background-color: var(--blue);
        width: 80%;
        height: 80%;
        border-radius: 50%;
        transform: translateZ(-2px);
    }
}

.carousel__prev--in-active,
.carousel__next--in-active {
    display: none;
}
</style>

<style lang="scss" scoped>
.tank-count {
    left: 10px;
    top: 10px;
    width: 24px;
    height: 24px;
    font-size: 12px;
    font-weight: bold;
}

svg {
    max-width: 40px;
    fill: white;
    margin: 0 auto;
}

.badge {
    border: none;
}
</style>