<template>
  <el-scrollbar
    always
    ref="scrollbarRef"
  >
    <div class="storyText">
      <div class="storyText-box">
        <div
          v-for="(item, index) in texts"
          :key="index"
          class="mb-2"
          @click="$emit('click', item)"
        >
          <tag
            size="small"
            class="mr-2"
          >
            {{ item.time }}
          </tag>
          <span v-html="item.message" />
        </div>
        <div ref="bottomRef" />
      </div>
    </div>
  </el-scrollbar>
</template>

<script setup>
import { defineProps, nextTick, ref, watch } from "vue";
const props = defineProps({
  texts: {
    type: Array,
    default: () => [],
  },
});

const scrollbarRef = ref(null);
const bottomRef = ref()
watch(
  () => props.texts,
  async () => {
    await nextTick()

    if (bottomRef.value && scrollbarRef.value) {
      bottomRef.value.scrollIntoView({ behavior: 'smooth' })
    }
  },
  { deep: true }
)
</script>

<style scoped>
.storyText {
  width: 100%;
}

.storyText-box {
  text-align: left;
  max-height: 300px;
  overflow-y: auto;
  padding: 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  margin-bottom: 20px;
  width: 100%;
  box-sizing: border-box;
  font-size: 14px;
}
</style>
