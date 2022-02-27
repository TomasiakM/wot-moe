<template>
    <nav class="navbar navbar-dark fixed-top bg-dark navbar-expand-md">
        <div class="container">
            <router-link to="/" class="navbar-brand">WoT-MoE</router-link>

            <button
                class="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span class="navbar-toggler-icon"></span>
            </button>

            <div
                class="collapse navbar-collapse mt-2 mt-md-0"
                id="navbarSupportedContent"
            >
                <div class="ml-auto d-flex flex-column flex-md-row">
                    <div class="btn-group mr-0 mr-md-2">
                        <button
                            @click="findSwitch = 'player'"
                            :class="[
                                'btn fw-bold',
                                findSwitch == 'player'
                                    ? 'btn-primary'
                                    : 'btn-light',
                            ]"
                        >
                            Player
                        </button>
                        <button
                            @click="findSwitch = 'clan'"
                            :class="[
                                'btn fw-bold',
                                findSwitch == 'clan'
                                    ? 'btn-primary'
                                    : 'btn-light',
                            ]"
                        >
                            Clan
                        </button>
                    </div>
                    <div class="position-relative">
                        <form
                            class="input-group mt-2 mt-md-0"
                            @submit.prevent="find"
                        >
                            <input
                                type="text"
                                class="form-control"
                                :placeholder="'Find ' + findSwitch"
                                v-model="input"
                            />

                            <div class="input-group-append">
                                <button type="submit" class="btn btn-primary">
                                    <i class="bi bi-search"></i>
                                </button>
                            </div>
                        </form>
                        <button
                            id="errorButton"
                            data-target="#navError"
                            data-toggle="modal"
                            style="display: none"
                        ></button>
                    </div>
                </div>
            </div>
        </div>
    </nav>
    <div class="modal fade" id="navError" tabindex="-1" aria-hidden="false">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title text-danger">Error</h5>
                    <button
                        type="button"
                        class="close"
                        data-dismiss="modal"
                        aria-label="Close"
                    >
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="alert alert-danger py-2 m-0 text-dark">
                        {{ error }}
                    </div>
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
import { defineComponent } from "vue";

export default defineComponent({
    name: "Nav",
    data() {
        return {
            findSwitch: "player" as "player" | "clan",
            input: "",
            error: null as string | null,
        };
    },
    watch: {
        $route() {
            this.input = "";
            this.error = null;

            document
                .querySelectorAll('[data-dismiss="modal"]')
                .forEach((e) => (e as HTMLButtonElement).click());

            const navBtn: HTMLButtonElement | null =
                document.querySelector(".navbar-toggler");

            const navOpen =
                navBtn?.attributes.getNamedItem("aria-expanded")?.value ===
                "true";

            if (navOpen) {
                navBtn?.click();
            }
        },
        input() {
            const { length } = this.input;

            if (length >= 3 && length <= 24) {
                this.error = null;
            }
        },
        findSwitch() {
            this.error = null;
        },
    },
    methods: {
        validate() {
            this.error = null;
            const input = this.input.trim();

            if (this.findSwitch == "player") {
                if (input.length < 3)
                    return (this.error = "Minimum 3 characters!");

                const regEx = /^([A-Za-z0-9_]+)$/;
                if (!regEx.test(input))
                    return (this.error = "Wrong characters in search string.");
            }
            if (this.findSwitch == "clan") {
                if (input.length < 2)
                    return (this.error = "Minimum 2 characters!");
            }

            if (input.length > 24)
                return (this.error = "Maximum 24 characters!");
        },
        find() {
            this.validate();

            if (!this.error) {
                if (this.findSwitch === "player") {
                    this.$router.push({
                        name: "PlayerSite",
                        params: {
                            username: this.input.trim(),
                        },
                    });
                }
                if (this.findSwitch === "clan") {
                    this.$router.push({
                        name: "ClanPage",
                        params: {
                            clan: this.input.trim(),
                        },
                    });
                }
                return;
            }
            document.getElementById("errorButton")?.click();
        },
    },
});
</script>

<style lang="scss" scoped>
nav {
    box-shadow: 0 4px 4px 0 rgba($color: #000000, $alpha: 0.2);
}

form {
    min-width: 200px;
}

.btn-group {
    button {
        min-width: 100px;
    }
}

.error {
    position: absolute;
    top: 100%;
}
</style>
