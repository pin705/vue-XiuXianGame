<template>
  <div class="index">
    <div class="index-box">
      <div class="story mb-2">
        <p v-html="storyText" />
      </div>
      <div class="attributes">
        <div class="attribute-box">
          <div class="tag attribute" @click="editUserName">
            Tên: {{ player.name }}
            <el-text v-if="player.currentTitle" type="danger">
              [{{ player.currentTitle }}]
            </el-text>
            <el-icon>
              <EditPen />
            </el-icon>
          </div>
          <div class="tag attribute">Tuổi: {{ player.age }} tuổi</div>
          <div class="tag attribute" @click="isLevel = true">
            Cảnh giới: {{ $levelNames(player.level) }} ({{
              player.reincarnation || 0
            }}
            chuyển)
            <el-icon>
              <Warning />
            </el-icon>
          </div>
          <div class="tag attribute" v-if="player.level >= this.$maxLv">
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
              @click="petItemShow = true"
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
          <el-tabs v-model="inventoryActive" :stretch="true">
            <el-tab-pane label="Trang bị" name="equipment">
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
                      :disabled="equipmentDropdownActive == item.type"
                    >
                      Theo {{ item.name }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
              <el-tabs v-model="equipmentActive">
                <el-tab-pane
                  :label="i.name"
                  :name="i.type"
                  v-for="(i, k) in backPackItem"
                  :key="k"
                >
                  <div class="inventory-content">
                    <div v-if="player.inventory.length">
                      <template v-for="item in player.inventory" :key="item.id">
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
                        <!-- <el-popover
                          placement="bottom-start"
                          :title="item.name"
                          :width="300"
                          trigger="hover"
                          content="this is content, this is content, this is content"
                        >
                          <template #reference>
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
                              }}{{
                                item?.strengthen ? "+" + item?.strengthen : ""
                              }}
                            </tag>
                          </template>
                          <template #default>
                            <div>
                              <equip-tooltip
                                :player="player"
                                :strengthen-info="strengthenInfo"
                              />
                            </div>
                          </template>
                        </el-popover> -->
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
            <el-tab-pane label="Đạo cụ" name="props">
              <div class="inventory-content">
                <template v-for="(item, index) in sortedProps" :key="index">
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
            <el-tab-pane label="Linh sủng" name="pet">
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
                      :disabled="petDropdownActive == item.type"
                    >
                      Theo {{ item.name }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
              <div class="inventory-content">
                <template v-for="(item, index) in player.pets" :key="index">
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
            <el-tab-pane label="Đạo lữ" name="wife">
              <div class="inventory-content">
                <template v-for="(item, index) in player.wifes" :key="index">
                  <tag class="inventory-item" @click="wifeItemInfo(item)">
                    {{ item.name }}
                  </tag>
                </template>
              </div>
            </el-tab-pane>
            <el-tab-pane label="Cửa hàng Hồng Mông" name="shop">
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
              <el-tabs v-model="shopActive" :stretch="true">
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
        <div class="action" v-for="(action, index) in actions" :key="index">
          <el-button
            class="item"
            :type="action.type ? action.type : ''"
            @click="action.handler"
          >
            {{ action.text }}
          </el-button>
        </div>
        <div class="action">
          <el-button class="item" @click="show = true">
            Cài đặt trò chơi
          </el-button>
        </div>
      </div>
    </div>
    <el-drawer
      title="Bảng cảnh giới tu tiên"
      v-model="isLevel"
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
      v-model="wifeItemShow"
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
      v-model="petItemShow"
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
            <div class="tag attribute">Ngộ tính: {{ player.pet.rootBone }}</div>
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
            v-model="petReincarnation"
            label="Linh sủng chuyển sinh"
          />
          <el-checkbox v-model="petRootBone" label="Nâng cao ngộ tính" />
          <el-button type="primary" @click="petUpgrade(player.pet)">
            Bồi dưỡng speranza
          </el-button>
        </div>
      </div>
    </el-drawer>
    <el-drawer
      :title="strengthenInfo.name"
      v-model="strengthenShow"
      direction="rtl"
      class="strengthen"
    >
      <div class="strengthen-box" v-if="strengthenShow">
        <equip-tooltip
          :calculate-cost="calculateCost(strengthenInfo)"
          :calculate-enhance-success-rate="
            calculateEnhanceSuccessRate(strengthenInfo)
          "
          :player="player"
          :strengthen-info="strengthenInfo"
        />
        <div class="click-box">
          <el-checkbox v-model="protect" label="Bảo vệ luyện khí" />
          <el-checkbox v-model="increase" label="Tăng cường luyện khí" />
          <el-button type="primary" @click="enhance(strengthenInfo)">
            Luyện khí
          </el-button>
        </div>
      </div>
    </el-drawer>
    <el-dialog :title="petInfo.name" v-model="petShow" center width="420px">
      <div class="monsterinfo">
        <div class="monsterinfo-box">
          <p>
            <span class="description"
              >Cảnh giới: {{ $levelNames(petInfo?.level) }}</span
            >
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
            <span class="description"
              >Chuyển sinh: {{ petInfo?.reincarnation || 0 }}</span
            >
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
            <span class="description"
              >Tỷ lệ né tránh:
              {{
                petInfo?.dodge > 0
                  ? petInfo?.dodge * 100 > 100
                    ? 100
                    : (petInfo?.dodge * 100).toFixed(2)
                  : 0
              }}%</span
            >
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
            <span class="description"
              >Tỷ lệ bạo kích:
              {{
                petInfo?.critical > 0
                  ? petInfo?.critical * 100 > 100
                    ? 100
                    : (petInfo?.critical * 100).toFixed(2)
                  : 0
              }}%</span
            >
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
            <span class="description"
              >Điểm linh sủng: {{ petInfo?.score }}</span
            >
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
      <el-collapse v-model="petCollapse" class="collapse">
        <el-collapse-item name="1">
          <template #title>
            <div class="custom-title">So sánh thuộc tính cơ bản</div>
          </template>
          <div class="monsterinfo-box">
            <p>
              <span class="description"
                >Khí huyết: {{ petInfo?.initial?.health }}</span
              >
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
              <span class="description"
                >Công kích: {{ petInfo?.initial?.attack }}</span
              >
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
              <span class="description"
                >Phòng thủ: {{ petInfo?.initial?.defense }}</span
              >
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
        <el-button plain class="dialog-footer-button" @click="petLock(petInfo)">
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
      :title="inventoryInfo.name"
      v-model="inventoryShow"
      center
      width="420px"
    >
      <div class="monsterinfo" v-if="inventoryShow">
        <div class="monsterinfo-box">
          <p>
            <span class="description"
              >Loại: {{ $genre[inventoryInfo.type] }}</span
            >
            <span class="icon" />
            <span class="value" />
          </p>
          <p>
            <span class="description"
              >Luyện khí: {{ inventoryInfo.strengthen || 0 }}</span
            >
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
            <span class="description"
              >Cảnh giới: {{ $levelNames(inventoryInfo.level) }}</span
            >
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
            <span class="description"
              >Phẩm chất: {{ $levels[inventoryInfo.quality] }}</span
            >
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
            <span class="description"
              >Khí huyết: {{ inventoryInfo?.health }}</span
            >
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
            <span class="description"
              >Công kích: {{ inventoryInfo?.attack }}</span
            >
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
            <span class="description"
              >Phòng thủ: {{ inventoryInfo?.defense }}</span
            >
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
            <span class="description"
              >Tỷ lệ né tránh:
              {{
                inventoryInfo?.dodge > 0
                  ? inventoryInfo?.dodge * 100 > 100
                    ? 100
                    : (inventoryInfo?.dodge * 100).toFixed(2)
                  : 0
              }}%</span
            >
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
            <span class="description"
              >Tỷ lệ bạo kích:
              {{
                inventoryInfo?.critical > 0
                  ? inventoryInfo?.critical * 100 > 100
                    ? 100
                    : (inventoryInfo?.critical * 100).toFixed(2)
                  : 0
              }}%</span
            >
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
            <span class="description"
              >Điểm trang bị: {{ inventoryInfo?.score }}</span
            >
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
      <el-collapse v-model="inventoryCollapse" class="collapse">
        <el-collapse-item name="1">
          <template #title>
            <div class="custom-title">So sánh thuộc tính cơ bản</div>
          </template>
          <div class="monsterinfo-box">
            <p>
              <span class="description"
                >Khí huyết: {{ inventoryInfo?.initial?.health }}</span
              >
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
              <span class="description"
                >Công kích: {{ inventoryInfo?.initial?.attack }}</span
              >
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
              <span class="description"
                >Phòng thủ: {{ inventoryInfo?.initial?.defense }}</span
              >
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
      title="Xử lý hàng loạt"
      v-model="sellingEquipmentShow"
      width="600px"
    >
      <el-divider>Trang bị</el-divider>
      <el-checkbox-group
        v-model="player.sellingEquipmentData"
        @change="sellingEquipmentDataChange"
      >
        <el-checkbox
          v-for="(item, index) in AllEquipmenType"
          :value="item"
          :key="index"
          :label="$levels[item]"
        />
      </el-checkbox-group>
      <div class="dialog-footer" style="margin-top: 20px">
        <el-button class="dialog-footer-button" @click="sellingEquipment">
          Phân giải trang bị
        </el-button>
      </div>
      <el-divider>Linh sủng</el-divider>
      <div class="dialog-footer" style="margin-top: 20px">
        <el-button class="dialog-footer-button" @click="sellingPet">
          Thả linh sủng
        </el-button>
      </div>
    </el-dialog>
    <el-dialog v-model="show" title="Cài đặt trò chơi" width="350px">
      <div class="dialog-footer">
        <el-divider>Liên quan đến lưu trữ</el-divider>
        <el-button class="dialog-footer-button" @click="exportData">
          Lưu dữ liệu
        </el-button>
        <el-upload
          action="#"
          class="dialog-upload"
          :http-request="importData"
          :show-file-list="false"
          accept="application/json"
        >
          <el-button class="dialog-footer-button"> Nhập lưu trữ </el-button>
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
        <el-button class="dialog-footer-button" @click="sellingEquipmentBox">
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
          <el-switch size="large" v-model="player.dark">
            <template #active-action>
              <i class="el-icon">
                <svg viewBox="0 0 24 24" class="dark-icon">
                  <path
                    d="M11.01 3.05C6.51 3.54 3 7.36 3 12a9 9 0 0 0 9 9c4.63 0 8.45-3.5 8.95-8c.09-.79-.78-1.42-1.54-.95A5.403 5.403 0 0 1 11.1 7.5c0-1.06.31-2.06.84-2.89c.45-.67-.04-1.63-.93-1.56z"
                    fill="currentColor"
                  />
                </svg>
              </i>
            </template>
            <template #inactive-action>
              <i class="el-icon">
                <svg viewBox="0 0 24 24" class="light-icon">
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
      v-model="equipAllShow"
      direction="rtl"
      class="equipAll"
    >
      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane label="Sổ tay trang bị" name="illustrations">
          <div class="equipAll-box">
            <el-tabs v-model="illustrationsActive" :stretch="true">
              <el-tab-pane
                :label="i.name"
                :name="i.type"
                v-for="(i, k) in illustrationsItems"
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
        <el-tab-pane label="Thành tựu của tôi" name="achievement">
          <el-tabs v-model="achievementActive" :stretch="true">
            <el-tab-pane
              :label="i.name"
              :name="i.type"
              v-for="(i, k) in achievementAll"
              :key="k"
            >
              <div class="achievement-content" v-if="i.data.length > 0">
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
              <div class="achievement-content" v-else>
                Loại thành tựu này chưa được phát hành
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>
      </el-tabs>
      <div class="backtop" @click="equipAllShow = false">
        <el-icon>
          <Close />
        </el-icon>
      </div>
    </el-drawer>
    <el-drawer
      title="Gói quà tân thủ"
      v-model="newBieBox"
      :before-close="confirmCollectionNewBie"
      class="newBieBox"
      direction="rtl"
    >
      <div class="newBie">
        <tag
          v-for="(item, index) in newBieData"
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
          :loading="newBieLoading"
          @click="refreshNewBie"
        >
          {{ newBieLoading ? "Đang làm mới..." : "Làm mới" }}
        </el-button>
        <el-button size="small" type="primary" @click="confirmCollectionNewBie">
          Nhận trang bị
        </el-button>
      </div>
    </el-drawer>
    <el-dialog v-model="newBieInfoBox" :title="newBieItem.name" width="420px">
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
          @click="newBieInfoBox = false"
        >
          Xác nhận
        </el-button>
      </div>
    </el-dialog>
    <el-dialog v-model="errBox" title="Thông tin lỗi" width="420px">
      <el-input v-model="err" :rows="10" type="textarea" />
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
  </div>
</template>
<script>
// Thành phần nhãn
import tag from "@/components/tag.vue";
// Cửa hàng
import shop from "@/plugins/shop";
// Trang bị
import equip from "@/plugins/equip";
// Giải mã
// Xuất dữ liệu
import { saveAs } from "file-saver";
// Sổ tay
import equipAll from "@/plugins/equipAll";
// Thành tựu
import equipTooltip from "@/components/tooltip/equipTooltip.vue";
import achievement from "@/plugins/achievement";
export default {
  data() {
    return {
      ver: 0.9,
      // Thông tin lỗi
      err: "",
      show: false,
      // Cửa sổ thông tin lỗi
      errBox: false,
      // Thuộc tính người chơi
      player: {},
      actions: [],
      isLevel: false,
      // Cửa sổ thông tin linh sủng
      petShow: false,
      // Dữ liệu linh sủng
      petInfo: {},
      // Bảo vệ luyện khí
      protect: false,
      // Tăng cường luyện khí
      increase: false,
      // Sửa tên
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
      // Cửa sổ gói quà tân thủ
      newBieBox: false,
      storyText: "",
      // Giá vật phẩm cửa hàng
      shopPrice: 100,
      // Dữ liệu gói quà tân thủ
      newBieData: [],
      shopActive: "weapon",
      activeName: "illustrations",
      // Thông tin trang bị gói quà tân thủ
      newBieItem: {},
      // File script đã tải lên
      scriptFile: "",
      // Cửa sổ thông tin linh sủng
      petItemShow: false,
      backPackItem: [
        { type: "weapon", name: "Thần binh" },
        { type: "armor", name: "Hộ giáp" },
        { type: "accessory", name: "Linh bảo" },
        { type: "sutra", name: "Pháp khí" },
      ],
      petRootBone: false,
      petCollapse: "",
      // Cửa sổ sổ tay
      equipAllShow: false,
      // Cửa sổ đạo lữ
      wifeItemShow: false,
      // Thông tin trang bị
      inventoryInfo: {},
      // Cửa sổ thông tin trang bị gói quà tân thủ
      newBieInfoBox: false,
      // Trạng thái làm mới gói quà tân thủ
      newBieLoading: false,
      // Cửa sổ thông tin trang bị
      inventoryShow: false,
      // Cửa sổ luyện khí
      strengthenShow: false,
      // Thông tin luyện khí
      strengthenInfo: {},
      achievementAll: [],
      // Chọn phẩm chất trang bị để phân giải
      checkedEquipmen: [],
      inventoryActive: "equipment",
      equipmentActive: "weapon",
      // Tất cả phẩm chất trang bị
      AllEquipmenType: [
        "info",
        "success",
        "primary",
        "purple",
        "warning",
        "danger",
        "pink",
      ],
      // Trạng thái chọn chuyển sinh linh sủng
      petReincarnation: false,
      achievementActive: "pet",
      inventoryCollapse: "",
      petDropdownActive: "",
      illustrationsItems: [],
      // Cửa sổ phân giải hàng loạt
      sellingEquipmentShow: false,
      illustrationsActive: "weapon",
      equipmentDropdownActive: "",
    };
  },
  components: {
    equipTooltip,
    tag,
  },
  computed: {
    // Chuyển đối tượng túi đạo cụ thành mảng
    sortedProps() {
      const obj = this.player.props;
      return Object.keys(obj).map((key) => ({ name: key, num: obj[key] }));
    },
  },
  watch: {
    inventoryActive(type) {
      if (type == "shop" && !this.player.shopData.length) {
        this.player.shopData = shop.drawPrize(this.$maxLv);
      }
      if (type == "props")
        this.$notifys({
          title: "Gợi ý",
          message: "Nhấn vào đạo cụ để xem thông tin liên quan",
        });
    },
    "player.dark": function (val) {
      console.log("val", val);
      const setThemeColor = (color) => {
        let meta = document.querySelector('meta[name="theme-color"]');
        if (!meta) {
          meta = document.createElement("meta");
          meta.name = "theme-color";
          document.head.appendChild(meta);
        }
        meta.setAttribute("content", color);
      };

      setThemeColor(val ? "#141414" : "#ffffff");
    },
    "player.attack": function (val) {
      if (isNaN(val)) this.reset();
      else return val;
    },
    "player.health": function (val) {
      if (isNaN(val)) this.reset();
      else return val;
    },
    "player.defense": function (val) {
      if (isNaN(val)) this.reset();
      else return val;
    },
    "player.maxHealth": function (val) {
      if (isNaN(val)) this.reset();
      else return val;
    },
    "player.critical": function (val) {
      if (isNaN(val) || val < 0) {
        this.storyText =
          "Thuộc tính bạo kích lỗi, vui lòng tháo hết trang bị trên người và làm mới trò chơi<br>Nếu không có trang bị mà thông báo này vẫn xuất hiện, hãy thử mặc một trang bị rồi làm mới lại";
        return 0;
      } else {
        return val;
      }
    },
    "player.dodge": function (val) {
      if (isNaN(val) || val < 0) {
        this.storyText =
          "Thuộc tính né tránh lỗi, vui lòng tháo hết trang bị trên người và làm mới trò chơi<br>Nếu không có trang bị mà thông báo này vẫn xuất hiện, hãy thử mặc một trang bị rồi làm mới lại";
        return 0;
      } else {
        return val;
      }
    },
  },
  created() {
    this.boss = this.$store.boss;
    this.player = this.$store.player;
    this.achievementAll = achievement.all();
    this.illustrationsItems = equipAll.drawPrize(this.$maxLv);
  },
  mounted() {
    // Khởi tạo trò chơi
    this.startGame();
  },
  methods: {
    // Khởi tạo trò chơi
    startGame() {
      this.storyText = "Hành trình tu tiên của bạn đã bắt đầu.";
      this.actions = [
        {
          text: "Bắt đầu tu luyện",
          handler: () => this.$router.push("/cultivate"),
        },
        {
          text: "Khám phá bí cảnh",
          handler: () => {
            if (!this.player.isNewbie) {
              this.$notifys({
                title: "Gợi ý",
                message: `Gói quà tân thủ chưa được nhận`,
              });
              return;
            }
            if (this.player.level < 10) {
              this.$notifys({
                title: "Gợi ý sức mạnh không đủ",
                message: `Bên ngoài quá nguy hiểm, hãy đột phá đến ${this.$levelNames(
                  10
                )} rồi mới ra ngoài!`,
              });
              return;
            }
            this.$router.push("/map");
          },
        },
        {
          text: "Sổ tay và thành tựu",
          handler: () => {
            this.equipAllShow = true;
          },
        },
        {
          text: "Thách đấu Vô Tận Tháp",
          handler: () => this.$router.push("/endlesstower"),
        },
        { text: "BOSS thế giới", handler: () => this.$router.push("/boss") },
        {
          text: "Giải trí thư giãn",
          handler: () => this.$router.push("/game"),
        },
      ];
      // Khởi tạo khí huyết hiện tại của người chơi
      this.player.health = this.player.maxHealth;
    },
    // Xóa script
    deleteScriptData() {
      // Xóa script do người chơi nhập
      this.player.script = "";
      // Gửi thông báo
      this.$notifys({ title: "Gợi ý", message: "Xóa script thành công" });
      // Làm mới trang
      location.reload(1);
    },
    // Kích hoạt trước khi tải script
    scriptBeforeUpload(file) {
      // Lưu file hiện tại
      this.scriptFile = file;
      // Hiển thị hộp thoại xác nhận
      this.uploadScript();
      // Ngăn tải lên
      return false;
    },
    handleOpenGroup() {
      window.open("https://zalo.me/g/cltcgr815", "_blank");
    },
    // Nhập script
    uploadScript() {
      this.$confirm("", "Lưu ý nhập script", {
        center: true,
        message:
          "Trước khi nhập, hãy xác nhận script có thể sử dụng và sao lưu dữ liệu<br>Nếu xảy ra vấn đề với trò chơi do nhập script lỗi, tác giả không chịu trách nhiệm",
        cancelButtonText: "Suy nghĩ thêm",
        confirmButtonText: "Tôi sẽ chịu trách nhiệm cho hành động của mình",
        dangerouslyUseHTMLString: true,
      })
        .then(() => {
          const file = this.scriptFile;
          const reader = new FileReader();
          reader.onload = (e) => {
            try {
              const script = e.target.result;
              // Lưu script do người chơi nhập
              this.player.script = script;
              // Gửi thông báo
              this.$notifys({
                title: "Gợi ý",
                message: "Nhập script thành công",
              });
              // Làm mới trang
              location.reload(1);
            } catch (err) {
              this.err = err;
              this.errBox = true;
              this.$notifys({
                title: "Nhập script thất bại",
                message: "Sao chép thông tin lỗi vào nhóm QQ",
              });
            }
          };
          reader.readAsText(file);
        })
        .catch(() => {});
    },
    // Sửa tên
    editUserName() {
      this.$prompt("Mỗi lần sửa tên cần tiêu tốn 100 linh thạch", "Sửa tên", {
        inputPattern: /^(?=\S).*/,
        cancelButtonText: "Hủy sửa",
        confirmButtonText: "Xác nhận sửa",
        inputErrorMessage: "Tên không được để trống",
      })
        .then(({ value }) => {
          if (this.player.props.money < 100) {
            this.$notifys({
              title: "Gợi ý",
              message: "Linh thạch không đủ, sửa tên thất bại",
            });
            return;
          }
          // Sửa tên
          this.player.name = value;
          // Trừ linh thạch
          this.player.props.money -= 100;
          // Gửi thông báo
          this.$notifys({ title: "Gợi ý", message: "Sửa thành công" });
        })
        .catch(() => {});
    },
    // Xóa lưu trữ
    clearSave() {
      this.$confirm(
        "Do phiên bản trò chơi hiện tại không tương thích với phiên bản lưu trữ, cần xóa dữ liệu",
        "Gợi ý xóa lưu trữ",
        {
          center: true,
          showClose: false,
          showCancelButton: false,
          confirmButtonText: "Xác nhận",
          closeOnClickModal: false,
          closeOnPressEscape: false,
        }
      ).then(() => {
        // Xóa lưu trữ
        localStorage.removeItem("vuex");
        // Làm mới trang
        location.reload(1);
      });
    },
    // Đặt lại
    reset() {
      this.storyText =
        'Thuộc tính lỗi, vui lòng tham gia nhóm, tải lên "lưu trữ" và liên hệ tác giả để giải quyết';
      this.$confirm("Bạn có muốn Lưu dữ liệu không?", "Gợi ý lưu trữ", {
        center: true,
        confirmButtonText: "Xác nhận",
      })
        .then(() => {
          this.exportData();
        })
        .catch(() => {});
    },
    // Thả linh sủng hàng loạt
    sellingPet() {
      // Lấy trang bị trong túi người chơi
      const pets = this.player.pets;
      // Kiểm tra xem túi có linh sủng nào không
      if (!pets.length) {
        this.$notifys({
          title: "Gợi ý thả linh sủng",
          message: "Bạn không có linh sủng nào để thả",
        });
        return;
      }
      // Lọc ra linh sủng có thể thả
      const selling = pets.filter((item) => !item.lock);
      // Kiểm tra xem có linh sủng nào có thể thả không
      if (!selling.length) {
        this.$notifys({
          title: "Gợi ý thả linh sủng",
          message: "Bạn không có linh sủng chưa khóa nào để thả",
        });
        return;
      }
      // Đóng cửa sổ
      this.sellingEquipmentShow = false;
      // Tính tổng số đan bồi dưỡng nhận được từ việc thả linh sủng chưa khóa
      const cultivateDanTotal = selling.reduce((total, i) => {
        // Số lần chuyển sinh của linh sủng
        const reincarnation = i.reincarnation ? i.reincarnation : 1;
        let level = i.level * reincarnation;
        level = Number(level) || 0;
        return total + Math.floor(level);
      }, 0);
      // Tăng số lượng đan bồi dưỡng
      this.player.props.cultivateDan += cultivateDanTotal;
      // Xóa tất cả linh sủng chưa khóa trong túi
      this.player.pets = pets.filter((item) => item.lock);
      this.$notifys({
        title: "Gợi ý thả linh sủng",
        message: `Tất cả linh sủng không khóa đã được thả thành công, trước khi đi chúng đã tặng bạn ${cultivateDanTotal} đan bồi dưỡng`,
      });
    },
    // Phân giải trang bị hàng loạt
    sellingEquipment() {
      // Lấy trang bị trong túi người chơi
      const inventory = this.player.inventory;
      // Lấy cài đặt phân giải trang bị của người chơi
      const sellingEquipmen = this.player.sellingEquipmentData;
      // Kiểm tra xem có chọn phẩm chất cần phân giải không
      if (!sellingEquipmen.length) {
        this.$notifys({
          title: "Gợi ý phân giải trang bị trong túi",
          message: "Bạn chưa chọn phẩm chất cần phân giải",
        });
        return;
      }
      // Lọc ra trang bị có thể phân giải
      const selling = inventory.filter(
        (item) => sellingEquipmen.includes(item.quality) && !item.lock
      );
      // Kiểm tra xem có trang bị nào có thể bán không
      if (!selling.length) {
        this.$notifys({
          title: "Gợi ý phân giải trang bị trong túi",
          message: "Chưa trang bị trang bị nào trong túi để bán",
        });
        return;
      }
      // Đóng cửa sổ
      this.sellingEquipmentShow = false;
      // Tính tổng cấp độ của trang bị chưa khóa và phẩm chất được chọn để phân giải
      const strengtheningStoneTotal = selling.reduce((total, i) => {
        let level = i.level + (i.level * this.player.reincarnation) / 10;
        level = Number(level) || 0;
        return total + Math.floor(level);
      }, 0);
      // Tăng số lượng linh thạch
      this.player.props.money += selling.length;
      // Tăng số lượng đá luyện khí
      this.player.props.strengtheningStone += strengtheningStoneTotal;
      // Xóa tất cả trang bị chưa khóa và phẩm chất được chọn trong túi
      this.player.inventory = inventory.filter(
        (item) => !sellingEquipmen.includes(item.quality) || item.lock
      );
      this.$notifys({
        title: "Gợi ý phân giải trang bị trong túi",
        message: `Tất cả trang bị không khóa trong túi đã được phân giải thành công, bạn nhận được ${strengtheningStoneTotal} đá luyện khí và ${selling.length} linh thạch`,
      });
    },
    // Sửa cài đặt phân giải trang bị của người chơi
    sellingEquipmentDataChange(val) {
      this.player.sellingEquipmentData = val;
    },
    // Làm mới cửa hàng
    refreshShop() {
      if (this.player.props.money < 500) {
        this.$notifys({
          title: "Gợi ý",
          message: "Linh thạch không đủ, làm mới cửa hàng cần 500 linh thạch",
        });
        return;
      }
      // Trừ linh thạch
      this.player.props.money -= 500;
      // Cập nhật dữ liệu cửa hàng Hồng Mông
      this.player.shopData = shop.drawPrize(this.$maxLv);
      this.$notifys({ title: "Gợi ý", message: "Làm mới thành công" });
    },
    // Xóa dữ liệu
    deleteData() {
      this.$confirm(
        "Bạn có chắc muốn xóa lưu trữ không? Nên xóa khi dữ liệu gặp vấn đề",
        "Gợi ý xóa dữ liệu",
        {
          center: true,
          cancelButtonText: "Tôi nhấn nhầm",
          confirmButtonText: "Xác nhận và chắc chắn",
        }
      )
        .then(() => {
          this.$notifys({ title: "Gợi ý", message: "Xóa lưu trữ thành công" });
          // Xóa lưu trữ
          localStorage.removeItem("vuex");
          // Làm mới trang
          location.reload(1);
        })
        .catch(() => {});
    },
    // Nhập lưu trữ từ máy tính
    importData(data) {
      const file = data.file;
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          // Nhập lưu trữ
          localStorage.setItem("vuex", e.target.result);
          // Làm mới trang
          location.reload(1);
        } catch (err) {
          this.err = err;
          this.errBox = true;
          this.$notifys({
            title: "Nhập script thất bại",
            message: "Sao chép thông tin lỗi vào nhóm QQ",
          });
        }
      };
      reader.readAsText(file);
    },
    // Xuất lưu trữ
    exportData() {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      const hours = String(today.getHours()).padStart(2, "0");
      const minutes = String(today.getMinutes()).padStart(2, "0");
      const seconds = String(today.getSeconds()).padStart(2, "0");
      const blob = new Blob([localStorage.getItem("vuex")], {
        type: "application/json;charset=utf-8",
      });
      const name = `Tu Tiên Văn Tự Của Tôi Toàn Dựa Vào Cày-[Thời gian xuất lưu trữ ${year}${month}${day}${hours}${minutes}${seconds}]-[Phiên bản trò chơi ${this.ver}].json`;
      saveAs(blob, name);
    },
    // Cửa sổ phân giải trang bị hàng loạt
    sellingEquipmentBox() {
      this.show = false;
      this.sellingEquipmentShow = true;
    },
    // Trang bị vật phẩm
    equipItem(id, type) {
      const inventoryItem = this.getObjectById(id, this.player.inventory);
      // Nếu cảnh giới của trang bị hiện tại lớn hơn cảnh giới của nhân vật
      if (
        !this.player.reincarnation &&
        inventoryItem.level > this.player.level
      ) {
        this.$notifys({
          title: "Cảnh giới hiện tại không đủ",
          message: "Không thể trang bị vật phẩm này",
        });
        return;
      }
      // Nếu trang bị loại này đã được mặc, đưa nó về túi
      if (JSON.stringify(this.player.equipment[type]) != "{}") {
        const equipment = this.player.equipment[type];
        // Cập nhật thuộc tính người chơi, xóa tăng cường thuộc tính từ trang bị hiện tại
        this.playerAttribute(
          -equipment.dodge,
          -equipment.attack,
          -equipment.health,
          -equipment.critical,
          -equipment.defense
        );
        // Đưa trang bị hiện tại về túi
        this.player.inventory.push(equipment);
      }
      // Trang bị vật phẩm mới
      this.player.equipment[type] = inventoryItem;
      // Cập nhật thuộc tính người chơi, thêm tăng cường thuộc tính từ trang bị mới
      this.playerAttribute(
        inventoryItem.dodge,
        inventoryItem.attack,
        inventoryItem.health,
        inventoryItem.critical,
        inventoryItem.defense
      );
      // Xóa vật phẩm mới khỏi túi
      this.player.inventory = this.player.inventory.filter(
        (item) => item.id !== id
      );
      // Đặt lại loại
      type = "";
      // Đóng cửa sổ thông tin đạo cụ
      this.inventoryShow = false;
    },
    // Khóa hoặc mở khóa đạo cụ
    inventoryLock(id) {
      let inventoryItem = this.getObjectById(id, this.player.inventory);
      inventoryItem.lock = !inventoryItem.lock;
      this.$notifys({
        title: !inventoryItem.lock
          ? "Gợi ý mở khóa trang bị"
          : "Gợi ý khóa trang bị",
        message: !inventoryItem.lock
          ? "Mở khóa trang bị thành công"
          : "Khóa trang bị thành công",
      });
    },
    // Linh sủng xuất chiến
    petCarry(item) {
      // Tìm thông tin linh sủng theo ID
      const petItem = this.getObjectById(item.id, this.player.pets);
      // Nếu đã có linh sủng xuất chiến, thu hồi nó
      if (JSON.stringify(this.player.pet) != "{}") {
        const itemInfo = this.player.pet;
        // Cập nhật thuộc tính người chơi, xóa tăng cường thuộc tính từ linh sủng xuất chiến
        this.playerAttribute(
          -itemInfo.dodge,
          -itemInfo.attack,
          -itemInfo.health,
          -itemInfo.critical,
          -itemInfo.defense
        );
        // Thu hồi linh sủng đang xuất chiến
        this.player.pets.push(this.player.pet);
      }
      // Đóng cửa sổ thông tin linh sủng
      this.petShow = false;
      // Cho linh sủng hiện tại xuất chiến
      this.player.pet = petItem;
      // Cập nhật thuộc tính người chơi, thêm tăng cường thuộc tính từ linh sủng xuất chiến
      this.playerAttribute(
        petItem.dodge,
        petItem.attack,
        petItem.health,
        petItem.critical,
        petItem.defense
      );
      // Xóa linh sủng này khỏi túi linh sủng
      this.player.pets = this.player.pets.filter((i) => i.id !== item.id);
    },
    // Thả linh sủng
    petClose(item) {
      this.$confirm(
        `Bạn có chắc muốn thả <span class="el-tag el-tag--${this.computePetsLevel(
          item.level
        )}">${item.name} (${this.$levelNames(item.level)})</span> không?`,
        "Thả linh sủng",
        {
          center: true,
          cancelButtonText: "Hủy thả",
          confirmButtonText: "Xác nhận thả",
          dangerouslyUseHTMLString: true,
        }
      )
        .then(() => {
          // Số lần chuyển sinh của linh sủng
          const reincarnation = item.reincarnation ? item.reincarnation : 1;
          // Số lượng đan bồi dưỡng nhận được
          const num = item.level * reincarnation;
          // Đóng cửa sổ thông tin linh sủng
          this.petShow = false;
          // Tăng số lượng đan bồi dưỡng
          this.player.props.cultivateDan += num;
          // Xóa đạo cụ
          this.player.pets = this.player.pets.filter(
            (obj) => obj.id !== item.id
          );
          // Thông báo phân giải trang bị
          this.$notifys({
            title: `${item.name} đã được thả thành công`,
            message: `Trước khi đi, đối phương đã tặng bạn ${num} đan bồi dưỡng`,
          });
        })
        .catch(() => {});
    },
    // Khóa hoặc mở khóa linh sủng
    petLock(item) {
      item.lock = !item.lock;
      this.$notifys({
        title: !item.lock ? "Gợi ý mở khóa linh sủng" : "Gợi ý khóa linh sủng",
        message: !item.lock
          ? "Mở khóa linh sủng thành công"
          : "Khóa linh sủng thành công",
      });
    },
    // Tính toán sự khác biệt giữa trang bị trên người và trong túi
    calculateDifference(item1, item2) {
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
            ? (Float * 100).toFixed(2) + "%"
            : item1 - parseInt(item2),
        icon:
          item1 > item2
            ? "success el-icon-caret-top"
            : item1 == item2
            ? ""
            : "danger el-icon-caret-bottom",
      };
      ojb.num = ojb.num == 0 ? "" : ojb.num;
      return ojb;
    },
    // Luyện khí
    enhance(item) {
      // Tỷ lệ thành công luyện khí
      const successRate = this.calculateEnhanceSuccessRate(item);
      // Số lượng đạo cụ tiêu hao khi luyện khí
      const calculateCost = this.calculateCost(item);
      // Nếu đá luyện khí không đủ
      if (calculateCost > this.player.props.strengtheningStone) {
        // Gửi thông báo
        this.$notifys({
          title: "Gợi ý luyện khí",
          message: "Đá luyện khí không đủ, không thể thực hiện luyện khí",
          position: "top-left",
        });
        return;
      }
      // Nếu cấp độ luyện khí đã tối đa
      if (item.strengthen == 30) {
        // Gửi thông báo
        this.$notifys({
          title: "Gợi ý luyện khí",
          message: "Cấp độ luyện khí của trang bị hiện tại đã tối đa",
          position: "top-left",
        });
        return;
      }
      // Cửa sổ xác nhận luyện khí
      this.$confirm(
        item.strengthen >= 15 && !this.protect
          ? `Cấp độ luyện khí của trang bị hiện tại đã đạt +${item.strengthen}, nếu luyện khí thất bại, trang bị sẽ bị hủy, bạn có muốn tiếp tục luyện khí không?`
          : "Bạn có chắc muốn luyện khí không?",
        "Gợi ý luyện khí",
        {
          cancelButtonText: "Tôi nhấn nhầm",
          confirmButtonText: "Xác nhận và chắc chắn",
        }
      )
        .then(() => {
          // Nếu luyện khí thành công
          if (Math.random() <= successRate) {
            // Công kích
            const attack = Math.floor(item.initial.attack * 0.2);
            // Khí huyết
            const health = Math.floor(item.initial.health * 0.2);
            // Phòng thủ
            const defense = Math.floor(item.initial.defense * 0.2);
            switch (item.type) {
              // Nếu là thần binh
              case "weapon":
                item.attack += attack;
                this.playerAttribute(0, attack, 0, 0, 0);
                break;
              // Nếu là hộ giáp
              case "armor":
                item.health += health;
                item.defense += defense;
                this.playerAttribute(0, 0, health, 0, defense);
                break;
              // Nếu là linh bảo hoặc pháp khí
              case "accessory":
              case "sutra":
                item.attack += attack;
                item.health += health;
                item.defense += defense;
                this.playerAttribute(0, attack, health, 0, defense);
                break;
              default:
                break;
            }
            // Tăng cấp độ luyện khí
            item.strengthen++;
            // Tính lại điểm trang bị
            item.score = equip.calculateEquipmentScore(
              item.dodge,
              item.attack,
              item.health,
              item.critical,
              item.defense
            );
            // Gửi thông báo luyện khí thành công
            this.$notifys({
              title: "Gợi ý luyện khí",
              message: "Luyện khí thành công",
              position: "top-left",
            });
          } else {
            // Nếu cấp độ luyện khí từ 15 trở lên và không bật bảo vệ luyện khí
            if (item.strengthen >= 15 && !this.protect) {
              // Xóa trang bị bị hủy
              this.player.equipment[item.type] = {};
              // Trừ thuộc tính tăng cường từ trang bị bị hủy
              this.playerAttribute(
                -item.dodge,
                -item.attack,
                -item.health,
                -item.critical,
                -item.defense
              );
              // Đặt lại cấp độ luyện khí
              item.strengthen = 0;
              // Đóng cửa sổ luyện khí
              this.strengthenShow = false;
            }
            // Gửi thông báo luyện khí thất bại
            this.$notifys({
              title: "Gợi ý luyện khí",
              message:
                item.strengthen >= 15 && !this.protect
                  ? "Luyện khí thất bại, trang bị đã tự động bị hủy"
                  : "Luyện khí thất bại",
              position: "top-left",
            });
          }
          // Trừ đá luyện khí
          this.player.props.strengtheningStone -= calculateCost;
        })
        .catch(() => {});
    },
    // Tính toán số lượng đạo cụ cần tiêu hao khi luyện khí
    calculateCost(item) {
      // Tiêu hao cơ bản khi luyện khí
      let baseCost = item.level * 5;
      // Tiêu hao tăng thêm mỗi cấp luyện khí
      let incrementPerLevel = item.strengthen * 50;
      // Có bật bảo vệ luyện khí không
      let protect = this.protect ? 10 : 1;
      // Có bật tăng cường luyện khí không
      let increase = this.increase ? 5 : 1;
      // Tổng số đạo cụ cần tiêu hao
      return (baseCost + incrementPerLevel) * protect * increase;
    },
    // Tính toán tỷ lệ thành công luyện khí
    calculateEnhanceSuccessRate(item) {
      // Tỷ lệ thành công cơ bản
      let baseSuccessRate = 1;
      // Giảm tỷ lệ thành công mỗi cấp
      let decrementPerLevel = 0.03;
      // Tăng cường luyện khí
      let increase = this.increase ? 0.1 : 0;
      // Tỷ lệ thành công cuối cùng
      return baseSuccessRate - (item.strengthen * decrementPerLevel - increase);
    },
    // Nâng cấp linh sủng
    petUpgrade(item) {
      // Tính toán số lượng vật liệu cần để nâng cấp linh sủng
      const consume = this.petConsumption(item.level);

      // Nếu chọn nâng ngộ tính nhưng đan ngộ tính không đủ
      if (this.petRootBone && this.player.props.rootBone < item.rootBone) {
        // Gửi thông báo
        this.$notifys({
          title: "Gợi ý bồi dưỡng linh sủng",
          message:
            "Đan ngộ tính không đủ, không thể nâng cao ngộ tính linh sủng",
          position: "top-left",
        });
        return;
      }
      // Nếu chọn chuyển sinh linh sủng nhưng số lần chuyển sinh của nhân vật không bằng linh sủng
      if (
        this.petReincarnation &&
        this.player.reincarnation < this.player.pet.reincarnation
      ) {
        // Gửi thông báo
        this.$notifys({
          title: "Gợi ý bồi dưỡng linh sủng",
          message:
            "Chuyển sinh linh sủng không thể cao hơn chuyển sinh nhân vật",
          position: "top-left",
        });
        return;
      }
      // Nếu chọn chuyển sinh linh sủng nhưng cấp độ linh sủng chưa tối đa
      if (this.petReincarnation && this.$maxLv > item.level) {
        // Gửi thông báo
        this.$notifys({
          title: "Gợi ý bồi dưỡng linh sủng",
          message: "Cảnh giới linh sủng chưa tối đa, không thể chuyển sinh",
          position: "top-left",
        });
        return;
      }
      // Nếu không chọn chuyển sinh linh sủng và cấp độ đã tối đa
      if (!this.petReincarnation && item.level >= this.$maxLv) {
        // Gửi thông báo
        this.$notifys({
          title: "Gợi ý bồi dưỡng linh sủng",
          message: "Cảnh giới linh sủng đã tối đa, hãy chuyển sinh",
          position: "top-left",
        });
        return;
      }
      // Nếu đan bồi dưỡng không đủ
      if (consume > this.player.props.cultivateDan) {
        // Gửi thông báo
        this.$notifys({
          title: "Gợi ý bồi dưỡng linh sủng",
          message: "Đan bồi dưỡng không đủ, không thể bồi dưỡng",
          position: "top-left",
        });
        return;
      }
      // Cửa sổ xác nhận bồi dưỡng linh sủng
      this.$confirm(
        "Bạn có chắc muốn bồi dưỡng linh sủng này không?",
        "Gợi ý bồi dưỡng linh sủng",
        {
          cancelButtonText: "Tôi nhấn nhầm",
          confirmButtonText: "Xác nhận và chắc chắn",
        }
      )
        .then(() => {
          let attack,
            health,
            defense = 0;
          // Nếu chọn nâng ngộ tính và đan ngộ tính đủ
          if (this.petRootBone && this.player.props.rootBone >= item.rootBone) {
            let rootBone = item.initial.rootBone - item.rootBone;
            rootBone = rootBone ? rootBone : 1;
            // Công kích
            attack = Math.floor(item.initial.attack * rootBone);
            // Khí huyết
            health = Math.floor(item.initial.health * rootBone);
            // Phòng thủ
            defense = Math.floor(item.initial.defense * rootBone);
            // Nâng ngộ tính
            item.rootBone++;
            // Trừ đan ngộ tính
            this.player.props.rootBone -= item.rootBone;
          } else {
            // Công kích
            attack = Math.floor(item.initial.attack * 0.05);
            // Khí huyết
            health = Math.floor(item.initial.health * 0.05);
            // Phòng thủ
            defense = Math.floor(item.initial.defense * 0.05);
          }
          // Nếu chọn chuyển sinh và cấp độ hiện tại đã tối đa
          if (this.petReincarnation && item.level >= this.$maxLv) {
            // Đặt lại cấp độ linh sủng
            this.player.pet.level = 1;
            // Hủy chọn chuyển sinh
            this.petReincarnation = false;
            // Tăng số lần chuyển sinh linh sủng
            this.player.pet.reincarnation++;
            // Gửi thông báo
            this.$notifys({
              title: "Gợi ý bồi dưỡng linh sủng",
              message:
                "Chuyển sinh linh sủng thành công, đã đặt lại cảnh giới linh sủng",
              position: "top-left",
            });
          } else {
            // Tăng cấp độ linh sủng
            this.player.pet.level++;
            // Gửi thông báo
            this.$notifys({
              title: "Gợi ý bồi dưỡng linh sủng",
              message: "Bồi dưỡng linh sủng thành công",
              position: "top-left",
            });
          }
          // Tăng thuộc tính linh sủng
          this.player.pet.attack += attack;
          this.player.pet.health += health;
          this.player.pet.defense += defense;
          // Cập nhật thuộc tính người chơi, thêm tăng cường thuộc tính sau khi bồi dưỡng linh sủng
          this.playerAttribute(0, attack, health, 0, defense);
          // Tính lại điểm linh sủng
          this.player.pet.score = equip.calculateEquipmentScore(
            this.player.pet.dodge,
            this.player.pet.attack,
            this.player.pet.health,
            this.player.pet.critical,
            this.player.pet.defense
          );
          // Trừ đan bồi dưỡng
          this.player.props.cultivateDan -= consume;
        })
        .catch(() => {});
    },
    // Nâng cấp đạo lữ
    wifeUpgrade(item) {
      // Tính toán số lượng vật liệu cần để nâng cấp đạo lữ
      const consume = item.level * 10;
      // Nếu điểm tình duyên không đủ
      if (consume > this.player.props.qingyuan) {
        // Gửi thông báo
        this.$notifys({
          title: "Gợi ý nâng cấp đạo lữ",
          message: "Điểm tình duyên không đủ, không thể bồi dưỡng",
          position: "top-left",
        });
        return;
      }
      // Cửa sổ xác nhận nâng cấp đạo lữ
      this.$confirm(
        "Bạn có chắc muốn nâng cấp đạo lữ này không?",
        "Gợi ý nâng cấp đạo lữ",
        {
          cancelButtonText: "Tôi nhấn nhầm",
          confirmButtonText: "Xác nhận và chắc chắn",
        }
      )
        .then(() => {
          const attack = Math.floor(item.attack * 0.1);
          const health = Math.floor(item.health * 0.1);
          const defense = Math.floor(item.defense * 0.1);
          // Tăng cấp độ đạo lữ
          this.player.wife.level++;
          // Gửi thông báo
          this.$notifys({
            title: "Gợi ý nâng cấp đạo lữ",
            message: "Nâng cấp đạo lữ thành công",
            position: "top-left",
          });
          // Tăng thuộc tính đạo lữ
          this.player.wife.attack += attack;
          this.player.wife.health += health;
          this.player.wife.defense += defense;
          // Cập nhật thuộc tính người chơi, thêm tăng cường thuộc tính sau khi nâng cấp đạo lữ
          this.playerAttribute(0, attack, health, 0, defense);
          // Trừ điểm tình duyên
          this.player.props.qingyuan -= consume;
        })
        .catch(() => {});
    },
    // Tính toán tiêu hao để nâng cấp linh sủng
    petConsumption(lv) {
      // Có chọn tùy chọn chuyển sinh không
      const cost = this.petReincarnation ? 10 : 1;
      // Số lần chuyển sinh
      const reincarnation = this.player.pet.reincarnation ? lv * 200 : 1;
      return (lv * 200 + reincarnation) * cost;
    },
    // Mua trang bị
    shopBuy(item) {
      if (this.player.props.currency >= this.shopPrice) {
        // Trừ đá Hồng Mông
        this.player.props.currency -= this.shopPrice;
        // Nếu dung lượng túi trang bị hiện tại lớn hơn hoặc bằng tổng dung lượng túi
        if (this.player.inventory.length >= this.player.backpackCapacity)
          this.storyText = `Dung lượng túi trang bị hiện tại đã đầy, trang bị này sẽ tự động bị bỏ, chuyển sinh có thể tăng dung lượng túi`;
        // Thêm vào túi
        else this.player.inventory.push(item);
        // Chuyển đến trang liên quan đến túi
        this.inventoryActive = item.type;
        this.$notifys({
          title: "Gợi ý mua hàng",
          message: `Bạn đã chi ${this.shopPrice} đá Hồng Mông để mua ${item.name} thành công`,
        });
      } else {
        this.$notifys({
          title: "Gợi ý mua hàng",
          message: "Mua thất bại, đá Hồng Mông không đủ",
        });
      }
    },
    // Đạo lữ theo dõi
    wifeTack(item) {
      // Nếu đã có đạo lữ theo dõi, thu hồi
      if (JSON.stringify(this.player.wife) != "{}") {
        const itemInfo = this.player.wife;
        // Cập nhật thuộc tính người chơi, xóa tăng cường thuộc tính từ đạo lữ đang theo dõi
        this.playerAttribute(
          -itemInfo.dodge,
          -itemInfo.attack,
          -itemInfo.health,
          -itemInfo.critical,
          -itemInfo.defense
        );
        // Thu hồi đạo lữ đang theo dõi
        this.player.wifes.push(this.player.wife);
      }
      this.player.wife = item;
      // Cập nhật thuộc tính người chơi, thêm tăng cường thuộc tính từ đạo lữ hiện tại
      this.playerAttribute(
        item.dodge,
        item.attack,
        item.health,
        item.critical,
        item.defense
      );
      // Xóa đạo lữ này khỏi túi đạo lữ
      this.player.wifes = this.player.wifes.filter((i) => i.name !== item.name);
    },
    // Thu hồi đạo lữ
    wifeRevoke() {
      const item = this.player.wife;
      // Cập nhật thuộc tính người chơi, xóa tăng cường thuộc tính từ đạo lữ hiện tại
      this.playerAttribute(
        -item.dodge,
        -item.attack,
        -item.health,
        -item.critical,
        -item.defense
      );
      // Thu hồi đạo lữ hiện tại
      this.player.wife = {};
      this.player.wifes.push(item);
    },
    // Thông tin đạo lữ
    wifeItemInfo(item) {
      this.$confirm("", item.name, {
        center: true,
        message: `<div class="monsterinfo">
                    <div class="monsterinfo-box">
                        <p>Cảnh giới: ${this.$levelNames(item.level)}</p>
                        <p>Khí huyết: ${this.$formatNumberToChineseUnit(
                          item.health
                        )}</p>
                        <p>Công kích: ${this.$formatNumberToChineseUnit(
                          item.attack
                        )}</p>
                        <p>Phòng thủ: ${this.$formatNumberToChineseUnit(
                          item.defense
                        )}</p>
                    </div>
                </div>`,
        confirmButtonText: "Theo dõi",
        dangerouslyUseHTMLString: true,
      })
        .then(() => {
          this.wifeTack(item);
        })
        .catch(() => {});
    },
    // Thông tin trang bị trong cửa hàng
    shopItemInfo(item) {
      this.$confirm("", item.name, {
        center: true,
        message: `<div class="monsterinfo">
                    <div class="monsterinfo-box">
                        <p>Giá: ${this.shopPrice} đá Hồng Mông</p>
                        <p>Loại: ${this.$genre[item.type]}</p>
                        <p>Cảnh giới: ${this.$levelNames(item.level)}</p>
                        <p>Phẩm chất: ${this.$levels[item.quality]}</p>
                        <p>Khí huyết: ${this.$formatNumberToChineseUnit(
                          item.health
                        )}</p>
                        <p>Công kích: ${this.$formatNumberToChineseUnit(
                          item.attack
                        )}</p>
                        <p>Phòng thủ: ${this.$formatNumberToChineseUnit(
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
                        <p>Điểm trang bị: ${this.$formatNumberToChineseUnit(
                          item.score
                        )}</p>
                    </div>
                </div>`,
        cancelButtonText: "Hủy mua",
        confirmButtonText: "Mua trang bị",
        dangerouslyUseHTMLString: true,
      })
        .then(() => {
          this.shopBuy(item);
        })
        .catch(() => {});
    },
    // Tặng gói quà tân thủ
    newbiePack(timesLeft) {
      // Nếu đã nhận gói quà tân thủ
      if (this.player.isNewbie) {
        this.$notifys({
          title: "Gợi ý",
          message: "Gói quà tân thủ không thể nhận lại",
        });
        return;
      }
      this.newBieBox = true;
      // Khởi tạo vật phẩm
      let equipItem = {};
      // Thần binh
      if (timesLeft == 4) equipItem = equip.equip_Weapons(10, false);
      // Hộ giáp
      else if (timesLeft == 3) equipItem = equip.equip_Armors(10, false);
      // Linh bảo
      else if (timesLeft == 2) equipItem = equip.equip_Accessorys(10, false);
      // Pháp khí
      else if (timesLeft == 1) equipItem = equip.equip_Sutras(10, false);
      // Sửa trạng thái tải của nút làm mới
      else if (timesLeft == 0) this.newBieLoading = false;
      // Kết thúc
      else return;
      // Thêm trang bị vào kho
      if (JSON.stringify(equipItem) != "{}") this.newBieData.push(equipItem);
      // Cập nhật số lần còn lại
      timesLeft--;
      // Đặt thời gian trễ để gọi lần tiếp theo
      setTimeout(() => {
        this.newbiePack(timesLeft);
      }, 100);
    },
    // Làm mới gói quà tân thủ
    refreshNewBie() {
      // Khởi tạo dữ liệu
      this.newBieData = [];
      // Sửa trạng thái tải của nút làm mới
      this.newBieLoading = true;
      // Tặng gói quà tân thủ
      this.newbiePack(4);
    },
    // Thông tin trang bị gói quà tân thủ
    newBieInfo(item) {
      this.newBieItem = item;
      this.newBieInfoBox = true;
    },
    // Xác nhận nhận gói quà tân thủ
    confirmCollectionNewBie() {
      this.$confirm(
        "Bạn có chắc đã nhận được trang bị mình hài lòng chưa?",
        "Gợi ý",
        {
          center: true,
          cancelButtonText: "Không chắc",
          confirmButtonText: "Xác nhận",
          dangerouslyUseHTMLString: true,
        }
      )
        .then(() => {
          // Đóng cửa sổ
          this.newBieBox = false;
          // Cập nhật trang bị của người chơi
          this.player.inventory = this.newBieData;
          // Xóa dữ liệu
          this.newBieData = [];
          // Sửa trạng thái nhận gói quà
          this.player.isNewbie = true;
          this.$notifys({
            title: "Gợi ý nhận gói quà tân thủ",
            message: "Nhận gói quà tân thủ thành công!",
          });
        })
        .catch(() => {});
    },
    // Phân giải trang bị
    inventoryClose(item) {
      this.$confirm(
        `Bạn có chắc muốn phân giải <span class="el-tag el-tag--${
          item.quality
        }">${this.$levels[item.quality]} ${item.name}(${
          this.$genre[item.type]
        })</span> không?`,
        "Phân giải trang bị",
        {
          center: true,
          cancelButtonText: "Hủy phân giải",
          confirmButtonText: "Phân giải",
          dangerouslyUseHTMLString: true,
        }
      )
        .then(() => {
          const num =
            item.level +
            Math.floor((item.level * this.player.reincarnation) / 10);
          // Tăng số lượng đá luyện khí
          this.player.props.strengtheningStone += num;
          // Xóa trang bị trong túi
          this.player.inventory = this.player.inventory.filter(
            (obj) => obj.id !== item.id
          );
          // Đóng cửa sổ thông tin trang bị
          this.inventoryShow = false;
          // Thông báo bán trang bị
          this.$notifys({
            title: "Gợi ý bán trang bị trong túi",
            message: `${item.name} đã được bán thành công, bạn nhận được ${num} đá luyện khí`,
          });
        })
        .catch(() => {});
    },
    // Lấy thông tin theo ID trang bị
    getObjectById(id, arr) {
      return arr.find((obj) => obj.id === id);
    },
    // Thông tin đạo cụ
    inventory(id) {
      this.inventoryInfo = this.getObjectById(id, this.player.inventory);
      this.inventoryShow = true;
    },
    // Thông tin linh sủng
    petItemInfo(item) {
      this.petShow = true;
      this.petInfo = item;
    },
    // Thu hồi linh sủng
    petRetract() {
      const item = this.player.pet;
      if (JSON.stringify(item) == "{}") return;
      // Cập nhật thuộc tính người chơi, xóa tăng cường thuộc tính từ linh sủng xuất chiến
      this.playerAttribute(
        -item.dodge,
        -item.attack,
        -item.health,
        -item.critical,
        -item.defense
      );
      // Chuyển đến trang liên quan đến túi
      this.inventoryActive = "pet";
      // Thêm linh sủng vào túi linh sủng
      this.player.pets.push(item);
      // Thu hồi linh sủng đang xuất chiến
      this.player.pet = {};
    },
    // Tính cấp độ linh sủng
    computePetsLevel(lv) {
      if (lv >= 1 && lv <= 9) return "success";
      if (lv >= 10 && lv <= 19) return "primary";
      if (lv >= 20 && lv <= 29) return "warning";
      if (lv >= 30) return "danger";
    },
    // Thao tác thuộc tính người chơi
    // Thao tác thuộc tính người chơi
    playerAttribute(
      dodge = 0,
      attack = 0,
      health = 0,
      critical = 0,
      defense = 0
    ) {
      // Khởi tạo giá trị thuộc tính truyền vào
      dodge = isNaN(dodge) || !dodge ? 0 : parseFloat(dodge);
      attack = isNaN(attack) || !attack ? 0 : Math.floor(attack);
      health = isNaN(health) || !health ? 0 : Math.floor(health);
      defense = isNaN(defense) || !defense ? 0 : Math.floor(defense);
      critical = isNaN(critical) || !critical ? 0 : parseFloat(critical);
      // Né tránh
      this.player.dodge = this.player.dodge + dodge;
      // Công kích
      this.player.attack = this.player.attack + attack;
      // Khí huyết
      this.player.health = this.player.health + health;
      this.player.maxHealth = this.player.maxHealth + health;
      // Bạo kích
      this.player.critical = this.player.critical + critical;
      // Phòng thủ
      this.player.defense = this.player.defense + defense;
      // Điểm số
      this.player.score = equip.calculateEquipmentScore(
        this.player.dodge,
        this.player.attack,
        this.player.maxHealth,
        this.player.critical,
        this.player.defense
      );
    },
    // Tháo trang bị
    equipmentClose(type) {
      const { inventory, equipment } = this.player;
      if (!equipment[type]) return;
      // Cập nhật thuộc tính người chơi, xóa tăng cường thuộc tính từ trang bị đang mặc
      this.playerAttribute(
        -equipment[type].dodge,
        -equipment[type].attack,
        -equipment[type].health,
        -equipment[type].critical,
        -equipment[type].defense
      );
      // Chuyển đến trang liên quan đến túi
      this.equipmentActive = type;
      // Thêm ID cho trang bị
      equipment[type].id = Date.now();
      // Thêm trang bị vào túi
      inventory.push(equipment[type]);
      // Xóa trang bị loại hiện tại trên người
      equipment[type] = {};
    },
    // Lấy thông tin trang bị hiện tại của nhân vật
    getEquipmentInfo(id, type) {
      if (!id || !type) return;

      const equipment = this.getObjectById(
        id,
        this.player.inventory.concat(this.player.equipment[type])
      );
      if (!equipment) return;

      // Thông tin trang bị cần luyện khí
      this.strengthenInfo = equipment;
      // Cấp độ luyện khí
      if (this.player.equipment[type]) {
        this.player.equipment[type].strengthen = equipment.strengthen
          ? equipment.strengthen
          : 0;
      }
    },
    // Thông tin trang bị
    equipmentInfo(id, type) {
      if (id) {
        // Mở cửa sổ luyện khí
        this.strengthenShow = true;
        this.getEquipmentInfo(id, type);
      }
    },
    // Sắp xếp trang bị
    equipmentDropdown(command) {
      this.equipmentDropdownActive = command;
      this.player.inventory = this.player.inventory
        .slice()
        .sort((a, b) => b[command] - a[command]);
    },
    // Sắp xếp linh sủng
    petDropdown(command) {
      this.petDropdownActive = command;
      this.player.pets = this.player.pets
        .slice()
        .sort((a, b) => b[command] - a[command]);
    },
    // Thêm điểm thuộc tính
    attributePoints(type) {
      const typeNames = {
        attack: "Công kích",
        health: "Khí huyết",
        defense: "Phòng thủ",
      };
      if (this.player.points > 0) {
        const num = this.player.reincarnation
          ? this.player.reincarnation * 10
          : 1;
        const numText =
          type == "attack" || type == "defense" ? 50 * num : 100 * num;
        // Nếu là công kích
        if (type == "attack") this.playerAttribute(0, numText, 0, 0, 0);
        // Nếu là phòng thủ
        else if (type == "defense") this.playerAttribute(0, 0, 0, 0, numText);
        // Nếu là khí huyết
        else if (type == "health") this.playerAttribute(0, 0, numText, 0, 0);
        // Trừ điểm
        this.player.points--;
        this.$notifys({
          title: "Gợi ý thêm điểm",
          message: `Thêm điểm thành công, ${typeNames[type]} tăng ${numText} điểm`,
        });
      }
    },
    // Tính phần trăm chênh lệch tu vi cần thiết
    calculatePercentageDifference(num1, num2) {
      let difference = Math.abs(num1 - num2);
      let percentage = (difference / num1) * 100;
      const num3 =
        this.player.maxCultivation - this.player.cultivation > 0
          ? 100 - percentage
          : 100;
      return `${num3.toFixed(2)}%`;
    },
    copyContent(type) {
      /*
          Lưu ý chỉnh sửa
          Có thể thay đổi số nhóm nhưng phải giữ lại địa chỉ
      */
      const content =
        type == "qq"
          ? "920930589"
          : "https://github.com/setube/vue-XiuXianGame";
      this.$prompt(
        "",
        type == "qq" ? "Nhóm chat chính thức" : "Địa chỉ mã nguồn mở",
        {
          inputValue: content,
          showCancelButton: false,
          confirmButtonText: "Sao chép",
          beforeClose: async (action, instance, done) => {
            if (action === "confirm") {
              if (window.navigator.clipboard) {
                try {
                  await window.navigator.clipboard.writeText(content);
                  done();
                  // Đóng cửa sổ
                  this.show = false;
                  this.$notifys({
                    title: "Gợi ý",
                    message: "Sao chép thành công",
                  });
                } catch (err) {
                  this.$notifys({
                    title: "Gợi ý",
                    message: "Sao chép thất bại, vui lòng sao chép thủ công",
                  });
                }
              }
            } else {
              done();
            }
          },
        }
      ).catch(() => {});
    },
    getTagClass(type, index) {
      const achievements1 = this.$store.player.achievement[type] || [];
      return (
        Array.isArray(achievements1) &&
        achievements1.some((ach) => ach.id === index)
      );
    },
    // Chi tiết thành tựu
    achievementInfo(type, item) {
      let message = "";
      if (
        item.condition.health ||
        item.condition.attack ||
        item.condition.defense ||
        item.condition.dodge ||
        item.condition.critical
      ) {
        message = `<p>Khí huyết: ${item.condition.health || "Không yêu cầu"}</p>
                    <p>Công kích: ${
                      item.condition.attack || "Không yêu cầu"
                    }</p>
                    <p>Phòng thủ: ${
                      item.condition.defense || "Không yêu cầu"
                    }</p>
                    <p>Tỷ lệ né tránh: ${
                      item.condition.dodge
                        ? (item.condition.dodge * 100).toFixed(2) + "%"
                        : "Không yêu cầu"
                    }</p>
                    <p>Tỷ lệ bạo kích: ${
                      item.condition.critical
                        ? (item.condition.critical * 100).toFixed(2) + "%"
                        : "Không yêu cầu"
                    }</p>`;
      } else if (item.condition.level) {
        message = `<p>Đạt cấp độ: ${item.condition.level}</p>`;
      } else if (item.condition.monstersDefeated) {
        message = `<p>Số lượng quái vật đánh bại: ${item.condition.monstersDefeated}</p>`;
      } else if (item.condition.money) {
        message = `<p>Tích lũy linh thạch: ${this.$formatNumberToChineseUnit(
          item.condition.money
        )}</p>`;
      }
      if (item.desc) {
        message += `<p>Mô tả: ${item.desc}</p>`;
      }
      message += `<p>Phần thưởng hoàn thành: ${item.award} đan bồi dưỡng</p>`;
      message += `<p>Tăng cường danh hiệu: ${this.formatTitleBonus(
        item.titleBonus
      )}</p>`;
      const isCompleted = this.getTagClass(type, item.id);
      const isWearing = this.player.currentTitle === item.name;
      this.$confirm("", `${item.name}`, {
        center: true,
        message: `<div class="monsterinfo"><div class="monsterinfo-box">${message}</div></div>`,
        cancelButtonText: "Đóng",
        showCancelButton: isCompleted,
        confirmButtonText: isCompleted
          ? isWearing
            ? "Hủy đeo"
            : "Đeo danh hiệu"
          : "Đã hiểu",
        dangerouslyUseHTMLString: true,
      })
        .then(() => {
          if (isCompleted) this.toggleTitle(item);
        })
        .catch(() => {});
    },
    // Phương thức mới
    formatTitleBonus(bonus) {
      return Object.entries(bonus)
        .map(([key, value]) => {
          const num = value > 1 ? value : `${value * 100}%`;
          return `${this.$dropdownTypeObject[key]}+${num}`;
        })
        .join(", ");
    },
    toggleTitle(achievement) {
      if (this.player.currentTitle === achievement.name) {
        // Hủy đeo danh hiệu
        this.applyTitleBonus(achievement.titleBonus, false);
        this.player.currentTitle = null;
        this.$notifys({
          title: "Hệ thống danh hiệu",
          message: `Bạn đã hủy đeo danh hiệu "${achievement.name}"`,
        });
      } else {
        // Đeo danh hiệu mới
        if (this.player.currentTitle) {
          // Nếu đã đeo danh hiệu, xóa tăng cường của danh hiệu cũ
          const oldAchievement = this.findAchievementByTitle(
            this.player.currentTitle
          );
          if (oldAchievement)
            this.applyTitleBonus(oldAchievement.titleBonus, false);
        }
        this.applyTitleBonus(achievement.titleBonus, true);
        this.player.currentTitle = achievement.name;
        this.$notifys({
          title: "Hệ thống danh hiệu",
          message: `Bạn đã đeo danh hiệu "${achievement.name}"`,
        });
      }
    },
    applyTitleBonus(bonus, isApplying) {
      const multiplier = isApplying ? 1 : -1;
      let dodge = 0,
        attack = 0,
        health = 0,
        critical = 0,
        defense = 0;
      Object.entries(bonus).forEach(([key, value]) => {
        switch (key) {
          case "dodge":
            dodge += value * multiplier;
            break;
          case "attack":
            attack += value * multiplier;
            break;
          case "health":
            health += value * multiplier;
            break;
          case "critical":
            critical += value * multiplier;
            break;
          case "defense":
            defense += value * multiplier;
            break;
          default:
        }
      });
      this.playerAttribute(dodge, attack, health, critical, defense);
    },
    findAchievementByTitle(title) {
      return this.achievementAll
        .flatMap((category) => category.data)
        .find((ach) => ach.name === title);
    },
    // Thông tin trang bị trong sổ tay
    illustrationsInfo(i, ii) {
      const info = this.illustrationsItems[i].data[ii];
      this.$confirm("", info.name, {
        center: true,
        message: `<div class="monsterinfo">
                        <div class="monsterinfo-box">
                            <p>Loại: ${this.$genre[info.type]}</p>
                            <p>Cảnh giới: ${this.$levelNames(info.level)}</p>
                            <p>Phẩm chất: ${this.$levels[info.quality]}</p>
                            <p>Khí huyết: ${this.$formatNumberToChineseUnit(
                              info.health
                            )}</p>
                            <p>Công kích: ${this.$formatNumberToChineseUnit(
                              info.attack
                            )}</p>
                            <p>Phòng thủ: ${this.$formatNumberToChineseUnit(
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
                            <p>Điểm trang bị: ${this.$formatNumberToChineseUnit(
                              info.score
                            )}</p>
                            <p>Tỷ lệ nhận: ${info.prize}%</p>
                        </div>
                    </div>`,
        showCancelButton: false,
        confirmButtonText: "Đã hiểu",
        dangerouslyUseHTMLString: true,
      }).catch(() => {});
    },
  },
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
