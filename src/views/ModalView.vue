<script setup lang="ts">
import { computed, onMounted, ref, watch, watchEffect } from 'vue';
import { ModalDialog, VueZoomable } from '@/components';
import { SeatChart } from 'vue2-seatchart';
import type { Options, SubmitEvent } from 'seatchart';
import { customLabelOptions, simpleOptions } from '@/config';
import { useScreenDetector, useMove } from '@/hooks';

const { isTablet, isDesktop, width } = useScreenDetector();
// const { changeZoom } = useMove({}, null, );

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
    const container = dialogEl.querySelector('.zoom-wrapper .container');
    scale.value = Math.min(
      container.offsetWidth / map.offsetWidth,
      container.offsetHeight / map.offsetHeight,
    );
  }
});
const onTouch = (e: any) => console.log(e);
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
      <VueZoomable
        v-if="isTablet"
        class="zoom-wrapper"
        selector=".sc-map"
        :enable-controll-button="true"
        :min-zoom="0.1"
        :zoom="scale"
        @panned="onTouch"
        @zoom="onTouch"
        @update:pan="onTouch"
        @update:zoom="onTouch"
      >
        <SeatChart :options="simpleOptions" @cart:submit="onSubmit" ref="seatChartRef" />
      </VueZoomable>
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
