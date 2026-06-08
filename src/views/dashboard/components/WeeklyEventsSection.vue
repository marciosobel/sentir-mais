<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  events: string[]
}>()

const hasEvents = computed(() => props.events.length > 0)
</script>

<template>
  <section class="events-section">
    <h2>Principais eventos</h2>

    <div v-if="hasEvents" class="events-grid">
      <article v-for="(event, index) in events" :key="`${index}-${event}`" class="card event-card">
        <p>{{ event }}</p>
      </article>
    </div>

    <p v-else class="empty-state">Sem eventos principais nesta semana.</p>
  </section>
</template>

<style scoped>
.events-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.events-section h2 {
  margin: 0;
  font-size: 1.125rem;
}

.events-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.85rem;
}

.event-card {
  flex: 1 1 220px;
  min-height: 96px;
  padding: 1rem;
  display: flex;
  align-items: center;
}

.event-card p {
  margin: 0;
  line-height: 1.45;
}

.empty-state {
  margin: 0;
  opacity: 0.75;
}
</style>
