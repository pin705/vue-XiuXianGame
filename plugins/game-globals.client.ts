import { ElNotification, ElMessageBox } from 'element-plus'

export default defineNuxtPlugin((nuxtApp) => {
  // Add global properties that the old game uses
  const maxLv = 144

  nuxtApp.vueApp.config.globalProperties.$maxLv = maxLv

  nuxtApp.vueApp.config.globalProperties.$notifys = (data: any) => {
    ElNotification.closeAll()
    ElNotification(data)
  }

  nuxtApp.vueApp.config.globalProperties.$levelNames = (level: number) => {
    const levelsPerStage = 9
    const stageIndex = Math.floor((level - 1) / levelsPerStage)
    const stageLevel = (level - 1) % levelsPerStage + 1
    const numberName: Record<number, string> = {
      1: 'Một', 2: 'Hai', 3: 'Ba', 4: 'Bốn',
      5: 'Năm', 6: 'Sáu', 7: 'Bảy', 8: 'Tám', 9: 'Chín'
    }
    const stageNames = [
      'Trúc Cơ', 'Khai Quang', 'Thai Tức', 'Tịch Cốc',
      'Kim Đan', 'Nguyên Anh', 'Xuất Khiếu', 'Phân Thần',
      'Hợp Thể', 'Đại Thừa', 'Độ Kiếp', 'Địa Tiên',
      'Thiên Tiên', 'Kim Tiên', 'Đại La Kim Tiên', 'Cửu Thiên Huyền Tiên'
    ]
    if (level === 0) return 'Phàm Nhân'
    else if (level >= maxLv) return 'Cửu Thiên Huyền Tiên Chín Tầng'
    else return `${stageNames[stageIndex]} ${numberName[stageLevel]} Tầng`
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
  }

  nuxtApp.vueApp.config.globalProperties.$dropdownTypeObject = dropdownTypeObject
  nuxtApp.vueApp.config.globalProperties.$dropdownType = Object.entries(dropdownTypeObject).map(([type, name]) => ({ type, name }))

  nuxtApp.vueApp.config.globalProperties.$genre = {
    sutra: 'Pháp Khí',
    armor: 'Hộ Giáp',
    weapon: 'Thần Binh',
    accessory: 'Linh Bảo'
  }

  nuxtApp.vueApp.config.globalProperties.$isAPP = false

  nuxtApp.vueApp.config.globalProperties.$levels = {
    info: 'Hoàng Giai',
    pink: 'Tiên Giai',
    danger: 'Thần Giai',
    purple: 'Thiên Giai',
    primary: 'Địa Giai',
    success: 'Huyền Giai',
    warning: 'Đế Giai',
  }

  nuxtApp.vueApp.config.globalProperties.$propItemNames = {
    money: { name: 'Linh Thạch', desc: 'Có thể thu được bằng cách phân giải trang bị' },
    flying: { name: 'Truyền Tống Phù', desc: 'Có thể thu được bằng cách tặng quà cho NPC' },
    rootBone: { name: 'Ngộ Tính Đan', desc: 'Có thể thu được bằng cách đánh bại BOSS thế giới' },
    qingyuan: { name: 'Tình Duyên', desc: 'Có thể thu được bằng cách tặng quà cho NPC' },
    currency: { name: 'Hồng Mông Thạch', desc: 'Có thể thu được bằng cách đánh bại BOSS thế giới' },
    cultivateDan: { name: 'Bồi Dưỡng Đan', desc: 'Có thể thu được bằng cách thám hiểm' },
    strengtheningStone: { name: 'Luyện Khí Thạch', desc: 'Có thể thu được bằng cách phân giải trang bị' }
  }

  nuxtApp.vueApp.config.globalProperties.$formatNumberToChineseUnit = (number: number) => {
    number = number > 0 ? Math.floor(number) : 0
    const units = ['', 'Vạn', 'Ức', 'Triệu', 'Kinh', 'Hợi', 'Tử', 'Nhương', 'Câu', 'Giản', 'Chính', 'Tái', 'Cực']
    const bigTenThousand = BigInt(10000)
    let num = BigInt(number)
    let unitIndex = 0
    let additionalUnits = ''
    while (num >= bigTenThousand) {
      num /= bigTenThousand
      unitIndex++
      if (unitIndex >= units.length - 1) {
        additionalUnits += 'Cực'
        unitIndex = 0
      }
    }
    return `${num.toString()} ${units[unitIndex]} ${additionalUnits}`
  }

  nuxtApp.vueApp.config.globalProperties.$smoothScrollToBottom = (element: HTMLElement) => {
    const start = element.scrollTop
    const end = element.scrollHeight
    const duration = 300
    const startTime = performance.now()
    const scroll = () => {
      const currentTime = performance.now()
      const timeElapsed = currentTime - startTime
      const progress = Math.min(timeElapsed / duration, 1)
      element.scrollTop = start + (end - start) * easeInOutCubic(progress)
      if (progress < 1) window.requestAnimationFrame(scroll)
    }
    const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
    window.requestAnimationFrame(scroll)
  }

  // Helper to get confirm dialog
  nuxtApp.vueApp.config.globalProperties.$confirm = (message: string, title: string, options: any) => {
    return ElMessageBox.confirm(message, title, options)
  }

  // Helper to get prompt dialog  
  nuxtApp.vueApp.config.globalProperties.$prompt = (message: string, title: string, options: any) => {
    return ElMessageBox.prompt(message, title, options)
  }
})
