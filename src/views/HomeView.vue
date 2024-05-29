<script setup lang="ts">
import type { CartChangeEvent, CartClearEvent, SeatChangeEvent, SubmitEvent } from 'seatchart';
import { SeatChart } from 'vue2-seatchart';
import { customLabelOptions } from '@/config';

const onSubmit = (e: SubmitEvent) => {
  console.log('SubmitEvent', e);
  alert(JSON.stringify(e, null, 4));
};
const onCartChange = (e: CartChangeEvent) => console.log('CartChangeEvent', e);
const onCartClear = (e: CartClearEvent) => console.log('CartClearEvent', e);
const onSeatChange = (e: SeatChangeEvent) => console.log('SeatChangeEvent', e);
</script>

<template>
  <div>
    <div class="content">
      <SeatChart
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
</style>
