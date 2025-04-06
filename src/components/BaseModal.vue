<!-- components/BaseModal.vue -->
<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    @click.self="close"
  >
    <div class="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 relative">
      <button
        @click="close"
        class="absolute top-2 right-2 text-emerald-600 hover:text-emerald-800"
      >
        ✕
      </button>
      <slot />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: Boolean,
});
const emit = defineEmits(['update:modelValue']);

const close = () => {
  emit('update:modelValue', false);
};
</script>
