<template>
  <nav class="navbar navbar-dark bg-dark navbar-expand-md">
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

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <div class="ml-auto">
          <form class="input-group mt-2 mt-md-0" @submit.prevent="findPlayer">
            <input
              type="text"
              :class="['form-control', error && 'is-invalid']"
              placeholder="Find player"
              v-model="input"
            />

            <div class="input-group-append">
              <button type="submit" class="btn btn-primary">
                <i class="bi bi-search"></i>
              </button>
            </div>
          </form>
          <div class="invalid-feedback d-block">{{ error }}</div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Nav",
  data() {
    return {
      input: "",
      error: null as string | null,
    };
  },
  watch: {
    $route() {
      this.input = "";
      this.error = null;
    },
    input() {
      const { input } = this;

      if (input.length >= 3 && input.length <= 24) {
        this.error = null;
      }
    },
  },
  methods: {
    validate() {
      const { length } = this.input;
      if (length < 3) return (this.error = "Minimum 3 characters!");
      if (length > 24) return (this.error = "Maximum 24 characters!");
    },
    findPlayer() {
      this.validate();

      if (!this.error) {
        this.$router.push({
          name: "PlayerSite",
          params: { username: this.input, temp: new Date().getTime() },
        });
      }
    },
  },
});
</script>
