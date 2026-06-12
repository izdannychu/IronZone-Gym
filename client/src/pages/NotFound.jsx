import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export default function NotFound() {
  return (
    <main className="container-page page-shell grid min-h-screen place-items-center py-28 text-center">
      <div>
        <h1 className="text-6xl font-black text-primary">404</h1>
        <p className="mt-3 text-xl font-bold">Không tìm thấy trang</p>
        <Button as={Link} to="/" className="mt-6">Về trang chủ</Button>
      </div>
    </main>
  );
}
