<template>
    <div class="d-flex align-items-center mb-3">
        <img :src="data.logo" :alt="data.name" class="clan-logo" />
        <div class="ml-2">
            <h4>
                <span :style="{ color: data.color }">[</span>
                <span>{{ data.tag }}</span>
                <span :style="{ color: data.color }">]</span>
            </h4>
            <div class="text-break">
                {{ data.name }}
            </div>
        </div>
    </div>

    <div class="mb-3">
        <header
            class="
                card-header
                d-flex
                align-items-center
                justify-content-between
            "
            data-toggle="collapse"
            data-target="#collapse_clan_description"
            aria-expanded="false"
        >
            <h6 class="mb-0">Description</h6>

            <i class="bi bi-caret-down-fill" v-if="data.description_html"></i>
        </header>

        <div
            class="filter-content collapse border-bottom mb-3"
            id="collapse_clan_description"
            v-if="data.description_html"
        >
            <div class="card-body border-right border-left px-4">
                <div class="description" v-html="data.description_html"></div>
            </div>
        </div>
    </div>

    <ClanTank :tanks="data.marks" />

    <div>
        <header
            class="
                card-header
                d-flex
                align-items-center
                justify-content-between
            "
        >
            <h6 class="mb-0">Members</h6>
            <div>
                <select class="form-control form-control-sm" v-model="select">
                    <option value="name">by name</option>
                    <option value="3moe">by 3 moe</option>
                    <option value="2moe">by 2 moe</option>
                    <option value="1moe">by 1 moe</option>
                </select>
            </div>
        </header>
        <div class="member-list border-bottom mb-3">
            <div class="card-body border-right border-left py-0">
                <div
                    v-for="member in sortMembers"
                    :key="member.account_id"
                    class="border-top py-2"
                >
                    <ClanMember :data="member" />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { IClan, IClanMember } from "@/types/IClan";
import { defineComponent, PropType } from "vue";

import ClanMember from "../components/ClanMember.vue";
import ClanTank from "../components/ClanTanks.vue";

export default defineComponent({
    name: "ClanData",
    components: { ClanMember, ClanTank },
    data() {
        return {
            select: "name" as "name" | "3moe" | "2moe" | "1moe",
        };
    },
    props: {
        data: {
            type: Object as PropType<IClan>,
            required: true,
        },
    },
    methods: {
        sortByName(a: IClanMember, b: IClanMember) {
            return a.account_name.replace("_", ".").toLowerCase() >
                b.account_name.replace("_", ".").toLowerCase()
                ? 1
                : -1;
        },
        sortByMoe(a: IClanMember, b: IClanMember, moe: 3 | 2 | 1) {
            const aMoe = a.moe[moe];
            const bMoe = b.moe[moe];
            if (aMoe != bMoe) return bMoe - aMoe;
            return this.sortByName(a, b);
        },
    },
    computed: {
        sortMembers(): IClanMember[] {
            if (this.select == "3moe")
                return this.data.members.sort((a, b) =>
                    this.sortByMoe(a, b, 3)
                );
            if (this.select == "2moe")
                return this.data.members.sort((a, b) =>
                    this.sortByMoe(a, b, 2)
                );
            if (this.select == "1moe")
                return this.data.members.sort((a, b) =>
                    this.sortByMoe(a, b, 1)
                );
            return this.data.members.sort(this.sortByName);
        },
    },
});
</script>

<style lang="scss" scoped>
.clan-logo {
    width: 30%;
    max-width: 120px;
}

.member-list div:first-child.border-top {
    border-top: none !important;
}

.description ::v-deep p {
    margin: 0;
}

header[aria-expanded="true"] i {
    transition: all 0.3s ease-in-out;
    transform: rotate(180deg);
}

header[aria-expanded="false"] i {
    transition: all 0.3s ease-in-out;
    transform: rotate(0deg);
}
</style>