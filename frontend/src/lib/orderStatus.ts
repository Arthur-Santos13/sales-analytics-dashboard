import type { OrderStatus } from "@/types/sales";

export const STATUS_LABELS: Record<OrderStatus, string> = {
    pending: "Pendente",
    confirmed: "Confirmado",
    shipped: "Enviado",
    delivered: "Entregue",
    cancelled: "Cancelado",
};

export const STATUS_COLORS: Record<OrderStatus, { bg: string; color: string; border: string }> = {
    pending: { bg: "#f59e0b22", color: "#f59e0b", border: "#f59e0b44" },
    confirmed: { bg: "#00b4d822", color: "#00b4d8", border: "#00b4d844" },
    shipped: { bg: "#8b5cf622", color: "#8b5cf6", border: "#8b5cf644" },
    delivered: { bg: "#22c55e22", color: "#22c55e", border: "#22c55e44" },
    cancelled: { bg: "#ef444422", color: "#ef4444", border: "#ef444444" },
};

export const ALL_STATUSES: OrderStatus[] = [
    "pending",
    "confirmed",
    "shipped",
    "delivered",
    "cancelled",
];
