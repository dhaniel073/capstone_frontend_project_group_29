import React from "react";

const DEFAULT_ORDER = {
  id: "64f2a91b",
  status: "processing",
  items: [
    { name: "Coca-Cola 50cl", qty: 2, price: 1000 },
    { name: "Bread Loaf", qty: 1, price: 800 },
    { name: "Rice 5kg", qty: 1, price: 6500 },
  ],
  cardLast4: "4242",
};

// Prices are the line totals (as shown in the design). Change to
// item.price * item.qty if your prices are per unit.
const formatNGN = (amount) => `NGN ${amount.toLocaleString("en-NG")}`;

const STATUS_STYLES = {
  processing: { bg: "#FEF3C7", color: "#D97706", label: "PROCESSING" },
  shipped: { bg: "#DBEAFE", color: "#2563EB", label: "SHIPPED" },
  delivered: { bg: "#D1FAE5", color: "#059669", label: "DELIVERED" },
};

const colors = {
  ink: "#1A1D2E",
  muted: "#6B7280",
  faint: "#9CA3AF",
  green: "#059669",
  greenSoft: "#D1FAE5",
  indigo: "#5046E5",
  border: "#E5E7EB",
  surface: "#F7F8FA",
};

const styles = {
  page: {
    minHeight: "100vh",
    background: "#F3F4F6",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    boxSizing: "border-box",
    fontFamily:
      "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  },
  phone: {
    width: 360,
    height: 740,
    background: "#fff",
    border: "8px solid #1F2937",
    borderRadius: 44,
    position: "relative",
    overflow: "hidden",
    boxSizing: "border-box",
  },
  notch: {
    position: "absolute",
    top: 0,
    left: "50%",
    transform: "translateX(-50%)",
    width: 100,
    height: 22,
    background: "#1F2937",
    borderRadius: "0 0 14px 14px",
  },
  statusBar: {
    display: "flex",
    justifyContent: "space-between",
    padding: "28px 24px 0",
    fontSize: 13,
    color: colors.ink,
  },
  screen: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "48px 24px 24px",
    boxSizing: "border-box",
  },
  checkCircle: {
    width: 78,
    height: 78,
    borderRadius: "50%",
    background: colors.greenSoft,
    border: `3px solid ${colors.green}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    margin: "14px 0 0",
    fontSize: 24,
    fontWeight: 500,
    color: colors.ink,
  },
  orderId: { margin: "10px 0 8px", fontSize: 14, color: colors.muted },
  badge: {
    padding: "8px 40px",
    borderRadius: 14,
    fontSize: 12,
    letterSpacing: 0.3,
  },
  card: {
    width: "100%",
    marginTop: 32,
    padding: "20px 14px",
    background: "#fff",
    border: `1.5px solid ${colors.border}`,
    borderRadius: 18,
    boxShadow: "0 3px 0 rgba(0,0,0,0.04)",
    boxSizing: "border-box",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    fontSize: 14,
    color: colors.ink,
    marginBottom: 16,
  },
  divider: {
    height: 1,
    background: colors.border,
    border: "none",
    margin: "4px 0 16px",
  },
  totalLabel: { fontSize: 15, color: colors.ink },
  totalValue: { fontSize: 16, color: colors.green },
  paidVia: { margin: "10px 0 0", fontSize: 12, color: colors.faint },
  actions: {
    width: "100%",
    marginTop: 32,
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },
  primaryBtn: {
    height: 52,
    border: "none",
    borderRadius: 26,
    background: colors.indigo,
    color: "#fff",
    fontSize: 16,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  secondaryBtn: {
    height: 52,
    border: "none",
    borderRadius: 26,
    background: colors.surface,
    color: colors.ink,
    fontSize: 15,
    cursor: "pointer",
    fontFamily: "inherit",
  },
};

function CheckIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true">
      <path
        d="M8 21 L17 30 L33 10"
        fill="none"
        stroke={colors.green}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PhoneFrame({ children }) {
  return (
    <div style={styles.page}>
      <div style={styles.phone}>
        <div style={styles.notch} />
        <div style={styles.statusBar}>
          <span>9:41</span>
          <span>100%</span>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function PaymentConfirmation({
  order = DEFAULT_ORDER,
  showFrame = true,
  onTrackOrder = () => console.log("Track order", order.id),
  onContinueShopping = () => console.log("Continue shopping"),
}) {
  const total = order.items.reduce((sum, item) => sum + item.price, 0);
  const status = STATUS_STYLES[order.status] ?? STATUS_STYLES.processing;

  const content = (
    <main style={styles.screen}>
      <style>{`
        .pc-btn { transition: transform .12s ease, filter .12s ease; }
        .pc-btn:hover { filter: brightness(0.97); }
        .pc-btn:active { transform: scale(0.98); }
        .pc-btn:focus-visible { outline: 3px solid #A5B4FC; outline-offset: 2px; }
        @media (prefers-reduced-motion: reduce) { .pc-btn { transition: none; } }
      `}</style>

      <div style={styles.checkCircle}>
        <CheckIcon />
      </div>

      <h1 style={styles.title}>Payment Successful!</h1>
      <p style={styles.orderId}>Order #{order.id}</p>
      <span
        style={{ ...styles.badge, background: status.bg, color: status.color }}
      >
        {status.label}
      </span>

      <section style={styles.card} aria-label="Order summary">
        {order.items.map((item) => (
          <div key={item.name} style={styles.row}>
            <span>
              {item.name}&nbsp; x{item.qty}
            </span>
            <span>{formatNGN(item.price)}</span>
          </div>
        ))}

        <hr style={styles.divider} />

        <div style={{ ...styles.row, marginBottom: 0 }}>
          <span style={styles.totalLabel}>Total Paid</span>
          <span style={styles.totalValue}>{formatNGN(total)}</span>
        </div>
        <p style={styles.paidVia}>Paid via Card ending {order.cardLast4}</p>
      </section>

      <div style={styles.actions}>
        <button
          type="button"
          className="pc-btn"
          style={styles.primaryBtn}
          onClick={onTrackOrder}
        >
          Track Order
        </button>
        <button
          type="button"
          className="pc-btn"
          style={styles.secondaryBtn}
          onClick={onContinueShopping}
        >
          Continue Shopping
        </button>
      </div>
    </main>
  );

  return showFrame ? <PhoneFrame>{content}</PhoneFrame> : content;
}