<template>
    <div>
        <div
            class="text-hide rounded banner mb-3"
            :style="{
                backgroundImage: `url('${require('@/assets/banner.jpg')}')`,
            }"
        ></div>

        <Spinner v-if="isLoading || isLoadingTankList" />
        <div v-else-if="error">
            <div
                class="alert alert-danger py-2 mb-1"
                @click="fetchStatistics()"
                role="button"
            >
                <h6 class="mb-1">Error</h6>
                <p class="mb-0">
                    An error has occurred while fetching statistics, try again
                    by clicking on this alert.
                </p>
            </div>
        </div>

        <div v-else-if="errorTankList">
            <div
                class="alert alert-danger py-2 mb-1"
                @click="fetchTankList()"
                role="button"
            >
                <h6 class="mb-1">Error</h6>
                <p class="mb-0">
                    An error has occurred while fetching tanks, try again by
                    clicking on this alert.
                </p>
            </div>
        </div>

        <div v-else>
            <div class="row px-3 mb-1">
                <div class="col-12 col-md-6 p-0 pr-md-3">
                    <TanksTopList
                        title="The most common tanks with 3 MoE"
                        :tanks="statistics.marked_tank_top_list"
                    />
                </div>
                <div class="col-12 col-md-6 p-0 pl-md-3 mt-3 mt-md-0">
                    <TanksTopList
                        title="The most popular tanks"
                        :tanks="statistics.popular_tanks_top_list"
                    />
                </div>
            </div>
            <div class="d-flex">
                <div class="badge p-0 text-muted ml-auto">
                    *based on data from
                    {{ statistics.total_players }} players
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapActions, mapGetters } from "vuex";
import { IStatistics } from "../types/IStatistics";
import TanksTopList from "../components/TanksTopList.vue";
import Spinner from "../components/Spinner.vue";

export default defineComponent({
    name: "Home",
    components: {
        TanksTopList,
        Spinner,
    },
    data() {
        return {
            isLoading: true,
            error: false,
            statistics: {
                total_players: 0,
                new_players_last_day: 0,
                marked_tank_top_list: [],
                popular_tanks_top_list: [],
                created_at: "",
            } as IStatistics,
        };
    },
    mounted() {
        this.fetchStatistics();
    },
    methods: {
        ...mapActions(["fetchTankList"]),
        fetchStatistics() {
            this.isLoading = true;
            this.error = false;

            fetch("/api/statistics")
                .then((e) => e.json())
                .then((e) => {
                    if (e.success) {
                        this.statistics = e.statistics;
                        return;
                    }

                    this.error = true;
                })
                .catch((err) => {
                    this.error = true;
                })
                .finally(() => {
                    this.isLoading = false;
                });
        },
    },
    computed: {
        ...mapGetters(["isLoadingTankList", "errorTankList"]),
    },
});
</script>

<style lang="scss" scoped>
.banner {
    height: 200px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
}
</style>
