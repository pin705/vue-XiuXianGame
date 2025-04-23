const boss = {
    drawPrize(lv) {
        const bossInfo = this.boss_Names();
        // Máu
        const health = this.getRandomInt(50000, 100000) * lv;
        // Tấn công
        const attack = this.getRandomInt(5000, 10000) * lv;
        // Phòng thủ
        const defense = this.getRandomInt(1000, 10000) * lv;
        // Né tránh
        const dodge = this.getRandomFloatInRange(0.1, 0.8);
        // Chí mạng
        const critical = this.getRandomFloatInRange(0.1, 1);
        return {
            name: bossInfo.name,
            text: this.boss_Text(),
            time: Math.floor(Date.now() / 1000),
            desc: bossInfo.description,
            level: 144,
            dodge,
            attack,
            health,
            defense,
            conquer: false,
            critical,
            maxhealth: health
        };
    },
    // Rơi đồ từ boss
    boss_Equip(lv) {
        const weapon = [
            'Kiếm Phượng Hoàng Lửa', 'Thương Liên Hoa Ngọc Máu', 'Cung Thiêu Đốt Thiên Đình', 'Kích Xích Tiêu Thần Hỏa', 'Quạt Lưu Vân Vũ Hỏa',
            'Roi Cánh Chu Tước', 'Đao Nhận Xích Long', 'Liềm Ma Đồng Viêm Ngục', 'Trượng Tinh Thần Huyết Dịch', 'Luân Xích Liên Nghiệp Hỏa'
        ];
        const armor = [
            'Chiến Giáp Liên Hoa Lửa', 'Vân Thường Phượng Hoàng Xích Tiêu', 'Gấm Thêu Chu Tước Thiêu Đốt', 'Bảo Y Long Lân Lửa Đỏ', 'Hoa Phục Hồng Tường Vi',
            'Trường Bào Lưu Quang Đan Hà', 'Chiến Bào Viêm Dương', 'Áo Choàng Xích Liên', 'Vũ Y Phượng Hoàng', 'Cẩm Y Nghiệp Hỏa Liên Hoa'
        ];
        const accessory = [
            'Lông Phượng Hoàng Lửa', 'Ngọc Bội Lưu Ly Huyết Phách', 'Dây Chuyền Hồng Ngọc Rực Lửa', 'Hoa Tai Cánh Chu Tước', 'Vòng Tay Nghiệp Hỏa Liên Hoa',
            'Nhẫn Phượng Hoàng Đan Tiêu', 'Dây Chuyền Hỏa Diệm Mã Não', 'Ngọc Bội Thiên Thần Lệ', 'Vòng Tay Cẩm Hồng', 'Chuỗi Ngọc Phượng Hoàng Tái Sinh'
        ];
        const sutra = [
            'Trận Đồ Linh Châu Hỏa Diệm', 'Lò Đỉnh Phượng Hoàng Tái Sinh', 'Bia Nghiệp Hỏa Tịnh Thế', 'Bàn Luân Hồi Ngọc Máu', 'Cánh Chu Tước Vút Trời',
            'Lò Luyện Thiêu Đốt', 'Bản Đồ Hỏa Vực Đan Tiêu', 'Ngọc Luyện Hồn Xích Long', 'Gương Tâm Hỏa Linh', 'Đàn Tế Cửu Chuyển Viêm Linh'
        ];
        const weaponTypes = {
            weapon: { names: weapon, probability: 25 },
            armor: { names: armor, probability: 25 },
            accessory: { names: accessory, probability: 25 },
            sutra: { names: sutra, probability: 25 }
        };
        const totalProbability = Object.values(weaponTypes).reduce((acc, { probability }) => acc + probability, 0);
        const random = Math.floor(Math.random() * totalProbability);
        let cumulativeProbability = 0;
        for (const [quality, { names, probability }] of Object.entries(weaponTypes)) {
            cumulativeProbability += probability;
            if (random < cumulativeProbability) {
                const dodge = this.getRandomFloatInRange(0.05, 0.1);
                const Attack = this.getRandomInt(500, 1000) * lv * 10;
                const Health = this.getRandomInt(5000, 10000) * lv * 10;
                const defense = this.getRandomInt(500, 1000) * lv * 10;
                const Criticalhitrate = this.getRandomFloatInRange(0.05, 0.1);
                return {
                    id: Date.now(), // ID trang bị
                    name: names[Math.floor(Math.random() * names.length)], // Tên trang bị
                    type: quality, // Loại trang bị
                    level: lv, // Cấp độ trang bị
                    score: this.calculateEquipmentScore(dodge, Attack, Health, Criticalhitrate, defense), // Điểm trang bị
                    dodge: ['accessory', 'sutra'].includes(quality) ? dodge : 0, // Tỉ lệ né tránh
                    attack: ['weapon', 'accessory', 'sutra'].includes(quality) ? Attack : 0, // Tấn công
                    health: ['armor', 'accessory', 'sutra'].includes(quality) ? Health : 0, // Máu
                    quality: 'danger', // Chất lượng trang bị
                    // Dữ liệu ban đầu
                    initial: {
                        dodge: ['accessory', 'sutra'].includes(quality) ? dodge : 0, // Tỉ lệ né tránh
                        attack: ['weapon', 'accessory', 'sutra'].includes(quality) ? Attack : 0, // Tấn công
                        health: ['armor', 'accessory', 'sutra'].includes(quality) ? Health : 0, // Máu
                        defense: ['accessory', 'sutra'].includes(quality) ? defense : 0, // Phòng thủ
                        critical: ['weapon', 'accessory', 'sutra'].includes(quality) ? Criticalhitrate : 0, // Tỉ lệ chí mạng
                    },
                    defense: ['armor', 'accessory', 'sutra'].includes(quality) ? defense : 0, // Phòng thủ
                    critical: ['weapon', 'accessory', 'sutra'].includes(quality) ? Criticalhitrate : 0 // Tỉ lệ chí mạng
                };
            }
        }
    },
    // Ngôn ngữ boss
    boss_Text() {
        const text = [
            'Thời đại của ngươi đã kết thúc, giờ đây, ta là kẻ thống trị tất cả.',
            'Nỗ lực của ngươi rốt cuộc chỉ là con đường dẫn ta tới chiến thắng.',
            'Đánh bại ngươi, với ta chỉ là chuyện nhỏ, sức mạnh của ngươi chỉ có vậy.',
            'Sinh mệnh ngươi trong tay ta mong manh như kiến, cái chết của ngươi chỉ là một mắt xích trong kế hoạch của ta.',
            'Thất bại của ngươi chứng minh trí tuệ và sức mạnh của ta vô địch, còn ngươi chỉ là bậc thang cho ta.',
            'Sự tồn tại của ngươi từng khiến ta cảm thấy đe dọa, nhưng giờ ngươi đã trở thành hạt bụi dưới chân ta.',
            'Dũng khí của ngươi đáng khen, nhưng tiếc thay, dũng khí không thể thay đổi kết quả, rốt cuộc ngươi vẫn thất bại.',
            'Cái chết của ngươi sẽ là một nét trong huyền thoại của ta, còn ngươi sẽ mãi bị ta đạp dưới chân.',
            'Sự chống cự của ngươi chỉ là vô ích, số phận ngươi đã được định đoạt.',
            'Kết thúc của ngươi là khởi đầu cho đỉnh cao mới của ta, sự tồn tại của ngươi với ta đã vô nghĩa.',
            'Cái chết của ngươi sẽ chứng minh sức mạnh bất khả chiến bại của ta, còn ngươi mãi là kẻ thua cuộc.',
            'Lời trăn trối của ngươi với ta vô nghĩa, vì ngươi không còn ảnh hưởng đến kế hoạch của ta.',
            'Sự biến mất của ngươi chỉ là gợn sóng nhỏ trong vũ trụ, còn ta sẽ tiếp tục viết nên huyền thoại.',
            'Thất bại của ngươi chỉ là chú thích trên con đường thành công của ta, còn ngươi mãi không thoát khỏi vết nhơ này.',
            'Ngọn lửa sinh mệnh của ngươi đã tắt, còn ta sẽ tiếp tục cháy sáng, soi rọi thế giới.',
            'Cái chết của ngươi khiến ta thêm tin vào con đường của mình, còn ngươi chỉ là kẻ qua đường.',
            'Sự tồn tại của ngươi từng khiến ta do dự, nhưng giờ ta đã không còn bận tâm, vì ta đã hoàn toàn đánh bại ngươi.',
            'Kết thúc của ngươi là minh chứng cho sức mạnh của ta, còn ngươi mãi không thoát khỏi định mệnh.',
            'Cái chết của ngươi sẽ là nền tảng cho sự nghiệp vĩ đại của ta, còn ngươi sẽ bị lãng quên.',
            'Thách thức của ngươi dù mãnh liệt, nhưng không thể lay chuyển vị thế của ta, cái chết của ngươi chỉ là chú thích trong cuộc đời rực rỡ của ta.'
        ];
        return text[Math.floor(Math.random() * text.length)];
    },
    boss_Names() {
        const boss = [
            { name: 'Chúc Long Thần Tôn', description: 'Thần núi Chung Sơn, mở mắt là ban ngày, nhắm mắt là đêm tối, trong hơi thở làm biến đổi phong vân, khống chế dòng chảy thời gian.' },
            { name: 'U Minh Quỷ Đế', description: 'Bậc thống trị tối cao cõi U Minh, nắm giữ luân hồi sinh tử, sức mạnh thâm bất khả trắc, có thể triệu hồi vạn thiên oan hồn.' },
            { name: 'Thương Khung Ma Tôn', description: 'Sinh ra từ chín tầng trời, vì đam mê tình cảm phàm trần mà sa vào ma đạo, có khả năng thao túng nguyên tố trời đất, xé rách hư không.' },
            { name: 'Long Hoàng Ngạo Thiên', description: 'Tôn quý nhất trong tộc Long, khoác long lân lấp lánh, nắm giữ tất cả bí mật và sức mạnh cổ xưa của tộc Long, uy nghi khiến vạn thú quy phục.' },
            { name: 'Phượng Vũ Cửu Thiên', description: 'Nữ vương tộc Phượng Hoàng, sở hữu thân thể bất tử cùng khả năng tái sinh từ tro tàn, mỗi vẫy cánh có thể tạo ra biển lửa thiêu rụi vạn vật.' },
            { name: 'Lôi Thần Thiên Tôn', description: 'Chuyển thế của Lôi Thần thiên giới, tay cầm Lôi Thần chùy, có thể triệu hồi cửu thiên thần lôi, một kích phá núi sông, vạn vật tịch diệt.' },
            { name: 'U Minh Huyết Hoàng', description: 'Tồn tại cổ xưa nơi U Minh giới, lấy máu tươi làm thức ăn, sức mạnh bắt nguồn từ sát khí và oán niệm vô tận, khiến người nghe kinh hồn bạt vía.' },
            { name: 'Huyền Băng Long Thần', description: 'Sinh vật thần bí từ vùng cực bắc, kết hợp sức mạnh của Long và nguyên tố băng, thân thể bất khả xâm phạm, có thể đóng băng vạn vật.' },
            { name: 'Kim Sí Đại Bằng Vương', description: 'Vua của tộc Đại Bằng, sở hữu đôi cánh che kín bầu trời, tốc độ nhanh như chớp, móng vuốt đủ sức xé rách không gian.' },
            { name: 'Hỗn Độn Ma Quân', description: 'Ma vật cổ xưa sinh ra từ hỗn độn nguyên sơ, sức mạnh bắt nguồn từ bản nguyên vũ trụ, có thể bẻ cong hiện thực, nuốt chửng vạn vật, là một trong những tồn tại đáng sợ nhất.' }
        ];
        return boss[Math.floor(Math.random() * boss.length)];
    },
    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    getRandomFloatInRange(min, max) {
        return Math.random() * (max - min) + min;
    },
    // Tính điểm trang bị
    calculateEquipmentScore(dodge = 0, attack = 0, health = 0, critical = 0, defense = 0) {
        // Trọng số điểm
        const weights = {
            attack: 1.5, // Tấn công
            health: 1.0, // Khí huyết
            defense: 1.2, // Phòng thủ
            critRate: 1.8, // Chí mạng
            dodgeRate: 1.6 // Né tránh
        };
        // Tính điểm
        const score = (
            dodge * weights.dodgeRate +
            attack * weights.attack +
            (health / 100) * weights.health +
            defense * weights.defense +
            critical * weights.critRate
        );
        return Math.floor(score);
    }
};

export default boss;
