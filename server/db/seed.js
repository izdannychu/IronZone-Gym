import bcrypt from 'bcryptjs';
import db, { migrate } from './database.js';

migrate();

const hash = (password) => bcrypt.hashSync(password, 10);
const adminHash = hash('admin123');
const userHash = hash('password123');

db.exec(`
DELETE FROM notifications; DELETE FROM reviews; DELETE FROM maintenance_logs; DELETE FROM equipment;
DELETE FROM memberships; DELETE FROM order_items; DELETE FROM orders; DELETE FROM promotions;
DELETE FROM cart_items; DELETE FROM plans; DELETE FROM trainers; DELETE FROM employees; DELETE FROM admins; DELETE FROM users;
DELETE FROM sqlite_sequence;
`);

const insertAdmin = db.prepare('INSERT INTO admins (username, email, password_hash, role) VALUES (?, ?, ?, ?)');
insertAdmin.run('superadmin', 'admin@ironzone.vn', adminHash, 'super_admin');
insertAdmin.run('manager', 'manager@ironzone.vn', adminHash, 'admin');

const insertUser = db.prepare(`INSERT INTO users (full_name, email, password_hash, phone, dob, gender, avatar_url) VALUES (?, ?, ?, ?, ?, ?, ?)`);
const users = [
    ['Nguyễn An Nhiên', 'user1@example.com', '0901000001', '1994-03-12', 'female'],
    ['Trần Minh Khang', 'user2@example.com', '0901000002', '1992-07-18', 'male'],
    ['Lê Hoàng Gia Bảo', 'user3@example.com', '0901000003', '1996-11-05', 'male'],
    ['Phạm Thảo Vy', 'user4@example.com', '0901000004', '1998-01-22', 'female'],
    ['Võ Đức Anh', 'user5@example.com', '0901000005', '1991-09-09', 'male'],
    ['Đỗ Khánh Linh', 'user6@example.com', '0901000006', '1997-05-30', 'female'],
    ['Hoàng Nhật Minh', 'user7@example.com', '0901000007', '1995-12-14', 'male'],
    ['Bùi Ngọc Hân', 'user8@example.com', '0901000008', '1999-04-03', 'female'],
    ['Đặng Quang Huy', 'user9@example.com', '0901000009', '1993-08-25', 'male'],
    ['Phan Mai Chi', 'user10@example.com', '0901000010', '2000-02-17', 'female'],
    ['Vũ Hải Nam', 'user11@example.com', '0901000011', '1990-10-11', 'male'],
    ['Ngô Thanh Trúc', 'user12@example.com', '0901000012', '1996-06-21', 'female'],
    ['Trương Gia Hân', 'user13@example.com', '0901000013', '1998-12-01', 'female'],
    ['Nguyễn Tuấn Kiệt', 'user14@example.com', '0901000014', '1994-09-28', 'male'],
    ['Lâm Phương Uyên', 'user15@example.com', '0901000015', '1997-03-08', 'female'],
    ['Mai Đức Thịnh', 'user16@example.com', '0901000016', '1992-05-19', 'male'],
    ['Hồ Bảo Ngọc', 'user17@example.com', '0901000017', '1999-07-07', 'female'],
    ['Cao Minh Quân', 'user18@example.com', '0901000018', '1991-01-15', 'male'],
    ['Tạ Yến Nhi', 'user19@example.com', '0901000019', '2001-04-26', 'female'],
    ['Đinh Quốc Việt', 'user20@example.com', '0901000020', '1993-11-20', 'male'],
    ['Emily Carter', 'emily.carter@example.com', '0901000021', '1995-06-04', 'female'],
    ['Daniel Brooks', 'daniel.brooks@example.com', '0901000022', '1990-08-13', 'male'],
    ['Sophie Nguyen', 'sophie.nguyen@example.com', '0901000023', '1998-02-10', 'female'],
    ['Michael Tran', 'michael.tran@example.com', '0901000024', '1989-12-09', 'male'],
    ['Anna Williams', 'anna.williams@example.com', '0901000025', '1996-10-30', 'female'],
    ['James Wilson', 'james.wilson@example.com', '0901000026', '1992-03-27', 'male'],
    ['Sarah Johnson', 'sarah.johnson@example.com', '0901000027', '1997-09-16', 'female'],
    ['David Miller', 'david.miller@example.com', '0901000028', '1991-07-22', 'male'],
    ['Nguyễn Hà My', 'ha.my@example.com', '0901000029', '2000-01-09', 'female'],
    ['Trần Quốc Hưng', 'quoc.hung@example.com', '0901000030', '1994-04-18', 'male'],
    ['Lê Bảo Châu', 'bao.chau@example.com', '0901000031', '1999-08-02', 'female'],
    ['Phạm Minh Đức', 'minh.duc@example.com', '0901000032', '1993-06-12', 'male'],
    ['Võ Hà Anh', 'ha.anh@example.com', '0901000033', '1996-02-25', 'female'],
    ['Đỗ Thành Đạt', 'thanh.dat@example.com', '0901000034', '1990-11-03', 'male'],
    ['Hoàng Mỹ Linh', 'my.linh@example.com', '0901000035', '1998-05-05', 'female'],
    ['Bùi Anh Tuấn', 'anh.tuan@example.com', '0901000036', '1991-10-29', 'male']
];
users.forEach((user, index) => {
    insertUser.run(user[0], user[1], userHash, user[2], user[3], user[4], `https://i.pravatar.cc/300?img=${(index % 70) + 1}`);
});

const trainers = [
    ['Arnold Schwarzenegger', 'arnold@ironzone.vn', '0901234567', 'Bodybuilding & Strength', 'Mr. Olympia, Fitness Icon', 550000, 'Biểu tượng thể hình thế giới, truyền cảm hứng về sức mạnh và kỷ luật.', 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Arnold_Schwarzenegger_1974.jpg'],

    ['Ronnie Coleman', 'ronnie@ironzone.vn', '0912345678', 'Bodybuilding', '8x Mr. Olympia', 600000, 'Huyền thoại bodybuilding, nổi tiếng với sức mạnh và khối lượng cơ bắp vượt trội.', 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Ronnie_Coleman_8_x_Mr_Olympia_-_2009_-_5.png'],

    ['Jay Cutler', 'jay.cutler@ironzone.vn', '0923456789', 'Bodybuilding', '4x Mr. Olympia', 580000, 'Chuyên về tăng cơ, kiểm soát hình thể và xây dựng vóc dáng thi đấu.', 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Jay_Cutler_bodybuilder_2008-crop.jpg'],

    ['Lou Ferrigno', 'lou@ironzone.vn', '0934567890', 'Strength Training', 'Bodybuilder, Fitness Icon', 500000, 'Biểu tượng sức mạnh cổ điển, phù hợp hình ảnh HLV truyền cảm hứng.', 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Lou_Ferrigno_2018.jpg'],

    ['Kai Greene', 'kai.greene@ironzone.vn', '0945678901', 'Bodybuilding & Posing', 'IFBB Pro', 560000, 'Nổi tiếng với phong cách thi đấu nghệ thuật, kiểm soát cơ thể và tư duy luyện tập.', 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Kai_Greene_IFBB_2009_Australia_6.jpg'],

    ['Phil Heath', 'phil.heath@ironzone.vn', '0951112233', 'Muscle Building', '7x Mr. Olympia', 620000, 'Huyền thoại Mr. Olympia, đại diện cho hình thể cân đối và phát triển cơ bắp đỉnh cao.', 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Phil_Heath.JPG'],

    ['Dexter Jackson', 'dexter.jackson@ironzone.vn', '0961112233', 'Bodybuilding', 'Mr. Olympia Champion', 540000, 'Vận động viên thể hình nổi tiếng với độ sắc nét, cân đối và tính bền bỉ trong sự nghiệp.', 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Dexter_Jackson_IFBB_2008_Australia_4.jpg'],

    ['Lee Haney', 'lee.haney@ironzone.vn', '0971112233', 'Strength & Conditioning', '8x Mr. Olympia', 570000, 'Biểu tượng bodybuilding cổ điển, nổi bật với triết lý tập luyện kỷ luật và bền vững.', 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Lee_Haney_2014.jpg'],

    ['Branch Warren', 'branch.warren@ironzone.vn', '0982223344', 'Power Bodybuilding', 'IFBB Pro', 520000, 'Phong cách tập luyện nặng, mạnh mẽ, phù hợp nhóm sức mạnh và tăng cơ.', 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Branch_Warren_cropped.jpg'],

    ['Frank Zane', 'frank.zane@ironzone.vn', '0982223355', 'Classic Physique', '3x Mr. Olympia', 530000, 'Nổi tiếng với hình thể classic, cân đối và thẩm mỹ.', 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Frank_Zane_2011_Shankbone.JPG'],

    ['Mike Mentzer', 'mike.mentzer@ironzone.vn', '0982223366', 'High Intensity Training', 'Bodybuilder, HIT Advocate', 510000, 'Gắn liền với triết lý High Intensity Training, tập trung hiệu quả và cường độ.', 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Mike_Mentzer.jpg'],

    ['Larry Scott', 'larry.scott@ironzone.vn', '0982223377', 'Classic Bodybuilding', 'First Mr. Olympia', 500000, 'Nhà vô địch Mr. Olympia đầu tiên, phù hợp hình ảnh bodybuilding cổ điển.', 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Larry_Scott_1963.png']
];
const insertTrainer = db.prepare('INSERT INTO trainers (full_name,email,phone,specialty,certifications,hourly_rate,bio,avatar_url) VALUES (?,?,?,?,?,?,?,?)');
trainers.forEach((row) => insertTrainer.run(...row));

const insertPlan = db.prepare('INSERT INTO plans (name,duration_days,price,description,features,is_active,is_featured) VALUES (?,?,?,?,?,?,?)');
[
    ['Basic', 30, 299000, 'Gói cơ bản 1 tháng, lý tưởng để bắt đầu hành trình thể hình.', ['Truy cập phòng gym 6h-22h', 'Phòng thay đồ và tủ khóa', 'Hướng dẫn tập cơ bản', '1 buổi tư vấn dinh dưỡng'], 1, 0],
    ['Standard', 90, 799000, 'Gói 3 tháng tiết kiệm cho người tập đều đặn.', ['Tất cả quyền lợi Basic', 'Lớp học nhóm không giới hạn', 'Đánh giá thể lực hằng tháng', 'Ứng dụng theo dõi tiến độ'], 1, 0],
    ['Premium', 180, 1490000, 'Gói 6 tháng với trải nghiệm đầy đủ nhất.', ['Tất cả quyền lợi Standard', '2 buổi PT/tháng miễn phí', 'Phòng xông hơi và hồ bơi', 'Ưu tiên đặt lịch máy tập', 'Tư vấn dinh dưỡng không giới hạn'], 1, 1],
    ['VIP Annual', 365, 2490000, 'Gói 1 năm VIP, tiết kiệm và đầy đủ đặc quyền.', ['Tất cả quyền lợi Premium', '4 buổi PT/tháng miễn phí', 'Phòng tập riêng theo yêu cầu', 'Towel service hằng ngày', 'Quà tặng thành viên VIP'], 1, 1],
    ['PT Package', 30, 1990000, 'Gói tập 1-1 cùng PT chuyên nghiệp trong 12 buổi/tháng.', ['12 buổi tập 1-1 với PT', 'Lịch tập cá nhân hóa', 'Kế hoạch dinh dưỡng riêng', 'Theo dõi body composition', 'Hỗ trợ qua Zalo 24/7'], 1, 1],
    ['Student Flex', 30, 199000, 'Gói linh hoạt cho sinh viên, dễ bắt đầu và tối ưu chi phí.', ['Truy cập khung giờ 9h-16h', 'Tủ khóa dùng trong ngày', '2 lớp nhóm mỗi tuần', 'Ưu đãi nâng cấp gói dài hạn'], 1, 0],
    ['Corporate Fit', 180, 1890000, 'Gói doanh nghiệp cho nhân viên văn phòng cần lịch tập ổn định.', ['Check-in nhanh cho nhóm công ty', 'Workshop sức khỏe mỗi tháng', 'Báo cáo tiến độ tổng quan', 'Ưu tiên lớp sau giờ làm'], 1, 1],
    ['Recovery Plus', 60, 990000, 'Gói phục hồi và mobility dành cho người cần cải thiện vận động.', ['Đánh giá tư thế ban đầu', 'Lớp mobility 3 buổi/tuần', 'Khu recovery chuyên biệt', 'Theo dõi đau mỏi và giấc ngủ'], 1, 0]
].forEach((p) => insertPlan.run(p[0], p[1], p[2], p[3], JSON.stringify(p[4]), p[5], p[6]));

const insertPromo = db.prepare('INSERT INTO promotions (code,description,discount_type,discount_value,min_order_amount,start_date,end_date,usage_limit,is_active) VALUES (?,?,?,?,?,?,?,?,?)');
[
    ['NEWBIE10', 'Giảm 10% cho hội viên mới đăng ký lần đầu', 'percent', 10, 0, '2025-01-01', '2027-12-31', 200, 1],
    ['SUMMER20', 'Khuyến mãi hè, giảm 20% tất cả gói tập', 'percent', 20, 500000, '2025-06-01', '2027-08-31', 100, 1],
    ['FLAT100K', 'Giảm thẳng 100.000đ cho đơn từ 500k', 'fixed', 100000, 500000, '2025-01-01', '2027-12-31', 500, 1],
    ['VIP30', 'Giảm 30% khi mua gói VIP Annual', 'percent', 30, 2000000, '2025-01-01', '2027-06-30', 50, 1],
    ['BIRTHDAY', 'Quà sinh nhật, giảm 15% bất kỳ gói nào', 'percent', 15, 0, '2025-01-01', '2027-12-31', 365, 1],
    ['STUDENT15', 'Ưu đãi 15% cho sinh viên khi mua Student Flex', 'percent', 15, 0, '2025-01-01', '2027-12-31', 300, 1],
    ['CORP500K', 'Giảm 500.000đ cho gói Corporate Fit', 'fixed', 500000, 1500000, '2025-01-01', '2027-12-31', 80, 1],
    ['RECOVERY12', 'Giảm 12% cho gói phục hồi Recovery Plus', 'percent', 12, 700000, '2025-01-01', '2027-12-31', 120, 1]
].forEach((row) => insertPromo.run(...row));

const insertEquipment = db.prepare('INSERT INTO equipment (name,category,brand,serial_number,purchased_at,purchase_price,condition,location) VALUES (?,?,?,?,?,?,?,?)');
[
    ['Máy chạy bộ TechnoGym', 'Cardio', 'TechnoGym', 'TG-TM-001', '2023-01-15', 45000000, 'good', 'Khu Cardio - Tầng 1'],
    ['Máy đạp xe Spin Bike', 'Cardio', 'Keiser', 'KS-SB-005', '2023-01-15', 22000000, 'good', 'Khu Cardio - Tầng 1'],
    ['Bộ tạ đòn Olympic 200kg', 'Free Weights', 'Eleiko', 'EL-BAR-010', '2022-06-01', 35000000, 'good', 'Khu Tạ Tự Do'],
    ['Máy ép ngực Cable', 'Machines', 'Life Fitness', 'LF-CB-003', '2023-03-20', 68000000, 'good', 'Khu Máy - Tầng 1'],
    ['Smith Machine', 'Machines', 'Hammer Strength', 'HS-SM-001', '2022-06-01', 55000000, 'fair', 'Khu Tạ Tự Do'],
    ['Squat Rack Power Cage', 'Free Weights', 'Rogue', 'RG-PC-002', '2022-06-01', 42000000, 'good', 'Khu Tạ Tự Do'],
    ['Rowing Machine', 'Cardio', 'Concept2', 'C2-RM-004', '2023-08-10', 28000000, 'new', 'Khu Cardio - Tầng 1'],
    ['Dumbbell Set 2-50kg', 'Free Weights', 'Urethane', 'UR-DB-SET1', '2022-06-01', 120000000, 'good', 'Khu Tạ Tự Do'],
    ['Leg Press Machine', 'Machines', 'Precor', 'PR-LP-002', '2023-03-20', 72000000, 'good', 'Khu Máy - Tầng 1'],
    ['Battle Rope 15m', 'Functional', 'Valor Fitness', 'VF-BR-001', '2024-01-05', 3500000, 'new', 'Khu Functional'],
    ['Máy kéo xô Lat Pulldown', 'Machines', 'Matrix', 'MX-LP-011', '2024-02-14', 64000000, 'good', 'Khu Máy - Tầng 1'],
    ['Ghế Bench Press', 'Free Weights', 'Rogue', 'RG-BP-021', '2023-09-12', 18000000, 'good', 'Khu Tạ Tự Do'],
    ['Máy Stair Climber', 'Cardio', 'StairMaster', 'SM-SC-002', '2024-03-04', 83000000, 'new', 'Khu Cardio - Tầng 1'],
    ['Bóng Slam Ball 5-20kg', 'Functional', 'TRX', 'TRX-SB-014', '2024-01-20', 9000000, 'good', 'Khu Functional'],
    ['Máy Hip Thrust', 'Machines', 'Booty Builder', 'BB-HT-006', '2023-12-06', 76000000, 'good', 'Khu Máy - Tầng 1']
].forEach((row) => insertEquipment.run(...row));

const insertEmployee = db.prepare('INSERT INTO employees (full_name,email,phone,position,hire_date,salary) VALUES (?,?,?,?,?,?)');
insertEmployee.run('Trần Quân', 'quan.ops@ironzone.vn', '0909000001', 'Maintenance Lead', '2022-04-01', 14000000);
insertEmployee.run('Lê Hạnh', 'hanh.cs@ironzone.vn', '0909000002', 'Customer Success', '2023-02-10', 11000000);
insertEmployee.run('Nguyễn Phương Nam', 'nam.ops@ironzone.vn', '0909000003', 'Floor Supervisor', '2023-08-15', 12500000);
insertEmployee.run('Emily Rogers', 'emily.cs@ironzone.vn', '0909000004', 'Member Success', '2024-01-10', 12000000);

const insertMaintenance = db.prepare('INSERT INTO maintenance_logs (equipment_id,employee_id,maintenance_date,type,description,cost,status) VALUES (?,?,?,?,?,?,?)');
insertMaintenance.run(5, 1, '2026-06-01', 'inspection', 'Kiểm tra ray trượt và bôi trơn cáp', 450000, 'completed');
insertMaintenance.run(1, 1, '2026-06-18', 'routine', 'Bảo trì định kỳ băng chạy', 800000, 'scheduled');
insertMaintenance.run(11, 3, '2026-06-10', 'repair', 'Thay dây cáp kéo xô và cân chỉnh puly', 1200000, 'completed');
insertMaintenance.run(13, 1, '2026-06-22', 'inspection', 'Kiểm tra motor và vệ sinh cảm biến tốc độ', 650000, 'scheduled');
insertMaintenance.run(15, 3, '2026-06-05', 'routine', 'Siết lại bu lông khung máy và vệ sinh đệm lưng', 350000, 'completed');

const insertReview = db.prepare('INSERT INTO reviews (user_id,target_type,target_id,rating,comment) VALUES (?,?,?,?,?)');
[
    [1, 'trainer', 1, 5, 'Thầy Tuấn dạy rất tận tâm, sau 3 tháng mình tăng 4kg cơ!'],
    [2, 'trainer', 2, 5, 'Chị Mai giải thích kỹ từng động tác yoga, rất phù hợp cho người mới.'],
    [3, 'plan', 3, 5, 'Gói Premium xứng đáng từng đồng, phòng xông hơi tuyệt vời.'],
    [4, 'trainer', 3, 4, 'Thầy Hùng dạy boxing rất đỉnh, chỉ cần thêm giờ cuối tuần là hoàn hảo.'],
    [5, 'gym', 0, 5, 'Cơ sở vật chất xịn, nhân viên thân thiện, không khí tập cực tốt.'],
    [6, 'plan', 4, 5, 'Gói VIP Annual tiết kiệm được khá nhiều so với mua từng tháng.'],
    [7, 'trainer', 4, 5, 'Chị Linh giúp mình giảm 8kg trong 2 tháng, siêu hiệu quả!'],
    [8, 'trainer', 5, 5, 'Anh Thanh có kiến thức chuyên sâu về bodybuilding, rất chuyên nghiệp.'],
    [9, 'plan', 2, 4, 'Gói Standard giá tốt, lớp học nhóm phong phú.'],
    [10, 'gym', 0, 4, 'Máy móc hiện đại, sạch sẽ. Giờ cao điểm hơi đông nhưng vẫn ổn.'],
    [11, 'trainer', 1, 5, 'Chương trình tập của thầy Tuấn rất khoa học, kết quả thấy rõ.'],
    [12, 'plan', 5, 5, 'PT Package đáng tiền lắm, có lịch tập riêng rất tiện.'],
    [13, 'trainer', 2, 4, 'Yoga với chị Mai giúp mình giảm stress đáng kể sau giờ làm.'],
    [14, 'gym', 0, 5, 'Vị trí thuận tiện, parking rộng, hay ghé tập sáng sớm.'],
    [15, 'plan', 1, 4, 'Gói Basic đủ dùng cho người mới bắt đầu tập gym.'],
    [16, 'trainer', 9, 5, 'Alex chỉnh form chạy nước rút rất kỹ, buổi tập nặng nhưng cực đã.'],
    [17, 'trainer', 10, 5, 'Sophia giúp vai gáy của mình đỡ căng rõ rệt sau vài tuần.'],
    [18, 'plan', 7, 5, 'Corporate Fit rất hợp với team văn phòng, đi tập sau giờ làm tiện.'],
    [19, 'gym', 0, 5, 'Không gian sáng, locker sạch và nhân viên hỗ trợ nhanh.'],
    [20, 'trainer', 12, 5, 'Anh Bảo hướng dẫn deadlift an toàn, mình tự tin hơn rất nhiều.'],
    [21, 'plan', 6, 4, 'Student Flex rẻ và hợp lịch học, mong có thêm lớp tối.'],
    [22, 'gym', 0, 5, 'Great equipment, friendly trainers, and the app flow is easy to follow.'],
    [23, 'plan', 8, 5, 'Recovery Plus giúp mình ngủ tốt hơn và bớt đau lưng khi ngồi lâu.'],
    [24, 'trainer', 11, 5, 'Chị Quỳnh Anh tư vấn ăn uống rất thực tế, không bị áp lực.']
].forEach((row) => insertReview.run(...row));

const today = new Date();
const end = new Date(today);
end.setDate(today.getDate() + 180);
db.prepare('INSERT INTO memberships (user_id,plan_id,order_id,trainer_id,start_date,end_date,status) VALUES (?,?,?,?,?,?,?)')
    .run(1, 3, null, 1, today.toISOString().slice(0, 10), end.toISOString().slice(0, 10), 'active');
db.prepare('INSERT INTO notifications (user_id,title,message,type) VALUES (?,?,?,?)')
    .run(1, 'Chào mừng đến IronZone', 'Gói Premium của bạn đang hoạt động. Hãy đặt lịch tập đầu tiên ngay hôm nay.', 'success');

const planById = db.prepare('SELECT * FROM plans WHERE id=?');
const insertOrder = db.prepare('INSERT INTO orders (user_id,promotion_id,subtotal,discount_amount,total_amount,payment_method,payment_status,status,note,ordered_at) VALUES (?,?,?,?,?,?,?,?,?,?)');
const insertOrderItem = db.prepare('INSERT INTO order_items (order_id,plan_id,quantity,unit_price) VALUES (?,?,?,?)');
const insertMembership = db.prepare('INSERT INTO memberships (user_id,plan_id,order_id,trainer_id,start_date,end_date,status) VALUES (?,?,?,?,?,?,?)');
const insertNotification = db.prepare('INSERT INTO notifications (user_id,title,message,type) VALUES (?,?,?,?)');

[
    { user_id: 2, plan_id: 4, trainer_id: 5, method: 'momo', ordered_at: '2026-06-02 09:20:00', note: 'Khách muốn ưu tiên khung giờ sáng.' },
    { user_id: 3, plan_id: 2, trainer_id: 1, method: 'bank_transfer', ordered_at: '2026-06-04 14:45:00', note: null },
    { user_id: 4, plan_id: 5, trainer_id: 4, method: 'vnpay', ordered_at: '2026-06-06 19:10:00', note: 'Tư vấn giảm cân.' },
    { user_id: 5, plan_id: 7, trainer_id: 9, method: 'zalopay', ordered_at: '2026-06-08 12:05:00', note: 'Gói công ty.' },
    { user_id: 6, plan_id: 8, trainer_id: 10, method: 'cash', ordered_at: '2026-06-09 17:35:00', note: 'Thanh toán tại quầy.' },
    { user_id: 7, plan_id: 3, trainer_id: 11, method: 'momo', ordered_at: '2026-06-11 08:50:00', note: null },
    { user_id: 8, plan_id: 6, trainer_id: null, method: 'bank_transfer', ordered_at: '2026-06-12 16:25:00', note: 'Sinh viên năm nhất.' }
].forEach((orderSeed) => {
    const plan = planById.get(orderSeed.plan_id);
    const subtotal = Number(plan.price);
    const discount = orderSeed.plan_id === 6 ? Math.round(subtotal * 0.15) : 0;
    const total = subtotal - discount;
    const start = orderSeed.ordered_at.slice(0, 10);
    const membershipEnd = new Date(start);
    membershipEnd.setDate(membershipEnd.getDate() + plan.duration_days);
    const order = insertOrder.run(orderSeed.user_id, null, subtotal, discount, total, orderSeed.method, orderSeed.method === 'cash' ? 'pending' : 'paid', 'confirmed', orderSeed.note, orderSeed.ordered_at);
    insertOrderItem.run(order.lastInsertRowid, orderSeed.plan_id, 1, plan.price);
    insertMembership.run(orderSeed.user_id, orderSeed.plan_id, order.lastInsertRowid, orderSeed.trainer_id, start, membershipEnd.toISOString().slice(0, 10), 'active');
    insertNotification.run(orderSeed.user_id, 'Đăng ký thành công', `Gói ${plan.name} đã được kích hoạt.`, 'success');
});

console.log('Database seeded successfully.');
