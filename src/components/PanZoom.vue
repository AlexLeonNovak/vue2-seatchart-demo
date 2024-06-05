<script setup lang="ts">
import PanZoom, { type PanzoomObject } from '@panzoom/panzoom';
import { onMounted, ref, watch } from 'vue';
import { ControlButtons } from '.';

const props = defineProps({
  selector: {
    type: String,
  },
  zoom: {
    type: Number,
    default: 1,
  },
});

const wrapperRef = ref<HTMLDivElement>();
const contentRef = ref<HTMLDivElement>();
const pzInstanceRef = ref<PanzoomObject>();
const transformContainer = ref();

const onHome = () => {
  pzInstanceRef.value?.reset();
  pzInstanceRef.value?.zoom(props.zoom);
};

const onWheel = (e: WheelEvent) => pzInstanceRef.value?.zoomWithWheel(e);
const onDown = (e: PointerEvent) => pzInstanceRef.value?.handleDown(e);

const onZoom = (e: number) => {
  console.log(e);
  e === 1 && pzInstanceRef.value?.zoomIn();
  e === -1 && pzInstanceRef.value?.zoomOut();
};

watch(
  () => props.zoom,
  () => {
    if (!isNaN(props.zoom)) {
      pzInstanceRef.value?.zoom(props.zoom);
    }
  },
);

onMounted(() => {
  if (!contentRef.value || !wrapperRef.value) {
    console.error('No init');
    return;
  }
  let elem: HTMLDivElement | null = contentRef.value;
  if (props.selector) {
    elem = contentRef.value.querySelector(props.selector);
  }
  transformContainer.value?.appendChild(elem);
  pzInstanceRef.value = PanZoom(transformContainer.value, {
    animate: true,
    overflow: 'unset',
  });
});
</script>

<template>
  <div class="pz-wrapper" ref="wrapperRef">
    <div class="pz-container" @wheel="onWheel" @pointerdown="onDown">
      <ControlButtons @button-home="onHome" @button-zoom="onZoom" />
      <div class="pz-scene-wrapper">
        <div class="pz-scene" ref="transformContainer" />
      </div>
    </div>
    <div class="pz-content" ref="contentRef">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.pz-container {
  position: relative;

  transition: transform 0.1s ease-out;

  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>
