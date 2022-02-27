<template>
    <div class="d-flex justify-content-between">
        <router-link
            :to="`/player/${data.account_name}`"
            :style="{
                textOverflow: 'ellipsis',
                overflow: 'hidden',
            }"
            class="text-decoration-none text-dark"
        >
            {{ data.account_name }}
        </router-link>

        <div class="d-flex align-items-center moe">
            <div style="min-width: 80px" class="d-flex align-items-center">
                <div class="d-flex">
                    <Star style="fill: var(--dark)" />
                    <Star style="fill: var(--dark)" />
                    <Star style="fill: var(--dark)" />
                </div>
                <div class="text-center w-100">{{ data.moe[3] }}</div>
            </div>
            <div style="min-width: 67px" class="d-flex align-items-center">
                <div class="d-flex">
                    <Star style="fill: var(--dark)" />
                    <Star style="fill: var(--dark)" />
                </div>
                <div class="text-center w-100">{{ data.moe[2] }}</div>
            </div>
            <div style="min-width: 45px" class="d-flex align-items-center">
                <div class="d-flex">
                    <Star style="fill: var(--dark)" />
                </div>
                <div class="text-center w-100">{{ data.moe[1] }}</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import Star from "../icons/Star.vue";
import { IClanMember } from "@/types/IClan";

export default defineComponent({
    name: "ClanMember",
    props: {
        data: {
            type: Object as PropType<IClanMember>,
            required: true,
        },
    },
    components: {
        Star,
    },
});
</script>

<style lang="scss" scoped>
.moe {
    img {
        max-height: 24px;

        @media (min-width: 768px) {
            max-height: 30px;
        }
    }
}
</style>