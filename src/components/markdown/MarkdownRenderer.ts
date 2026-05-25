import { createMarkdownRenderer } from 'vue-mdr'
import ARenderer from './nodes/ARenderer.vue'

export const MarkdownRenderer = createMarkdownRenderer({
  componentsMap: {
    a: ARenderer,
  },
})
