<template>
    <div>
        <div class="d-flex mb-3">
            <router-link
                v-if="player.clan"
                :to="`/clan/${player.clan.tag}`"
                class="d-none d-md-flex align-items-center"
            >
                <img
                    class="clan-image mr-3"
                    :src="player.clan.logo"
                    :alt="player.clan.tag"
                />
            </router-link>

            <div class="d-flex justify-content-center flex-column">
                <h4>{{ player.nickname }}</h4>
                <router-link
                    v-if="player.clan"
                    :to="`/clan/${player.clan.tag}`"
                    class="text-decoration-none text-dark"
                >
                    <div class="d-flex">
                        <div class="font-weight-bold mr-2">
                            <span :style="{ color: player.clan.color }">[</span>
                            <span>{{ player.clan.tag }}</span>
                            <span :style="{ color: player.clan.color }">]</span>
                        </div>

                        {{ player.clan.name }}
                    </div>
                </router-link>
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
                    <h5 class="card-text">{{ player.global_rating }}</h5>
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
                    <h5 class="card-text">
                        {{ getWR(player.battles, player.wins) }}%
                    </h5>
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
                    <h5 class="card-text">{{ player.battles }}</h5>
                </div>
            </div>
        </div>

        <div class="row mx-0">
            <BestTankCard
                class="col-12 col-md-6 col-xl-3"
                header="Max kills"
                :tank_id="player.max_frags_tank_id"
                :text="`${player.max_frags} kills`"
            />
            <BestTankCard
                class="col-12 col-md-6 col-xl-3"
                header="Max damage"
                :tank_id="player.max_damage_tank_id"
                :text="`${player.max_damage} damage`"
            />
            <BestTankCard
                class="col-12 col-md-6 col-xl-3"
                header="Max experience"
                :tank_id="player.max_xp_tank_id"
                :text="`${player.max_xp} experience`"
            />
            <BestTankCard
                class="col-12 col-md-6 col-xl-3"
                header="Favorite tank"
                :tank_id="getFavoriteTank()?.tank_id"
                :text="`${getFavoriteTank()?.battles || 0} battles`"
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
            <div>Created: {{ getDate(player.created_at) }}</div>
            <div v-if="player.last_battle_time > player.created_at">
                Last battle: {{ getDate(player.last_battle_time) }}
            </div>
            <div v-else>Last battle: never played</div>
        </div>
        <TankList :tanks="player.tanks" />
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

import BestTankCard from "./BestTankCard.vue";
import TankList from "./TankList.vue";
import { mapGetters } from "vuex";
import { IPlayer } from "@/types/IPlayer";

export default defineComponent({
    name: "Player",
    components: {
        BestTankCard,
        TankList,
    },
    props: {
        player: {
            type: Object as PropType<IPlayer>,
            required: true,
        },
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
        getFavoriteTank() {
            const { tanks } = this.player;
            if (tanks.length) {
                const favTank = tanks.reduce((favorite, tank) => {
                    if (!favorite.battles || tank.battles > favorite.battles)
                        return tank;
                    return favorite;
                });

                return favTank;
            }
            return null;
        },
    },
    computed: {
        ...mapGetters(["tanksList"]),
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