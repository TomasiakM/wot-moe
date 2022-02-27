<template>
    <Responsive class="w-full">
        <template #main="{ width }">
            <Chart
                :size="{ width, height: 300 }"
                :data="getPieData"
                :margin="{
                    left: 0,
                    top: 20,
                    right: 20,
                    bottom: 0,
                }"
                direction="horizontal"
                :axis="axis"
            >
                <template #layers>
                    <Grid strokeDasharray="2,2" />
                    <Bar
                        :dataKeys="['name', 'count']"
                        :barStyle="{ fill: 'var(--primary)' }"
                    />
                </template>

                <template #widgets>
                    <Tooltip
                        borderColor="var(--primary)"
                        :config="{
                            name: { color: '#000' },
                            count: { color: '#000' },
                        }"
                    />
                </template>
            </Chart>
        </template>
    </Responsive>
</template>

<script lang="ts">
import { Tier } from "@/types/ITank";
import { defineComponent, PropType } from "vue";
import { Marker, Chart, Grid, Tooltip, Responsive, Bar } from "vue3-charts";

export default defineComponent({
    name: "LineChart",
    components: { Chart, Grid, Tooltip, Marker, Responsive, Bar },
    props: {
        data: {
            type: Object as PropType<{ [key: string]: number }>,
            required: true,
        },
        type: {
            type: String,
            required: false,
        },
    },
    data() {
        return {
            axis: {
                primary: {
                    type: "band",
                },
                secondary: {
                    domain: ["dataMin", "dataMax + 10"],
                    type: "linear",
                    ticks: 8,
                },
            },
        };
    },
    methods: {
        getRomanNumber(e: Tier): string {
            const obj = {
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

            return obj[e];
        },
    },
    computed: {
        getPieData() {
            const arr = Object.keys(this.data).map((e) => {
                return {
                    name:
                        this.type == "tier"
                            ? this.getRomanNumber(<Tier>Number(e))
                            : e,
                    count: this.data[e],
                };
            });

            if (this.type == "tier") return arr.reverse();
            return arr;
        },
    },
});
</script>

<style lang="scss" >
.v-tooltip-content > div {
    border-color: var(--dark) !important;
}
</style>