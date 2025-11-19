import router from '@/plugins/router';
import { useMainStore } from '@/stores/mainStore';
import { useAuthStore } from '@/stores/auth';
import { usePlayerStore } from '@/stores/player';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import ElementPlus, { ElNotification } from 'element-plus';
import 'element-plus/dist/index.css';
import 'normalize.css/normalize.css';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(pinia);

// Initialize stores
const store = useMainStore();
const authStore = useAuthStore();
const playerStore = usePlayerStore();

// Make stores available globally
app.config.productionTip = false;
app.config.globalProperties.$store = store;
app.config.globalProperties.$authStore = authStore;
app.config.globalProperties.$playerStore = playerStore;

app.config.globalProperties.$notifys = (data) => {
    ElNotification.closeAll();
    ElNotification(data);
};

const maxLv = 144;
app.config.globalProperties.$maxLv = maxLv;

app.config.globalProperties.$levelNames = (level) => {
    const levelsPerStage = 9;
    const stageIndex = Math.floor((level - 1) / levelsPerStage);
    const stageLevel = (level - 1) % levelsPerStage + 1;
    const numberName = {
        1: 'Một', 2: 'Hai', 3: 'Ba', 4: 'Bốn',
        5: 'Năm', 6: 'Sáu', 7: 'Bảy', 8: 'Tám', 9: 'Chín'
    };
    const stageNames = [
        'Trúc Cơ', 'Khai Quang', 'Thai Tức', 'Tịch Cốc',
        'Kim Đan', 'Nguyên Anh', 'Xuất Khiếu', 'Phân Thần',
        'Hợp Thể', 'Đại Thừa', 'Độ Kiếp', 'Địa Tiên',
        'Thiên Tiên', 'Kim Tiên', 'Đại La Kim Tiên', 'Cửu Thiên Huyền Tiên'
    ];
    if (level === 0) return 'Phàm Nhân';
    else if (level >= maxLv) return 'Cửu Thiên Huyền Tiên Chín Tầng';
    else return `${stageNames[stageIndex]} ${numberName[stageLevel]} Tầng`;
}

const dropdownTypeObject = {
    id: 'Thời Gian',
    level: 'Cảnh Giới',
    score: 'Điểm Số',
    health: 'Khí Huyết',
    attack: 'Công Kích',
    defense: 'Phòng Thủ',
    critical: 'Bạo Kích',
    dodge: 'Né Tránh'
};

app.config.globalProperties.$dropdownTypeObject = dropdownTypeObject;
app.config.globalProperties.$dropdownType = Object.entries(dropdownTypeObject).map(([type, name]) => ({ type, name }));

app.config.globalProperties.$genre = {
    sutra: 'Pháp Khí',
    armor: 'Hộ Giáp',
    weapon: 'Thần Binh',
    accessory: 'Linh Bảo'
};

app.config.globalProperties.$isAPP = location.host == 'appassets.androidplatform.net';

app.config.globalProperties.$levels = {
    info: 'Hoàng Giai',
    pink: 'Tiên Giai',
    danger: 'Thần Giai',
    purple: 'Thiên Giai',
    primary: 'Địa Giai',
    success: 'Huyền Giai',
    warning: 'Đế Giai',
};

app.config.globalProperties.$propItemNames = {
    money: { name: 'Linh Thạch', desc: 'Có thể thu được bằng cách phân giải trang bị' },
    flying: { name: 'Truyền Tống Phù', desc: 'Có thể thu được bằng cách tặng quà cho NPC' },
    rootBone: { name: 'Ngộ Tính Đan', desc: 'Có thể thu được bằng cách đánh bại BOSS thế giới' },
    qingyuan: { name: 'Tình Duyên', desc: 'Có thể thu được bằng cách tặng quà cho NPC' },
    currency: { name: 'Hồng Mông Thạch', desc: 'Có thể thu được bằng cách đánh bại BOSS thế giới' },
    cultivateDan: { name: 'Bồi Dưỡng Đan', desc: 'Có thể thu được bằng cách thám hiểm' },
    strengtheningStone: { name: 'Luyện Khí Thạch', desc: 'Có thể thu được bằng cách phân giải trang bị' }
};

app.config.globalProperties.$formatNumberToChineseUnit = (number) => {
    number = number > 0 ? Math.floor(number) : 0;
    const units = ['', 'Vạn', 'Ức', 'Triệu', 'Kinh', 'Hợi', 'Tử', 'Nhương', 'Câu', 'Giản', 'Chính', 'Tái', 'Cực'];
    const bigTenThousand = window.BigInt(10000);
    let num = window.BigInt(number);
    let unitIndex = 0;
    let additionalUnits = '';
    while (num >= bigTenThousand) {
        num /= bigTenThousand;
        unitIndex++;
        if (unitIndex >= units.length - 1) {
            additionalUnits += 'Cực';
            unitIndex = 0;
        }
    }
    return `${num.toString()} ${units[unitIndex]} ${additionalUnits}`;
};

app.config.globalProperties.$smoothScrollToBottom = (element) => {
    const start = element.scrollTop;
    const end = element.scrollHeight;
    const duration = 300;
    const startTime = performance.now();
    const scroll = () => {
        const currentTime = performance.now();
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        element.scrollTop = start + (end - start) * easeInOutCubic(progress);
        if (progress < 1) window.requestAnimationFrame(scroll);
    }
    const easeInOutCubic = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    window.requestAnimationFrame(scroll);
};

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}

app.use(router);
app.use(ElementPlus);

(async () => {
    await store.init()
  
    app.mount('#app')
  })()
