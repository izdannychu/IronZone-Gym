import { Route, Routes } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';
import Home from './pages/Home';
import Plans from './pages/Plans';
import Trainers from './pages/Trainers';
import TrainerDetail from './pages/TrainerDetail';
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

const App = () => (
  <div className="min-h-screen">
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/plans" element={<Plans />} />
      <Route path="/trainers" element={<Trainers />} />
      <Route path="/trainers/:id" element={<TrainerDetail />} />
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
          <Route path="members" element={<AdminMembers />} />
          <Route path="trainers" element={<AdminTrainers />} />
          <Route path="equipment" element={<AdminEquipment />} />
          <Route path="maintenance" element={<AdminMaintenance />} />
          <Route path="promotions" element={<AdminPromotions />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
    <Footer />
  </div>
);

export default App;
