<template>
  <div ref="container">
    <div
      class="container"
      :class="$style.zoomable"
      @mousedown="onMouseDown"
      @dblclick="mouse.onDblClick"
      @touchstart="touch.onTouchStart"
      @wheel="wheel.onWheel"
      @mouseleave="onMouseLeave"
      @mouseenter="onMouseEnter"
    >
      <ControllButtons
        v-if="props.enableControllButton"
        @button-home="button.onHome"
        @button-pan="button.onPan"
        @button-zoom="button.onZoom"
        @mousedown="updateHideOverlay(true)"
      />
      <div :class="$style.container" ref="transformContainer" />
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import Vue, { computed, ref, type Ref, onMounted, watch } from 'vue';
import { useMouse, useTouch, useWheel, useButtons } from '@/hooks';
import ControllButtons from './ControllButtons.vue';
import ScrollOverlay from './ScrollOverlay.vue';
import type { ZoomableEvent } from '@/interfaces';

const hideOverlay: Ref<boolean> = ref(true);

const emitNative = defineEmits(['panned', 'zoom', 'update:zoom', 'update:pan']);
const props = defineProps({
  zoom: {
    type: Number,
    default: null,
  },

  pan: {
    type: Object,
    default: null,
  },
  selector: {
    type: String,
    default: '* > *',
  },
  maxZoom: {
    type: Number,
    default: 3,
  },
  minZoom: {
    type: Number,
    default: 0.5,
  },
  initialPanX: {
    type: Number,
    default: 0,
  },
  initialPanY: {
    type: Number,
    default: 0,
  },
  initialZoom: {
    type: Number,
    default: 0.5,
  },
  dblClickZoomStep: {
    type: Number,
    default: 0.4,
  },
  wheelZoomStep: {
    type: Number,
    default: 0.05,
  },
  panEnabled: {
    type: Boolean,
    default: true,
  },
  zoomEnabled: {
    type: Boolean,
    default: true,
  },
  mouseEnabled: {
    type: Boolean,
    default: true,
  },
  touchEnabled: {
    type: Boolean,
    default: true,
  },
  dblClickEnabled: {
    type: Boolean,
    default: true,
  },
  wheelEnabled: {
    type: Boolean,
    default: true,
  },
  enableControllButton: {
    type: Boolean,
    default: false,
  },
  buttonPanStep: {
    type: Number,
    default: 15,
  },
  buttonZoomStep: {
    type: Number,
    default: 0.1,
  },
  enableWheelOnKey: {
    type: String,
    default: undefined,
  },
});

const container = ref();
const transformContainer = ref();
const transformTarget = computed<HTMLElement>(() => transformContainer.value);

const zoom = ref(props.minZoom);
if (props.initialZoom >= props.minZoom && props.initialZoom <= props.maxZoom) {
  zoom.value = props.initialZoom;
}
if (props.zoom) zoom.value = props.zoom;

const pan = ref({
  x: props.pan != null ? props.pan.x : props.initialPanX,
  y: props.pan != null ? props.pan.y : props.initialPanY,
});

watch(
  () => props.zoom,
  () => {
    if (!isNaN(props.zoom)) {
      zoom.value = props.zoom;
    }
  },
);

watch(
  () => props.pan,
  () => {
    if (props.pan) {
      pan.value.x = props.pan.x;
      pan.value.y = props.pan.y;
    }
  },
  { deep: true },
);

function emit(name: string, event: ZoomableEvent) {
  if (name === 'zoom') {
    emitNative('update:zoom', event.zoom);
  } else if (name === 'panned') {
    emitNative('update:pan', event.pan);
  }
  emitNative(name as any, event);
}

const transform = computed(() => {
  return `translate(${pan.value.x}px, ${pan.value.y}px) scale(${zoom.value})`;
});

function setTransform() {
  if (!transformTarget.value) return;
  transformTarget.value.style.transform = transform.value;
  transformTarget.value.style.transition = 'transform 0.06s ease-out';
}

watch(
  transform,
  () => {
    setTransform();
  },
  {
    flush: 'post',
  },
);

onMounted(() => {
  transformContainer.value?.appendChild(container.value?.querySelector(props.selector));
  // const placeholder = document.createElement('div');
  // const scrollOverlayApp = createApp(ScrollOverlay, { enableWheelOnKey: props.enableWheelOnKey });
  //
  // // needs to be injected before it is mounted
  // scrollOverlayApp.provide('hideOverlay', { hideOverlay });
  //
  // scrollOverlayApp.mount(placeholder);
  // container.value.appendChild(placeholder);

  setTransform();
});

const pressedKeys: Ref<Set<String>> = ref(new Set<String>());

onMounted(() => {
  window.addEventListener(
    'wheel',
    event => {
      if (!isInContainer.value || props.enableWheelOnKey !== 'Control') return;
      if (event.ctrlKey) event.preventDefault();
    },
    { passive: false },
  );

  // track the keys, which are currently pressed
  document.addEventListener('keydown', event => {
    pressedKeys.value.add(event.key);
    if (event.key === props.enableWheelOnKey) hideOverlay.value = true;
  });
  document.addEventListener('keyup', event => {
    pressedKeys.value.deconste(event.key);
  });
});

// track if the mouse is in the container
const isInContainer = ref(false);

// track when the mouse leaves, to then hide the overlay
function onMouseEnter() {
  isInContainer.value = true;
}

function onMouseLeave() {
  hideOverlay.value = true;
  isInContainer.value = false;
}

function showOverlay() {
  hideOverlay.value = false;
}

function updateHideOverlay(newHideOverlay: boolean) {
  hideOverlay.value = newHideOverlay;
}

const mouse = useMouse(props, emit, pan, zoom, updateHideOverlay);
const touch = useTouch(props, emit, pan, zoom, updateHideOverlay);
const wheel = useWheel(props, emit, pan, zoom, pressedKeys, updateHideOverlay);
const button = useButtons(props, emit, pan, zoom, updateHideOverlay);

function onMouseDown(event: MouseEvent) {
  updateHideOverlay(true);
  mouse.onMouseDown(event);
}
</script>

<style module>
.container {
  position: relative;

  transition: transform 0.1s ease-out;

  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.zoomable {
  overflow: hidden;
}
</style>
