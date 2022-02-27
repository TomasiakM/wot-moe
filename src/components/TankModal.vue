<template>
    <div
        class="modal fade"
        id="tankStatisticsModal"
        tabindex="-1"
        aria-hidden="true"
    >
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h6 class="modal-title">
                        <img
                            :src="tanksList[tank.tank_id]?.image"
                            :alt="tanksList[tank.tank_id]?.name"
                        />
                        {{ tanksList[tank.tank_id]?.name }}
                    </h6>
                    <button
                        type="button"
                        class="close"
                        data-dismiss="modal"
                        aria-label="Close"
                    >
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body p-0">
                    <table class="table table-striped mb-0">
                        <tbody>
                            <tr>
                                <td>Mastery class:</td>
                                <td class="text-right">
                                    <img
                                        v-if="tank.mark_of_mastery"
                                        class="badge-image"
                                        :src="
                                            getMasteryBadge(
                                                tank.mark_of_mastery
                                            )
                                        "
                                        alt="Mastery badge"
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>Battles:</td>
                                <td class="text-right">{{ tank.battles }}</td>
                            </tr>
                            <tr>
                                <td>Wins:</td>
                                <td class="text-right">
                                    {{ getWinRation(tank.battles, tank.wins) }}%
                                </td>
                            </tr>
                            <tr>
                                <td>Avg damage:</td>
                                <td class="text-right">
                                    {{
                                        getAvg(tank.battles, tank.damage_dealt)
                                    }}
                                </td>
                            </tr>
                            <tr>
                                <td>Avg xp:</td>
                                <td class="text-right">
                                    {{ getAvg(tank.battles, tank.xp) }}
                                </td>
                            </tr>
                            <tr>
                                <td>Avg frags:</td>
                                <td class="text-right">
                                    {{ getAvg(tank.battles, tank.frags, true) }}
                                </td>
                            </tr>
                            <tr>
                                <td>Max xp:</td>
                                <td class="text-right">
                                    {{ tank.max_xp }}
                                </td>
                            </tr>
                            <tr>
                                <td>Max frags:</td>
                                <td class="text-right">
                                    {{ tank.max_frags }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="modal-footer">
                    <button
                        type="button"
                        class="btn btn-danger"
                        data-dismiss="modal"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { IPlayerTank } from "@/types/IPlayer";
import { defineComponent, PropType } from "vue";
import { mapGetters } from "vuex";

export default defineComponent({
    name: "TankModal",
    props: {
        tank: {} as PropType<IPlayerTank>,
    },
    methods: {
        getWinRation(battles: number, wins: number) {
            if (!battles) return 0;
            return Math.round((wins / battles) * 10000) / 100;
        },
        getAvg(battles: number, value: number, hundredths: boolean = false) {
            if (!battles) return 0;
            if (hundredths) return Math.round((value / battles) * 100) / 100;
            return Math.round(value / battles);
        },
        getMasteryBadge(badge: number) {
            if (badge === 4) return require("../assets/ace-tanker.png");
            else if (badge === 3)
                return require("../assets/mastery-class-1.png");
            else if (badge === 2)
                return require("../assets/mastery-class-2.png");
            else if (badge === 1)
                return require("../assets/mastery-class-3.png");
        },
    },
    computed: {
        ...mapGetters(["tanksList"]),
    },
});
</script>

<style lang="scss" scoped>
.badge-image {
    max-height: 27px;
}

.modal-header {
    border-bottom: none;
}
</style>