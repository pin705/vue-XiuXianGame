<template>
  <div class="index">
    <div class="index2">
      <el-button
        class="button"
        @click="goHome"
      >
        Bắt đầu trò chơi
      </el-button>
      <el-button
        class="button"
        @click="dialogVisible = true"
      >
        Chính sách bảo mật
      </el-button>
    </div>
    <el-dialog
      v-model="dialogVisible"
      title="Chính sách bảo mật"
      width="420px"
    >
      <div class="custom-html md-stream-desktop">
        <p>Chúng tôi rất coi trọng quyền riêng tư của bạn và cam kết bảo vệ thông tin cá nhân của bạn. Vì trò chơi tu tiên dạng văn bản này là một trò chơi đơn máy hoàn toàn không cần kết nối mạng, chúng tôi xin tuyên bố rõ ràng như sau:</p>
        <el-collapse
          v-model="activeName"
          accordion
        >
          <el-collapse-item name="1">
            <template #title>
              <div class="custom-title">
                Không thu thập dữ liệu
              </div>
            </template>
            <p>Trò chơi được thiết kế để chạy mà không cần kết nối mạng. Do đó, chúng tôi không thu thập, lưu trữ, truyền tải hoặc sử dụng bất kỳ thông tin cá nhân nào của bạn, bao gồm nhưng không giới hạn ở tên, thông tin liên lạc, vị trí địa lý, thông tin thiết bị hoặc dữ liệu hành vi trong trò chơi.</p>
          </el-collapse-item>
          <el-collapse-item name="2">
            <template #title>
              <div class="custom-title">
                Không chia sẻ dữ liệu với bên thứ ba
              </div>
            </template>
            <p>Do trò chơi không thu thập bất kỳ thông tin cá nhân nào, chúng tôi cũng không chia sẻ bất kỳ dữ liệu nào với các tổ chức hoặc cá nhân bên thứ ba. Chúng tôi cam kết tôn trọng và bảo vệ quyền lợi riêng tư của bạn, đảm bảo trải nghiệm chơi game của bạn không bị gián đoạn bởi bất kỳ yếu tố không cần thiết nào.</p>
          </el-collapse-item>
          <el-collapse-item name="3">
            <template #title>
              <div class="custom-title">
                Lưu trữ cục bộ
              </div>
            </template>
            <p>Mặc dù trò chơi có thể cần lưu trữ một số tệp cần thiết trên thiết bị của bạn (như lưu trữ tiến độ, cài đặt, v.v.), nhưng các dữ liệu này chỉ được sử dụng để trò chơi hoạt động bình thường và được lưu trữ hoàn toàn trên thiết bị cục bộ của bạn. Chúng tôi không tải dữ liệu này lên máy chủ hoặc sử dụng cho bất kỳ mục đích nào ngoài việc chạy trò chơi.</p>
          </el-collapse-item>
          <el-collapse-item name="4">
            <template #title>
              <div class="custom-title">
                Bảo vệ quyền riêng tư
              </div>
            </template>
            <p>Chúng tôi hiểu rằng quyền riêng tư rất quan trọng đối với mỗi người chơi. Vì vậy, chúng tôi cam kết sẽ tiếp tục chú trọng và tuân thủ tất cả các quy định pháp luật bảo vệ quyền riêng tư hiện hành, đồng thời không ngừng cải thiện và tối ưu hóa các biện pháp bảo vệ quyền riêng tư của mình.</p>
          </el-collapse-item>
          <el-collapse-item name="5">
            <template #title>
              <div class="custom-title">
                Cập nhật chính sách
              </div>
            </template>
            <p>Mặc dù đặc tính không cần kết nối mạng của trò chơi khiến chính sách bảo mật của chúng tôi khó có khả năng thay đổi lớn, chúng tôi vẫn bảo lưu quyền sửa đổi chính sách bảo mật dựa trên sự thay đổi của luật pháp hoặc cập nhật kỹ thuật của trò chơi. Mọi cập nhật chính sách sẽ được công bố trên trang này và ghi rõ ngày có hiệu lực.</p>
          </el-collapse-item>
          <el-divider>Kết luận</el-divider>
          <p>Cảm ơn bạn đã chơi trò chơi này! Chúng tôi cam kết sẽ tiếp tục nỗ lực để mang đến cho bạn một trải nghiệm chơi game an toàn và thú vị.</p>
        </el-collapse>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="zhengce(false)">Từ chối</el-button>
        <el-button
          type="primary"
          @click="zhengce(true)"
        >Đồng ý</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
    export default {
        data () {
            return {
                player: {},
                activeName: '',
                dialogVisible: true
            };
        },
        mounted () {
            const local = this.$store;
            if (local) {
                this.player = local.player;
                this.player.zc = this.player.zc ? this.player.zc : false;
                this.dialogVisible = !this.player.zc;
            }
            if (!this.$isAPP || this.player.zc) this.$router.push('/home');
        },
        methods: {
            zhengce (bool) {
                if (bool) this.$router.push('/home');
                else this.$notifys({ title: 'Gợi ý', message: 'Chưa đồng ý với chính sách bảo mật, không thể vào trò chơi' });
                this.player.zc = bool;
                this.dialogVisible = false;
            },
            goHome () {
                if (!this.player.zc) {
                    this.$notifys({ title: 'Gợi ý', message: 'Chưa đồng ý với chính sách bảo mật, không thể vào trò chơi' });
                    return;
                }
                this.$router.push('/home');
            }
        }
    };
</script>
<style scoped>
    .index {
        position: relative;
        min-height: 574px;
    }

    @media only screen and (max-width: 768px) {
        .index2 {
            display: grid;
            width: 100%;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
        }

        .index2 .button {
            margin-top: 50px;
            width: 100%;
            margin-left: 0;
        }
    }
</style>
