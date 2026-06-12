import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { migrate } from './db/database.js';
import authRoutes from './routes/auth.js';
import planRoutes from './routes/plans.js';
import trainerRoutes from './routes/trainers.js';
import cartRoutes from './routes/cart.js';
import orderRoutes from './routes/orders.js';
import membershipRoutes from './routes/memberships.js';
import promotionRoutes from './routes/promotions.js';
import reviewRoutes from './routes/reviews.js';
import notificationRoutes from './routes/notifications.js';
import adminRoutes from './routes/admin/index.js';
import { error } from './utils/response.js';

dotenv.config();
migrate();

const app = express();
const port = process.env.PORT || 5000;
const allowedOrigin = process.env.CLIENT_URL || /^http:\/\/(localhost|127\.0\.0\.1):\d+$/;

app.use(cors({ origin: allowedOrigin, credentials: true }));
app.use(express.json({ limit: '1mb' }));

app.get('/', (req, res) => res.json({
  success: true,
  message: 'IronZone API đang chạy',
  docs: {
    health: '/api/health',
    plans: '/api/plans',
    trainers: '/api/trainers',
    auth: '/api/auth/login'
  }
}));
app.get('/api/health', (req, res) => res.json({ success: true, message: 'IronZone API is running' }));
app.use('/api/auth', authRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/trainers', trainerRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/memberships', membershipRoutes);
app.use('/api/promotions', promotionRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

app.use((req, res) => error(res, 'Endpoint không tồn tại', 404));
app.use((err, req, res, next) => {
  console.error(err);
  error(res, 'Loi server', 500);
});

app.listen(port, () => {
  console.log(`IronZone API listening on http://localhost:${port}`);
});
