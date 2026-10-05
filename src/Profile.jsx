import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const sections = [
  { label: "My Orders", detail: "Review your recent and past orders." },
  { label: "Wishlist", detail: "Review the items you have saved for later." },
  {
    label: "Saved Addresses",
    detail: "Manage the addresses used for delivery.",
  },
  {
    label: "Payment Methods",
    detail: "Manage your preferred payment methods.",
  },
  {
    label: "Notifications",
    detail: "Choose which account updates you receive.",
  },
  {
    label: "Settings",
    detail: "Update your personal and account preferences.",
  },
  {
    label: "Help & Support",
    detail: "Find help with your account and orders.",
  },
];

function readUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}") || {};
  } catch {
    return {};
  }
}

export default function Profile() {
  const navigate = useNavigate();
  const [user] = useState(readUser);
  const [activeSection, setActiveSection] = useState("");
  const name = user.name || "Daniel Chinedu";
  const email = user.email || "customer1@example.com";
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  const selectedSection = sections.find(
    (section) => section.label === activeSection,
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#f4f6f7] font-['Trebuchet_MS','Segoe_UI',sans-serif] text-[#202633]">
      <header className="border-b border-[#e8eaed] bg-white">
        <div className="mx-auto flex min-h-[76px] w-[calc(100%_-_64px)] max-w-[1180px] items-center gap-[34px] max-[900px]:gap-[18px] max-[900px]:w-[min(calc(100%_-_40px),720px)] max-[680px]:min-h-16 max-[680px]:w-[calc(100%_-_36px)] max-[680px]:flex-wrap max-[680px]:justify-between max-[680px]:gap-x-3">
          <Link
            className="inline-flex shrink-0 items-center gap-2.5 whitespace-nowrap text-[17px] font-bold uppercase text-[#252d3a] no-underline max-[680px]:text-sm"
            to="/profile"
            aria-label="Supermarket home"
          >
            <span
              className="grid size-[30px] place-items-center rounded-[9px_9px_9px_2px] bg-[#5148e5] text-[17px] text-white max-[680px]:size-[27px]"
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
              className="text-[13px] text-[#5148e5] no-underline transition-colors duration-150 hover:text-[#5148e5]"
              to="/profile"
            >
              Home
            </Link>
            <a
              className="text-[13px] text-[#677080] no-underline transition-colors duration-150 hover:text-[#5148e5]"
              href="#categories"
            >
              Categories
            </a>
            <a
              className="text-[13px] text-[#677080] no-underline transition-colors duration-150 hover:text-[#5148e5]"
              href="#deals"
            >
              Deals
            </a>
            <a
              className="text-[13px] text-[#677080] no-underline transition-colors duration-150 hover:text-[#5148e5]"
              href="#about"
            >
              About
            </a>
          </nav>
          <label className="flex h-[39px] w-[250px] items-center gap-[9px] rounded-[7px] border border-[#e5e8ed] bg-[#f8f9fa] px-3 text-[#9299a5] max-[900px]:w-[190px] max-[680px]:hidden">
            <span className="text-xl leading-none" aria-hidden="true">
              ⌕
            </span>
            <input
              className="w-full border-0 bg-transparent text-xs text-[#202633] outline-none placeholder:text-[#9299a5]"
              type="search"
              placeholder="Search for products..."
              aria-label="Search for products"
            />
          </label>
          <button
            className="inline-flex shrink-0 items-center gap-[7px] border-0 bg-transparent text-xs text-[#374052] max-[680px]:hidden"
            type="button"
            aria-label="Cart, 3 items"
          >
            Cart{" "}
            <span className="grid size-5 place-items-center rounded-full bg-[#edf0ff] text-[11px] text-[#5148e5]">
              3
            </span>
          </button>
          <button
            className="inline-flex min-h-[38px] shrink-0 items-center gap-2 rounded-md border border-[#e9ebef] bg-transparent py-1 pr-2.5 pl-[5px] text-xs text-[#374052] max-[680px]:min-h-[34px] max-[680px]:text-[11px]"
            type="button"
            aria-label={`Signed in as ${name}`}
          >
            <span className="grid size-[27px] place-items-center rounded-full bg-[#eff0ff] text-[10px] font-bold text-[#5148e5]">
              {initials || "U"}
            </span>
            <span>{name.split(" ")[0]}</span>
            <span className="text-[#8b93a1]" aria-hidden="true">
              ⌄
            </span>
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
                CUSTOMER ACCOUNT
              </span>
              <span
                className="size-2 rounded-full bg-[#009c70] shadow-[0_0_0_3px_#e6f6f0]"
                aria-label="Account active"
              />
            </div>
            <div className="mx-auto mt-[30px] mb-[13px] grid size-[86px] place-items-center rounded-full border-2 border-[#5148e5] bg-[#f1f1ff] text-[27px] font-medium text-[#5148e5] max-[680px]:mt-5 max-[680px]:size-[78px]">
              {initials || "U"}
            </div>
            <h2 className="m-0 text-center text-[19px] font-semibold">
              {name}
            </h2>
            <p className="my-[7px] mb-[11px] wrap-anywhere text-center text-xs text-[#7b8391]">
              {email}
            </p>
            <span className="mx-auto block w-fit rounded bg-[#f0f1ff] px-4 py-[7px] text-[9px] font-bold tracking-[0.7px] text-[#5148e5] uppercase">
              Customer
            </span>

            <div
              className="mt-[27px] grid grid-cols-3 gap-2 max-[680px]:mt-[21px]"
              aria-label="Account statistics"
            >
              <button
                className="grid min-h-[76px] content-center gap-1.5 rounded-md border border-[#e7e9ed] bg-[#f8f9fa] text-[#202633] transition-colors duration-150 hover:border-[#bfc0fa] hover:bg-[#f6f5ff] max-[680px]:min-h-[68px]"
                type="button"
                onClick={() => setActiveSection("My Orders")}
              >
                <strong className="text-xl font-medium">12</strong>
                <span className="text-[10px] text-[#828a98]">Orders</span>
              </button>
              <button
                className="grid min-h-[76px] content-center gap-1.5 rounded-md border border-[#e7e9ed] bg-[#f8f9fa] text-[#202633] transition-colors duration-150 hover:border-[#bfc0fa] hover:bg-[#f6f5ff] max-[680px]:min-h-[68px]"
                type="button"
                onClick={() => setActiveSection("Wishlist")}
              >
                <strong className="text-xl font-medium">3</strong>
                <span className="text-[10px] text-[#828a98]">Wishlist</span>
              </button>
              <button
                className="grid min-h-[76px] content-center gap-1.5 rounded-md border border-[#e7e9ed] bg-[#f8f9fa] text-[#202633] transition-colors duration-150 hover:border-[#bfc0fa] hover:bg-[#f6f5ff] max-[680px]:min-h-[68px]"
                type="button"
                onClick={() => setActiveSection("Saved Addresses")}
              >
                <strong className="text-xl font-medium">2</strong>
                <span className="text-[10px] text-[#828a98]">Addresses</span>
              </button>
            </div>

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
            aria-label="Account menu"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-2 text-[10px] font-bold tracking-[1.4px] text-[#8b92a0]">
                  ACCOUNT CENTER
                </p>
                <h2 className="m-0 text-xl font-semibold text-[#202633] max-[680px]:text-lg">
                  {selectedSection?.label || "Account overview"}
                </h2>
              </div>
              <span
                className="grid size-9 place-items-center rounded-md bg-[#eff0ff] text-lg text-[#5148e5]"
                aria-hidden="true"
              >
                {selectedSection ? "↗" : "✳"}
              </span>
            </div>

            {selectedSection ? (
              <div
                className="flex min-h-[280px] flex-col items-start justify-center border-t border-[#eceef1]"
                aria-live="polite"
              >
                <span className="text-[10px] font-bold tracking-[1px] text-[#5148e5] uppercase">
                  {selectedSection.label}
                </span>
                <p className="my-[10px] mb-[19px] text-sm text-[#697282]">
                  {selectedSection.detail}
                </p>
                <button
                  className="inline-flex items-center gap-2 border-0 bg-transparent p-0 text-[11px] text-[#5148e5]"
                  type="button"
                  onClick={() => setActiveSection("")}
                >
                  Back to account overview <span aria-hidden="true">→</span>
                </button>
              </div>
            ) : (
              <>
                <p className="mt-[13px] mb-[21px] text-xs text-[#7b8391]">
                  Manage your shopping activity and account preferences.
                </p>
                <div className="border-t border-[#eceef1]">
                  {sections
                    .filter((section) => section.label !== "Wishlist")
                    .map((section, index) => (
                      <button
                        className="group grid min-h-14 w-full grid-cols-[42px_1fr_auto] items-center border-0 border-b border-[#eceef1] bg-transparent text-left max-[680px]:min-h-[54px] max-[680px]:grid-cols-[34px_1fr_auto]"
                        type="button"
                        key={section.label}
                        onClick={() => setActiveSection(section.label)}
                      >
                        <span className="text-[10px] text-[#a4aab4]">
                          0{index + 1}
                        </span>
                        <span className="text-[13px] text-[#303847] transition-colors duration-150 group-hover:text-[#5148e5]">
                          {section.label}
                        </span>
                        <span
                          className="pr-[3px] text-base text-[#989fac] transition-all duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#5148e5]"
                          aria-hidden="true"
                        >
                          
                        </span>
                      </button>
                    ))}
                </div>
              </>
            )}
            <div className="my-[21px] flex items-center justify-between text-[11px] text-[#828a98] max-[680px]:my-[18px]">
              <span>Need a hand?</span>
              <button
                className="inline-flex items-center gap-2 border-0 bg-transparent p-0 text-[11px] text-[#5148e5]"
                type="button"
                onClick={() => setActiveSection("Help & Support")}
              >
                Visit support <span aria-hidden="true">→</span>
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
