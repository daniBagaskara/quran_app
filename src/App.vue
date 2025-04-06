<template>
  <div class="min-h-screen bg-gray-100 text-gray-800">
    <Suspense>
      <router-view />
      <template #fallback>
        <button type="button" class="bg-indigo-500 ..." disabled>
          <svg class="mr-3 size-5 animate-spin ..." viewBox="0 0 24 24">
            <!-- ... -->
          </svg>
          Processing…
        </button>
      </template>
    </Suspense>
  </div>
</template>
