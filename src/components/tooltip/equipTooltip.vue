<template>
  <div class="attributes">
    <div class="attribute-box">
      <div class="tag attribute">
        Sinh lực: {{ $formatNumberToChineseUnit(strengthenInfo.health) }}
      </div>
      <div class="tag attribute">
        Tấn công: {{ $formatNumberToChineseUnit(strengthenInfo.attack) }}
      </div>
      <div class="tag attribute">
        Phòng thủ: {{ $formatNumberToChineseUnit(strengthenInfo.defense) }}
      </div>
      <div class="tag attribute">
        Tỉ lệ chí mạng: {{ strengthenInfo?.critical > 0 ? (strengthenInfo?.critical * 100 > 100 ? 100 : (strengthenInfo?.critical * 100).toFixed(2)) : 0 }}%
      </div>
      <div class="tag attribute">
        Tỉ lệ né tránh: {{ strengthenInfo.dodge > 0 ? (strengthenInfo.dodge * 100 > 100 ? 100 : (strengthenInfo.dodge * 100).toFixed(2)) : 0 }}%
      </div>
      <div class="tag attribute">
        Cấp luyện khí: {{ strengthenInfo.strengthen ?? 0 }}
      </div>
      <div class="tag attribute">
        Điểm trang bị: {{ $formatNumberToChineseUnit(strengthenInfo.score) }}
      </div>
      <div
        class="tag attribute"
        @click="$notifys({title: 'Cách nhận', message: 'Phân giải trang bị có thể nhận được', position: 'top-left'})"
        v-if="calculateCost"
      >
        Đá luyện khí sở hữu: {{ $formatNumberToChineseUnit(player.props.strengtheningStone) }}
      </div>
      <div
        class="tag attribute"
        v-if="calculateCost"
      >
        Tiêu hao luyện khí: {{ calculateCost }}
      </div>
      <div
        class="tag attribute"
        v-if="calculateEnhanceSuccessRate"
      >
        Tỉ lệ thành công: {{ (calculateEnhanceSuccessRate * 100).toFixed(2) }}%
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WeaponTooltip',
  props: {
    calculateCost: {},
    calculateEnhanceSuccessRate: {},
    player: {},
    strengthenInfo: {}
  }
}
</script>

<style scoped>
.attribute {
  width: calc(50% - 8px);
  margin: 4px;
  overflow: auto hidden;
}

.attribute-box {
  display: flex;
  flex-wrap: wrap;
}

/* Luyện khí popup */

.click-box button {
  margin-top: 10px;
  width: 100%;
}

/* Thông tin trang bị */

.collapse p,
.monsterinfo-box p {
  display: contents;
}

/* So sánh thuộc tính cơ bản */

/* So sánh thuộc tính */

/* Popup người mới */

.newbieinfo-box p {
  margin-bottom: 10px;
}

@media only screen and (max-width: 768px) {

}
</style>

<style>
@media only screen and (max-width: 768px) {

  /* Popup người mới */
}

/* Nút tải lên */
</style>
