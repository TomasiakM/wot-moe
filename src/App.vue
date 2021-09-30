<template>
  <Nav />
  <router-view class="container py-3" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapActions } from "vuex";

import Nav from "./components/Nav.vue";

export default defineComponent({
  name: "App",
  components: {
    Nav,
  },
  mounted() {
    this.fetchTankList();
  },
  methods: {
    ...mapActions(["fetchTankList"]),
  },
});
</script>
