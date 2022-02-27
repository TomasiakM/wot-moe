<template>
    <div class="card border-light rounded text-light bg-dark text-center">
        <div class="card-header">{{ header }}</div>
        <div
            class="
                card-body
                d-flex
                flex-column
                align-items-center
                justify-content-between
            "
        >
            <img
                v-if="tanksList[tank_id]"
                class="card-img mb-3"
                :src="tanksList[tank_id].image"
                :alt="tanksList[tank_id].name"
            />
            <UnknownIcon class="mb-3" v-else />
            <div>
                <p class="card-text mb-0" v-if="tanksList[tank_id]">
                    {{ tanksList[tank_id].name }}
                </p>
                <p class="card-text">{{ text }}</p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters } from "vuex";

import UnknownIcon from "@/icons/Unknown.vue";

export default defineComponent({
    name: "BestTankCard",
    props: {
        header: String,
        tank_id: Number,
        text: String,
    },
    components: {
        UnknownIcon,
    },
    computed: {
        ...mapGetters(["tanksList"]),
    },
});
</script>

<style lang="scss" scoped>
.card img {
    width: auto;
    max-width: 75%;
}

svg {
    max-width: 40px;
    fill: white;
}
</style>