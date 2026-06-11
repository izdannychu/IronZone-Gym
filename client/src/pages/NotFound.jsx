import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export default function NotFound() {
  return (
    <main className="container-page grid min-h-[60vh] place-items-center py-10 text-center">
      <div>
        <h1 className="text-6xl font-black text-primary">404</h1>
        <p className="mt-3 text-xl font-bold">Khong tim thay trang</p>
        <Button as={Link} to="/" className="mt-6">Ve trang chu</Button>
      </div>
    </main>
  );
}
