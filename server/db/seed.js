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
Array.from({ length: 20 }).forEach((_, index) => {
  const i = index + 1;
  insertUser.run(`Hoi vien ${i}`, `user${i}@example.com`, userHash, `09876543${String(i).padStart(2, '0')}`, `199${index % 10}-0${(index % 9) + 1}-15`, index % 2 ? 'female' : 'male', `https://i.pravatar.cc/300?img=${20 + i}`);
});

const trainers = [
  ['Nguyen Minh Tuan', 'tuan.pt@ironzone.vn', '0901234567', 'Strength & Conditioning', 'ACE-CPT, NSCA-CSCS', 350000, 'HLV 8 nam kinh nghiem, chuyen phat trien suc manh va tang co.', 'https://i.pravatar.cc/300?img=11'],
  ['Tran Thi Mai', 'mai.pt@ironzone.vn', '0912345678', 'Yoga & Pilates', 'RYT-200, STOTT Pilates', 300000, 'Chuyen gia yoga tri lieu va giam stress, 6 nam kinh nghiem.', 'https://i.pravatar.cc/300?img=47'],
  ['Le Van Hung', 'hung.pt@ironzone.vn', '0923456789', 'Boxing & MMA', 'NASM-CPT, Boxing Coach Level 2', 400000, 'Vo si boxing chuyen nghiep, dao tao tu ve va the luc.', 'https://i.pravatar.cc/300?img=12'],
  ['Pham Thi Linh', 'linh.pt@ironzone.vn', '0934567890', 'Weight Loss & Cardio', 'ACE-CPT, Spinning Instructor', 280000, 'Chuyen giam can khoa hoc, 500+ hoc vien thanh cong.', 'https://i.pravatar.cc/300?img=48'],
  ['Vo Duc Thanh', 'thanh.pt@ironzone.vn', '0945678901', 'Bodybuilding', 'ISSA-CPT, Sports Nutrition', 450000, 'Runner-up Mr. Vietnam 2022, chuyen tang co giam mo.', 'https://i.pravatar.cc/300?img=15'],
  ['Do Bao Anh', 'baoanh.pt@ironzone.vn', '0951112233', 'Functional Training', 'TRX, NASM-CES', 330000, 'Thiet ke chuong trinh functional cho dan van phong.', 'https://i.pravatar.cc/300?img=50'],
  ['Hoang Nam', 'nam.pt@ironzone.vn', '0961112233', 'Calisthenics', 'Street Workout Coach', 320000, 'Tap trung kiem soat co the, pull-up, handstand va core.', 'https://i.pravatar.cc/300?img=16'],
  ['Bui Khanh Vy', 'vy.pt@ironzone.vn', '0971112233', 'Dance Fitness', 'Zumba, Les Mills', 270000, 'Lop nhom nang luong cao, than thien voi nguoi moi.', 'https://i.pravatar.cc/300?img=49']
];
const insertTrainer = db.prepare('INSERT INTO trainers (full_name,email,phone,specialty,certifications,hourly_rate,bio,avatar_url) VALUES (?,?,?,?,?,?,?,?)');
trainers.forEach((row) => insertTrainer.run(...row));

const insertPlan = db.prepare('INSERT INTO plans (name,duration_days,price,description,features,is_active,is_featured) VALUES (?,?,?,?,?,?,?)');
[
  ['Basic', 30, 299000, 'Goi co ban 1 thang, ly tuong de bat dau hanh trinh the hinh.', ['Truy cap phong gym 6h-22h', 'Phong thay do va tu khoa', 'Huong dan tap co ban', '1 buoi tu van dinh duong'], 1, 0],
  ['Standard', 90, 799000, 'Goi 3 thang tiet kiem cho nguoi tap deu dan.', ['Tat ca quyen loi Basic', 'Lop hoc nhom khong gioi han', 'Danh gia the luc hang thang', 'Ung dung theo doi tien do'], 1, 0],
  ['Premium', 180, 1490000, 'Goi 6 thang voi trai nghiem day du nhat.', ['Tat ca quyen loi Standard', '2 buoi PT/thang mien phi', 'Phong xong hoi va ho boi', 'Uu tien dat lich may tap', 'Tu van dinh duong khong gioi han'], 1, 1],
  ['VIP Annual', 365, 2490000, 'Goi 1 nam VIP, tiet kiem va day du dac quyen.', ['Tat ca quyen loi Premium', '4 buoi PT/thang mien phi', 'Phong tap rieng theo yeu cau', 'Towel service hang ngay', 'Qua tang thanh vien VIP'], 1, 1],
  ['PT Package', 30, 1990000, 'Goi tap 1-1 cung PT chuyen nghiep trong 12 buoi/thang.', ['12 buoi tap 1-1 voi PT', 'Lich tap ca nhan hoa', 'Ke hoach dinh duong rieng', 'Theo doi body composition', 'Ho tro qua Zalo 24/7'], 1, 1]
].forEach((p) => insertPlan.run(p[0], p[1], p[2], p[3], JSON.stringify(p[4]), p[5], p[6]));

const insertPromo = db.prepare('INSERT INTO promotions (code,description,discount_type,discount_value,min_order_amount,start_date,end_date,usage_limit,is_active) VALUES (?,?,?,?,?,?,?,?,?)');
[
  ['NEWBIE10', 'Giam 10% cho hoi vien moi dang ky lan dau', 'percent', 10, 0, '2025-01-01', '2027-12-31', 200, 1],
  ['SUMMER20', 'Khuyen mai he, giam 20% tat ca goi tap', 'percent', 20, 500000, '2025-06-01', '2027-08-31', 100, 1],
  ['FLAT100K', 'Giam thang 100.000d cho don tu 500k', 'fixed', 100000, 500000, '2025-01-01', '2027-12-31', 500, 1],
  ['VIP30', 'Giam 30% khi mua goi VIP Annual', 'percent', 30, 2000000, '2025-01-01', '2027-06-30', 50, 1],
  ['BIRTHDAY', 'Qua sinh nhat, giam 15% bat ky goi nao', 'percent', 15, 0, '2025-01-01', '2027-12-31', 365, 1]
].forEach((row) => insertPromo.run(...row));

const insertEquipment = db.prepare('INSERT INTO equipment (name,category,brand,serial_number,purchased_at,purchase_price,condition,location) VALUES (?,?,?,?,?,?,?,?)');
[
  ['May chay bo TechnoGym', 'Cardio', 'TechnoGym', 'TG-TM-001', '2023-01-15', 45000000, 'good', 'Khu Cardio - Tang 1'],
  ['May dap xe Spin Bike', 'Cardio', 'Keiser', 'KS-SB-005', '2023-01-15', 22000000, 'good', 'Khu Cardio - Tang 1'],
  ['Bo ta don Olympic 200kg', 'Free Weights', 'Eleiko', 'EL-BAR-010', '2022-06-01', 35000000, 'good', 'Khu Ta Tu Do'],
  ['May ep nguc Cable', 'Machines', 'Life Fitness', 'LF-CB-003', '2023-03-20', 68000000, 'good', 'Khu May - Tang 1'],
  ['Smith Machine', 'Machines', 'Hammer Strength', 'HS-SM-001', '2022-06-01', 55000000, 'fair', 'Khu Ta Tu Do'],
  ['Squat Rack Power Cage', 'Free Weights', 'Rogue', 'RG-PC-002', '2022-06-01', 42000000, 'good', 'Khu Ta Tu Do'],
  ['Rowing Machine', 'Cardio', 'Concept2', 'C2-RM-004', '2023-08-10', 28000000, 'new', 'Khu Cardio - Tang 1'],
  ['Dumbbell Set 2-50kg', 'Free Weights', 'Urethane', 'UR-DB-SET1', '2022-06-01', 120000000, 'good', 'Khu Ta Tu Do'],
  ['Leg Press Machine', 'Machines', 'Precor', 'PR-LP-002', '2023-03-20', 72000000, 'good', 'Khu May - Tang 1'],
  ['Battle Rope 15m', 'Functional', 'Valor Fitness', 'VF-BR-001', '2024-01-05', 3500000, 'new', 'Khu Functional']
].forEach((row) => insertEquipment.run(...row));

const insertEmployee = db.prepare('INSERT INTO employees (full_name,email,phone,position,hire_date,salary) VALUES (?,?,?,?,?,?)');
insertEmployee.run('Tran Quan', 'quan.ops@ironzone.vn', '0909000001', 'Maintenance Lead', '2022-04-01', 14000000);
insertEmployee.run('Le Hanh', 'hanh.cs@ironzone.vn', '0909000002', 'Customer Success', '2023-02-10', 11000000);

const insertMaintenance = db.prepare('INSERT INTO maintenance_logs (equipment_id,employee_id,maintenance_date,type,description,cost,status) VALUES (?,?,?,?,?,?,?)');
insertMaintenance.run(5, 1, '2026-06-01', 'inspection', 'Kiem tra ray truot va boi tron cap', 450000, 'completed');
insertMaintenance.run(1, 1, '2026-06-18', 'routine', 'Bao tri dinh ky bang chay', 800000, 'scheduled');

const insertReview = db.prepare('INSERT INTO reviews (user_id,target_type,target_id,rating,comment) VALUES (?,?,?,?,?)');
[
  [1, 'trainer', 1, 5, 'Thay Tuan day rat tan tam, sau 3 thang minh tang 4kg co!'],
  [2, 'trainer', 2, 5, 'Chi Mai giai thich ky tung dong tac yoga, rat phu hop cho nguoi moi.'],
  [3, 'plan', 3, 5, 'Goi Premium xung dang tung dong, phong xong hoi tuyet voi.'],
  [4, 'trainer', 3, 4, 'Thay Hung day boxing rat dinh, chi can them gio cuoi tuan la hoan hao.'],
  [5, 'gym', 0, 5, 'Co so vat chat xin, nhan vien than thien, khong khi tap cuc tot.'],
  [6, 'plan', 4, 5, 'Goi VIP Annual tiet kiem duoc kha nhieu so voi mua tung thang.'],
  [7, 'trainer', 4, 5, 'Chi Linh giup minh giam 8kg trong 2 thang, sieu hieu qua!'],
  [8, 'trainer', 5, 5, 'Anh Thanh co kien thuc chuyen sau ve bodybuilding, rat chuyen nghiep.'],
  [9, 'plan', 2, 4, 'Goi Standard gia tot, lop hoc nhom phong phu.'],
  [10, 'gym', 0, 4, 'May moc hien dai, sach se. Gio cao diem hoi dong nhung van on.'],
  [11, 'trainer', 1, 5, 'Chuong trinh tap cua thay Tuan rat khoa hoc, ket qua thay ro.'],
  [12, 'plan', 5, 5, 'PT Package dang tien lam, co lich tap rieng rat tien.'],
  [13, 'trainer', 2, 4, 'Yoga voi chi Mai giup minh giam stress dang ke sau gio lam.'],
  [14, 'gym', 0, 5, 'Vi tri thuan tien, parking rong, hay ghe tap sang som.'],
  [15, 'plan', 1, 4, 'Goi Basic du dung cho nguoi moi bat dau tap gym.']
].forEach((row) => insertReview.run(...row));

const today = new Date();
const end = new Date(today);
end.setDate(today.getDate() + 180);
db.prepare('INSERT INTO memberships (user_id,plan_id,order_id,trainer_id,start_date,end_date,status) VALUES (?,?,?,?,?,?,?)')
  .run(1, 3, null, 1, today.toISOString().slice(0, 10), end.toISOString().slice(0, 10), 'active');
db.prepare('INSERT INTO notifications (user_id,title,message,type) VALUES (?,?,?,?)')
  .run(1, 'Chao mung den IronZone', 'Goi Premium cua ban dang hoat dong. Hay dat lich tap dau tien ngay hom nay.', 'success');

console.log('Database seeded successfully.');
