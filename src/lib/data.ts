import type { Product, Sale, SaleItem } from "../types";

export let currentRevision = 1;
export let canEditState = true;
export const isSupabaseConfigured = true;

let ownerToken: string | null = null;
try {
  ownerToken = localStorage.getItem("jamu_owner_token") || sessionStorage.getItem("jamu_owner_token");
} catch {}

export function getOwnerToken(): string | null {
  return ownerToken;
}

export function setOwnerToken(token: string | null) {
  ownerToken = token;
  try {
    if (token) {
      localStorage.setItem("jamu_owner_token", token);
      sessionStorage.setItem("jamu_owner_token", token);
    } else {
      localStorage.removeItem("jamu_owner_token");
      sessionStorage.removeItem("jamu_owner_token");
    }
  } catch {}
}

export function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  if (ownerToken) {
    headers["Authorization"] = `Bearer ${ownerToken}`;
    headers["x-owner-token"] = ownerToken;
  }
  return headers;
}

export const demoProducts: Product[] = [
  { id: "prod-1", sku: "H", code: "H", name: "Habba", category: "Jamu Cair", unit: "BOTOL", buy_price: 5000, sell_price: 8000, stock: 10, min_stock: 3, last_updated: "26 Okt 2026" },
  { id: "prod-2", sku: "KS", code: "KS", name: "Kunyit Sirih", category: "Jamu Cair", unit: "BOTOL", buy_price: 5000, sell_price: 8000, stock: 12, min_stock: 3, last_updated: "26 Okt 2026" },
  { id: "prod-3", sku: "SS", code: "SS", name: "Sirih Sereh", category: "Jamu Cair", unit: "BOTOL", buy_price: 5000, sell_price: 8000, stock: 4, min_stock: 2, last_updated: "26 Okt 2026" },
  { id: "prod-4", sku: "SP", code: "SP", name: "Sambiloto Pahit", category: "Jamu Cair", unit: "BOTOL", buy_price: 6000, sell_price: 9000, stock: 10, min_stock: 3, last_updated: "26 Okt 2026" },
  { id: "prod-5", sku: "M", code: "M", name: "Mengkudu", category: "Jamu Cair", unit: "BOTOL", buy_price: 5000, sell_price: 8000, stock: 7, min_stock: 2, last_updated: "26 Okt 2026" },
  { id: "prod-6", sku: "K", code: "K", name: "Kencur", category: "Jamu Cair", unit: "BOTOL", buy_price: 5000, sell_price: 8000, stock: 4, min_stock: 2, last_updated: "26 Okt 2026" },
  { id: "prod-7", sku: "O", code: "O", name: "Olahan Temulawak", category: "Jamu Cair", unit: "BOTOL", buy_price: 5000, sell_price: 8000, stock: 14, min_stock: 3, last_updated: "26 Okt 2026" },
  { id: "prod-8", sku: "P", code: "P", name: "Pahit", category: "Jamu Cair", unit: "BOTOL", buy_price: 5000, sell_price: 8000, stock: 3, min_stock: 2, last_updated: "26 Okt 2026" },
  { id: "prod-9", sku: "B", code: "B", name: "Beras Kencur", category: "Jamu Cair", unit: "BOTOL", buy_price: 5000, sell_price: 8000, stock: 3, min_stock: 2, last_updated: "26 Okt 2026" },
  { id: "prod-10", sku: "HJ", code: "HJ", name: "Herbal Jahe", category: "Jamu Cair", unit: "BOTOL", buy_price: 6000, sell_price: 9000, stock: 7, min_stock: 2, last_updated: "26 Okt 2026" },
  { id: "prod-11", sku: "PB", code: "PB", name: "Pahit Brotowali", category: "Jamu Cair", unit: "BOTOL", buy_price: 6000, sell_price: 9000, stock: 5, min_stock: 2, last_updated: "26 Okt 2026" },
  { id: "prod-12", sku: "PLS", code: "PLS", name: "Pegal Linu Super", category: "Jamu Cair", unit: "BOTOL", buy_price: 6000, sell_price: 9000, stock: 3, min_stock: 2, last_updated: "26 Okt 2026" },
  { id: "prod-13", sku: "DRT", code: "DRT", name: "Darah Tinggi", category: "Herbal", unit: "BOTOL", buy_price: 7000, sell_price: 10000, stock: 3, min_stock: 2, last_updated: "26 Okt 2026" },
  { id: "prod-14", sku: "KCM", code: "KCM", name: "Kencing Manis", category: "Herbal", unit: "BOTOL", buy_price: 7000, sell_price: 10000, stock: 2, min_stock: 2, last_updated: "26 Okt 2026" },
  { id: "prod-15", sku: "MADU LANANG", code: "MADU LANANG", name: "Madu Lanang", category: "Herbal", unit: "PCS", buy_price: 15000, sell_price: 25000, stock: 28, min_stock: 5, last_updated: "26 Okt 2026" }
];

export const demoSales: Sale[] = [
  { id: "sale-1", invoice_no: "TRX-20261026-660EFE", customer_name: "Pendapatan jamu", total: 410000, payment_method: "Tunai", notes: "Penjualan harian botol jamu", created_at: "2026-10-26T17:30:00Z", status: "Tercatat" },
  { id: "sale-2", invoice_no: "TRX-20261024-163D53", customer_name: "Pendapatan jamu", total: 390000, payment_method: "QRIS", notes: "Penjualan harian", created_at: "2026-10-24T18:15:00Z", status: "Tercatat" },
  { id: "sale-3", invoice_no: "TRX-20261023-7C1437", customer_name: "Pendapatan jamu", total: 355000, payment_method: "Tunai", notes: "Penjualan harian", created_at: "2026-10-23T16:45:00Z", status: "Tercatat" },
  { id: "sale-4", invoice_no: "TRX-20261022-D5148D", customer_name: "Pendapatan jamu", total: 455000, payment_method: "Tunai", notes: "Penjualan harian", created_at: "2026-10-22T19:00:00Z", status: "Tercatat" },
  { id: "sale-5", invoice_no: "TRX-20261022-9C1212", customer_name: "Pendapatan jamu", total: 890000, payment_method: "QRIS", notes: "Penjualan borongan & botol", created_at: "2026-10-21T18:30:00Z", status: "Tercatat" },
  { id: "sale-6", invoice_no: "TRX-20261019-331A12", customer_name: "Pendapatan jamu", total: 245000, payment_method: "Tunai", notes: "Penjualan", created_at: "2026-10-19T17:00:00Z", status: "Tercatat" },
  { id: "sale-7", invoice_no: "TRX-20261018-8A3319", customer_name: "Pendapatan jamu", total: 320000, payment_method: "Tunai", notes: "Penjualan", created_at: "2026-10-18T17:00:00Z", status: "Tercatat" },
  { id: "sale-8", invoice_no: "TRX-20261017-909BF1", customer_name: "Pendapatan jamu", total: 185000, payment_method: "QRIS", notes: "Penjualan", created_at: "2026-10-17T18:00:00Z", status: "Tercatat" },
  { id: "sale-9", invoice_no: "TRX-20261015-4B8210", customer_name: "Pendapatan jamu", total: 275000, payment_method: "Transfer", notes: "Pesanan herbal & jamu", created_at: "2026-10-15T15:20:00Z", status: "Tercatat" },
  { id: "sale-10", invoice_no: "TRX-20261014-77A124", customer_name: "Pendapatan jamu", total: 165000, payment_method: "Tunai", notes: "Penjualan", created_at: "2026-10-14T17:15:00Z", status: "Tercatat" },
  { id: "sale-11", invoice_no: "TRX-20261012-302CD9", customer_name: "Pendapatan jamu", total: 210000, payment_method: "Tunai", notes: "Penjualan", created_at: "2026-10-12T16:40:00Z", status: "Tercatat" },
  { id: "sale-12", invoice_no: "TRX-20261010-2C9914", customer_name: "Pendapatan jamu", total: 220000, payment_method: "Tunai", notes: "Penjualan botol", created_at: "2026-10-10T16:00:00Z", status: "Tercatat" },
  { id: "sale-13", invoice_no: "TRX-20261008-118FA0", customer_name: "Pendapatan jamu", total: 175000, payment_method: "Tunai", notes: "Penjualan", created_at: "2026-10-08T17:30:00Z", status: "Tercatat" },
  { id: "sale-14", invoice_no: "TRX-20261006-554EA1", customer_name: "Pendapatan jamu", total: 135000, payment_method: "QRIS", notes: "Penjualan", created_at: "2026-10-06T18:10:00Z", status: "Tercatat" },
  { id: "sale-15", invoice_no: "TRX-20261004-902BC8", customer_name: "Pendapatan jamu", total: 142000, payment_method: "Tunai", notes: "Penjualan", created_at: "2026-10-04T17:20:00Z", status: "Tercatat" },
  { id: "sale-16", invoice_no: "TRX-20261002-4410E7", customer_name: "Pendapatan jamu", total: 115000, payment_method: "Tunai", notes: "Penjualan", created_at: "2026-10-02T16:00:00Z", status: "Tercatat" }
];

/**
 * Fetch full store from /api/store
 */
export async function fetchStore(): Promise<{
  products: Product[];
  sales: Sale[];
  revision: number;
  canEdit: boolean;
}> {
  try {
    const res = await fetch("/api/store", {
      headers: {
        ...getAuthHeaders()
      },
      credentials: "same-origin"
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const data = await res.json();
    currentRevision = data.revision || 1;
    canEditState = Boolean(data.canEdit);

    const products: Product[] = (data.state?.products || []).map((p: Record<string, unknown>) => ({
      id: String(p.id || ""),
      sku: String(p.sku || p.kode || p.code || ""),
      code: String(p.code || p.kode || p.sku || ""),
      name: String(p.name || p.nama || ""),
      category: String(p.category || "Jamu Cair"),
      unit: String(p.unit || p.satuan || "BOTOL"),
      buy_price: Number(p.buy_price || 0),
      sell_price: Number(p.sell_price || p.price || p.harga || 0),
      stock: Number(p.stock !== undefined ? p.stock : 0),
      min_stock: Number(p.min_stock !== undefined ? p.min_stock : 2),
      status: String(p.status || (p.payload as Record<string, unknown>)?.status || (Number(p.stock || 0) <= Number(p.min_stock || 2) ? "Stok menipis" : "Stok aman")),
      last_updated: String(p.last_updated || "26 Okt 2026")
    }));

    const sales: Sale[] = (data.state?.transactions || data.state?.sales || []).map((s: Record<string, unknown>) => {
      const invoiceNo = String(s.invoice_no || s.nomor || s.number || "");
      let dateStr = String(s.created_at || s.tanggal || s.date || "");
      const match = invoiceNo.match(/TRX-(\d{4})(\d{2})(\d{2})/);
      if (match) {
        const derived = `${match[1]}-${match[2]}-${match[3]}`;
        if (!dateStr || !dateStr.startsWith(derived)) {
          dateStr = `${derived}T12:00:00Z`;
        }
      } else if (!dateStr) {
        dateStr = new Date().toISOString();
      }

      return {
        id: String(s.id || ""),
        invoice_no: invoiceNo,
        customer_name: String(s.customer_name || s.catatan || "Pendapatan jamu"),
        total: Number(s.total || 0),
        payment_method: String(s.payment_method || "Tunai"),
        notes: s.notes ? String(s.notes) : null,
        status: String(s.status || "Tercatat"),
        created_at: dateStr
      };
    });

    return { products, sales, revision: currentRevision, canEdit: canEditState };
  } catch (err) {
    console.warn("fetchStore fallback ke demo dataset:", err);
    return {
      products: demoProducts,
      sales: demoSales,
      revision: currentRevision,
      canEdit: canEditState
    };
  }
}

/**
 * Dispatch business action to /api/store
 */
export async function sendStoreAction(action: string, payload: unknown): Promise<{
  products: Product[];
  sales: Sale[];
  revision: number;
  canEdit: boolean;
}> {
  const res = await fetch("/api/store", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders()
    },
    credentials: "same-origin",
    body: JSON.stringify({
      revision: currentRevision,
      action,
      payload
    })
  });

  if (res.status === 409) {
    throw new Error("Data telah diperbarui oleh sesi lain. Memuat ulang data terbaru…");
  }

  if (res.status === 403) {
    throw new Error("Akses ditolak: hanya pemilik toko yang dapat mengubah data.");
  }

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gagal menyimpan: ${errText}`);
  }

  const data = await res.json();
  currentRevision = data.revision || currentRevision + 1;
  canEditState = Boolean(data.canEdit);

  const products: Product[] = (data.state?.products || []).map((p: Record<string, unknown>) => ({
    id: String(p.id || ""),
    sku: String(p.sku || p.kode || p.code || ""),
    code: String(p.code || p.kode || p.sku || ""),
    name: String(p.name || p.nama || ""),
    category: String(p.category || "Jamu Cair"),
    unit: String(p.unit || p.satuan || "BOTOL"),
    buy_price: Number(p.buy_price || 0),
    sell_price: Number(p.sell_price || p.price || p.harga || 0),
    stock: Number(p.stock !== undefined ? p.stock : 0),
    min_stock: Number(p.min_stock !== undefined ? p.min_stock : 2),
    status: String(p.status || (p.payload as Record<string, unknown>)?.status || (Number(p.stock || 0) <= Number(p.min_stock || 2) ? "Stok menipis" : "Stok aman")),
    last_updated: String(p.last_updated || "26 Okt 2026")
  }));

  const sales: Sale[] = (data.state?.transactions || data.state?.sales || []).map((s: Record<string, unknown>) => {
    const invoiceNo = String(s.invoice_no || s.nomor || s.number || "");
    let dateStr = String(s.created_at || s.tanggal || s.date || "");
    const match = invoiceNo.match(/TRX-(\d{4})(\d{2})(\d{2})/);
    if (match) {
      const derived = `${match[1]}-${match[2]}-${match[3]}`;
      if (!dateStr || !dateStr.startsWith(derived)) {
        dateStr = `${derived}T12:00:00Z`;
      }
    } else if (!dateStr) {
      dateStr = new Date().toISOString();
    }

    return {
      id: String(s.id || ""),
      invoice_no: invoiceNo,
      customer_name: String(s.customer_name || s.catatan || "Pendapatan jamu"),
      total: Number(s.total || 0),
      payment_method: String(s.payment_method || "Tunai"),
      notes: s.notes ? String(s.notes) : null,
      status: String(s.status || "Tercatat"),
      created_at: dateStr
    };
  });

  return { products, sales, revision: currentRevision, canEdit: canEditState };
}

/**
 * Login owner via /api/owner
 */
export async function authenticateOwnerApi(code: string): Promise<boolean> {
  const res = await fetch("/api/owner", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify({ code })
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Kode akses salah.");
  }

  const data = await res.json();
  canEditState = Boolean(data.canEdit);
  if (data.token) {
    setOwnerToken(data.token);
  }
  return canEditState;
}

/**
 * Logout owner via /api/owner
 */
export async function logoutOwnerApi(): Promise<void> {
  try {
    await fetch("/api/owner", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders()
      },
      credentials: "same-origin",
      body: JSON.stringify({ action: "logout" })
    });
  } finally {
    setOwnerToken(null);
    canEditState = false;
  }
}

export async function getProducts(): Promise<Product[]> {
  const store = await fetchStore();
  return store.products;
}

export async function saveProduct(product: Partial<Product> & { name: string }) {
  const payload = {
    id: product.id,
    nama: product.name.trim(),
    name: product.name.trim(),
    kode: product.sku || product.code || "JH",
    code: product.sku || product.code || "JH",
    sku: product.sku || product.code || "JH",
    satuan: product.unit || "BOTOL",
    unit: product.unit || "BOTOL",
    harga: Number(product.sell_price || 0),
    buy_price: Number(product.buy_price || 0),
    sell_price: Number(product.sell_price || 0),
    stock: Number(product.stock || 0),
    min_stock: Number(product.min_stock || 2)
  };

  const res = await sendStoreAction("product", payload);
  return res.products.find(p => p.id === product.id || p.sku === payload.sku) || product as Product;
}

export async function deleteProduct(id: string) {
  // Archive or mark inactive
  await sendStoreAction("variants", { id, aktif: false, active: false });
}

export async function getSales(): Promise<Sale[]> {
  const store = await fetchStore();
  return store.sales;
}

export async function createSale(input: {
  customer_name?: string;
  payment_method?: string;
  notes?: string;
  total?: number;
  date?: string;
  tanggal?: string;
  items?: { product_id: string; qty: number; unit_price: number }[];
}) {
  const total = input.total !== undefined
    ? Number(input.total)
    : (input.items || []).reduce((s, it) => s + it.qty * it.unit_price, 0);

  const now = new Date();
  let dateStr = input.tanggal || input.date || now.toISOString();
  if (dateStr.length === 10) {
    const timePart = now.toTimeString().split(" ")[0];
    dateStr = `${dateStr}T${timePart}Z`;
  }
  const randomPart = Math.random().toString(16).substring(2, 8).toUpperCase();
  const datePart = dateStr.slice(0, 10).replace(/-/g, "");
  const invoiceNo = `TRX-${datePart}-${randomPart}`;

  await sendStoreAction("income", {
    nomor: invoiceNo,
    invoice_no: invoiceNo,
    tanggal: dateStr,
    total,
    customer_name: input.customer_name || input.notes || "Pendapatan jamu",
    payment_method: input.payment_method || "Tunai",
    notes: input.notes || input.customer_name || "Pendapatan transaksi jamu",
    items: input.items || []
  });

  return invoiceNo;
}

export async function recordStocktake(
  items: Record<string, number>,
  date?: string,
  statuses?: Record<string, string>
) {
  return sendStoreAction("stocktake", {
    tanggal: date || new Date().toISOString().slice(0, 10),
    items,
    statuses
  });
}

export async function getSaleItems(_saleId: string): Promise<SaleItem[]> {
  return [];
}
