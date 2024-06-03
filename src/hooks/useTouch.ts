import type { Ref } from 'vue';
import { reactive } from 'vue';
import type { ZoomableEvent } from '@/interfaces';

interface TouchXY {
  clientX: number;
  clientY: number;
}
export function useTouch(
  props: any,
  emit: any,
  pan: Ref<{ x: number; y: number }>,
  zoom: Ref<number>,
  setOverlay: Function,
) {
  let dragLoc = {
    x: 0,
    y: 0,
  };

  const state = reactive<{
    touch1: TouchXY | null;
    touch2: TouchXY | null;
    startZoom: number;
  }>({
    touch1: null,
    touch2: null,
    startZoom: zoom.value,
  });

  function onTouchStart(ev: TouchEvent) {
    if (!props.touchEnabled) return;
    const touch = ev.changedTouches.item(ev.changedTouches.length - 1);
    if (!touch) return;
    dragLoc = {
      x: touch.clientX,
      y: touch.clientY,
    };
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', (evEnd: TouchEvent) => {
      stopPinch();
      window.removeEventListener('touchmove', onTouchMove);
      // evEnd.cancelable && evEnd.preventDefault();
    });
  }

  function onTouchMove(ev: TouchEvent) {
    if (!props.panEnabled) return;
    const touch = ev.changedTouches.item(ev.changedTouches.length - 1);
    if (!touch) return;
    if (ev.touches.length === 2) {
      const [touch1, touch2] = ev.touches;
      if (!state.touch1 && !state.touch2) {
        state.touch1 = touch1;
        state.touch2 = touch2;
        state.startZoom = zoom.value;
      }
      ev.cancelable && ev.preventDefault();
      startPinch(ev.touches);
      return;
    } else {
      stopPinch();
    }
    const delta = {
      x: touch.clientX - dragLoc.x,
      y: touch.clientY - dragLoc.y,
    };
    pan.value = {
      x: pan.value.x + delta.x,
      y: pan.value.y + delta.y,
    };
    dragLoc = {
      x: touch.clientX,
      y: touch.clientY,
    };
    const event: ZoomableEvent = {
      zoom: zoom.value,
      pan: {
        x: pan.value.x,
        y: pan.value.y,
        deltaX: delta.x,
        deltaY: delta.y,
      },
      type: 'touch',
    };
    emit('panned', event);
    ev.preventDefault();
  }

  function startPinch(touches: TouchList) {
    const [currentTouch1, currentTouch2] = touches;
    const { touch1, touch2 } = state;
    const startDistance = getDistance(
      touch1?.clientX || 0,
      touch2?.clientX || 0,
      touch1?.clientY || 0,
      touch2?.clientY || 0,
    );
    const distance = getDistance(
      currentTouch1?.clientX,
      currentTouch2?.clientX,
      currentTouch1?.clientY,
      currentTouch2?.clientY,
    );
    zoom.value = state.startZoom * (distance / startDistance);
  }

  function getDistance(x1: number, x2: number, y1: number, y2: number) {
    const sqrtDistance = (x1 - x2) ** 2 + (y1 - y2) ** 2;
    return Math.sqrt(sqrtDistance);
  }

  function stopPinch(): void {
    const delta = {
      x: (state.touch1?.clientX || 0) - (state.touch2?.clientX || 0),
      y: (state.touch1?.clientY || 0) - (state.touch2?.clientY || 0),
    };
    state.touch1 = null;
    state.touch2 = null;
    state.startZoom = zoom.value;
    const event: ZoomableEvent = {
      zoom: zoom.value,
      pan: {
        x: pan.value.x,
        y: pan.value.y,
        deltaX: delta.x,
        deltaY: delta.y,
      },
      type: 'touch',
    };
    emit('stopPinch', event);
  }

  return {
    onTouchStart,
  };
}
