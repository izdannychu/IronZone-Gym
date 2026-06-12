import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, MotionConfig } from 'framer-motion';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';
import Home from './pages/Home';
import Plans from './pages/Plans';
import Trainers from './pages/Trainers';
import TrainerDetail from './pages/TrainerDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMembers from './pages/admin/AdminMembers';
import AdminTrainers from './pages/admin/AdminTrainers';
import AdminEquipment from './pages/admin/AdminEquipment';
import AdminMaintenance from './pages/admin/AdminMaintenance';
import AdminPromotions from './pages/admin/AdminPromotions';
import AdminPlans from './pages/admin/AdminPlans';
import AdminOrders from './pages/admin/AdminOrders';
import { pageTransition } from './components/motion/Motion';

const PublicShell = ({ children, location }) => (
  <div className="flex min-h-screen flex-col">
    <Navbar />
    <AnimatePresence mode="wait" initial={false}>
      <motion.div key={location.pathname} className="flex-1" {...pageTransition}>
        {children}
      </motion.div>
    </AnimatePresence>
    <Footer />
  </div>
);

const App = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  const routes = (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<Home />} />
      <Route path="/plans" element={<Plans />} />
      <Route path="/trainers" element={<Trainers />} />
      <Route path="/trainers/:id" element={<TrainerDetail />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
      <Route element={<ProtectedRoute admin />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="plans" element={<AdminPlans />} />
          <Route path="members" element={<AdminMembers />} />
          <Route path="trainers" element={<AdminTrainers />} />
          <Route path="equipment" element={<AdminEquipment />} />
          <Route path="maintenance" element={<AdminMaintenance />} />
          <Route path="promotions" element={<AdminPromotions />} />
          <Route path="orders" element={<AdminOrders />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );

  return (
    <MotionConfig reducedMotion="user">
      {isAdminRoute ? routes : <PublicShell location={location}>{routes}</PublicShell>}
    </MotionConfig>
  );
};

export default App;
