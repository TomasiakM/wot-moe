<template>
  <div>
    <div
      class="text-hide rounded banner"
      :style="{ backgroundImage: `url('${require('@/assets/banner.jpg')}')` }"
    >
      Baner
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Home",
});
</script>

<style lang="scss" scoped>
.banner {
  height: 200px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
