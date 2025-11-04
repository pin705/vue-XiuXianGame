const npc = {
    // Trả về danh sách tên NPC
    npcNames() {
        const names = [
            'Vân Miểu Tiên Tử', 'Lưu Quang U Cơ', 'Yên Hà Tiên Tử', 'Thanh Vận Linh Cơ', 'Bích Lạc Linh Tiên',
            'Kỳ Hà Linh Nữ', 'Diêu Quang Tuyết Cơ', 'Lưu Ly Tuyết Cơ', 'U Hoằng Tuyết Cơ', 'Tuyết Vũ Linh Cơ'
        ];
        return names;
    },
    // Chọn ngẫu nhiên 10 tên NPC từ danh sách
    // getRandomObjects() {
    //     const names = [
    //         'Trương Nhã Kỳ', 'Lý Hân Di', 'Vương Chỉ Nhược', 'Triệu Tư Hàm', 'Lưu Mộng Kỳ', 'Trần Ngữ Yên', 'Chu Tịnh Kỳ', 'Ngô Uyển Nhi', 'Hoàng Vũ Đình', 'Từ Tuyết Oánh',
    //         'Tôn Thi Hàm', 'Cao Tịnh Kỳ', 'Hà Hiểu Tuyên', 'Trịnh Tâm Di', 'Lương Tử Tuyên', 'Tạ Mộng Dao', 'La Vũ Tuyên', 'Hứa Chỉ Tuyên', 'Phùng Khả Hinh', 'Trình Chỉ Nhược',
    //         'Thái Hân Nghiễn', 'Đặng Uyển Đình', 'Quách Huệ Nghiễn', 'Diệp Tư Mẫn', 'Mã Tịnh Văn', 'Lâm Vũ Hân', 'Tô Nhược Hinh', 'Lư Duyệt Lâm', 'Đinh Nhã Đình', 'Đường Mộng Đình',
    //         'Tiêu Ngữ Đồng', 'Tống Thi Nhã', 'Hứa Hiểu Lôi', 'Hàn Chỉ Hàm', 'Chương Hân Duyệt', 'Thẩm Tịnh Như', 'Ngụy Uyển Quân', 'Khương Vũ Vi', 'Tần Tử Hàm', 'Đào Tư Kỳ',
    //         'Viên Tịnh Hàm', 'Tưởng Ngữ Yên', 'Hồ Uyển Thanh', 'Dư Di Nhiên', 'Lục Mộng Khiết', 'Tiền Chỉ Nhược', 'Nghiêm Nhã Tịnh', 'Tào Tư Dĩnh', 'Giang Hiểu Yến', 'Phương Vũ Hân'
    //     ];
    //     const randomObjects = [];

    //     for (let i = 0; i < 10; i++) {
    //         const randomIndex = Math.floor(Math.random() * names.length);
    //         randomObjects.push(names[randomIndex]);
    //     }

    //     return randomObjects;
    // }
};

export default npc;
