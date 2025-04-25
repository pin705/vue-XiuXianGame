<template>
  <div class="w-full max-w-4xl">
    <div class="overflow-x-auto shadow-lg rounded-lg overflow-auto h-[calc(100vh_-_180px)]">
      <table class="w-full table-auto">
        <thead>
          <tr class="text-white">
            <th class="px-4 py-3 text-left text-sm font-semibold">
              Hạng
            </th>
            <th class="px-4 py-3 text-left text-sm font-semibold">
              Tên
            </th>
            <th class="px-4 py-3 text-left text-sm font-semibold">
              Cấp Độ
            </th>
            <th class="px-4 py-3 text-left text-sm font-semibold">
              Sức mạnh
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(player, index) in players"
            :key="player.id"
            class="border-b border-gray-200 dark:border-gray-700"
          >
            <td class="px-4 py-3 text-sm">
              <span>
                {{ index + 1 }}
              </span>
            </td>
            <td class="px-4 py-3 text-sm">
              {{ player.name }}
            </td>
            <td class="px-4 py-3 text-sm">
              {{ $levelNames(player.level) }}
            </td>
            <td class="px-4 py-3 text-sm">
              {{ $formatNumberToChineseUnit(player.score) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { useMainStore } from '@/plugins/store';
import { onMounted, ref } from 'vue';


const store = useMainStore()
const players = ref(null)
onMounted(async () => {
  const fetcher = await getPlayers()
    players.value = fetcher.sort((a, b) => {
      return b.score - a.score
    })
})

const getPlayers = async () => {
  return await store.getAllPlayerItems()
}
</script>
