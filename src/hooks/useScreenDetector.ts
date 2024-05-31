import { ref, onMounted, onUnmounted, computed } from 'vue';

export const useScreenDetector = () => {
  const widthWindow = ref<number>(window.innerWidth);

  const handleWindowSizeChange = () => (widthWindow.value = window.innerWidth);

  onMounted(() => window.addEventListener('resize', handleWindowSizeChange));
  onUnmounted(() => window.removeEventListener('resize', handleWindowSizeChange));

  const isMobile = computed(() => widthWindow.value <= 768);
  const isTablet = computed(() => widthWindow.value <= 1280);
  const isDesktop = computed(() => widthWindow.value > 1280);

  return { isMobile, isTablet, isDesktop, width: widthWindow };
};
