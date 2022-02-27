<template>
    <div>
        <Spinner v-if="isLoading" class="mt-2" />

        <div v-else-if="clanNotFound">
            <div class="alert alert-danger py-2">
                <h6 class="mb-1">Error</h6>
                <p class="mb-0">Clan not found.</p>
            </div>
        </div>

        <div v-else-if="error">
            <div
                class="alert alert-danger py-2"
                @click="fetchClan()"
                role="button"
            >
                <h6 class="mb-1">Error</h6>
                <p class="mb-0">
                    An error has occurred while fetching clan, try again by
                    clicking on this alert.
                </p>
            </div>
        </div>

        <div v-else-if="errorTankList">
            <div
                class="alert alert-danger py-2"
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

        <ClanData v-else :data="clan" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapActions, mapGetters } from "vuex";

import Spinner from "../components/Spinner.vue";
import ClanData from "../components/ClanData.vue";

import { IClan } from "@/types/IClan";

export default defineComponent({
    name: "ClanPage",
    components: {
        ClanData,
        Spinner,
    },
    data() {
        return {
            error: false,
            clanNotFound: false,
            isLoading: true,
            clan: {} as IClan,
        };
    },
    mounted() {
        this.fetchClan();
    },
    watch: {
        "$route.params"() {
            this.fetchClan();
        },
    },
    methods: {
        ...mapActions(["fetchTankList"]),
        fetchClan() {
            this.isLoading = true;
            this.error = false;
            this.clanNotFound = false;

            const name = this.$route.params.clan;

            fetch(`/api/clan/${name}`)
                .then((e) => e.json())
                .then((e) => {
                    if (e.success) {
                        this.clan = e.data;
                        return;
                    }
                    if (e.clanNotFound) {
                        this.clanNotFound = true;
                        return;
                    }

                    this.error = true;
                })
                .catch(() => {
                    this.error = true;
                })
                .finally(() => {
                    this.isLoading = false;
                });
        },
    },
    computed: {
        ...mapGetters(["tanksList", "isLoadingTankList", "errorTankList"]),
    },
});
</script>
