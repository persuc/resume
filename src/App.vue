<script setup lang="ts">
</script>

<template>
  <main style="height: 100vh;">
    <router-view/>
  </main>
</template>

<style>
@import "./assets/base.css";
@import "./assets/decoration.css";
@import "./assets/layout.css";
@import "./assets/pad.css";

@media (hover: hover) {
  a:not(.plain):not(.nohover):hover {
    background-color: hsla(240, 100%, 73%, 0.2);

    &::before {
      content: " ";
      position: absolute;
      left: -0.1em;
      top: 0;
      height: 100%;
      width: 0.1em;
      background-color: hsla(240, 100%, 73%, 0.2);
    }

    &::after {
      content: " ";
      position: absolute;
      right: -0.1em;
      top: 0;
      height: 100%;
      width: 0.1em;
      background-color: hsla(240, 100%, 73%, 0.2);
    }
  }
}
</style>
