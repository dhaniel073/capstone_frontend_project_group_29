import React from "react";
import { Link, useNavigate } from "react-router-dom";

function readUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}") || {};
  } catch {
    return {};
  }
}

function readCart() {
  try {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    return Array.isArray(cart) ? cart : [];
  } catch {
    return [];
  }
}

export default function Profile() {
  const navigate = useNavigate();
  const user = readUser();
  const cart = readCart();
  const cartCount = cart.reduce(
    (count, item) => count + (Number(item.quantity) || 0),
    0,
  );
  const cartSubtotal = cart.reduce(
    (subtotal, item) =>
      subtotal + (Number(item.price) || 0) * (Number(item.quantity) || 0),
    0,
  );
  const name = user.name || user.email || "My Account";
  const email = user.email || "";
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 font-['Trebuchet_MS','Segoe_UI',sans-serif] text-[#202633]">
      <header className="border-b border-[#e8eaed] bg-white">
        <div className="mx-auto flex min-h-[76px] w-[calc(100%_-_64px)] max-w-[1180px] items-center gap-[34px] max-[900px]:gap-[18px] max-[900px]:w-[min(calc(100%_-_40px),720px)] max-[680px]:min-h-16 max-[680px]:w-[calc(100%_-_36px)] max-[680px]:flex-wrap max-[680px]:justify-between max-[680px]:gap-x-3">
          <Link
            className="inline-flex shrink-0 items-center gap-2.5 whitespace-nowrap text-[17px] font-bold uppercase text-[#252d3a] no-underline max-[680px]:text-sm"
            to="/home"
            aria-label="Supermarket home"
          >
            <span
              className="grid size-[30px] place-items-center rounded-[9px_9px_9px_2px] bg-emerald-600 text-[17px] text-white max-[680px]:size-[27px]"
              aria-hidden="true"
            >
              S
            </span>
            <span>Supermarket</span>
          </Link>
          <nav
            className="ml-auto flex items-center gap-[26px] max-[900px]:gap-[15px] max-[680px]:hidden"
            aria-label="Main navigation"
          >
            <Link
              className="text-[13px] text-emerald-700 no-underline transition-colors duration-150 hover:text-emerald-800"
              to="/home"
            >
              Home
            </Link>
          </nav>
          <Link
            className="inline-flex shrink-0 items-center gap-[7px] border-0 bg-transparent text-xs text-[#374052] no-underline max-[680px]:hidden"
            to="/cart"
            aria-label={`Open cart, ${cartCount} items`}
          >
            Cart ({cartCount})
          </Link>
          <button
            className="inline-flex min-h-[38px] shrink-0 items-center gap-2 rounded-md border border-[#e9ebef] bg-transparent py-1 px-2.5 text-xs text-[#374052] max-[680px]:min-h-[34px] max-[680px]:text-[11px]"
            type="button"
            onClick={handleLogout}
          >
            <span className="grid size-[27px] place-items-center rounded-full bg-emerald-50 text-[10px] font-bold text-emerald-700">
              {initials}
            </span>
            <span>Log out</span>
          </button>
        </div>
      </header>

      <main className="mx-auto w-[calc(100%_-_64px)] max-w-[1100px] py-[42px] pb-16 max-[900px]:w-[min(calc(100%_-_40px),720px)] max-[680px]:w-[calc(100%_-_32px)] max-[680px]:py-[29px] max-[680px]:pb-10">
        <div className="mb-[26px] flex items-end justify-between max-[680px]:mb-[19px]">
          <div>
            <p className="mb-2 text-[10px] font-bold tracking-[1.4px] text-[#8b92a0]">
              Your account
            </p>
            <h1 className="m-0 text-[25px] font-semibold text-[#202633] max-[680px]:text-[22px]">
              My Profile
            </h1>
          </div>
          <p className="m-0 mb-[3px] text-xs text-[#8b92a0] max-[680px]:hidden">
            Home <span className="px-2 text-[#c4c8ce]">/</span> My Profile
          </p>
        </div>

        <div className="grid grid-cols-[minmax(270px,0.72fr)_minmax(0,1.55fr)] items-start gap-[22px] max-[900px]:grid-cols-[minmax(230px,0.8fr)_minmax(0,1.3fr)] max-[900px]:gap-[15px] max-[680px]:grid-cols-1 max-[680px]:gap-[14px]">
          <aside
            className="rounded-[9px] border border-[#e5e8ec] bg-white p-[22px] max-[900px]:p-[18px] max-[680px]:px-[18px] max-[680px]:pt-[19px] max-[680px]:pb-[17px]"
            aria-label="Profile information"
          >
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold tracking-[1.1px] text-[#8b92a0]">
                ACCOUNT
              </span>
            </div>
            <div className="mx-auto mt-[30px] mb-[13px] grid size-[86px] place-items-center rounded-full border-2 border-emerald-600 bg-emerald-50 text-[27px] font-medium text-emerald-700 max-[680px]:mt-5 max-[680px]:size-[78px]">
              {initials || "U"}
            </div>
            <h2 className="m-0 text-center text-[19px] font-semibold">
              {name}
            </h2>
            {email && (
              <p className="my-[7px] mb-[11px] wrap-anywhere text-center text-xs text-[#7b8391]">
                {email}
              </p>
            )}
            <span className="mx-auto block w-fit rounded bg-emerald-50 px-4 py-[7px] text-[9px] font-bold tracking-[0.7px] text-emerald-700 uppercase">
              {user.role || "Account"}
            </span>

            <button
              className="mt-5 flex min-h-[43px] w-full items-center justify-center gap-[9px] rounded-md border border-[#f6e1e1] bg-[#fff7f6] text-xs text-[#d84b4b] transition-colors duration-150 hover:bg-[#fff0ef] max-[680px]:mt-[14px]"
              type="button"
              onClick={handleLogout}
            >
              <span className="text-base" aria-hidden="true">
                ↪
              </span>{" "}
              Log Out
            </button>
          </aside>

          <section
            className="min-h-[440px] rounded-[9px] border border-[#e5e8ec] bg-white px-[30px] pt-[27px] max-[900px]:px-[22px] max-[680px]:min-h-0 max-[680px]:px-[18px] max-[680px]:pt-[21px]"
            aria-label="Shopping actions"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-2 text-[10px] font-bold tracking-[1.4px] text-[#8b92a0]">
                  SHOPPING
                </p>
                <h2 className="m-0 text-xl font-semibold text-[#202633] max-[680px]:text-lg">
                  Your shopping
                </h2>
              </div>
              <span
                className="grid size-9 place-items-center rounded-md bg-emerald-50 text-lg text-emerald-700"
                aria-hidden="true"
              >
                🛒
              </span>
            </div>

            <p className="mt-[13px] mb-[21px] text-xs text-[#7b8391]">
              Your cart has {cartCount} {cartCount === 1 ? "item" : "items"}{" "}
              with a subtotal of ₦{cartSubtotal.toLocaleString()}.
            </p>
            <div className="border-t border-[#eceef1]">
              <Link
                className="flex min-h-14 items-center justify-between border-b border-[#eceef1] text-[13px] text-[#303847] no-underline transition-colors hover:text-emerald-700"
                to="/home"
              >
                <span>Continue shopping</span>
                <span aria-hidden="true">→</span>
              </Link>
              <Link
                className="flex min-h-14 items-center justify-between border-b border-[#eceef1] text-[13px] text-[#303847] no-underline transition-colors hover:text-emerald-700"
                to="/cart"
              >
                <span>View cart ({cartCount})</span>
                <span aria-hidden="true">→</span>
              </Link>
              {cartCount > 0 && (
                <Link
                  className="flex min-h-14 items-center justify-between text-[13px] text-[#303847] no-underline transition-colors hover:text-emerald-700"
                  to="/checkout"
                >
                  <span>Go to checkout</span>
                  <span aria-hidden="true">→</span>
                </Link>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
