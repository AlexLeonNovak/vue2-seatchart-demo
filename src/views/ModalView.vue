<script setup lang="ts">
import { ref } from 'vue';
import { ModalDialog } from '@/components';
import { SeatChart } from 'vue2-seatchart';
import type { Options, SubmitEvent } from 'seatchart';
import { simpleOptions } from '@/config';

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
    <ModalDialog :show="dialogVisible" @update:show="hideDialog">
      <SeatChart :options="simpleOptions" @cart:submit="onSubmit" ref="seatChartRef" />
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
</style>
