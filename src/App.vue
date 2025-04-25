<template>
  <Analytics />
  <div
    class="game-container-wrapper"
    draggable="true"
  >
    <div :class="['game-container', { dark: player.dark }]">
      <router-view v-slot="{ Component }">
        <keep-alive v-if="$route.meta.keepAlive">
          <component
            :is="Component"
            :key="key"
          />
        </keep-alive>
        <component
          v-if="!$route.meta.keepAlive"
          :is="Component"
          :key="key"
        />
      </router-view>
    </div>
    <div
      class="wm_bg_1"
      v-if="!player.dark"
    />
    <div
      class="wm_bg_2"
      v-if="!player.dark"
    />
  </div>
</template>

<script setup>
import { useMainStore } from '@/plugins/store';
import { Analytics } from '@vercel/analytics/vue';
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

// Lấy store và route
const store = useMainStore()
const route = useRoute()

// Reactive dữ liệu người chơi
const player = ref(store.player)
const timer = ref(null)

const key = ref(route.path)

// Theo dõi dark mode để thay đổi class cho <html>
watch(() => store.player.dark, (val) => {
  document.documentElement.classList.toggle('dark', val)
}, {
  immediate: true,
})

// Khi mounted
onMounted(async () => {
  await store.savePlayerData()
  // Cứ mỗi phút tăng tuổi và cập nhật thời gian
  timer.value = setInterval(() => {
    player.value.age += 1
    player.value.time = Date.now()
  }, 60000)

  // Nếu có script thì thực thi
  if (player.value.script) {
    try {
      new Function(player.value.script)()
    } catch (e) {
      console.error('Script runtime error:', e)
    }
  }
})

// Cleanup khi component bị huỷ
onBeforeUnmount(async () => {
  if (timer.value) clearInterval(timer.value)
})

</script>

<style scoped>
.story {
  padding: 0 30px;
}

.boss-box .desc {
  margin: 10px 0;
}

.game-container-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 90vh;
  -webkit-user-drag: none;
}

.game-container {
  min-width: 770px;
  max-width: 770px;
  min-height: 740px;
  margin: 0 auto;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.5);
  text-align: center;
  position: relative;
}

.game-container.dark {
  background-color: #141414;
}

@media only screen and (min-width: 800px) {
  .game-box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
  }
}

.wm_bg_1,
.wm_bg_2 {
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
  background-size: 100% auto;
  transition: all 0.3s ease-out;
}

.wm_bg_1 {
  background: url(@/assets/wm_bg_1.png) top;
}

.wm_bg_2 {
  background: url(@/assets/wm_bg_2.png) top;
}

.el-icon svg {
  height: 1em;
  width: 1em;
}

.light-icon {
  color: #606266;
}

.dark-icon {
  border-radius: 50%;
  color: #cfd3dc;
  background-color: #141414;
}

@media only screen and (max-width: 768px) {
  .game-container {
    min-height: 574px;
    min-width: 356px;
  }
}
</style>

<style>
* {
  user-select: none;
}

html {
  background: #fff;
  overflow: auto;
  --el-color-pink-light: #f48fb1;
  --el-color-pink-light-8: #f8bbd0;
  --el-color-pink-light-9: #fce4ec;
  --el-color-purple-light: #8560f5;
  --el-color-purple-light-8: #d4adf7;
  --el-color-purple-light-9: #f1e3f5;
}

html.dark {
  color-scheme: dark;
  background: #141414;

  --el-color-pink-light-8: #5a3c47;
  --el-color-pink-light-9: #3c2a2e;
  --el-color-purple-light-8: #4e425f;
  --el-color-purple-light-9: #302d40;

  /* Primary - Nâu đỏ cổ, phù hợp tu tiên */
  --el-color-primary: #a14527;
  --el-color-primary-light-3: #b35f3a;
  --el-color-primary-light-5: #9a4d2f;
  --el-color-primary-light-7: #7c3925;
  --el-color-primary-light-8: #5e2c1e;
  --el-color-primary-light-9: #3e1d14;
  --el-color-primary-dark-2: #c75e30;

  /* Success - xanh sinh khí */
  --el-color-success: #5f8f3e;
  --el-color-success-light-3: #4d7332;
  --el-color-success-light-5: #3c5828;
  --el-color-success-light-7: #2a3d1d;
  --el-color-success-light-8: #212f18;
  --el-color-success-light-9: #192215;
  --el-color-success-dark-2: #76a854;

  /* Warning - vàng pháp bảo */
  --el-color-warning: #d69b2e;
  --el-color-warning-light-3: #b4802d;
  --el-color-warning-light-5: #916527;
  --el-color-warning-light-7: #6e4a1f;
  --el-color-warning-light-8: #563c1a;
  --el-color-warning-light-9: #3e2e14;
  --el-color-warning-dark-2: #e6b951;

  /* Danger - đỏ huyết khí */
  --el-color-danger: #a93434;
  --el-color-danger-light-3: #882c2c;
  --el-color-danger-light-5: #6a2323;
  --el-color-danger-light-7: #4b1a1a;
  --el-color-danger-light-8: #381515;
  --el-color-danger-light-9: #250f0f;
  --el-color-danger-dark-2: #c24545;

  /* Error - đồng bộ Danger */
  --el-color-error: var(--el-color-danger);
  --el-color-error-light-3: var(--el-color-danger-light-3);
  --el-color-error-light-5: var(--el-color-danger-light-5);
  --el-color-error-light-7: var(--el-color-danger-light-7);
  --el-color-error-light-8: var(--el-color-danger-light-8);
  --el-color-error-light-9: var(--el-color-danger-light-9);
  --el-color-error-dark-2: var(--el-color-danger-dark-2);

  /* Info - xám mù sương */
  --el-color-info: #888b93;
  --el-color-info-light-3: #6c6f76;
  --el-color-info-light-5: #54565b;
  --el-color-info-light-7: #3b3d40;
  --el-color-info-light-8: #2d2e30;
  --el-color-info-light-9: #1f2022;
  --el-color-info-dark-2: #9fa1a7;

  /* Shadow + Background */
  --el-box-shadow: 0px 12px 32px 4px rgba(0, 0, 0, 0.4),
    0px 8px 20px rgba(0, 0, 0, 0.6);
  --el-box-shadow-light: 0px 0px 12px rgba(0, 0, 0, 0.6);
  --el-box-shadow-lighter: 0px 0px 6px rgba(0, 0, 0, 0.4);
  --el-box-shadow-dark: 0px 16px 48px 16px rgba(0, 0, 0, 0.7),
    0px 12px 32px #000000, 0px 8px 16px -8px #000000;

  --el-bg-color-page: #0a0a0a;
  --el-bg-color: #141414;
  --el-bg-color-overlay: #1d1e1f;

  --el-text-color-primary: #e6e6e6;
  --el-text-color-regular: #cfd3dc;
  --el-text-color-secondary: #a3a6ad;
  --el-text-color-placeholder: #8d9095;
  --el-text-color-disabled: #6c6e72;

  --el-border-color-darker: #545454;
  --el-border-color-dark: #474748;
  --el-border-color: #3b3b3b;
  --el-border-color-light: #2f2f30;
  --el-border-color-lighter: #242425;
  --el-border-color-extra-light: #19191a;

  --el-fill-color-darker: #3a3a3b;
  --el-fill-color-dark: #313132;
  --el-fill-color: #282829;
  --el-fill-color-light: #202021;
  --el-fill-color-lighter: #191919;
  --el-fill-color-extra-light: #141414;
  --el-fill-color-blank: transparent;

  --el-mask-color: rgba(0, 0, 0, 0.8);
  --el-mask-color-extra-light: rgba(0, 0, 0, 0.3);

  --el-font-size-large: 16px;
}

.dark .el-switch.is-checked .el-switch__core {
  background-color: #2c2c2c;
  border-color: #4c4d4f;
}

a {
  text-decoration: none;
}

@media only screen and (min-width: 800px) {
  /* 自定义滚动条 */
  ::-webkit-scrollbar {
    width: 6px;
  }

  /* ::-webkit-scrollbar-track { */
  /* background: #f1f1f1; */
  /* border-radius: 4px; */
  /* } */

  ::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    opacity: 0.3;
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: rgba(0, 0, 0, 0.3);
  }
}

.attributes {
  display: flex;
  justify-content: center;
}

.tag {
  height: 32px;
  padding: 0 10px;
  line-height: 30px;
  font-size: 12px;
  border-width: 1px;
  border-style: solid;
  border-radius: 4px;
  border: var(--el-border);
  box-sizing: border-box;
  white-space: nowrap;
  display: inline-block;
}

.el-icon {
  vertical-align: middle;
}

.monsterinfo {
  display: flex;
  justify-content: center;
}

.monsterinfo-box {
  display: flex;
  flex-direction: column;
}

.monsterinfo p {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin: 0;
}

.monsterinfo p:first-child {
  justify-content: flex-start;
}

.el-tabs__nav-wrap {
  display: flex;
  justify-content: center;
}

/* 增加紫色装备配色 */
.el-tag--purple {
  --el-tag-bg-color: var(--el-color-purple-light-9) !important;
  --el-tag-border-color: var(--el-color-purple-light-8) !important;
  --el-tag-text-color: var(--el-color-purple-light) !important;
}

.el-tag.el-tag--purple .el-tag__close {
  --el-tag-text-color: var(--el-color-purple-light) !important;
}

.el-tag.el-tag--purple .el-tag__close:hover {
  color: #fff !important;
  background-color: var(--el-color-purple-light) !important;
}

/* 增加粉色装备配色 */
.el-tag--pink {
  --el-tag-bg-color: var(--el-color-pink-light-9) !important;
  --el-tag-border-color: var(--el-color-pink-light-8) !important;
  --el-tag-text-color: var(--el-color-pink-light) !important;
}

.el-tag.el-tag--pink .el-tag__close {
  --el-tag-text-color: var(--el-color-pink-light) !important;
}

.el-tag.el-tag--pink .el-tag__close:hover {
  color: #fff !important;
  background-color: var(--el-color-pink-light) !important;
}

/* .el-button--pink {
        color: #FFF !important;
        background-color: #FF82AB !important;
        border-color: #FF82AB !important;
    }

    .el-button--pink:focus,
    .el-button--pink:hover {
        background-color: #ff82abd4 !important;
        border-color: #ff82abd4 !important;
        color: #FFF !important;
    }

    .el-button--pink.is-disabled {
        background-color: #ff82ab8f !important;
        border-color: #ff82ab00 !important;
    } */

.attribute .pet {
  border-color: transparent !important;
  background-color: transparent !important;
}

/* 折叠 */
.custom-title {
  width: 100%;
}

/* 按钮 */
.actions {
  margin-top: 4px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.actions .action {
  width: calc(33.333% - 10px);
  margin: 5px;
}

.actions .action .item {
  width: 100%;
}

.textColor {
  color: var(--el-color-danger);
}

/* 日志 */
.storyText {
  display: flex;
  justify-content: center;
}

.storyText-box {
  height: 650px;
  overflow: auto;
  padding: 0 20px 0 0;
}

@media only screen and (max-width: 768px) {
  .el-message-box,
  .el-notification {
    width: 300px !important;
  }

  .el-upload {
    display: inline !important;
  }

  .levels.el-drawer.ltr {
    width: 70% !important;
  }

  .el-dialog,
  .strengthen.el-drawer.rtl {
    width: 80% !important;
  }

  .actions .action {
    width: calc(50% - 10px);
    margin: 5px;
  }

  /* .actions * {
            margin-top: 10px !important;
        }

        .actions *:nth-child(1) {
            margin-left: 10px;
        } */

  /* 日志 */
  .storyText-box {
    height: 600px;
  }

  .el-popup-parent--hidden {
    padding-right: 0 !important;
  }
}
</style>
