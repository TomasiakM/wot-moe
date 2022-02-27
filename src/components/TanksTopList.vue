<template>
    <h5 class="mb-3">{{ title }}</h5>
    <div
        v-for="(tank, i) in tanks"
        :key="tank.tank_id"
        class="mb-1 d-flex justify-content-between border-bottom border-dark"
    >
        <div
            class="bg-primary text-light rounded-top font-weight-bold"
            style="min-width: 30px"
        >
            <div class="d-flex align-items-center justify-content-center h-100">
                {{ i + 1 }}
            </div>
        </div>
        <div class="d-flex align-items-center">
            <div class="ml-auto mr-2">
                {{ tanksList[tank.tank_id]?.name || "unknown" }}
            </div>
            <div style="min-width: 80px">
                <img
                    v-if="tanksList[tank.tank_id]"
                    :src="tanksList[tank.tank_id].image"
                    :alt="tanksList[tank.tank_id].name"
                    class="d-block mx-auto"
                    style="height: 24px; margin: 2px 0"
                />
                <Unknown
                    v-else
                    class="d-block mx-auto"
                    style="height: 24px; margin: 2px 0"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { mapGetters } from "vuex";
import Unknown from "../icons/Unknown.vue";

export default defineComponent({
    name: "TanksTopList",
    props: {
        title: {
            type: String,
            required: true,
        },
        tanks: {
            type: Array as PropType<{ tank_id: number; amount: number }[]>,
            required: true,
        },
    },
    components: {
        Unknown,
    },
    computed: {
        ...mapGetters(["tanksList"]),
    },
});
</script>
