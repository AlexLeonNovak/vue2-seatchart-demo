<script setup lang="ts">
import { HeaderComponent } from '@/components';
import 'seatchart/dist/seatchart.min.css';
</script>

<template>
  <main id="app">
    <HeaderComponent />
    <router-view />
  </main>
</template>
