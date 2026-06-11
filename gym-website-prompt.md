# 🏋️ Gym Website — Full Build Prompt

> Copy toàn bộ prompt bên dưới vào Claude, Cursor, Windsurf hoặc bất kỳ AI coding tool nào để sinh ra project hoàn chỉnh.

---

## PROMPT

```
Bạn là một senior full-stack developer. Hãy xây dựng một Gym Management Website hoàn chỉnh, production-ready với các yêu cầu chi tiết sau.
```

---

## 1. TECH STACK

### Frontend
| Công nghệ | Phiên bản | Mục đích |
|---|---|---|
| React | 18 | UI framework |
| Vite | 5 | Build tool |
| Tailwind CSS | 3 | Styling + dark mode |
| lucide-react | latest | Icon library |
| react-router-dom | v6 | Client-side routing |
| axios | latest | HTTP client |
| react-hot-toast | latest | Toast notifications |
| @headlessui/react | latest | Accessible UI primitives |

### Backend
| Công nghệ | Phiên bản | Mục đích |
|---|---|---|
| Node.js | 20+ | Runtime |
| Express | 4 | Web framework |
| better-sqlite3 | latest | SQLite (demo) |
| bcryptjs | latest | Password hashing |
| jsonwebtoken | latest | JWT authentication |
| cors | latest | Cross-origin requests |
| dotenv | latest | Environment variables |
| express-validator | latest | Input validation |

> **Upgrade path**: Khi cần production, thay `better-sqlite3` bằng `mysql2` hoặc `pg` (PostgreSQL). Schema SQL tương thích cả ba.

---

## 2. DATABASE SCHEMA (SQLite)

Tạo file `server/db/schema.sql`. Mỗi bảng có đầy đủ constraints và indexes.

```sql
-- 1. users
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  phone TEXT,
  dob DATE,
  gender TEXT CHECK(gender IN ('male','female','other')),
  avatar_url TEXT,
  status TEXT DEFAULT 'active' CHECK(status IN ('active','inactive','banned')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. admins
CREATE TABLE IF NOT EXISTS admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'admin' CHECK(role IN ('admin','super_admin')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. employees
CREATE TABLE IF NOT EXISTS employees (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  position TEXT NOT NULL,
  hire_date DATE,
  salary DECIMAL(12,2),
  status TEXT DEFAULT 'active' CHECK(status IN ('active','inactive'))
);

-- 4. trainers
CREATE TABLE IF NOT EXISTS trainers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  specialty TEXT,
  certifications TEXT,
  hourly_rate DECIMAL(10,2),
  bio TEXT,
  avatar_url TEXT,
  status TEXT DEFAULT 'active' CHECK(status IN ('active','inactive'))
);

-- 5. plans
CREATE TABLE IF NOT EXISTS plans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  duration_days INTEGER NOT NULL,
  price DECIMAL(12,2) NOT NULL,
  description TEXT,
  features TEXT,  -- JSON array string
  is_active INTEGER DEFAULT 1,
  is_featured INTEGER DEFAULT 0
);

-- 6. cart_items
CREATE TABLE IF NOT EXISTS cart_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_id INTEGER NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, plan_id)
);

-- 7. promotions
CREATE TABLE IF NOT EXISTS promotions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  discount_type TEXT CHECK(discount_type IN ('percent','fixed')),
  discount_value DECIMAL(10,2) NOT NULL,
  min_order_amount DECIMAL(12,2) DEFAULT 0,
  start_date DATE,
  end_date DATE,
  usage_limit INTEGER DEFAULT 100,
  used_count INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT 1
);

-- 8. orders
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id),
  promotion_id INTEGER REFERENCES promotions(id),
  subtotal DECIMAL(12,2) NOT NULL,
  discount_amount DECIMAL(12,2) DEFAULT 0,
  total_amount DECIMAL(12,2) NOT NULL,
  payment_method TEXT CHECK(payment_method IN ('cash','bank_transfer','momo','zalopay','vnpay')),
  payment_status TEXT DEFAULT 'pending' CHECK(payment_status IN ('pending','paid','failed','refunded')),
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending','confirmed','cancelled')),
  note TEXT,
  ordered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. memberships
CREATE TABLE IF NOT EXISTS memberships (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id),
  plan_id INTEGER NOT NULL REFERENCES plans(id),
  order_id INTEGER REFERENCES orders(id),
  trainer_id INTEGER REFERENCES trainers(id),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT DEFAULT 'active' CHECK(status IN ('active','expired','cancelled','pending'))
);

-- 10. equipment
CREATE TABLE IF NOT EXISTS equipment (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category TEXT,
  brand TEXT,
  serial_number TEXT UNIQUE,
  purchased_at DATE,
  purchase_price DECIMAL(12,2),
  condition TEXT DEFAULT 'good' CHECK(condition IN ('new','good','fair','poor','retired')),
  location TEXT,
  image_url TEXT
);

-- 11. maintenance_logs
CREATE TABLE IF NOT EXISTS maintenance_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  equipment_id INTEGER NOT NULL REFERENCES equipment(id),
  employee_id INTEGER REFERENCES employees(id),
  maintenance_date DATE NOT NULL,
  type TEXT CHECK(type IN ('routine','repair','replacement','inspection')),
  description TEXT,
  cost DECIMAL(10,2) DEFAULT 0,
  status TEXT DEFAULT 'completed' CHECK(status IN ('scheduled','in_progress','completed'))
);

-- 12. reviews
CREATE TABLE IF NOT EXISTS reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id),
  target_type TEXT CHECK(target_type IN ('trainer','plan','gym')),
  target_id INTEGER,
  rating INTEGER CHECK(rating BETWEEN 1 AND 5),
  comment TEXT,
  is_approved INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 13. notifications
CREATE TABLE IF NOT EXISTS notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT CHECK(type IN ('info','success','warning','promo')),
  is_read INTEGER DEFAULT 0,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_memberships_user ON memberships(user_id);
CREATE INDEX idx_memberships_status ON memberships(status);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read);
CREATE INDEX idx_reviews_target ON reviews(target_type, target_id);
```

---

## 3. DỮ LIỆU MẪU (Seed)

Tạo file `server/db/seed.sql` với dữ liệu mẫu thực tế:

```sql
-- Admins (password: admin123)
INSERT INTO admins (username, email, password_hash, role) VALUES
('superadmin', 'admin@ironzone.vn', '$2a$10$HASH_HERE', 'super_admin'),
('manager', 'manager@ironzone.vn', '$2a$10$HASH_HERE', 'admin');

-- Trainers (25 dòng với ảnh pravatar)
INSERT INTO trainers (full_name, email, phone, specialty, certifications, hourly_rate, bio, avatar_url) VALUES
('Nguyễn Minh Tuấn', 'tuan.pt@ironzone.vn', '0901234567', 'Strength & Conditioning', 'ACE-CPT, NSCA-CSCS', 350000, 'HLV 8 năm kinh nghiệm, chuyên phát triển sức mạnh và tăng cơ.', 'https://i.pravatar.cc/300?img=11'),
('Trần Thị Mai', 'mai.pt@ironzone.vn', '0912345678', 'Yoga & Pilates', 'RYT-200, STOTT Pilates', 300000, 'Chuyên gia yoga trị liệu và giảm stress, 6 năm kinh nghiệm.', 'https://i.pravatar.cc/300?img=47'),
('Lê Văn Hùng', 'hung.pt@ironzone.vn', '0923456789', 'Boxing & MMA', 'NASM-CPT, Boxing Coach Level 2', 400000, 'Võ sĩ boxing chuyên nghiệp, đào tạo tự vệ và thể lực.', 'https://i.pravatar.cc/300?img=12'),
('Phạm Thị Linh', 'linh.pt@ironzone.vn', '0934567890', 'Weight Loss & Cardio', 'ACE-CPT, Spinning Instructor', 280000, 'Chuyên giảm cân khoa học, 500+ học viên thành công.', 'https://i.pravatar.cc/300?img=48'),
('Võ Đức Thành', 'thanh.pt@ironzone.vn', '0945678901', 'Bodybuilding', 'ISSA-CPT, Sports Nutrition', 450000, 'Runner-up Mr. Vietnam 2022, chuyên tăng cơ giảm mỡ.', 'https://i.pravatar.cc/300?img=15');

-- Plans
INSERT INTO plans (name, duration_days, price, description, features, is_active, is_featured) VALUES
('Basic', 30, 299000, 'Gói cơ bản 1 tháng — lý tưởng để bắt đầu hành trình thể hình.', '["Truy cập phòng gym 6h-22h","Phòng thay đồ + tủ khóa","Hướng dẫn tập cơ bản","1 buổi tư vấn dinh dưỡng"]', 1, 0),
('Standard', 90, 799000, 'Gói 3 tháng tiết kiệm 11% — dành cho người tập đều đặn.', '["Tất cả quyền lợi Basic","Lớp học nhóm không giới hạn","Đánh giá thể lực hàng tháng","Ứng dụng theo dõi tiến độ"]', 1, 0),
('Premium', 180, 1490000, 'Gói 6 tháng tiết kiệm 17% — trải nghiệm đầy đủ nhất.', '["Tất cả quyền lợi Standard","2 buổi PT/tháng miễn phí","Phòng xông hơi + hồ bơi","Ưu tiên đặt lịch máy tập","Tư vấn dinh dưỡng không giới hạn"]', 1, 1),
('VIP Annual', 365, 2490000, 'Gói 1 năm VIP — tiết kiệm 30%, đẳng cấp tối thượng.', '["Tất cả quyền lợi Premium","4 buổi PT/tháng miễn phí","Phòng tập riêng theo yêu cầu","Towel service hàng ngày","Ưu tiên tất cả dịch vụ","Quà tặng thành viên VIP"]', 1, 1),
('PT Package', 30, 1990000, 'Gói tập cùng PT chuyên nghiệp — 12 buổi/tháng.', '["12 buổi tập 1-1 với PT","Lịch tập cá nhân hóa 100%","Kế hoạch dinh dưỡng riêng","Theo dõi body composition","Hỗ trợ qua Zalo 24/7"]', 1, 1);

-- Promotions
INSERT INTO promotions (code, description, discount_type, discount_value, min_order_amount, start_date, end_date, usage_limit, is_active) VALUES
('NEWBIE10', 'Giảm 10% cho hội viên mới đăng ký lần đầu', 'percent', 10, 0, '2025-01-01', '2025-12-31', 200, 1),
('SUMMER20', 'Khuyến mãi hè — giảm 20% tất cả gói tập', 'percent', 20, 500000, '2025-06-01', '2025-08-31', 100, 1),
('FLAT100K', 'Giảm thẳng 100.000đ cho đơn từ 500k', 'fixed', 100000, 500000, '2025-01-01', '2025-12-31', 500, 1),
('VIP30', 'Giảm 30% khi mua gói VIP Annual', 'percent', 30, 2000000, '2025-01-01', '2025-06-30', 50, 1),
('BIRTHDAY', 'Quà sinh nhật — giảm 15% bất kỳ gói nào', 'percent', 15, 0, '2025-01-01', '2025-12-31', 365, 1);

-- Equipment (10 dòng)
INSERT INTO equipment (name, category, brand, serial_number, purchased_at, purchase_price, condition, location) VALUES
('Máy chạy bộ TechnoGym', 'Cardio', 'TechnoGym', 'TG-TM-001', '2023-01-15', 45000000, 'good', 'Khu Cardio - Tầng 1'),
('Máy đạp xe Spin Bike', 'Cardio', 'Keiser', 'KS-SB-005', '2023-01-15', 22000000, 'good', 'Khu Cardio - Tầng 1'),
('Bộ tạ đòn Olympic 200kg', 'Free Weights', 'Eleiko', 'EL-BAR-010', '2022-06-01', 35000000, 'good', 'Khu Tạ Tự Do'),
('Máy ép ngực Cable', 'Machines', 'Life Fitness', 'LF-CB-003', '2023-03-20', 68000000, 'good', 'Khu Máy - Tầng 1'),
('Smith Machine', 'Machines', 'Hammer Strength', 'HS-SM-001', '2022-06-01', 55000000, 'fair', 'Khu Tạ Tự Do'),
('Squat Rack Power Cage', 'Free Weights', 'Rogue', 'RG-PC-002', '2022-06-01', 42000000, 'good', 'Khu Tạ Tự Do'),
('Rowing Machine', 'Cardio', 'Concept2', 'C2-RM-004', '2023-08-10', 28000000, 'new', 'Khu Cardio - Tầng 1'),
('Dumbbell Set 2-50kg', 'Free Weights', 'Urethane', 'UR-DB-SET1', '2022-06-01', 120000000, 'good', 'Khu Tạ Tự Do'),
('Leg Press Machine', 'Machines', 'Precor', 'PR-LP-002', '2023-03-20', 72000000, 'good', 'Khu Máy - Tầng 1'),
('Battle Rope 15m', 'Functional', 'Valor Fitness', 'VF-BR-001', '2024-01-05', 3500000, 'new', 'Khu Functional');

-- Users (20 dòng mẫu — password: password123)
-- Tự sinh hash trong seed script Node.js, không hardcode trong SQL

-- Reviews (15 dòng)
INSERT INTO reviews (user_id, target_type, target_id, rating, comment) VALUES
(1, 'trainer', 1, 5, 'Thầy Tuấn dạy rất tận tâm, sau 3 tháng mình tăng 4kg cơ!'),
(2, 'trainer', 2, 5, 'Chị Mai giải thích kỹ từng động tác yoga, rất phù hợp cho người mới.'),
(3, 'plan', 3, 5, 'Gói Premium xứng đáng từng đồng, phòng xông hơi tuyệt vời.'),
(4, 'trainer', 3, 4, 'Thầy Hùng dạy boxing rất đỉnh, chỉ cần thêm giờ cuối tuần là hoàn hảo.'),
(5, 'gym', 0, 5, 'Cơ sở vật chất xịn, nhân viên thân thiện, không khí tập cực tốt.'),
(6, 'plan', 4, 5, 'Gói VIP Annual tiết kiệm được khá nhiều so với mua từng tháng.'),
(7, 'trainer', 4, 5, 'Chị Linh giúp mình giảm 8kg trong 2 tháng, siêu hiệu quả!'),
(8, 'trainer', 5, 5, 'Anh Thành có kiến thức chuyên sâu về bodybuilding, rất chuyên nghiệp.'),
(9, 'plan', 2, 4, 'Gói Standard giá tốt, lớp học nhóm phong phú.'),
(10, 'gym', 0, 4, 'Máy móc hiện đại, sạch sẽ. Giờ cao điểm hơi đông nhưng vẫn ổn.'),
(11, 'trainer', 1, 5, 'Chương trình tập của thầy Tuấn rất khoa học, kết quả thấy rõ.'),
(12, 'plan', 5, 5, 'PT Package đáng tiền lắm, có lịch tập riêng rất tiện.'),
(13, 'trainer', 2, 4, 'Yoga với chị Mai giúp mình giảm stress đáng kể sau giờ làm.'),
(14, 'gym', 0, 5, 'Vị trí thuận tiện, parking rộng, hay ghé tập sáng sớm.'),
(15, 'plan', 1, 4, 'Gói Basic đủ dùng cho người mới bắt đầu tập gym.');
```

---

## 4. CẤU TRÚC THƯ MỤC

```
gym-app/
├── client/
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── package.json
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── Plans.jsx
│       │   ├── Trainers.jsx
│       │   ├── TrainerDetail.jsx
│       │   ├── Cart.jsx
│       │   ├── Checkout.jsx
│       │   ├── OrderSuccess.jsx
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── Dashboard.jsx
│       │   ├── NotFound.jsx
│       │   └── admin/
│       │       ├── AdminLayout.jsx
│       │       ├── AdminDashboard.jsx
│       │       ├── AdminMembers.jsx
│       │       ├── AdminTrainers.jsx
│       │       ├── AdminEquipment.jsx
│       │       ├── AdminMaintenance.jsx
│       │       └── AdminPromotions.jsx
│       ├── components/
│       │   ├── layout/
│       │   │   ├── Navbar.jsx
│       │   │   └── Footer.jsx
│       │   ├── ui/
│       │   │   ├── Button.jsx
│       │   │   ├── Badge.jsx
│       │   │   ├── Modal.jsx
│       │   │   ├── Spinner.jsx
│       │   │   └── EmptyState.jsx
│       │   ├── PlanCard.jsx
│       │   ├── TrainerCard.jsx
│       │   ├── ReviewCard.jsx
│       │   ├── CartItem.jsx
│       │   ├── MembershipCard.jsx
│       │   ├── StatCard.jsx
│       │   └── ProtectedRoute.jsx
│       ├── context/
│       │   ├── AuthContext.jsx
│       │   └── CartContext.jsx
│       ├── hooks/
│       │   ├── useAuth.js
│       │   └── useCart.js
│       └── api/
│           ├── axios.js
│           ├── auth.js
│           ├── plans.js
│           ├── trainers.js
│           ├── orders.js
│           ├── cart.js
│           ├── reviews.js
│           └── admin.js
├── server/
│   ├── package.json
│   ├── .env.example
│   ├── index.js
│   ├── db/
│   │   ├── schema.sql
│   │   ├── seed.js          ← Node script, dùng bcrypt hash
│   │   └── database.js      ← better-sqlite3 singleton
│   ├── routes/
│   │   ├── auth.js
│   │   ├── plans.js
│   │   ├── trainers.js
│   │   ├── cart.js
│   │   ├── orders.js
│   │   ├── memberships.js
│   │   ├── promotions.js
│   │   ├── reviews.js
│   │   ├── notifications.js
│   │   └── admin/
│   │       ├── index.js
│   │       ├── members.js
│   │       ├── equipment.js
│   │       ├── maintenance.js
│   │       └── promotions.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── adminOnly.js
│   │   └── validate.js
│   └── utils/
│       ├── response.js      ← helper format response
│       └── jwt.js
└── README.md
```

---

## 5. API ENDPOINTS

### Auth
```
POST   /api/auth/register          Đăng ký tài khoản mới
POST   /api/auth/login             Đăng nhập → trả JWT
GET    /api/auth/me                Lấy thông tin user hiện tại [auth]
PUT    /api/auth/profile           Cập nhật profile [auth]
PUT    /api/auth/change-password   Đổi mật khẩu [auth]
```

### Public
```
GET    /api/plans                  Danh sách gói tập (filter: is_active)
GET    /api/plans/:id              Chi tiết gói tập
GET    /api/trainers               Danh sách HLV (filter: specialty, status)
GET    /api/trainers/:id           Chi tiết HLV + reviews
GET    /api/reviews?target_type=&target_id=   Lấy reviews theo target
```

### User (JWT required)
```
GET    /api/cart                   Xem giỏ hàng
POST   /api/cart                   Thêm vào giỏ { plan_id, quantity }
PUT    /api/cart/:id               Cập nhật số lượng
DELETE /api/cart/:id               Xóa item
DELETE /api/cart                   Xóa toàn bộ giỏ

POST   /api/promotions/validate    Kiểm tra mã { code, order_amount }

POST   /api/orders                 Tạo đơn hàng + tự động tạo membership
GET    /api/orders/my              Lịch sử đơn hàng của user
GET    /api/orders/:id             Chi tiết đơn hàng

GET    /api/memberships/my         Membership đang active của user

POST   /api/reviews                Viết review { target_type, target_id, rating, comment }

GET    /api/notifications/my       Thông báo của user (unread first)
PATCH  /api/notifications/:id/read Đánh dấu đã đọc
PATCH  /api/notifications/read-all Đánh dấu tất cả đã đọc
```

### Admin (JWT + role=admin required)
```
GET    /api/admin/stats            Dashboard: tổng hội viên, doanh thu, gói bán chạy

GET    /api/admin/members          Danh sách users (search, filter, paginate)
GET    /api/admin/members/:id      Chi tiết user + memberships
PUT    /api/admin/members/:id      Cập nhật thông tin + status
DELETE /api/admin/members/:id      Soft delete (set status=banned)

GET    /api/admin/trainers         Danh sách HLV
POST   /api/admin/trainers         Tạo HLV mới
PUT    /api/admin/trainers/:id     Cập nhật HLV
DELETE /api/admin/trainers/:id     Xóa HLV

GET    /api/admin/equipment        Danh sách thiết bị
POST   /api/admin/equipment        Thêm thiết bị mới
PUT    /api/admin/equipment/:id    Cập nhật thiết bị
GET    /api/admin/maintenance      Lịch sử bảo trì (filter: equipment_id)
POST   /api/admin/maintenance      Ghi log bảo trì mới

GET    /api/admin/promotions       Danh sách mã giảm giá
POST   /api/admin/promotions       Tạo mã mới
PUT    /api/admin/promotions/:id   Cập nhật / tắt mã
DELETE /api/admin/promotions/:id   Xóa mã

GET    /api/admin/orders           Tất cả đơn hàng (filter: status, date range)
PUT    /api/admin/orders/:id       Cập nhật trạng thái đơn
```

---

## 6. TÍNH NĂNG CHI TIẾT

### Trang Landing (Home.jsx)
- **Hero section**: background tối (dark overlay trên ảnh gym), headline lớn "FORGE YOUR BEST SELF", subheadline, 2 CTA buttons (Xem gói tập / Đăng ký miễn phí)
- **Stats bar**: 4 con số animate khi scroll vào (2000+ hội viên, 15 HLV, 50+ lớp/tuần, 5 năm kinh nghiệm)
- **Why us section**: 6 card lợi ích với icon lucide-react (Dumbbell, Shield, Clock, Award, Users, Zap)
- **Featured plans**: hiển thị 3 gói nổi bật, badge "Phổ biến nhất" cho gói is_featured
- **Trainer highlights**: grid 3 HLV, ảnh tròn, tên + specialty + rating
- **Testimonials**: 3 review nổi bật, avatar + tên + rating stars + comment
- **Promo banner**: "Nhập NEWBIE10 giảm 10% đơn đầu tiên"
- **CTA section**: nền tối, text kêu gọi + nút đăng ký

### Trang Plans (Plans.jsx)
- Filter bar: Tất cả / 1 tháng / 3 tháng / 6+ tháng
- Sort: Giá tăng dần / giảm dần
- Plan cards: tên, giá, duration, danh sách features, nút "Thêm vào giỏ"
- Comparison table ở dưới (optional)

### Trang Trainers (Trainers.jsx)
- Filter theo specialty
- Trainer card: ảnh, tên, specialty, rating trung bình, hourly_rate, nút "Xem chi tiết"
- TrainerDetail page: bio đầy đủ, certifications, lịch làm việc placeholder, reviews của trainer đó

### Giỏ hàng & Checkout
- Cart: list items, subtotal
- Checkout form: chọn payment method, ô nhập mã giảm giá (gọi API validate real-time)
- Hiển thị: subtotal, discount, total
- Submit → tạo order → redirect OrderSuccess

### Dashboard (user)
- Tab: Tổng quan / Membership / Đơn hàng / Thông báo
- Tổng quan: membership còn bao nhiêu ngày (progress bar), thông báo mới
- Membership: thẻ membership active, ngày hết hạn, PT được assign (nếu có)
- Đơn hàng: bảng lịch sử, status badge màu sắc
- Thông báo: list + nút mark as read

### Admin Dashboard
- Stat cards: Tổng hội viên, Doanh thu tháng này, Membership active, Thiết bị cần bảo trì
- Biểu đồ doanh thu 6 tháng (dùng dữ liệu tĩnh hoặc recharts nếu muốn)
- Bảng đơn hàng mới nhất
- Bảng hội viên mới đăng ký

---

## 7. UI/UX SPECIFICATIONS

### Color Palette
```js
// tailwind.config.js — extend colors
colors: {
  primary: {
    DEFAULT: '#F59E0B', // amber-500 — màu vàng gym
    dark: '#D97706',    // amber-600
    light: '#FCD34D',   // amber-300
  },
  dark: {
    DEFAULT: '#0A0A0A',
    card: '#111111',
    border: '#1F1F1F',
    muted: '#2A2A2A',
  }
}
```

### Dark Mode
- Sử dụng `class` strategy: `darkMode: 'class'` trong tailwind.config.js
- Toggle button trên Navbar, lưu preference vào localStorage
- Toàn bộ components phải có `dark:` variants

### Typography
```css
/* index.css */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');
body { font-family: 'Inter', sans-serif; }
```

### Component Patterns
- Buttons: `bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg`
- Cards: `bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl`
- Inputs: `bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg`
- Badges: màu theo status (active=green, expired=red, pending=yellow)
- Loading: Spinner component từ lucide `Loader2` với `animate-spin`

---

## 8. LOGIC NGHIỆP VỤ QUAN TRỌNG

### Tạo Order (POST /api/orders)
```
1. Lấy cart_items của user
2. Tính subtotal
3. Nếu có promotion_id → validate mã (active, chưa hết hạn, chưa vượt limit)
4. Tính discount_amount, total_amount
5. INSERT vào orders
6. Với mỗi cart_item: INSERT vào memberships
   - start_date = TODAY
   - end_date = TODAY + plan.duration_days
   - order_id = order vừa tạo
7. Tăng promotions.used_count nếu có dùng mã
8. Xóa toàn bộ cart_items của user
9. INSERT notification cho user: "Đăng ký thành công gói [plan_name]"
10. Trả về order + memberships
```

### Validate Promotion (POST /api/promotions/validate)
```
1. Tìm promotion theo code
2. Check: is_active = 1
3. Check: start_date <= TODAY <= end_date
4. Check: used_count < usage_limit
5. Check: order_amount >= min_order_amount
6. Tính discount:
   - type='percent' → discount = amount * value/100
   - type='fixed'   → discount = min(value, amount)
7. Trả về { valid: true, discount_amount, final_amount }
```

### Response Format chuẩn
```js
// utils/response.js
const success = (res, data, message = 'Success', statusCode = 200) =>
  res.status(statusCode).json({ success: true, message, data });

const error = (res, message = 'Error', statusCode = 400) =>
  res.status(statusCode).json({ success: false, message, data: null });
```

---

## 9. ENVIRONMENT & SETUP

### server/.env.example
```
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_here_min_32_chars
JWT_EXPIRES_IN=7d
DB_PATH=./db/gym.db
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### client/.env.example
```
VITE_API_URL=http://localhost:5000/api
```

---

## 10. README.md

Viết README đầy đủ với:

```markdown
# 🏋️ IronZone Gym Management System

## Tech Stack
[list tech stack]

## Cài đặt và chạy

### Yêu cầu
- Node.js >= 20
- npm >= 9

### 1. Clone & install
git clone ...
cd gym-app

# Backend
cd server && npm install

# Frontend  
cd ../client && npm install

### 2. Cấu hình môi trường
cp server/.env.example server/.env
# Chỉnh sửa JWT_SECRET trong server/.env

### 3. Khởi tạo database
cd server
node db/seed.js

### 4. Chạy development
# Terminal 1 — Backend
cd server && npm run dev   # port 5000

# Terminal 2 — Frontend
cd client && npm run dev   # port 5173

### Tài khoản demo
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@ironzone.vn | admin123 |
| User | user1@example.com | password123 |

## API Documentation
[link hoặc mô tả ngắn]
```

---

## 11. LƯU Ý TRIỂN KHAI

| Hạng mục | Yêu cầu |
|---|---|
| Code style | Không dùng `var`, dùng `const`/`let`. Arrow functions. Async/await thay callbacks |
| Error handling | Try/catch mọi async route. Frontend hiện toast error từ `error.response.data.message` |
| Validation | Dùng `express-validator` phía server. Client validate cơ bản trước khi gửi |
| Security | Không log password. Rate limit auth routes. Sanitize inputs |
| Placeholder images | Trainer avatars: `https://i.pravatar.cc/300?img={1-70}`. Gym images: `https://images.unsplash.com/...` (free) |
| Pagination | Các list API admin hỗ trợ `?page=1&limit=20` |
| Timestamps | Luôn dùng `CURRENT_TIMESTAMP` của SQLite, format ISO 8601 |

---

## 12. THỨ TỰ BUILD

Thực hiện theo thứ tự sau để tránh dependency errors:

```
Bước 1: server/db/schema.sql + database.js
Bước 2: server/db/seed.js (chạy được ngay)
Bước 3: server/utils/ + server/middleware/
Bước 4: server/routes/ (auth trước, sau đó các route khác)
Bước 5: server/index.js
Bước 6: client — cấu hình Vite + Tailwind + Router
Bước 7: client/context/ (AuthContext + CartContext)
Bước 8: client/components/layout/ (Navbar + Footer)
Bước 9: client/pages/ (Home → Plans → Trainers → Cart → Checkout → Dashboard)
Bước 10: client/pages/admin/
Bước 11: README.md
```

**Viết code hoàn chỉnh, không dùng placeholder hay comment TODO. Mỗi file phải chạy được ngay sau khi copy.**

---

*Generated for IronZone Gym Management System — Full Stack Build Prompt v1.0*
