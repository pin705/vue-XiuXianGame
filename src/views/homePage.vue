<template>
  <div class="index">
    <div class="index-box">
      <!-- <div class="story mb-2">
        <p v-html="state.storyText" />
      </div> -->
      <div class="attributes">
        <div class="attribute-box">
          <div
            class="tag attribute"
            @click="editUserName"
          >
            Tên: {{ player.name }}
            <el-text
              v-if="player.currentTitle"
              type="danger"
            >
              [{{ player.currentTitle }}]
            </el-text>
            <el-icon>
              <EditPen />
            </el-icon>
          </div>
          <div class="tag attribute">
            Tuổi: {{ player.age }} tuổi
          </div>
          <div
            class="tag attribute"
            @click="isLevel = true"
          >
            Cảnh giới: {{ $levelNames(player.level) }} ({{
              player.reincarnation || 0
            }}
            chuyển)
            <el-icon>
              <Warning />
            </el-icon>
          </div>
          <div
            class="tag attribute"
            v-if="player.level >= $maxLv"
          >
            Tu vi: Đỉnh cao tột bậc
          </div>
          <div
            class="tag attribute"
            v-else
            @click="
              $notifys({
                title: 'Gợi ý',
                message: `Bạn còn cần ${$formatNumberToChineseUnit(
                  player.maxCultivation - player.cultivation
                )} điểm tu vi để đạt ${$levelNames(player.level + 1)}`,
              })
            "
          >
            Tu vi:
            {{
              calculatePercentageDifference(
                player.maxCultivation,
                player.cultivation
              )
            }}
            <el-icon>
              <Warning />
            </el-icon>
          </div>
          <div class="tag attribute">
            Khí huyết: {{ $formatNumberToChineseUnit(player.health) }} /
            {{ $formatNumberToChineseUnit(player.maxHealth) }}
            <el-icon
              v-if="player.points > 0"
              @click="attributePoints('health')"
            >
              <CirclePlus />
            </el-icon>
          </div>
          <div class="tag attribute">
            Công kích: {{ $formatNumberToChineseUnit(player.attack) }}
            <el-icon
              v-if="player.points > 0"
              @click="attributePoints('attack')"
            >
              <CirclePlus />
            </el-icon>
          </div>
          <div class="tag attribute">
            Phòng thủ: {{ $formatNumberToChineseUnit(player.defense) }}
            <el-icon
              v-if="player.points > 0"
              @click="attributePoints('defense')"
            >
              <CirclePlus />
            </el-icon>
          </div>
          <div class="tag attribute">
            Tỷ lệ né tránh:
            {{
              player.dodge > 0
                ? player.dodge * 100 > 100
                  ? 100
                  : (player.dodge * 100).toFixed(2)
                : 0
            }}%
          </div>
          <div class="tag attribute">
            Tỷ lệ bạo kích:
            {{
              player.critical > 0
                ? player.critical * 100 > 100
                  ? 100
                  : (player.critical * 100).toFixed(2)
                : 0
            }}%
          </div>
          <div class="tag attribute">
            Sức mạnh tổng thể: {{ $formatNumberToChineseUnit(player.score) }}
          </div>
          <div
            class="tag attribute"
            @click="
              $notifys({
                title: 'Cách nhận',
                message:
                  'Mỗi lần nâng cấp cảnh giới sẽ nhận được 3 điểm cảnh giới',
              })
            "
          >
            Điểm cảnh giới: {{ $formatNumberToChineseUnit(player.points) }}
            <el-icon>
              <Warning />
            </el-icon>
          </div>
          <div
            class="tag attribute"
            @click="
              $notifys({
                title: 'Cách nhận',
                message: 'Mỗi lần chuyển sinh sẽ tăng 50 dung lượng túi đồ',
              })
            "
          >
            Dung lượng túi đồ: {{ player.inventory.length }} /
            {{ player.backpackCapacity }}
            <el-icon>
              <Warning />
            </el-icon>
          </div>
        </div>
      </div>
      <div class="equip-box">
        <div class="tag !h-12 !flex items-center justify-center gap-2">
          <span class="w-1/2 flex flex-col items-start justify-center">
            <tag
              class="!whitespace-normal text-left"
              v-if="player.equipment.weapon?.name"
              :type="player.equipment.weapon?.quality"
              :closable="player.equipment.weapon?.name ? true : false"
              @close="equipmentClose('weapon')"
              size="large"
              @click="equipmentInfo(player.equipment['weapon']?.id, 'weapon')"
              @mouseenter="
                getEquipmentInfo(player.equipment['weapon']?.id, 'weapon')
              "
            >
              <el-text size="small"> [Thần binh] </el-text>
              {{ player.equipment.weapon?.name
              }}{{
                player.equipment.weapon?.strengthen
                  ? "+" + player.equipment.weapon?.strengthen
                  : ""
              }}
            </tag>
            <span v-else>
              <el-text size="small"> [Thần binh] </el-text> Chưa trang bị
            </span>
          </span>
          <span class="w-1/2 flex flex-col items-start justify-center">
            <tag
              class="!whitespace-normal text-left"
              size="large"
              v-if="player.equipment.armor?.name"
              :type="player.equipment.armor?.quality"
              :closable="player.equipment.armor?.name ? true : false"
              @close="equipmentClose('armor')"
              @click="equipmentInfo(player.equipment['armor']?.id, 'armor')"
              @mouseenter="
                getEquipmentInfo(player.equipment['armor']?.id, 'armor')
              "
            >
              <el-text size="small"> [Hộ giáp] </el-text>
              {{ player.equipment.armor?.name
              }}{{
                player.equipment.armor?.strengthen
                  ? "+" + player.equipment.armor?.strengthen
                  : ""
              }}
            </tag>
            <span v-else>
              <el-text size="small"> [Hộ giáp] </el-text> Chưa trang bị
            </span>
          </span>
        </div>
        <div
          class="tag !h-12 !flex flex-auto items-center justify-center gap-2 mt-2"
        >
          <span class="w-1/2 flex flex-col items-start justify-center">
            <tag
              size="large"
              class="!whitespace-normal text-left"
              v-if="player.equipment.accessory?.name"
              :type="player.equipment.accessory?.quality"
              :closable="!!player.equipment.accessory?.name"
              @close="equipmentClose('accessory')"
              @click="
                equipmentInfo(player.equipment['accessory']?.id, 'accessory')
              "
              @mouseenter="
                getEquipmentInfo(player.equipment['accessory']?.id, 'accessory')
              "
            >
              <el-text size="small"> [Pháp khí] </el-text>
              {{ player.equipment.accessory?.name
              }}{{
                player.equipment.accessory?.strengthen
                  ? "+" + player.equipment.accessory?.strengthen
                  : ""
              }}
            </tag>
            <span v-else>
              <el-text size="small"> [Pháp khí] </el-text> Chưa trang bị
            </span>
          </span>
          <span class="w-1/2 flex flex-col items-start justify-center">
            <tag
              size="large"
              class="!whitespace-normal text-left"
              v-if="player.equipment.sutra?.name"
              :type="player.equipment.sutra?.quality"
              :closable="!!player.equipment.sutra?.name"
              @close="equipmentClose(player.equipment['sutra']?.id, 'sutra')"
              @click="equipmentInfo(player.equipment['sutra']?.id, 'sutra')"
              @mouseenter="
                getEquipmentInfo(player.equipment['sutra']?.id, 'sutra')
              "
            >
              <el-text size="small"> [Pháp khi] </el-text>
              {{ player.equipment.sutra?.name
              }}{{
                player.equipment.sutra?.strengthen
                  ? "+" + player.equipment.sutra?.strengthen
                  : ""
              }}
            </tag>
            <span v-else>
              <el-text size="small"> [Pháp khi] </el-text> Chưa trang bị
            </span>
          </span>
        </div>
        <div class="tag !h-12 !flex items-center justify-center gap-2 my-2">
          <span class="w-1/2 flex flex-col items-start justify-center">
            <tag
              class="!whitespace-normal text-left"
              v-if="player.wife?.name"
              closable
              @close="wifeRevoke"
              @click="wifeItemShow = true"
              size="large"
            >
              <el-text size="small"> [Đạo lữ] </el-text>
              {{ player.wife?.name }}
            </tag>
            <span v-else>
              <el-text size="small"> [Đạo lữ] </el-text> Chưa trang bị
            </span>
          </span>
          <span class="w-1/2 flex flex-col items-start justify-center">
            <tag
              size="large"
              class="!whitespace-normal text-left"
              v-if="player.pet?.name"
              :type="computePetsLevel(player.pet?.level)"
              closable
              @close="petRetract"
              @click="state.petItemShow = true"
            >
              <el-text size="small"> [Linh sủng] </el-text>
              {{ player.pet?.name }}({{ $levelNames(player.pet.level) }})
            </tag>
            <span v-else>
              <el-text size="small"> [Linh sủng] </el-text> Chưa trang bị
            </span>
          </span>
        </div>
        <div class="tag inventory-box">
          <el-tabs
            v-model="state.inventoryActive"
            :stretch="true"
          >
            <el-tab-pane
              label="Tiên Đạo"
              name="tien_dao"
            >
              <CultivationPath />
            </el-tab-pane>
            <el-tab-pane
              label="Trang bị"
              name="equipment"
            >
              <el-dropdown
                trigger="click"
                @command="equipmentDropdown"
                v-if="player.inventory.length"
              >
                <span class="el-dropdown-link">
                  Sắp xếp trang bị
                  <el-icon>
                    <arrow-down />
                  </el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      :command="item.type"
                      v-for="(item, index) in $dropdownType"
                      :key="index"
                      :disabled="state.equipmentDropdownActive == item.type"
                    >
                      Theo {{ item.name }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
              <el-tabs v-model="state.equipmentActive">
                <el-tab-pane
                  :label="i.name"
                  :name="i.type"
                  v-for="(i, k) in state.backPackItem"
                  :key="k"
                >
                  <div class="inventory-content">
                    <div v-if="player.inventory.length">
                      <template
                        v-for="item in player.inventory"
                        :key="item.id"
                      >
                        <tag
                          class="inventory-item"
                          v-if="item.type == i.type"
                          :key="item.id"
                          :type="item.quality"
                          :closable="!item.lock"
                          @close="inventoryClose(item)"
                          @click="inventory(item.id, item.type)"
                          @mouseenter="getEquipmentInfo(item.id, item.type)"
                        >
                          <el-icon v-if="item.lock">
                            <Lock />
                          </el-icon>
                          <el-icon v-else>
                            <Unlock />
                          </el-icon>
                          {{ item?.name
                          }}{{ item?.strengthen ? "+" + item?.strengthen : "" }}
                        </tag>
                      </template>
                    </div>
                    <tag
                      type="success"
                      class="dialog-footer-button"
                      v-if="!player.isNewbie"
                      @click="newbiePack(4)"
                    >
                      Nhận gói quà tân thủ
                    </tag>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </el-tab-pane>
            <el-tab-pane
              label="Đạo cụ"
              name="props"
            >
              <div class="inventory-content">
                <template
                  v-for="(item, index) in sortedProps"
                  :key="index"
                >
                  <tag
                    type="primary"
                    class="inventory-item"
                    @click="
                      $notifys({
                        title: 'Cách nhận',
                        message: $propItemNames[item.name].desc,
                      })
                    "
                  >
                    {{ $propItemNames[item.name].name }}({{ item.num }})
                  </tag>
                </template>
              </div>
            </el-tab-pane>
            <el-tab-pane
              label="Linh sủng"
              name="pet"
            >
              <el-dropdown
                trigger="click"
                @command="petDropdown"
                v-if="player.pets.length"
              >
                <span class="el-dropdown-link">
                  Sắp xếp linh sủng
                  <el-icon>
                    <arrow-down />
                  </el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      :command="item.type"
                      v-for="(item, index) in $dropdownType"
                      :key="index"
                      :disabled="state.petDropdownActive == item.type"
                    >
                      Theo {{ item.name }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
              <div class="inventory-content">
                <template
                  v-for="(item, index) in player.pets"
                  :key="index"
                >
                  <tag
                    class="inventory-item"
                    :type="computePetsLevel(item.level)"
                    closable
                    @close="petClose(item)"
                    @click="petItemInfo(item)"
                  >
                    <el-icon v-if="item.lock">
                      <Lock />
                    </el-icon>
                    <el-icon v-else>
                      <Unlock />
                    </el-icon>
                    {{ item.name }}({{ $levelNames(item.level) }})
                  </tag>
                </template>
              </div>
            </el-tab-pane>
            <el-tab-pane
              label="Đạo lữ"
              name="wife"
            >
              <div class="inventory-content">
                <template
                  v-for="(item, index) in player.wifes"
                  :key="index"
                >
                  <tag
                    class="inventory-item"
                    @click="wifeItemInfo(item)"
                  >
                    {{ item.name }}
                  </tag>
                </template>
              </div>
            </el-tab-pane>
            <el-tab-pane
              label="Cửa hàng Hồng Mông"
              name="shop"
            >
              <div class="el-dropdown">
                <span
                  class="el-dropdown-link el-dropdown-selfdefine"
                  @click="refreshShop"
                >
                  Làm mới cửa hàng
                  <el-icon>
                    <Refresh />
                  </el-icon>
                </span>
              </div>
              <el-tabs
                v-model="state.shopActive"
                :stretch="true"
              >
                <el-tab-pane
                  :label="i.name"
                  :name="i.type"
                  v-for="(i, k) in player.shopData"
                  :key="k"
                >
                  <div class="inventory-content">
                    <template v-for="(item, index) in i.data">
                      <tag
                        class="inventory-item"
                        :type="item.quality"
                        v-if="item.type == i.type"
                        :key="index"
                        @click="shopItemInfo(item)"
                      >
                        {{ item.name }}
                      </tag>
                    </template>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <div class="actions">
        <div
          class="action"
          v-for="(action, index) in state.actions"
          :key="index"
        >
          <el-button
            class="item"
            :type="action.type ? action.type : ''"
            @click="action.handler"
          >
            {{ action.text }}
          </el-button>
        </div>
        <div class="action">
          <el-button
            class="item"
            @click="state.showRanking = true"
          >
            Vạn Tiên Bảng
          </el-button>
        </div>
        <div class="action">
          <el-button
            class="item"
            @click="state.show = true"
          >
            Cài đặt trò chơi
          </el-button>
        </div>
      </div>
    </div>
    <el-drawer
      title="Bảng cảnh giới tu tiên"
      v-model="state.isLevel"
      direction="ltr"
      class="levels"
    >
      <tag
        class="inventory-item"
        :type="
          player.level == index
            ? 'primary'
            : index > player.level
              ? 'danger'
              : 'success'
        "
        :key="index"
        v-for="(item, index) in $maxLv"
      >
        {{ $levelNames(item) }}
      </tag>
    </el-drawer>
    <el-drawer
      :title="player.wife.name"
      v-model="state.wifeItemShow"
      direction="rtl"
      class="strengthen"
    >
      <div class="strengthen-box">
        <div class="attributes">
          <div class="attribute-box">
            <div class="tag attribute">
              Cảnh giới: {{ $levelNames(player.wife.level) }}
            </div>
            <div class="tag attribute">
              Khí huyết: {{ $formatNumberToChineseUnit(player.wife.health) }}
            </div>
            <div class="tag attribute">
              Công kích: {{ $formatNumberToChineseUnit(player.wife.attack) }}
            </div>
            <div class="tag attribute">
              Phòng thủ: {{ $formatNumberToChineseUnit(player.wife.defense) }}
            </div>
            <div
              class="tag attribute"
              @click="
                $notifys({
                  title: 'Cách nhận',
                  message: 'Có thể nhận được bằng cách tặng quà cho NPC',
                  position: 'top-left',
                })
              "
            >
              Điểm tình duyên sở hữu:
              {{ $formatNumberToChineseUnit(player.props.qingyuan) }}
            </div>
            <div class="tag attribute">
              Tiêu hao nâng cấp: {{ player.wife.level * 10 }}
            </div>
          </div>
        </div>
        <div class="click-box">
          <el-button
            type="primary"
            @click="wifeUpgrade(player.wife)"
            :disabled="player.wife.level >= $maxLv"
          >
            {{
              player.wife.level >= $maxLv
                ? "Cấp độ đạo lữ đã tối đa"
                : "Nâng cấp đạo lữ"
            }}
          </el-button>
        </div>
      </div>
    </el-drawer>
    <el-drawer
      :title="player.pet.name"
      v-model="state.petItemShow"
      direction="rtl"
      class="strengthen"
    >
      <div class="strengthen-box">
        <div class="attributes">
          <div class="attribute-box">
            <div class="tag attribute">
              Cảnh giới: {{ $levelNames(player.pet.level) }} ({{
                player.pet.reincarnation || 0
              }}
              chuyển)
            </div>
            <div class="tag attribute">
              Ngộ tính: {{ player.pet.rootBone }}
            </div>
            <div class="tag attribute">
              Khí huyết: {{ $formatNumberToChineseUnit(player.pet.health) }}
            </div>
            <div class="tag attribute">
              Công kích: {{ $formatNumberToChineseUnit(player.pet.attack) }}
            </div>
            <div class="tag attribute">
              Phòng thủ: {{ $formatNumberToChineseUnit(player.pet.defense) }}
            </div>
            <div class="tag attribute">
              Điểm linh sủng: {{ $formatNumberToChineseUnit(player.pet.score) }}
            </div>
            <div
              class="tag attribute"
              @click="
                $notifys({
                  title: 'Cách nhận',
                  message: 'Có thể nhận được bằng cách khám phá bí cảnh',
                  position: 'top-left',
                })
              "
            >
              Đan bồi dưỡng sở hữu:
              {{ $formatNumberToChineseUnit(player.props.cultivateDan) }}
            </div>
            <div
              class="tag attribute"
              @click="
                $notifys({
                  title: 'Cách nhận',
                  message: 'Có thể nhận được bằng cách đánh bại BOSS thế giới',
                  position: 'top-left',
                })
              "
            >
              Đan ngộ tính sở hữu:
              {{ $formatNumberToChineseUnit(player.props.rootBone) }}
            </div>
            <div class="tag attribute">
              Tiêu hao bồi dưỡng: {{ petConsumption(player.pet.level) }}
            </div>
            <div class="tag attribute">
              Tiêu hao nâng ngộ tính:
              {{ petRootBone ? player.pet.rootBone : 0 }}
            </div>
          </div>
        </div>
        <div class="click-box">
          <el-checkbox
            v-model="state.petReincarnation"
            label="Linh sủng chuyển sinh"
          />
          <el-checkbox
            v-model="state.petRootBone"
            label="Nâng cao ngộ tính"
          />
          <el-button
            type="primary"
            @click="petUpgrade(player.pet)"
          >
            Bồi dưỡng speranza
          </el-button>
        </div>
      </div>
    </el-drawer>
    <el-drawer
      :title="strengthenInfo.name"
      v-model="state.strengthenShow"
      direction="rtl"
      class="strengthen"
    >
      <div
        class="strengthen-box"
        v-if="state.strengthenShow"
      >
        <equip-tooltip
          :calculate-cost="calculateCost(strengthenInfo)"
          :calculate-enhance-success-rate="
            calculateEnhanceSuccessRate(strengthenInfo)
          "
          :player="player"
          :strengthen-info="strengthenInfo"
        />
        <div class="click-box">
          <el-checkbox
            v-model="state.protect"
            label="Bảo vệ luyện khí"
          />
          <el-checkbox
            v-model="state.increase"
            label="Tăng cường luyện khí"
          />
          <el-button
            type="primary"
            @click="enhance(strengthenInfo)"
          >
            Luyện khí
          </el-button>
        </div>
      </div>
    </el-drawer>
    <el-dialog
      v-if="state.petShow"
      :title="petInfo.name"
      v-model="state.petShow"
      center
      width="420px"
    >
      <div class="monsterinfo">
        <div class="monsterinfo-box">
          <p>
            <span class="description">Cảnh giới: {{ $levelNames(petInfo?.level) }}</span>
            <span class="icon">
              <i
                :class="
                  calculateDifference(petInfo?.level, player.pet?.level).icon
                "
              />
            </span>
            <span class="value">
              {{
                petInfo.level > parseInt(player.pet?.level || 0)
                  ? $levelNames(petInfo.level)
                  : $levelNames(player.pet?.level)
              }}
            </span>
          </p>
          <p>
            <span class="description">Chuyển sinh: {{ petInfo?.reincarnation || 0 }}</span>
            <span class="icon">
              <i
                :class="
                  calculateDifference(
                    petInfo?.reincarnation,
                    player.pet?.reincarnation
                  ).icon
                "
              />
            </span>
            <span class="value">{{
              calculateDifference(
                petInfo?.reincarnation,
                player.pet?.reincarnation
              ).num
            }}</span>
          </p>
          <p>
            <span class="description">Khí huyết: {{ petInfo?.health }}</span>
            <span class="icon">
              <i
                :class="
                  calculateDifference(petInfo?.health, player.pet?.health).icon
                "
              />
            </span>
            <span class="value">{{
              calculateDifference(petInfo?.health, player.pet?.health).num
            }}</span>
          </p>
          <p>
            <span class="description">Công kích: {{ petInfo?.attack }}</span>
            <span class="icon">
              <i
                :class="
                  calculateDifference(petInfo?.attack, player.pet?.attack).icon
                "
              />
            </span>
            <span class="value">{{
              calculateDifference(petInfo?.attack, player.pet?.attack).num
            }}</span>
          </p>
          <p>
            <span class="description">Phòng thủ: {{ petInfo?.defense }}</span>
            <span class="icon">
              <i
                :class="
                  calculateDifference(petInfo?.defense, player.pet?.defense)
                    .icon
                "
              />
            </span>
            <span class="value">{{
              calculateDifference(petInfo?.defense, player.pet?.defense).num
            }}</span>
          </p>
          <p>
            <span class="description">Tỷ lệ né tránh:
              {{
                petInfo?.dodge > 0
                  ? petInfo?.dodge * 100 > 100
                    ? 100
                    : (petInfo?.dodge * 100).toFixed(2)
                  : 0
              }}%</span>
            <span class="icon">
              <i
                :class="
                  calculateDifference(petInfo?.dodge, player.pet?.dodge).icon
                "
              />
            </span>
            <span class="value">{{
              calculateDifference(petInfo?.dodge, player?.pet?.dodge).num
            }}</span>
          </p>
          <p>
            <span class="description">Tỷ lệ bạo kích:
              {{
                petInfo?.critical > 0
                  ? petInfo?.critical * 100 > 100
                    ? 100
                    : (petInfo?.critical * 100).toFixed(2)
                  : 0
              }}%</span>
            <span class="icon">
              <i
                :class="
                  calculateDifference(petInfo?.critical, player.pet?.critical)
                    .icon
                "
              />
            </span>
            <span class="value">{{
              calculateDifference(petInfo?.critical, player.pet?.critical).num
            }}</span>
          </p>
          <p>
            <span class="description">Điểm linh sủng: {{ petInfo?.score }}</span>
            <span class="icon">
              <i
                :class="
                  calculateDifference(petInfo?.score, player.pet?.score).icon
                "
              />
            </span>
            <span class="value">{{
              calculateDifference(petInfo?.score, player.pet?.score).num
            }}</span>
          </p>
        </div>
      </div>
      <el-collapse
        v-model="state.petCollapse"
        class="collapse"
      >
        <el-collapse-item name="1">
          <template #title>
            <div class="custom-title">
              So sánh thuộc tính cơ bản
            </div>
          </template>
          <div class="monsterinfo-box">
            <p>
              <span class="description">Khí huyết: {{ petInfo?.initial?.health }}</span>
              <span bracing="icon">
                <i
                  :class="
                    calculateDifference(
                      petInfo?.initial?.health,
                      player.pet?.initial?.health
                    ).icon
                  "
                />
              </span>
              <span class="value">{{
                calculateDifference(
                  petInfo?.initial?.health,
                  player.pet?.initial?.health
                ).num
              }}</span>
            </p>
            <p>
              <span class="description">Công kích: {{ petInfo?.initial?.attack }}</span>
              <span class="icon">
                <i
                  :class="
                    calculateDifference(
                      petInfo?.initial?.attack,
                      player.pet?.initial?.attack
                    ).icon
                  "
                />
              </span>
              <span class="value">{{
                calculateDifference(
                  petInfo?.initial?.attack,
                  player.pet?.initial?.attack
                ).num
              }}</span>
            </p>
            <p>
              <span class="description">Phòng thủ: {{ petInfo?.initial?.defense }}</span>
              <span class="icon">
                <i
                  :class="
                    calculateDifference(
                      petInfo?.initial?.defense,
                      player.pet?.initial?.defense
                    ).icon
                  "
                />
              </span>
              <span class="value">{{
                calculateDifference(
                  petInfo?.initial?.defense,
                  player.pet?.initial?.defense
                ).num
              }}</span>
            </p>
            <p>
              <span class="description">
                Tỷ lệ né tránh:
                {{
                  petInfo?.initial?.dodge > 0
                    ? petInfo?.initial?.dodge * 100 > 100
                      ? 100
                      : (petInfo?.initial?.dodge * 100).toFixed(2)
                    : 0
                }}%
              </span>
              <span class="icon">
                <i
                  :class="
                    calculateDifference(
                      petInfo?.initial?.dodge,
                      player.pet?.initial?.dodge
                    ).icon
                  "
                />
              </span>
              <span class="value">{{
                calculateDifference(
                  petInfo?.initial?.dodge,
                  player.pet?.initial?.dodge
                ).num
              }}</span>
            </p>
            <p>
              <span class="description">
                Tỷ lệ bạo kích:
                {{
                  petInfo?.initial?.critical > 0
                    ? petInfo?.initial?.critical * 100 > 100
                      ? 100
                      : (petInfo?.initial?.critical * 100).toFixed(2)
                    : 0
                }}%
              </span>
              <span class="icon">
                <i
                  :class="
                    calculateDifference(
                      petInfo?.initial?.critical,
                      player.pet?.initial?.critical
                    ).icon
                  "
                />
              </span>
              <span class="value">{{
                calculateDifference(
                  petInfo?.initial?.critical,
                  player.pet?.initial?.critical
                ).num
              }}</span>
            </p>
          </div>
        </el-collapse-item>
      </el-collapse>
      <div class="dialog-footer">
        <el-button
          plain
          class="dialog-footer-button"
          @click="petLock(petInfo)"
        >
          Linh sủng {{ petInfo.lock ? "mở khóa" : "khóa" }}
        </el-button>
        <el-button
          plain
          class="dialog-footer-button"
          @click="petClose(petInfo)"
        >
          Thả linh sủng
        </el-button>
        <el-button
          type="primary"
          class="dialog-footer-button"
          @click="petCarry(petInfo)"
        >
          Linh sủng xuất chiến
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      v-if="state.inventoryShow"
      :title="inventoryInfo.name"
      v-model="state.inventoryShow"
      center
      width="420px"
    >
      <div
        class="monsterinfo"
        v-if="state.inventoryShow"
      >
        <div class="monsterinfo-box">
          <p>
            <span class="description">Loại: {{ $genre[inventoryInfo.type] }}</span>
            <span class="icon" />
            <span class="value" />
          </p>
          <p>
            <span class="description">Luyện khí: {{ inventoryInfo.strengthen || 0 }}</span>
            <span class="icon">
              <i
                :class="
                  calculateDifference(
                    inventoryInfo.strengthen,
                    player.equipment[inventoryInfo.type]?.strengthen
                  ).icon
                "
              />
            </span>
            <span class="value">{{
              calculateDifference(
                inventoryInfo.strengthen,
                player.equipment[inventoryInfo.type]?.strengthen
              ).num
            }}</span>
          </p>
          <p>
            <span class="description">Cảnh giới: {{ $levelNames(inventoryInfo.level) }}</span>
            <span class="icon">
              <i
                :class="
                  calculateDifference(
                    inventoryInfo.level,
                    player.equipment[inventoryInfo.type]?.level
                  ).icon
                "
              />
            </span>
            <span class="value">
              {{
                inventoryInfo.level >
                  parseInt(player.equipment[inventoryInfo.type]?.level || 1)
                  ? $levelNames(inventoryInfo.level)
                  : $levelNames(player.equipment[inventoryInfo.type]?.level)
              }}
            </span>
          </p>
          <p>
            <span class="description">Phẩm chất: {{ $levels[inventoryInfo.quality] }}</span>
            <span class="icon">
              <i
                :class="
                  calculateDifference(
                    levelsNum[inventoryInfo.quality],
                    levelsNum[player.equipment[inventoryInfo.type]?.quality]
                  ).icon
                "
              />
            </span>
            <span class="value">
              {{
                calculateDifference(
                  levelsNum[inventoryInfo.quality],
                  levelsNum[player.equipment[inventoryInfo.type]?.quality]
                ).num < 0
                  ? $levels[player.equipment[inventoryInfo.type]?.quality]
                  : $levels[inventoryInfo.quality]
              }}
            </span>
          </p>
          <p>
            <span class="description">Khí huyết: {{ inventoryInfo?.health }}</span>
            <span class="icon">
              <i
                :class="
                  calculateDifference(
                    inventoryInfo?.health,
                    player.equipment[inventoryInfo.type]?.health
                  ).icon
                "
              />
            </span>
            <span class="value">{{
              calculateDifference(
                inventoryInfo?.health,
                player.equipment[inventoryInfo.type]?.health
              ).num
            }}</span>
          </p>
          <p>
            <span class="description">Công kích: {{ inventoryInfo?.attack }}</span>
            <span class="icon">
              <i
                :class="
                  calculateDifference(
                    inventoryInfo?.attack,
                    player.equipment[inventoryInfo.type]?.attack
                  ).icon
                "
              />
            </span>
            <span class="value">{{
              calculateDifference(
                inventoryInfo?.attack,
                player.equipment[inventoryInfo.type]?.attack
              ).num
            }}</span>
          </p>
          <p>
            <span class="description">Phòng thủ: {{ inventoryInfo?.defense }}</span>
            <span class="icon">
              <i
                :class="
                  calculateDifference(
                    inventoryInfo?.defense,
                    player.equipment[inventoryInfo.type]?.defense
                  ).icon
                "
              />
            </span>
            <span class="value">{{
              calculateDifference(
                inventoryInfo?.defense,
                player.equipment[inventoryInfo.type]?.defense
              ).num
            }}</span>
          </p>
          <p>
            <span class="description">Tỷ lệ né tránh:
              {{
                inventoryInfo?.dodge > 0
                  ? inventoryInfo?.dodge * 100 > 100
                    ? 100
                    : (inventoryInfo?.dodge * 100).toFixed(2)
                  : 0
              }}%</span>
            <span class="icon">
              <i
                :class="
                  calculateDifference(
                    inventoryInfo?.dodge,
                    player.equipment[inventoryInfo.type]?.dodge
                  ).icon
                "
              />
            </span>
            <span class="value">{{
              calculateDifference(
                inventoryInfo?.dodge,
                player.equipment[inventoryInfo.type]?.dodge
              ).num
            }}</span>
          </p>
          <p>
            <span class="description">Tỷ lệ bạo kích:
              {{
                inventoryInfo?.critical > 0
                  ? inventoryInfo?.critical * 100 > 100
                    ? 100
                    : (inventoryInfo?.critical * 100).toFixed(2)
                  : 0
              }}%</span>
            <span class="icon">
              <i
                :class="
                  calculateDifference(
                    inventoryInfo?.critical,
                    player.equipment[inventoryInfo.type]?.critical
                  ).icon
                "
              />
            </span>
            <span class="value">{{
              calculateDifference(
                inventoryInfo?.critical,
                player.equipment[inventoryInfo.type]?.critical
              ).num
            }}</span>
          </p>
          <p>
            <span class="description">Điểm trang bị: {{ inventoryInfo?.score }}</span>
            <span class="icon">
              <i
                :class="
                  calculateDifference(
                    inventoryInfo?.score,
                    player.equipment[inventoryInfo.type]?.score
                  ).icon
                "
              />
            </span>
            <span class="value">{{
              calculateDifference(
                inventoryInfo?.score,
                player.equipment[inventoryInfo.type]?.score
              ).num
            }}</span>
          </p>
        </div>
      </div>
      <el-collapse
        v-model="state.inventoryCollapse"
        class="collapse"
      >
        <el-collapse-item name="1">
          <template #title>
            <div class="custom-title">
              So sánh thuộc tính cơ bản
            </div>
          </template>
          <div class="monsterinfo-box">
            <p>
              <span class="description">Khí huyết: {{ inventoryInfo?.initial?.health }}</span>
              <span class="icon">
                <i
                  :class="
                    calculateDifference(
                      inventoryInfo?.initial?.health,
                      player.equipment[inventoryInfo.type]?.initial?.health
                    ).icon
                  "
                />
              </span>
              <span class="value">{{
                calculateDifference(
                  inventoryInfo?.initial?.health,
                  player.equipment[inventoryInfo.type]?.initial?.health
                ).num
              }}</span>
            </p>
            <p>
              <span class="description">Công kích: {{ inventoryInfo?.initial?.attack }}</span>
              <span class="icon">
                <i
                  :class="
                    calculateDifference(
                      inventoryInfo?.initial?.attack,
                      player.equipment[inventoryInfo.type]?.initial?.attack
                    ).icon
                  "
                />
              </span>
              <span class="value">{{
                calculateDifference(
                  inventoryInfo?.initial?.attack,
                  player.equipment[inventoryInfo.type]?.initial?.attack
                ).num
              }}</span>
            </p>
            <p>
              <span class="description">Phòng thủ: {{ inventoryInfo?.initial?.defense }}</span>
              <span class="icon">
                <i
                  :class="
                    calculateDifference(
                      inventoryInfo?.initial?.defense,
                      player.equipment[inventoryInfo.type]?.initial?.defense
                    ).icon
                  "
                />
              </span>
              <span class="value">{{
                calculateDifference(
                  inventoryInfo?.initial?.defense,
                  player.equipment[inventoryInfo.type]?.initial?.defense
                ).num
              }}</span>
            </p>
            <p>
              <span class="description">
                Tỷ lệ né tránh:
                {{
                  inventoryInfo?.initial?.dodge > 0
                    ? inventoryInfo?.initial?.dodge * 100 > 100
                      ? 100
                      : (inventoryInfo?.initial?.dodge * 100).toFixed(2)
                    : 0
                }}%
              </span>
              <span class="icon">
                <i
                  :class="
                    calculateDifference(
                      inventoryInfo?.initial?.dodge,
                      player.equipment[inventoryInfo.type]?.initial?.dodge
                    ).icon
                  "
                />
              </span>
              <span class="value">{{
                calculateDifference(
                  inventoryInfo?.initial?.dodge,
                  player.equipment[inventoryInfo.type]?.initial?.dodge
                ).num
              }}</span>
            </p>
            <p>
              <span class="description">
                Tỷ lệ bạo kích:
                {{
                  inventoryInfo?.initial?.critical > 0
                    ? inventoryInfo?.initial?.critical * 100 > 100
                      ? 100
                      : (inventoryInfo?.initial?.critical * 100).toFixed(2)
                    : 0
                }}%
              </span>
              <span class="icon">
                <i
                  :class="
                    calculateDifference(
                      inventoryInfo?.initial?.critical,
                      player.equipment[inventoryInfo.type]?.initial?.critical
                    ).icon
                  "
                />
              </span>
              <span class="value">{{
                calculateDifference(
                  inventoryInfo?.initial?.critical,
                  player.equipment[inventoryInfo.type]?.initial?.critical
                ).num
              }}</span>
            </p>
          </div>
        </el-collapse-item>
      </el-collapse>
      <div class="dialog-footer">
        <el-button
          plain
          class="inventory-button"
          @click="inventoryClose(inventoryInfo)"
        >
          Phân giải trang bị
        </el-button>
        <el-button
          plain
          class="inventory-button"
          @click="inventoryLock(inventoryInfo.id)"
        >
          {{ inventoryInfo.lock ? "Mở khóa trang bị" : "Khóa trang bị" }}
        </el-button>
        <el-button
          type="primary"
          class="inventory-button"
          @click="equipItem(inventoryInfo.id, inventoryInfo.type)"
        >
          Trang bị ngay
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      v-if="state.sellingEquipmentShow"
      title="Xử lý hàng loạt"
      v-model="state.sellingEquipmentShow"
      width="600px"
    >
      <el-divider>Trang bị</el-divider>
      <el-checkbox-group
        v-model="player.sellingEquipmentData"
        @change="sellingEquipmentDataChange"
      >
        <el-checkbox
          v-for="(item, index) in state.AllEquipmenType"
          :value="item"
          :key="index"
          :label="$levels[item]"
        />
      </el-checkbox-group>
      <div
        class="dialog-footer"
        style="margin-top: 20px"
      >
        <el-button
          class="dialog-footer-button"
          @click="sellingEquipment"
        >
          Phân giải trang bị
        </el-button>
      </div>
      <el-divider>Linh sủng</el-divider>
      <div
        class="dialog-footer"
        style="margin-top: 20px"
      >
        <el-button
          class="dialog-footer-button"
          @click="sellingPet"
        >
          Thả linh sủng
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      v-if="state.show"
      v-model="state.show"
      title="Cài đặt trò chơi"
      width="350px"
    >
      <div class="dialog-footer">
        <el-divider>Liên quan đến lưu trữ</el-divider>
        <el-button
          class="dialog-footer-button"
          @click="exportData"
        >
          Lưu dữ liệu
        </el-button>
        <el-upload
          action="#"
          class="dialog-upload"
          :http-request="importData"
          :show-file-list="false"
          accept="application/json"
        >
          <el-button class="dialog-footer-button">
            Nhập lưu trữ
          </el-button>
        </el-upload>
        <el-button
          type="danger"
          class="dialog-footer-button"
          @click="deleteData"
        >
          Xóa lưu trữ
        </el-button>
        <!-- <el-divider>Liên quan đến script</el-divider>
        <el-upload
          action="#"
          class="dialog-upload"
          :before-upload="scriptBeforeUpload"
          :show-file-list="false"
          accept=".txt,.js"
        >
          <el-button
            type="danger"
            class="dialog-footer-button"
          >
            Nhập script
          </el-button>
        </el-upload>
        <el-button
          type="warning"
          class="dialog-footer-button"
          @click="deleteScriptData"
        >
          Xóa script
        </el-button> -->
        <el-divider>Liên quan khác</el-divider>
        <el-button
          class="dialog-footer-button"
          @click="sellingEquipmentBox"
        >
          Phân giả hàng loạt
        </el-button>
        <el-button
          type="primary"
          class="dialog-footer-button"
          @click="handleOpenGroup"
        >
          Nhóm chat chính thức
        </el-button>
        <div class="footer">
          <el-switch
            size="large"
            v-model="player.dark"
          >
            <template #active-action>
              <i class="el-icon">
                <svg
                  viewBox="0 0 24 24"
                  class="dark-icon"
                >
                  <path
                    d="M11.01 3.05C6.51 3.54 3 7.36 3 12a9 9 0 0 0 9 9c4.63 0 8.45-3.5 8.95-8c.09-.79-.78-1.42-1.54-.95A5.403 5.403 0 0 1 11.1 7.5c0-1.06.31-2.06.84-2.89c.45-.67-.04-1.63-.93-1.56z"
                    fill="currentColor"
                  />
                </svg>
              </i>
            </template>
            <template #inactive-action>
              <i class="el-icon">
                <svg
                  viewBox="0 0 24 24"
                  class="light-icon"
                >
                  <path
                    d="M6.05 4.14l-.39-.39a.993.993 0 0 0-1.4 0l-.01.01a.984.984 0 0 0 0 1.4l.39.39c.39.39 1.01.39 1.4 0l.01-.01a.984.984 0 0 0 0-1.4zM3.01 10.5H1.99c-.55 0-.99.44-.99.99v.01c0 .55.44.99.99.99H3c.56.01 1-.43 1-.98v-.01c0-.56-.44-1-.99-1zm9-9.95H12c-.56 0-1 .44-1 .99v.96c0 .55.44.99.99.99H12c.56.01 1-.43 1-.98v-.97c0-.55-.44-.99-.99-.99zm7.74 3.21c-.39-.39-1.02-.39-1.41-.01l-.39.39a.984.984 0 0 0 0 1.4l.01.01c.39.39 1.02.39 1.4 0l.39-.39a.984.984 0 0 0 0-1.4zm-1.81 15.1l.39.39a.996.996 0 1 0 1.41-1.41l-.39-.39a.993.993 0 0 0-1.4 0c-.4.4-.4 1.02-.01 1.41zM20 11.49v.01c0 .55.44.99.99.99H22c.55 0 .99-.44.99-.99v-.01c0-.55-.44-.99-.99-.99h-1.01c-.55 0-.99.44-.99.99zM12 5.5c-3.31 0-6 2.69-6 6s2.69 6 6 6s6-2.69 6-6s-2.69-6-6-6zm-.01 16.95H12c.55 0 .99-.44.99-.99v-.96c0-.55-.44-.99-.99-.99h-.01c-.55 0-.99.44-.99.99v.96c0 .55.44.99.99.99zm-7.74-3.21c.39.39 1.02.39 1.41 0l.39-.39a.993.993 0 0 0 0-1.4l-.01-.01a.996.996 0 0 0-1.41 0l-.39.39c-.38.4-.38 1.02.01 1.41z"
                    fill="currentColor"
                  />
                </svg>
              </i>
            </template>
          </el-switch>
        </div>
        <el-divider>Phiên bản hiện tại: {{ ver }}</el-divider>
      </div>
    </el-dialog>
    <el-drawer
      title="Sổ tay và thành tựu"
      v-model="state.equipAllShow"
      direction="rtl"
      class="equipAll"
    >
      <el-tabs
        v-model="state.activeName"
        type="border-card"
      >
        <el-tab-pane
          label="Sổ tay trang bị"
          name="illustrations"
        >
          <div class="equipAll-box">
            <el-tabs
              v-model="state.illustrationsActive"
              :stretch="true"
            >
              <el-tab-pane
                :label="i.name"
                :name="i.type"
                v-for="(i, k) in state.illustrationsItems"
                :key="k"
              >
                <div class="equipAll-content">
                  <template v-for="(item, index) in i.data">
                    <div
                      class="equipAll-item"
                      v-if="item.type == i.type"
                      :key="index"
                      @click="illustrationsInfo(k, index)"
                    >
                      <tag :type="item.quality">
                        {{ item.name }}
                      </tag>
                    </div>
                  </template>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-tab-pane>
        <el-tab-pane
          label="Thành tựu của tôi"
          name="achievement"
        >
          <el-tabs
            v-model="state.achievementActive"
            :stretch="true"
          >
            <el-tab-pane
              :label="i.name"
              :name="i.type"
              v-for="(i, k) in state.achievementAll"
              :key="k"
            >
              <div
                class="achievement-content"
                v-if="i.data.length > 0"
              >
                <div
                  class="achievement-item"
                  v-for="(item, index) in i.data"
                  :key="index"
                  @click="achievementInfo(i.type, item)"
                >
                  <tag
                    :type="getTagClass(i.type, item.id) ? 'success' : 'info'"
                  >
                    {{ item.name }}
                    ({{
                      getTagClass(i.type, item.id)
                        ? "Đã hoàn thành"
                        : "Chưa hoàn thành"
                    }})
                  </tag>
                </div>
              </div>
              <div
                class="achievement-content"
                v-else
              >
                Loại thành tựu này chưa được phát hành
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>
      </el-tabs>
      <div
        class="backtop"
        @click="state.equipAllShow = false"
      >
        <el-icon>
          <Close />
        </el-icon>
      </div>
    </el-drawer>
    <el-drawer
      title="Gói quà tân thủ"
      v-model="state.newBieBox"
      :before-close="confirmCollectionNewBie"
      class="newBieBox"
      direction="rtl"
    >
      <div class="newBie">
        <tag
          v-for="(item, index) in state.newBieData"
          class="inventory-item"
          :type="item.quality"
          :key="index"
          @click="newBieInfo(item)"
        >
          {{ item.name }}({{ $genre[item.type] }})
          <el-icon>
            <View />
          </el-icon>
        </tag>
      </div>
      <div class="flex items-center justify-arround gap-2">
        <el-button
          size="small"
          type="primary"
          :loading="state.newBieLoading"
          @click="refreshNewBie"
        >
          {{ newBieLoading ? "Đang làm mới..." : "Làm mới" }}
        </el-button>
        <el-button
          size="small"
          type="primary"
          @click="confirmCollectionNewBie"
        >
          Nhận trang bị
        </el-button>
      </div>
    </el-drawer>
    <el-dialog
      v-if="state.newBieInfoBox"
      v-model="state.newBieInfoBox"
      :title="newBieItem.name"
      width="420px"
    >
      <div class="monsterinfo">
        <div class="newbieinfo-box">
          <p>Loại: {{ $genre[newBieItem.type] }}</p>
          <p>Cảnh giới: {{ $levelNames(newBieItem.level) }}</p>
          <p>Phẩm chất: {{ $levels[newBieItem.quality] }}</p>
          <p>Khí huyết: {{ newBieItem?.health }}</p>
          <p>Công kích: {{ newBieItem?.attack }}</p>
          <p>Phòng thủ: {{ newBieItem?.defense }}</p>
          <p>
            Tỷ lệ né tránh:
            {{
              newBieItem?.dodge > 0
                ? newBieItem?.dodge * 100 > 100
                  ? 100
                  : (newBieItem?.dodge * 100).toFixed(2)
                : 0
            }}%
          </p>
          <p>
            Tỷ lệ bạo kích:
            {{
              newBieItem?.critical > 0
                ? newBieItem?.critical * 100 > 100
                  ? 100
                  : (newBieItem?.critical * 100).toFixed(2)
                : 0
            }}%
          </p>
          <p>Điểm trang bị: {{ newBieItem?.score }}</p>
        </div>
      </div>
      <div class="dialog-footer">
        <el-button
          type="primary"
          class="inventory-button"
          @click="state.newBieInfoBox = false"
        >
          Xác nhận
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      v-if="state.errBox"
      v-model="state.errBox"
      title="Thông tin lỗi"
      width="420px"
    >
      <el-input
        v-model="err"
        :rows="10"
        type="textarea"
      />
      <div class="dialog-footer">
        <el-button
          type="primary"
          class="inventory-button"
          @click="errBox = false"
        >
          Xác nhận
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      v-if="state.showRanking"
      v-model="state.showRanking"
      title="Vạn tiên bảng"
    >
      <GameRanking />
    </el-dialog>
  </div>
</template>

<script setup>
import CultivationPath from '@/components/CultivationPath.vue';
import GameRanking from '@/components/GameRanking.vue';
import tag from '@/components/tag.vue';
import equipTooltip from '@/components/tooltip/equipTooltip.vue';
import achievement from '@/plugins/achievement';
import equip from '@/plugins/equip';
import equipAll from '@/plugins/equipAll';
import shop from '@/plugins/shop';
import { saveAs } from 'file-saver';
import { computed, getCurrentInstance, onBeforeMount, onMounted, reactive, watch } from 'vue';
import { useRouter } from 'vue-router';

// Router
const router = useRouter();
const instance = getCurrentInstance()
const globalProperties = instance.appContext.config.globalProperties
const { $maxLv, $levelNames, $formatNumberToChineseUnit, $propItemNames, $levels, $genre, $dropdownType } = globalProperties

// State (thay thế data)
const state = reactive({
  ver: 0.9,
  err: '',
  show: false,
  showRanking: false,
  errBox: false,
  player: {},
  actions: [],
  isLevel: false,
  petShow: false,
  petInfo: {},
  protect: false,
  increase: false,
  editName: false,
  levelsNum: {
    info: 1,
    pink: 7,
    danger: 6,
    purple: 4,
    primary: 3,
    success: 2,
    warning: 5,
  },
  newBieBox: false,
  storyText: '',
  shopPrice: 100,
  newBieData: [],
  shopActive: 'weapon',
  activeName: 'illustrations',
  newBieItem: {},
  scriptFile: '',
  petItemShow: false,
  backPackItem: [
    { type: 'weapon', name: 'Thần binh' },
    { type: 'armor', name: 'Hộ giáp' },
    { type: 'accessory', name: 'Linh bảo' },
    { type: 'sutra', name: 'Pháp khí' },
  ],
  petRootBone: false,
  petCollapse: '',
  equipAllShow: false,
  wifeItemShow: false,
  inventoryInfo: {},
  newBieInfoBox: false,
  newBieLoading: false,
  inventoryShow: false,
  strengthenShow: false,
  strengthenInfo: {},
  achievementAll: [],
  checkedEquipmen: [],
  inventoryActive: 'equipment',
  equipmentActive: 'weapon',
  AllEquipmenType: [
    'info',
    'success',
    'primary',
    'purple',
    'warning',
    'danger',
    'pink',
  ],
  petReincarnation: false,
  achievementActive: 'pet',
  inventoryCollapse: '',
  petDropdownActive: '',
  illustrationsItems: [],
  sellingEquipmentShow: false,
  illustrationsActive: 'weapon',
  equipmentDropdownActive: '',
});

const player = computed(() => state.player);
const petInfo = computed(() => state.petInfo);
const inventoryInfo = computed(() => state.inventoryInfo);
const newBieItem = computed(() => state.newBieItem);
const strengthenInfo = computed(() => state.strengthenInfo);
const levelsNum = computed(() => state.levelsNum);

// Computed (thay thế computed)
const sortedProps = computed(() => {
  const obj = state.player.props;
  return Object.keys(obj).map((key) => ({ name: key, num: obj[key] }));
});

// Watch (thay thế watch)
watch(
  () => state.inventoryActive,
  (type) => {
    if (type === 'shop' && !state.player.shopData.length) {
      state.player.shopData = shop.drawPrize(globalProperties.$maxLv);
    }
    if (type === 'props') {
      globalProperties.$notifys({
        title: 'Gợi ý',
        message: 'Nhấn vào đạo cụ để xem thông tin liên quan',
      });
    }
  }
);

watch(
  () => state.player.dark,
  (val) => {
    const setThemeColor = (color) => {
      let meta = document.querySelector('meta[name="theme-color"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'theme-color';
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', color);
    };
    setThemeColor(val ? '#141414' : '#ffffff');
  }
);

watch(
  () => state.player.attack,
  (val) => {
    if (isNaN(val)) reset();
    else return val;
  }
);

watch(
  () => state.player.health,
  (val) => {
    if (isNaN(val)) reset();
    else return val;
  }
);

watch(
  () => state.player.defense,
  (val) => {
    if (isNaN(val)) reset();
    else return val;
  }
);

watch(
  () => state.player.maxHealth,
  (val) => {
    if (isNaN(val)) reset();
    else return val;
  }
);

watch(
  () => state.player.critical,
  (val) => {
    if (isNaN(val) || val < 0) {
      state.storyText =
        'Thuộc tính bạo kích lỗi, vui lòng tháo hết trang bị trên người và làm mới trò chơi<br>Nếu không có trang bị mà thông báo này vẫn xuất hiện, hãy thử mặc một trang bị rồi làm mới lại';
      return 0;
    } else {
      return val;
    }
  }
);

watch(
  () => state.player.dodge,
  (val) => {
    if (isNaN(val) || val < 0) {
      state.storyText =
        'Thuộc tính né tránh lỗi, vui lòng tháo hết trang bị trên người và làm mới trò chơi<br>Nếu không có trang bị mà thông báo này vẫn xuất hiện, hãy thử mặc một trang bị rồi làm mới lại';
      return 0;
    } else {
      return val;
    }
  }
);

// Lifecycle hooks
onBeforeMount(() => {
  state.boss = globalProperties.$store.boss;
  state.player = globalProperties.$store.player;
  state.achievementAll = achievement.all();
  state.illustrationsItems = equipAll.drawPrize(globalProperties.$maxLv);
});

onMounted(() => {
  startGame();
});

// Methods (thay thế methods)
const startGame = () => {
  state.storyText = 'Hành trình tu tiên của bạn đã bắt đầu.';
  state.actions = [
    {
      text: 'Bắt đầu tu luyện',
      handler: () => router.push('/cultivate'),
    },
    {
      text: 'Khám phá bí cảnh',
      handler: () => {
        if (!state.player.isNewbie) {
          globalProperties.$notifys({
            title: 'Gợi ý',
            message: 'Gói quà tân thủ chưa được nhận',
          });
          return;
        }
        if (state.player.level < 10) {
          globalProperties.$notifys({
            title: 'Gợi ý sức mạnh không đủ',
            message: `Bên ngoài quá nguy hiểm, hãy đột phá đến ${globalProperties.$levelNames(
              10
            )} rồi mới ra ngoài!`,
          });
          return;
        }
        router.push('/map');
      },
    },
    {
      text: 'Sổ tay và thành tựu',
      handler: () => {
        state.equipAllShow = true;
      },
    },
    {
      text: 'Thách đấu Vô Tận Tháp',
      handler: () => router.push('/endlesstower'),
    },
    { text: 'BOSS thế giới', handler: () => router.push('/boss') },
    {
      text: 'Giải trí thư giãn',
      handler: () => router.push('/game'),
    },
  ];
  state.player.health = state.player.maxHealth;
};

const deleteScriptData = () => {
  state.player.script = '';
  globalProperties.$notifys({ title: 'Gợi ý', message: 'Xóa script thành công' });
  location.reload(1);
};

const scriptBeforeUpload = (file) => {
  state.scriptFile = file;
  uploadScript();
  return false;
};

const handleOpenGroup = () => {
  window.open('https://zalo.me/g/cltcgr815', '_blank');
};

const uploadScript = () => {
  globalProperties
    .$confirm(
      '',
      'Lưu ý nhập script',
      {
        center: true,
        message:
          'Trước khi nhập, hãy xác nhận script có thể sử dụng và sao lưu dữ liệu<br>Nếu xảy ra vấn đề với trò chơi do nhập script lỗi, tác giả không chịu trách nhiệm',
        cancelButtonText: 'Suy nghĩ thêm',
        confirmButtonText: 'Tôi sẽ chịu trách nhiệm cho hành động của mình',
        dangerouslyUseHTMLString: true,
      }
    )
    .then(() => {
      const file = state.scriptFile;
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const script = e.target.result;
          state.player.script = script;
          globalProperties.$notifys({
            title: 'Gợi ý',
            message: 'Nhập script thành công',
          });
          location.reload(1);
        } catch (err) {
          state.err = err;
          state.errBox = true;
          globalProperties.$notifys({
            title: 'Nhập script thất bại',
            message: 'Sao chép thông tin lỗi vào nhóm QQ',
          });
        }
      };
      reader.readAsText(file);
    })
    .catch(() => {});
};

const editUserName = () => {
  globalProperties
    .$prompt('Mỗi lần sửa tên cần tiêu tốn 100 linh thạch', 'Sửa tên', {
      inputPattern: /^(?=\S).*/,
      cancelButtonText: 'Hủy sửa',
      confirmButtonText: 'Xác nhận sửa',
      inputErrorMessage: 'Tên không được để trống',
    })
    .then(({ value }) => {
      if (state.player.props.money < 100) {
        globalProperties.$notifys({
          title: 'Gợi ý',
          message: 'Linh thạch không đủ, sửa tên thất bại',
        });
        return;
      }
      state.player.name = value;
      state.player.props.money -= 100;
      globalProperties.$notifys({ title: 'Gợi ý', message: 'Sửa thành công' });
    })
    .catch(() => {});
};

const clearSave = () => {
  globalProperties
    .$confirm(
      'Do phiên bản trò chơi hiện tại không tương thích với phiên bản lưu trữ, cần xóa dữ liệu',
      'Gợi ý xóa lưu trữ',
      {
        center: true,
        showClose: false,
        showCancelButton: false,
        confirmButtonText: 'Xác nhận',
        closeOnClickModal: false,
        closeOnPressEscape: false,
      }
    )
    .then(() => {
      localStorage.removeItem('vuex');
      location.reload(1);
    });
};

const reset = () => {
  state.storyText =
    'Thuộc tính lỗi, vui lòng tham gia nhóm, tải lên "lưu trữ" và liên hệ tác giả để giải quyết';
  globalProperties
    .$confirm('Bạn có muốn Lưu dữ liệu không?', 'Gợi ý lưu trữ', {
      center: true,
      confirmButtonText: 'Xác nhận',
    })
    .then(() => {
      exportData();
    })
    .catch(() => {});
};

const sellingPet = () => {
  const pets = state.player.pets;
  if (!pets.length) {
    globalProperties.$notifys({
      title: 'Gợi ý thả linh sủng',
      message: 'Bạn không có linh sủng nào để thả',
    });
    return;
  }
  const selling = pets.filter((item) => !item.lock);
  if (!selling.length) {
    globalProperties.$notifys({
      title: 'Gợi ý thả linh sủng',
      message: 'Bạn không có linh sủng chưa khóa nào để thả',
    });
    return;
  }
  state.sellingEquipmentShow = false;
  const cultivateDanTotal = selling.reduce((total, i) => {
    const reincarnation = i.reincarnation ? i.reincarnation : 1;
    let level = i.level * reincarnation;
    level = Number(level) || 0;
    return total + Math.floor(level);
  }, 0);
  state.player.props.cultivateDan += cultivateDanTotal;
  state.player.pets = pets.filter((item) => item.lock);
  globalProperties.$notifys({
    title: 'Gợi ý thả linh sủng',
    message: `Tất cả linh sủng không khóa đã được thả thành công, trước khi đi chúng đã tặng bạn ${cultivateDanTotal} đan bồi dưỡng`,
  });
};

const sellingEquipment = () => {
  const inventory = state.player.inventory;
  const sellingEquipmen = state.player.sellingEquipmentData;
  if (!sellingEquipmen.length) {
    globalProperties.$notifys({
      title: 'Gợi ý phân giải trang bị trong túi',
      message: 'Bạn chưa chọn phẩm chất cần phân giải',
    });
    return;
  }
  const selling = inventory.filter(
    (item) => sellingEquipmen.includes(item.quality) && !item.lock
  );
  if (!selling.length) {
    globalProperties.$notifys({
      title: 'Gợi ý phân giải trang bị trong túi',
      message: 'Chưa trang bị trang bị nào trong túi để bán',
    });
    return;
  }
  state.sellingEquipmentShow = false;
  const strengtheningStoneTotal = selling.reduce((total, i) => {
    let level = i.level + (i.level * state.player.reincarnation) / 10;
    level = Number(level) || 0;
    return total + Math.floor(level);
  }, 0);
  state.player.props.money += selling.length;
  state.player.props.strengtheningStone += strengtheningStoneTotal;
  state.player.inventory = inventory.filter(
    (item) => !sellingEquipmen.includes(item.quality) || item.lock
  );
  globalProperties.$notifys({
    title: 'Gợi ý phân giải trang bị trong túi',
    message: `Tất cả trang bị không khóa trong túi đã được phân giải thành công, bạn nhận được ${strengtheningStoneTotal} đá luyện khí và ${selling.length} linh thạch`,
  });
};

const sellingEquipmentDataChange = (val) => {
  state.player.sellingEquipmentData = val;
};

const refreshShop = () => {
  if (state.player.props.money < 500) {
    globalProperties.$notifys({
      title: 'Gợi ý',
      message: 'Linh thạch không đủ, làm mới cửa hàng cần 500 linh thạch',
    });
    return;
  }
  state.player.props.money -= 500;
  state.player.shopData = shop.drawPrize(globalProperties.$maxLv);
  globalProperties.$notifys({ title: 'Gợi ý', message: 'Làm mới thành công' });
};

const deleteData = () => {
  globalProperties
    .$confirm(
      'Bạn có chắc muốn xóa lưu trữ không? Nên xóa khi dữ liệu gặp vấn đề',
      'Gợi ý xóa dữ liệu',
      {
        center: true,
        cancelButtonText: 'Tôi nhấn nhầm',
        confirmButtonText: 'Chắc chắn',
      }
    )
    .then(() => {
      globalProperties.$notifys({ title: 'Gợi ý', message: 'Xóa lưu trữ thành công' });
      localStorage.removeItem('vuex');
      location.reload(1);
    })
    .catch(() => {});
};

const importData = (data) => {
  const file = data.file;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      localStorage.setItem('vuex', e.target.result);
      location.reload(1);
    } catch (err) {
      state.err = err;
      state.errBox = true;
      globalProperties.$notifys({
        title: 'Nhập script thất bại',
        message: 'Sao chép thông tin lỗi vào nhóm QQ',
      });
    }
  };
  reader.readAsText(file);
};

const exportData = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const hours = String(today.getHours()).padStart(2, '0');
  const minutes = String(today.getMinutes()).padStart(2, '0');
  const seconds = String(today.getSeconds()).padStart(2, '0');
  const blob = new Blob([localStorage.getItem('vuex')], {
    type: 'application/json;charset=utf-8',
  });
  const name = `Tu Tiên Văn Tự Của Tôi Toàn Dựa Vào Cày-[Thời gian xuất lưu trữ ${year}${month}${day}${hours}${minutes}${seconds}]-[Phiên bản trò chơi ${state.ver}].json`;
  saveAs(blob, name);
};

const sellingEquipmentBox = () => {
  state.show = false;
  state.sellingEquipmentShow = true;
};

const equipItem = (id, type) => {
  const inventoryItem = getObjectById(id, state.player.inventory);
  if (
    !state.player.reincarnation &&
    inventoryItem.level > state.player.level
  ) {
    globalProperties.$notifys({
      title: 'Cảnh giới hiện tại không đủ',
      message: 'Không thể trang bị vật phẩm này',
    });
    return;
  }
  if (JSON.stringify(state.player.equipment[type]) !== '{}') {
    const equipment = state.player.equipment[type];
    playerAttribute(
      -equipment.dodge,
      -equipment.attack,
      -equipment.health,
      -equipment.critical,
      -equipment.defense
    );
    state.player.inventory.push(equipment);
  }
  state.player.equipment[type] = inventoryItem;
  playerAttribute(
    inventoryItem.dodge,
    inventoryItem.attack,
    inventoryItem.health,
    inventoryItem.critical,
    inventoryItem.defense
  );
  state.player.inventory = state.player.inventory.filter(
    (item) => item.id !== id
  );
  type = '';
  state.inventoryShow = false;
};

const inventoryLock = (id) => {
  let inventoryItem = getObjectById(id, state.player.inventory);
  inventoryItem.lock = !inventoryItem.lock;
  globalProperties.$notifys({
    title: !inventoryItem.lock
      ? 'Gợi ý mở khóa trang bị'
      : 'Gợi ý khóa trang bị',
    message: !inventoryItem.lock
      ? 'Mở khóa trang bị thành công'
      : 'Khóa trang bị thành công',
  });
};

const petCarry = (item) => {
  const petItem = getObjectById(item.id, state.player.pets);
  if (JSON.stringify(state.player.pet) !== '{}') {
    const itemInfo = state.player.pet;
    playerAttribute(
      -itemInfo.dodge,
      -itemInfo.attack,
      -itemInfo.health,
      -itemInfo.critical,
      -itemInfo.defense
    );
    state.player.pets.push(state.player.pet);
  }
  state.petShow = false;
  state.player.pet = petItem;
  playerAttribute(
    petItem.dodge,
    petItem.attack,
    petItem.health,
    petItem.critical,
    petItem.defense
  );
  state.player.pets = state.player.pets.filter((i) => i.id !== item.id);
};

const petClose = (item) => {
  globalProperties
    .$confirm(
      `Bạn có chắc muốn thả <span class="el-tag el-tag--${computePetsLevel(
        item.level
      )}">${item.name} (${globalProperties.$levelNames(item.level)})</span> không?`,
      'Thả linh sủng',
      {
        center: true,
        cancelButtonText: 'Hủy thả',
        confirmButtonText: 'Xác nhận thả',
        dangerouslyUseHTMLString: true,
      }
    )
    .then(() => {
      const reincarnation = item.reincarnation ? item.reincarnation : 1;
      const num = item.level * reincarnation;
      state.petShow = false;
      state.player.props.cultivateDan += num;
      state.player.pets = state.player.pets.filter((obj) => obj.id !== item.id);
      globalProperties.$notifys({
        title: `${item.name} đã được thả thành công`,
        message: `Trước khi đi, đối phương đã tặng bạn ${num} đan bồi dưỡng`,
      });
    })
    .catch(() => {});
};

const petLock = (item) => {
  item.lock = !item.lock;
  globalProperties.$notifys({
    title: !item.lock ? 'Gợi ý mở khóa linh sủng' : 'Gợi ý khóa linh sủng',
    message: !item.lock
      ? 'Mở khóa linh sủng thành công'
      : 'Khóa linh sủng thành công',
  });
};

const calculateDifference = (item1, item2) => {
  item1 = item1 || 0;
  item2 = item2 || 0;
  const isFloat = (num) => {
    return Number(num) === num && num % 1 !== 0;
  };
  const Float =
    item1 - parseFloat(item2) < -1
      ? -1
      : item1 - parseFloat(item2) > 1
      ? 1
      : item1 - parseFloat(item2);
  const ojb = {
    num:
      isFloat(item1) || isFloat(item2)
        ? (Float * 100).toFixed(2) + '%'
        : item1 - parseInt(item2),
    icon:
      item1 > item2
        ? 'success el-icon-caret-top'
        : item1 == item2
        ? ''
        : 'danger el-icon-caret-bottom',
  };
  ojb.num = ojb.num == 0 ? '' : ojb.num;
  return ojb;
};

const calculateCost = (item) => {
  let baseCost = item.level * 5;
  let incrementPerLevel = item.strengthen * 50;
  let protect = state.protect ? 10 : 1;
  let increase = state.increase ? 5 : 1;
  return (baseCost + incrementPerLevel) * protect * increase;
};

const enhance = (item) => {
  const successRate = calculateEnhanceSuccessRate(item);
  const cost = calculateCost(item);
  if (cost > state.player.props.strengtheningStone) {
    globalProperties.$notifys({
      title: 'Gợi ý luyện khí',
      message: 'Đá luyện khí không đủ, không thể thực hiện luyện khí',
      position: 'top-left',
    });
    return;
  }
  if (item.strengthen == 30) {
    globalProperties.$notifys({
      title: 'Gợi ý luyện khí',
      message: 'Cấp độ luyện khí của trang bị hiện tại đã tối đa',
      position: 'top-left',
    });
    return;
  }
  globalProperties
    .$confirm(
      item.strengthen >= 15 && !state.protect
        ? `Cấp độ luyện khí của trang bị hiện tại đã đạt +${item.strengthen}, nếu luyện khí thất bại, trang bị sẽ bị hủy, bạn có muốn tiếp tục luyện khí không?`
        : 'Bạn có chắc muốn luyện khí không?',
      'Gợi ý luyện khí',
      {
        cancelButtonText: 'Tôi nhấn nhầm',
        confirmButtonText: 'Chắc chắn',
      }
    )
    .then(() => {
      if (Math.random() <= successRate) {
        const attack = Math.floor(item.initial.attack * 0.2);
        const health = Math.floor(item.initial.health * 0.2);
        const defense = Math.floor(item.initial.defense * 0.2);
        switch (item.type) {
          case 'weapon':
            item.attack += attack;
            playerAttribute(0, attack, 0, 0, 0);
            break;
          case 'armor':
            item.health += health;
            item.defense += defense;
            playerAttribute(0, 0, health, 0, defense);
            break;
          case 'accessory':
          case 'sutra':
            item.attack += attack;
            item.health += health;
            item.defense += defense;
            playerAttribute(0, attack, health, 0, defense);
            break;
          default:
            break;
        }
        item.strengthen++;
        item.score = equip.calculateEquipmentScore(
          item.dodge,
          item.attack,
          item.health,
          item.critical,
          item.defense
        );
        globalProperties.$notifys({
          title: 'Gợi ý luyện khí',
          message: 'Luyện khí thành công',
          position: 'top-left',
        });
      } else {
        if (item.strengthen >= 15 && !state.protect) {
          state.player.equipment[item.type] = {};
          playerAttribute(
            -item.dodge,
            -item.attack,
            -item.health,
            -item.critical,
            -item.defense
          );
          item.strengthen = 0;
          state.strengthenShow = false;
        }
        globalProperties.$notifys({
          title: 'Gợi ý luyện khí',
          message:
            item.strengthen >= 15 && !state.protect
              ? 'Luyện khí thất bại, trang bị đã tự động bị hủy'
              : 'Luyện khí thất bại',
          position: 'top-left',
        });
      }
      state.player.props.strengtheningStone -= calculateCost;
    })
    .catch(() => {});
};

const calculateEnhanceSuccessRate = (item) => {
  let baseSuccessRate = 1;
  let decrementPerLevel = 0.03;
  let increase = state.increase ? 0.1 : 0;
  return baseSuccessRate - (item.strengthen * decrementPerLevel - increase);
};

const petUpgrade = (item) => {
  const consume = petConsumption(item.level);
  if (state.petRootBone && state.player.props.rootBone < item.rootBone) {
    globalProperties.$notifys({
      title: 'Gợi ý bồi dưỡng linh sủng',
      message: 'Đan ngộ tính không đủ, không thể nâng cao ngộ tính linh sủng',
      position: 'top-left',
    });
    return;
  }
  if (
    state.petReincarnation &&
    state.player.reincarnation < state.player.pet.reincarnation
  ) {
    globalProperties.$notifys({
      title: 'Gợi ý bồi dưỡng linh sủng',
      message: 'Chuyển sinh linh sủng không thể cao hơn chuyển sinh nhân vật',
      position: 'top-left',
    });
    return;
  }
  if (state.petReincarnation && globalProperties.$maxLv > item.level) {
    globalProperties.$notifys({
      title: 'Gợi ý bồi dưỡng linh sủng',
      message: 'Cảnh giới linh sủng chưa tối đa, không thể chuyển sinh',
      position: 'top-left',
    });
    return;
  }
  if (!state.petReincarnation && item.level >= globalProperties.$maxLv) {
    globalProperties.$notifys({
      title: 'Gợi ý bồi dưỡng linh sủng',
      message: 'Cảnh giới linh sủng đã tối đa, hãy chuyển sinh',
      position: 'top-left',
    });
    return;
  }
  if (consume > state.player.props.cultivateDan) {
    globalProperties.$notifys({
      title: 'Gợi ý bồi dưỡng linh sủng',
      message: 'Đan bồi dưỡng không đủ, không thể bồi dưỡng',
      position: 'top-left',
    });
    return;
  }
  globalProperties
    .$confirm(
      'Bạn có chắc muốn bồi dưỡng linh sủng này không?',
      'Gợi ý bồi dưỡng linh sủng',
      {
        cancelButtonText: 'Tôi nhấn nhầm',
        confirmButtonText: 'Chắc chắn',
      }
    )
    .then(() => {
      let attack,
        health,
        defense = 0;
      if (state.petRootBone && state.player.props.rootBone >= item.rootBone) {
        let rootBone = item.initial.rootBone - item.rootBone;
        rootBone = rootBone ? rootBone : 1;
        attack = Math.floor(item.initial.attack * rootBone);
        health = Math.floor(item.initial.health * rootBone);
        defense = Math.floor(item.initial.defense * rootBone);
        item.rootBone++;
        state.player.props.rootBone -= item.rootBone;
      } else {
        attack = Math.floor(item.initial.attack * 0.05);
        health = Math.floor(item.initial.health * 0.05);
        defense = Math.floor(item.initial.defense * 0.05);
      }
      if (state.petReincarnation && item.level >= globalProperties.$maxLv) {
        state.player.pet.level = 1;
        state.petReincarnation = false;
        state.player.pet.reincarnation++;
        globalProperties.$notifys({
          title: 'Gợi ý bồi dưỡng linh sủng',
          message:
            'Chuyển sinh linh sủng thành công, đã đặt lại cảnh giới linh sủng',
          position: 'top-left',
        });
      } else {
        state.player.pet.level++;
        globalProperties.$notifys({
          title: 'Gợi ý bồi dưỡng linh sủng',
          message: 'Bồi dưỡng linh sủng thành công',
          position: 'top-left',
        });
      }
      state.player.pet.attack += attack;
      state.player.pet.health += health;
      state.player.pet.defense += defense;
      playerAttribute(0, attack, health, 0, defense);
      state.player.pet.score = equip.calculateEquipmentScore(
        state.player.pet.dodge,
        state.player.pet.attack,
        state.player.pet.health,
        state.player.pet.critical,
        state.player.pet.defense
      );
      state.player.props.cultivateDan -= consume;
    })
    .catch(() => {});
};

const wifeUpgrade = (item) => {
  const consume = item.level * 10;
  if (consume > state.player.props.qingyuan) {
    globalProperties.$notifys({
      title: 'Gợi ý nâng cấp đạo lữ',
      message: 'Điểm tình duyên không đủ, không thể bồi dưỡng',
      position: 'top-left',
    });
    return;
  }
  globalProperties
    .$confirm(
      'Bạn có chắc muốn nâng cấp đạo lữ này không?',
      'Gợi ý nâng cấp đạo lữ',
      {
        cancelButtonText: 'Tôi nhấn nhầm',
        confirmButtonText: 'Chắc chắn',
      }
    )
    .then(() => {
      const attack = Math.floor(item.attack * 0.1);
      const health = Math.floor(item.health * 0.1);
      const defense = Math.floor(item.defense * 0.1);
      state.player.wife.level++;
      globalProperties.$notifys({
        title: 'Gợi ý nâng cấp đạo lữ',
        message: 'Nâng cấp đạo lữ thành công',
        position: 'top-left',
      });
      state.player.wife.attack += attack;
      state.player.wife.health += health;
      state.player.wife.defense += defense;
      playerAttribute(0, attack, health, 0, defense);
      state.player.props.qingyuan -= consume;
    })
    .catch(() => {});
};

const petConsumption = (lv) => {
  const cost = state.petReincarnation ? 10 : 1;
  const reincarnation = state.player.pet.reincarnation ? lv * 200 : 1;
  return (lv * 200 + reincarnation) * cost;
};

const shopBuy = (item) => {
  if (state.player.props.currency >= state.shopPrice) {
    state.player.props.currency -= state.shopPrice;
    if (state.player.inventory.length >= state.player.backpackCapacity)
      state.storyText = `Dung lượng túi trang bị hiện tại đã đầy, trang bị này sẽ tự động bị bỏ, chuyển sinh có thể tăng dung lượng túi`;
    else state.player.inventory.push(item);
    state.inventoryActive = item.type;
    globalProperties.$notifys({
      title: 'Gợi ý mua hàng',
      message: `Bạn đã chi ${state.shopPrice} đá Hồng Mông để mua ${item.name} thành công`,
    });
  } else {
    globalProperties.$notifys({
      title: 'Gợi ý mua hàng',
      message: 'Mua thất bại, đá Hồng Mông không đủ',
    });
  }
};

const wifeTack = (item) => {
  if (JSON.stringify(state.player.wife) !== '{}') {
    const itemInfo = state.player.wife;
    playerAttribute(
      -itemInfo.dodge,
      -itemInfo.attack,
      -itemInfo.health,
      -itemInfo.critical,
      -itemInfo.defense
    );
    state.player.wifes.push(state.player.wife);
  }
  state.player.wife = item;
  playerAttribute(
    item.dodge,
    item.attack,
    item.health,
    item.critical,
    item.defense
  );
  state.player.wifes = state.player.wifes.filter((i) => i.name !== item.name);
};

const wifeRevoke = () => {
  const item = state.player.wife;
  playerAttribute(
    -item.dodge,
    -item.attack,
    -item.health,
    -item.critical,
    -item.defense
  );
  state.player.wife = {};
  state.player.wifes.push(item);
};

const wifeItemInfo = (item) => {
  globalProperties
    .$confirm('', item.name, {
      center: true,
      message: `<div class="monsterinfo">
                    <div class="monsterinfo-box">
                        <p>Cảnh giới: ${globalProperties.$levelNames(item.level)}</p>
                        <p>Khí huyết: ${globalProperties.$formatNumberToChineseUnit(
                          item.health
                        )}</p>
                        <p>Công kích: ${globalProperties.$formatNumberToChineseUnit(
                          item.attack
                        )}</p>
                        <p>Phòng thủ: ${globalProperties.$formatNumberToChineseUnit(
                          item.defense
                        )}</p>
                    </div>
                </div>`,
      confirmButtonText: 'Theo dõi',
      dangerouslyUseHTMLString: true,
    })
    .then(() => {
      wifeTack(item);
    })
    .catch(() => {});
};

const shopItemInfo = (item) => {
  globalProperties
    .$confirm('', item.name, {
      center: true,
      message: `<div class="monsterinfo">
                    <div class="monsterinfo-box">
                        <p>Giá: ${state.shopPrice} đá Hồng Mông</p>
                        <p>Loại: ${globalProperties.$genre[item.type]}</p>
                        <p>Cảnh giới: ${globalProperties.$levelNames(item.level)}</p>
                        <p>Phẩm chất: ${globalProperties.$levels[item.quality]}</p>
                        <p>Khí huyết: ${globalProperties.$formatNumberToChineseUnit(
                          item.health
                        )}</p>
                        <p>Công kích: ${globalProperties.$formatNumberToChineseUnit(
                          item.attack
                        )}</p>
                        <p>Phòng thủ: ${globalProperties.$formatNumberToChineseUnit(
                          item.defense
                        )}</p>
                        <p>Tỷ lệ né tránh: ${
                          item.dodge > 0
                            ? item.dodge * 100 > 100
                              ? 100
                              : (item.dodge * 100).toFixed(2)
                            : 0
                        }%</p>
                        <p>Tỷ lệ bạo kích: ${
                          item.critical > 0
                            ? item.critical * 100 > 100
                              ? 100
                              : (item.critical * 100).toFixed(2)
                            : 0
                        }%</p>
                        <p>Điểm trang bị: ${globalProperties.$formatNumberToChineseUnit(
                          item.score
                        )}</p>
                    </div>
                </div>`,
      cancelButtonText: 'Hủy mua',
      confirmButtonText: 'Mua trang bị',
      dangerouslyUseHTMLString: true,
    })
    .then(() => {
      shopBuy(item);
    })
    .catch(() => {});
};

const newbiePack = (timesLeft) => {
  if (state.player.isNewbie) {
    globalProperties.$notifys({
      title: 'Gợi ý',
      message: 'Gói quà tân thủ không thể nhận lại',
    });
    return;
  }
  state.newBieBox = true;
  let equipItem = {};
  if (timesLeft == 4) equipItem = equip.equip_Weapons(10, false);
  else if (timesLeft == 3) equipItem = equip.equip_Armors(10, false);
  else if (timesLeft == 2) equipItem = equip.equip_Accessorys(10, false);
  else if (timesLeft == 1) equipItem = equip.equip_Sutras(10, false);
  else if (timesLeft == 0) state.newBieLoading = false;
  else return;
  if (JSON.stringify(equipItem) !== '{}') state.newBieData.push(equipItem);
  timesLeft--;
  setTimeout(() => {
    newbiePack(timesLeft);
  }, 100);
};

const refreshNewBie = () => {
  state.newBieData = [];
  state.newBieLoading = true;
  newbiePack(4);
};

const newBieInfo = (item) => {
  state.newBieItem = item;
  state.newBieInfoBox = true;
};

const confirmCollectionNewBie = () => {
  globalProperties
    .$confirm(
      'Bạn có chắc đã nhận được trang bị mình hài lòng chưa?',
      'Gợi ý',
      {
        center: true,
        cancelButtonText: 'Không chắc',
        confirmButtonText: 'Xác nhận',
        dangerouslyUseHTMLString: true,
      }
    )
    .then(() => {
      state.newBieBox = false;
      state.player.inventory = state.newBieData;
      state.newBieData = [];
      state.player.isNewbie = true;
      globalProperties.$notifys({
        title: 'Gợi ý nhận gói quà tân thủ',
        message: 'Nhận gói quà tân thủ thành công!',
      });
    })
    .catch(() => {});
};

const inventoryClose = (item) => {
  globalProperties
    .$confirm(
      `Bạn có chắc muốn phân giải <span class="el-tag el-tag--${
        item.quality
      }">${globalProperties.$levels[item.quality]} ${item.name}(${
        globalProperties.$genre[item.type]
      })</span> không?`,
      'Phân giải trang bị',
      {
        center: true,
        cancelButtonText: 'Hủy phân giải',
        confirmButtonText: 'Phân giải',
        dangerouslyUseHTMLString: true,
      }
    )
    .then(() => {
      const num =
        item.level + Math.floor((item.level * state.player.reincarnation) / 10);
      state.player.props.strengtheningStone += num;
      state.player.inventory = state.player.inventory.filter(
        (obj) => obj.id !== item.id
      );
      state.inventoryShow = false;
      globalProperties.$notifys({
        title: 'Gợi ý bán trang bị trong túi',
        message: `${item.name} đã được bán thành công, bạn nhận được ${num} đá luyện khí`,
      });
    })
    .catch(() => {});
};

const getObjectById = (id, arr) => {
  return arr.find((obj) => obj.id === id);
};

const inventory = (id) => {
  state.inventoryInfo = getObjectById(id, state.player.inventory);
  state.inventoryShow = true;
};

const petItemInfo = (item) => {
  state.petShow = true;
  state.petInfo = item;
};

const petRetract = () => {
  const item = state.player.pet;
  if (JSON.stringify(item) == '{}') return;
  playerAttribute(
    -item.dodge,
    -item.attack,
    -item.health,
    -item.critical,
    -item.defense
  );
  state.inventoryActive = 'pet';
  state.player.pets.push(item);
  state.player.pet = {};
};

const computePetsLevel = (lv) => {
  if (lv >= 1 && lv <= 9) return 'success';
  if (lv >= 10 && lv <= 19) return 'primary';
  if (lv >= 20 && lv <= 29) return 'warning';
  if (lv >= 30) return 'danger';
};

const playerAttribute = (
  dodge = 0,
  attack = 0,
  health = 0,
  critical = 0,
  defense = 0
) => {
  dodge = isNaN(dodge) || !dodge ? 0 : parseFloat(dodge);
  attack = isNaN(attack) || !attack ? 0 : Math.floor(attack);
  health = isNaN(health) || !health ? 0 : Math.floor(health);
  defense = isNaN(defense) || !defense ? 0 : Math.floor(defense);
  critical = isNaN(critical) || !critical ? 0 : parseFloat(critical);
  state.player.dodge = state.player.dodge + dodge;
  state.player.attack = state.player.attack + attack;
  state.player.health = state.player.health + health;
  state.player.maxHealth = state.player.maxHealth + health;
  state.player.critical = state.player.critical + critical;
  state.player.defense = state.player.defense + defense;
  state.player.score = equip.calculateEquipmentScore(
    state.player.dodge,
    state.player.attack,
    state.player.maxHealth,
    state.player.critical,
    state.player.defense
  );
};

const equipmentClose = (type) => {
  const { inventory, equipment } = state.player;
  if (!equipment[type]) return;
  playerAttribute(
    -equipment[type].dodge,
    -equipment[type].attack,
    -equipment[type].health,
    -equipment[type].critical,
    -equipment[type].defense
  );
  state.equipmentActive = type;
  equipment[type].id = Date.now();
  inventory.push(equipment[type]);
  equipment[type] = {};
};

const getEquipmentInfo = (id, type) => {
  if (!id || !type) return;
  const equipment = getObjectById(
    id,
    state.player.inventory.concat(state.player.equipment[type])
  );
  if (!equipment) return;
  state.strengthenInfo = equipment;
  if (state.player.equipment[type]) {
    state.player.equipment[type].strengthen = equipment.strengthen
      ? equipment.strengthen
      : 0;
  }
};

const equipmentInfo = (id, type) => {
  if (id) {
    state.strengthenShow = true;
    getEquipmentInfo(id, type);
  }
};

const equipmentDropdown = (command) => {
  state.equipmentDropdownActive = command;
  state.player.inventory = state.player.inventory
    .slice()
    .sort((a, b) => b[command] - a[command]);
};

const petDropdown = (command) => {
  state.petDropdownActive = command;
  state.player.pets = state.player.pets
    .slice()
    .sort((a, b) => b[command] - a[command]);
};

const attributePoints = (type) => {
  const typeNames = {
    attack: 'Công kích',
    health: 'Khí huyết',
    defense: 'Phòng thủ',
  };
  if (state.player.points > 0) {
    const num = state.player.reincarnation
      ? state.player.reincarnation * 10
      : 1;
    const numText =
      type == 'attack' || type == 'defense' ? 50 * num : 100 * num;
    if (type == 'attack') playerAttribute(0, numText, 0, 0, 0);
    else if (type == 'defense') playerAttribute(0, 0, 0, 0, numText);
    else if (type == 'health') playerAttribute(0, 0, numText, 0, 0);
    state.player.points--;
    globalProperties.$notifys({
      title: 'Gợi ý thêm điểm',
      message: `Thêm điểm thành công, ${typeNames[type]} tăng ${numText} điểm`,
    });
  }
};

const calculatePercentageDifference = (num1, num2) => {
  let difference = Math.abs(num1 - num2);
  let percentage = (difference / num1) * 100;
  const num3 =
    state.player.maxCultivation - state.player.cultivation > 0
      ? 100 - percentage
      : 100;
  return `${num3.toFixed(2)}%`;
};

const copyContent = (type) => {
  const content =
    type == 'qq'
      ? '920930589'
      : 'https://github.com/setube/vue-XiuXianGame';
  globalProperties
    .$prompt(
      '',
      type == 'qq' ? 'Nhóm chat chính thức' : 'Địa chỉ mã nguồn mở',
      {
        inputValue: content,
        showCancelButton: false,
        confirmButtonText: 'Sao chép',
        beforeClose: async (action, globalProperties, done) => {
          if (action === 'confirm') {
            if (window.navigator.clipboard) {
              try {
                await window.navigator.clipboard.writeText(content);
                done();
                state.show = false;
                globalProperties.$notifys({
                  title: 'Gợi ý',
                  message: 'Sao chép thành công',
                });
              } catch (err) {
                globalProperties.$notifys({
                  title: 'Gợi ý',
                  message: 'Sao chép thất bại, vui lòng sao chép thủ công',
                });
              }
            }
          } else {
            done();
          }
        },
      }
    )
    .catch(() => {});
};

const getTagClass = (type, index) => {
  const achievements1 = globalProperties.$store.player.achievement[type] || [];
  return (
    Array.isArray(achievements1) &&
    achievements1.some((ach) => ach.id === index)
  );
};

const achievementInfo = (type, item) => {
  let message = '';
  if (
    item.condition.health ||
    item.condition.attack ||
    item.condition.defense ||
    item.condition.dodge ||
    item.condition.critical
  ) {
    message = `<p>Khí huyết: ${item.condition.health || 'Không yêu cầu'}</p>
                    <p>Công kích: ${item.condition.attack || 'Không yêu cầu'}</p>
                    <p>Phòng thủ: ${item.condition.defense || 'Không yêu cầu'}</p>
                    <p>Tỷ lệ né tránh: ${
                      item.condition.dodge
                        ? (item.condition.dodge * 100).toFixed(2) + '%'
                        : 'Không yêu cầu'
                    }</p>
                    <p>Tỷ lệ bạo kích: ${
                      item.condition.critical
                        ? (item.condition.critical * 100).toFixed(2) + '%'
                        : 'Không yêu cầu'
                    }</p>`;
  } else if (item.condition.level) {
    message = `<p>Đạt cấp độ: ${item.condition.level}</p>`;
  } else if (item.condition.monstersDefeated) {
    message = `<p>Số lượng quái vật đánh bại: ${item.condition.monstersDefeated}</p>`;
  } else if (item.condition.money) {
    message = `<p>Tích lũy linh thạch: ${globalProperties.$formatNumberToChineseUnit(
      item.condition.money
    )}</p>`;
  }
  if (item.desc) {
    message += `<p>Mô tả: ${item.desc}</p>`;
  }
  message += `<p>Phần thưởng hoàn thành: ${item.award} đan bồi dưỡng</p>`;
  message += `<p>Tăng cường danh hiệu: ${formatTitleBonus(item.titleBonus)}</p>`;
  const isCompleted = getTagClass(type, item.id);
  const isWearing = state.player.currentTitle === item.name;
  globalProperties
    .$confirm('', `${item.name}`, {
      center: true,
      message: `<div class="monsterinfo"><div class="monsterinfo-box">${message}</div></div>`,
      cancelButtonText: 'Đóng',
      showCancelButton: isCompleted,
      confirmButtonText: isCompleted
        ? isWearing
          ? 'Hủy đeo'
          : 'Đeo danh hiệu'
        : 'Đã hiểu',
      dangerouslyUseHTMLString: true,
    })
    .then(() => {
      if (isCompleted) toggleTitle(item);
    })
    .catch(() => {});
};

const formatTitleBonus = (bonus) => {
  return Object.entries(bonus)
    .map(([key, value]) => {
      const num = value > 1 ? value : `${value * 100}%`;
      return `${globalProperties.$dropdownTypeObject[key]}+${num}`;
    })
    .join(', ');
};

const toggleTitle = (achievement) => {
  if (state.player.currentTitle === achievement.name) {
    applyTitleBonus(achievement.titleBonus, false);
    state.player.currentTitle = null;
    globalProperties.$notifys({
      title: 'Hệ thống danh hiệu',
      message: `Bạn đã hủy đeo danh hiệu "${achievement.name}"`,
    });
  } else {
    if (state.player.currentTitle) {
      const oldAchievement = findAchievementByTitle(state.player.currentTitle);
      if (oldAchievement)
        applyTitleBonus(oldAchievement.titleBonus, false);
    }
    applyTitleBonus(achievement.titleBonus, true);
    state.player.currentTitle = achievement.name;
    globalProperties.$notifys({
      title: 'Hệ thống danh hiệu',
      message: `Bạn đã đeo danh hiệu "${achievement.name}"`,
    });
  }
};

const applyTitleBonus = (bonus, isApplying) => {
  const multiplier = isApplying ? 1 : -1;
  let dodge = 0,
    attack = 0,
    health = 0,
    critical = 0,
    defense = 0;
  Object.entries(bonus).forEach(([key, value]) => {
    switch (key) {
      case 'dodge':
        dodge += value * multiplier;
        break;
      case 'attack':
        attack += value * multiplier;
        break;
      case 'health':
        health += value * multiplier;
        break;
      case 'critical':
        critical += value * multiplier;
        break;
      case 'defense':
        defense += value * multiplier;
        break;
      default:
    }
  });
  playerAttribute(dodge, attack, health, critical, defense);
};

const findAchievementByTitle = (title) => {
  return state.achievementAll
    .flatMap((category) => category.data)
    .find((ach) => ach.name === title);
};

const illustrationsInfo = (i, ii) => {
  const info = state.illustrationsItems[i].data[ii];
  globalProperties
    .$confirm('', info.name, {
      center: true,
      message: `<div class="monsterinfo">
                        <div class="monsterinfo-box">
                            <p>Loại: ${globalProperties.$genre[info.type]}</p>
                            <p>Cảnh giới: ${globalProperties.$levelNames(info.level)}</p>
                            <p>Phẩm chất: ${globalProperties.$levels[info.quality]}</p>
                            <p>Khí huyết: ${globalProperties.$formatNumberToChineseUnit(
                              info.health
                            )}</p>
                            <p>Công kích: ${globalProperties.$formatNumberToChineseUnit(
                              info.attack
                            )}</p>
                            <p>Phòng thủ: ${globalProperties.$formatNumberToChineseUnit(
                              info.defense
                            )}</p>
                            <p>Tỷ lệ né tránh: ${
                              info.dodge > 0
                                ? info.dodge * 100 > 100
                                  ? 100
                                  : (info.dodge * 100).toFixed(2)
                                : 0
                            }%</p>
                            <p>Tỷ lệ bạo kích: ${
                              info.critical > 0
                                ? info.critical * 100 > 100
                                  ? 100
                                  : (info.critical * 100).toFixed(2)
                                : 0
                            }%</p>
                            <p>Điểm trang bị: ${globalProperties.$formatNumberToChineseUnit(
                              info.score
                            )}</p>
                            <p>Tỷ lệ nhận: ${info.prize}%</p>
                        </div>
                    </div>`,
      showCancelButton: false,
      confirmButtonText: 'Đã hiểu',
      dangerouslyUseHTMLString: true,
    })
    .catch(() => {});
};
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

.user-name {
  margin-right: 5px;
}

.equip-box {
  padding: 0 3px;
  margin-top: 4px;
  display: flex;
  flex-direction: column;
}

.equip-item {
  margin-bottom: 8px;
  height: 40px;
  line-height: 38px;
}

.equip {
  margin-left: 10px;
}

.inventory-box {
  white-space: pre-wrap;
  min-height: 40px;
  line-height: 38px;
  height: auto;
}

.inventory-content {
  margin-bottom: 15px;
  height: 120px;
  overflow: auto;
}

.inventory-item {
  margin: 4px;
}

.dialog-footer {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
}

.dialog-upload {
  margin: 0;
}

.dialog-footer-button {
  margin: 10px 0 0 0 !important;
  width: 100%;
}

.dialog-footer-button:nth-child(2 + n) {
  margin-top: 10px;
  width: 100%;
}

/* 炼器弹窗 */
.strengthen-box {
  padding: 0 5px;
}

.click-box {
  padding: 0 5px;
  margin-top: 10px;
}

.click-box button {
  margin-top: 10px;
  width: 100%;
}

/* 装备信息 */
.monsterinfo {
  display: flex;
  justify-content: center;
}

.monsterinfo-box {
  display: grid;
  grid-template-columns: 1fr 20px 1fr;
  gap: 10px;
}

.collapse p,
.monsterinfo-box p {
  display: contents;
}

.description {
  text-align: left;
}

.icon {
  text-align: center;
}

.value {
  text-align: left;
}

/* 基础属性对比 */
.collapse {
  margin: 20px 0;
}

/* 属性对比 */
.el-icon-caret-top,
.el-icon-caret-bottom {
  width: 1em;
  height: 1em;
  display: block;
  margin-left: 5px;
}

.el-icon-caret-top {
  background-image: url(@/assets/CaretTop.svg);
}

.el-icon-caret-bottom {
  background-image: url(@/assets/caretBottom.svg);
}

.equipAll-content {
  display: flex;
  flex-wrap: wrap;
}

.equipAll-item {
  width: 20%;
  margin-top: 10px;
}

.achievement-content {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  justify-content: center;
  color: var(--el-text-color-primary);
}

.achievement-item {
  width: 33.33%;
  margin-top: 10px;
}

.backtop {
  background-color: #4d4d4d;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: #fff;
  position: fixed;
  z-index: 1;
  bottom: 20px;
  right: 20px;
  display: none;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.dark .backtop {
  background-color: #fff;
  color: #4d4d4d;
}

/* 新手弹窗 */
.newBie {
  display: flex;
  flex-direction: column;
  height: 128px;
  margin-bottom: 10px;
}

.newbieinfo-box p {
  margin-bottom: 10px;
}

@media only screen and (max-width: 768px) {
  .title {
    font-size: 20px;
  }

  .game-container {
    min-height: 574px;
    min-width: 356px;
  }

  .equip-box {
    padding: 0 5px;
  }

  .inventory-button {
    margin-left: 0 !important;
  }

  .equipAll-item {
    width: 33%;
  }

  .achievement-item {
    width: 50%;
  }

  .backtop {
    display: flex;
  }
}
</style>

<style>
.equipAll {
  width: 60% !important;
}

@media only screen and (max-width: 768px) {
  .equipAll {
    width: 100% !important;
  }

  /* 新手弹窗 */
  .newBieBox {
    width: 60% !important;
  }
}

.el-collapse-item__content,
.el-collapse-item div[role="tab"] {
  display: flex;
  justify-content: center;
}

.el-message-box--center {
  text-align: center;
}

/* 上传按钮 */
.el-upload {
  width: 100%;
}
</style>
