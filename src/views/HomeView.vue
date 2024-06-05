<script setup lang="ts">
import type { CartChangeEvent, CartClearEvent, SeatChangeEvent, SubmitEvent } from 'seatchart';
import { SeatChart } from 'vue2-seatchart';
import { customLabelOptions } from '@/config';
import { PanZoom } from '@/components';
import { useScreenDetector } from '@/hooks';
import { ref, watchEffect } from 'vue';

const { isTablet, isDesktop } = useScreenDetector();

const onSubmit = (e: SubmitEvent) => {
  console.log('SubmitEvent', e);
  alert(JSON.stringify(e, null, 4));
};
const onCartChange = (e: CartChangeEvent) => console.log('CartChangeEvent', e);
const onCartClear = (e: CartClearEvent) => console.log('CartClearEvent', e);
const onSeatChange = (e: SeatChangeEvent) => console.log('SeatChangeEvent', e);

const scaleRef = ref<number>(0.3);
const panzoomRef = ref<typeof PanZoom>();
watchEffect(() => {
  const dialogEl = panzoomRef.value?.$el;
  if (dialogEl && 'querySelector' in dialogEl) {
    const map = dialogEl.querySelector('.sc-map');
    const container = dialogEl.querySelector('.pz-wrapper .pz-container');
    scaleRef.value = Math.min(
      container.offsetWidth / map.offsetWidth,
      container.offsetHeight / map.offsetHeight,
    );
    console.log(scaleRef.value);
  }
});
</script>

<template>
  <div>
    <div class="content">
      <PanZoom
        v-if="isTablet"
        ref="panzoomRef"
        class="zoom-wrapper"
        selector=".sc-map"
        :zoom="scaleRef"
      >
        <SeatChart
          :options="customLabelOptions"
          @cart:submit="onSubmit"
          @update:cartChange="onCartChange"
          @update:cartClear="onCartClear"
          @update:seatChange="onSeatChange"
        />
      </PanZoom>
      <SeatChart
        v-if="isDesktop"
        :options="customLabelOptions"
        @cart:submit="onSubmit"
        @update:cartChange="onCartChange"
        @update:cartClear="onCartClear"
        @update:seatChange="onSeatChange"
      />
      <h2>View the console to see events</h2>
    </div>
  </div>
</template>

<style>
.economy {
  color: white;
  background-color: #43aa8b;
}

.first-class {
  color: white;
  background-color: #277da1;
}

.reduced {
  color: white;
  background-color: #f8961e;
}

.zoom-wrapper .pz-container {
  width: 80%;
  height: 70vh;
  border: 1px solid var(--color-accent);
  border-radius: 1rem;
  overflow: hidden;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.zoom-wrapper {
  display: flex;
  width: 100%;
}

.sc-wrapper .sc-right-container {
  margin-left: 2rem;
}
.sc-map {
  justify-content: center;
}

@media (max-width: 768px) {
  .zoom-wrapper {
    flex-direction: column;
  }
  .sc-wrapper .sc-right-container {
    margin-left: 0;
  }
  .sc-wrapper {
    margin: auto;
  }
}
</style>
