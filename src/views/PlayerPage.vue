<template>
    <div>
        <Spinner v-if="isLoading || isLoadingTankList" />

        <div v-else-if="playerNotFound">
            <div class="alert alert-danger py-2">
                <h6 class="mb-1">Error</h6>
                <p class="mb-0">Player not found.</p>
            </div>
        </div>

        <div v-else-if="error">
            <div
                class="alert alert-danger py-2"
                @click="fetchPlayer()"
                role="button"
            >
                <h6 class="mb-1">Error</h6>
                <p class="mb-0">
                    An error has occurred while fetching player, try again by
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

        <PlayerData v-else :player="player" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import PlayerData from "@/components/PlayerData.vue";
import Spinner from "@/components/Spinner.vue";

import { IPlayer } from "@/types/IPlayer";

import { mapActions, mapGetters } from "vuex";

export default defineComponent({
    name: "PlayerSide",
    components: {
        PlayerData,
        Spinner,
    },
    data() {
        return {
            isLoading: true,
            error: false,
            playerNotFound: false,
            player: {} as IPlayer,
        };
    },
    watch: {
        "$route.params"() {
            this.fetchPlayer();
        },
    },
    mounted() {
        this.fetchPlayer();
    },
    methods: {
        ...mapActions(["fetchTankList"]),
        fetchPlayer() {
            this.isLoading = true;
            this.error = false;
            this.playerNotFound = false;

            const { username } = this.$route.params;
            fetch(`/api/player/${username}`)
                .then((e) => e.json())
                .then((e) => {
                    if (e.success) {
                        this.player = e.data;
                        return;
                    }
                    if (e.playerNotFound) {
                        this.playerNotFound = true;
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