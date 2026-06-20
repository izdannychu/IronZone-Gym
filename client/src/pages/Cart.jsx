import { Link } from "react-router-dom";
import { CartItem } from "../components/CartItem";
import { formatMoney } from "../components/PlanCard";
import { EmptyState } from "../components/ui/EmptyState";
import { Button } from "../components/ui/Button";
import { useCart } from "../hooks/useCart";

export default function Cart() {
  const { cart } = useCart();
  return (
    <main className="container-page page-shell pb-10 pt-32">
      <h1 className="text-4xl font-black">Giỏ hàng</h1>
      {!cart.items.length ? (
        <div className="mt-8">
          <EmptyState
            title="Giỏ hàng trống"
            subtitle="Chọn một gói tập để bắt đầu."
          />
        </div>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            {cart.items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>
          <aside className="card h-fit p-5">
            <h2 className="text-xl font-black">Tổng đơn</h2>
            <div className="mt-4 flex justify-between text-sm">
              <span>Tạm tính</span>
              <strong>{formatMoney(cart.subtotal)}</strong>
            </div>
            <Button as={Link} to="/checkout" className="mt-6 w-full">
              Thanh toán
            </Button>
          </aside>
        </div>
      )}
    </main>
  );
}
