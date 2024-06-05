<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { ModalDialog, PanZoom } from '@/components';
import { SeatChart } from 'vue2-seatchart';
import type { SubmitEvent } from 'seatchart';
import { simpleOptions } from '@/config';
import { useScreenDetector } from '@/hooks';

const { isTablet, isDesktop } = useScreenDetector();

const seatChartRef = ref<typeof SeatChart>();
const checkoutDetailsRef = ref<SubmitEvent | null>(null);
const dialogVisible = ref<boolean>(false);
const showDialog = () => (dialogVisible.value = true);
const hideDialog = () => (dialogVisible.value = false);

const onCheckout = () => {
  checkoutDetailsRef.value = seatChartRef.value?.checkoutCart();
  hideDialog();
};
const onSubmit = (e: SubmitEvent) => {
  console.log('SubmitEvent', JSON.stringify(e, null, 4));
};

const scale = ref<number>(0.3);
const dialog = ref<typeof ModalDialog>();
watchEffect(() => {
  const dialogEl = dialog.value?.$el;
  if (dialogEl && 'querySelector' in dialogEl) {
    const map = dialogEl.querySelector('.sc-map');
    const container = dialogEl.querySelector('.pz-wrapper .pz-container');
    scale.value = Math.min(
      container.offsetWidth / map.offsetWidth,
      container.offsetHeight / map.offsetHeight,
    );
  }
});
</script>

<template>
  <div class="content">
    <div class="preview">
      <div class="btn-block">
        <button class="btn" @click="showDialog">Show dialog</button>
      </div>
      <pre
        v-if="checkoutDetailsRef"
      ><code>{{ JSON.stringify(checkoutDetailsRef, null, 2) }}</code></pre>
    </div>
    <ModalDialog :show="dialogVisible" @update:show="hideDialog" ref="dialog">
      <PanZoom v-if="isTablet" class="zoom-wrapper" selector=".sc-map" :zoom="scale">
        <SeatChart :options="simpleOptions" @cart:submit="onSubmit" ref="seatChartRef" />
      </PanZoom>
      <SeatChart
        v-if="isDesktop"
        :options="simpleOptions"
        @cart:submit="onSubmit"
        ref="seatChartRef"
      />
      <div class="dialog__footer">
        <button class="btn" @click="onCheckout">Checkout</button>
      </div>
    </ModalDialog>
  </div>
</template>

<style scoped>
.dialog__footer {
  display: flex;
  justify-content: center;
}

.btn-block {
  text-align: center;
}

.preview {
  display: block;
}
.zoom-wrapper .sc-main-container {
  display: none;
}
</style>
