// ============================================================================
// server/supabase-db.js - Supabase REST RPC Adapter for jamu_storage
// ============================================================================

import { initialSchema1State } from './core.js';

let localMemoryState = JSON.parse(JSON.stringify(initialSchema1State));
let localRevision = 1;

const DEFAULT_SUPABASE_URL = 'https://deinvdgyniotdnotbncg.supabase.co';
const DEFAULT_SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlaW52ZGd5bmlvdGRub3RibmNnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MzEyNjg2NywiZXhwIjoyMTA4NzAyODY3fQ.eAEpO3D9Zr0qf1FEki4NytTHFP6dTJn8lUJf4YKAu1Q';

/**
 * Dapatkan konfigurasi Supabase dari environment
 */
export function getSupabaseConfig(env = {}) {
  const url = (env.SUPABASE_URL || (typeof process !== 'undefined' ? process.env?.SUPABASE_URL : '') || DEFAULT_SUPABASE_URL).trim().replace(/\/$/, '');
  const key = (env.SUPABASE_SERVICE_ROLE_KEY || (typeof process !== 'undefined' ? process.env?.SUPABASE_SERVICE_ROLE_KEY : '') || DEFAULT_SUPABASE_KEY).trim();
  const configured = Boolean(url && key);
  return { url, key, configured };
}

/**
 * Panggil REST RPC jamu_storage pada Supabase
 * Endpoint: ${SUPABASE_URL}/rest/v1/rpc/jamu_storage
 * Headers:
 *   Content-Type: application/json
 *   apikey: SUPABASE_SERVICE_ROLE_KEY
 *   Authorization: Bearer SUPABASE_SERVICE_ROLE_KEY
 * Body: { operation, args }
 */
export async function callJamuStorage(operation, args = [], env = {}) {
  const { url, key, configured } = getSupabaseConfig(env);

  // Jika Supabase belum dikonfigurasi, gunakan fallback in-memory yang aman
  if (!configured) {
    return handleLocalFallback(operation, args);
  }

  const endpoint = `${url}/rest/v1/rpc/jamu_storage`;
  const headers = {
    'Content-Type': 'application/json',
    'apikey': key,
    'Authorization': `Bearer ${key}`
  };

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({ operation, args })
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    }

    const errText = await res.text();

    // Jika terjadi safeupdate error (DELETE requires a WHERE clause) dari RPC lama di PostgreSQL,
    // jalankan pembaruan langsung ke tabel terpisah menggunakan query ber-WHERE yang aman
    if (operation === 'update' && errText.includes('DELETE requires a WHERE clause')) {
      return await handleDirectTableUpdate(url, headers, args);
    }

    // Bila RPC belum dibuat di Supabase (misal SQL migrasi 002 belum dijalankan pengguna)
    if (res.status === 404 || errText.includes('could not find the function') || errText.includes('PGRST202')) {
      console.warn('[JamuStorage] RPC jamu_storage belum ditemukan di Supabase. Jalankan 002_Jamu_Herbal_Tabel_Terpisah.sql di SQL Editor.');
      return handleLocalFallback(operation, args);
    }

    throw new Error(`Supabase RPC Error (${res.status}): ${errText}`);
  } catch (err) {
    console.warn('[JamuStorage] Gagal terhubung ke RPC Supabase, memakai fallback memori:', err.message);
    return handleLocalFallback(operation, args);
  }
}

/**
 * Pembaruan langsung ke tabel terpisah jika RPC database terbentur safeupdate strict mode
 */
async function handleDirectTableUpdate(url, headers, args) {
  const nextStateStr = args[0];
  const expectedRev = Number(args[2]);
  const nextState = typeof nextStateStr === 'string' ? JSON.parse(nextStateStr) : nextStateStr;

  // 1. Periksa revisi di jamu_meta
  const metaRes = await fetch(`${url}/rest/v1/jamu_meta?id=eq.1`, { headers });
  if (!metaRes.ok) return { changes: 0 };
  const metaRows = await metaRes.json();
  const currentMeta = metaRows[0];
  if (!currentMeta || Number(currentMeta.revision) !== expectedRev) {
    return { changes: 0 }; // Konflik revisi!
  }

  const newRevision = expectedRev + 1;

  // 2. Update jamu_meta
  await fetch(`${url}/rest/v1/jamu_meta?id=eq.1`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({
      revision: newRevision,
      settings: nextState.settings || currentMeta.settings,
      extra: nextState.extra || currentMeta.extra
    })
  });

  // 3. Masukkan transaksi baru (jika ada) ke public.transaksi_penjualan
  const sales = nextState.sales || nextState.transactions || [];
  if (sales.length > 0) {
    const latestTrx = sales[0];
    if (latestTrx && latestTrx.id) {
      await fetch(`${url}/rest/v1/transaksi_penjualan`, {
        method: 'POST',
        headers: { ...headers, 'Prefer': 'resolution=merge-duplicates' },
        body: JSON.stringify({
          id: latestTrx.id,
          urutan: Number(latestTrx.urutan) || 1,
          nomor: latestTrx.number || latestTrx.nomor || latestTrx.invoice_no || `TRX-${Date.now()}`,
          tanggal: latestTrx.date || latestTrx.tanggal || new Date().toISOString().slice(0, 10),
          status: 'valid',
          total: Number(latestTrx.total) || 0,
          catatan: latestTrx.note || latestTrx.catatan || '',
          payload: latestTrx.payload || latestTrx
        })
      });
    }
  }

  // 4. Masukkan stok baru (jika ada) ke public.stok_harian
  // 4. Masukkan stok baru ke public.stok_harian
  const stockEntries = nextState.dailyStocks || nextState.stockEntries || nextState.stok_harian || [];
  if (stockEntries.length > 0) {
    for (const s of stockEntries) {
      const prodId = s.productId || s.produk_id;
      const date = s.date || s.tanggal;
      const qty = Number(s.qty !== undefined ? s.qty : (s.jumlah !== undefined ? s.jumlah : s.stock)) || 0;
      const statusEnum = qty > 2 ? 'safe' : 'low';
      if (prodId && date) {
        await fetch(`${url}/rest/v1/stok_harian?on_conflict=produk_id,tanggal`, {
          method: 'POST',
          headers: { ...headers, 'Prefer': 'resolution=merge-duplicates' },
          body: JSON.stringify({
            id: s.id || `stock-${Date.now()}-${prodId}`,
            urutan: Number(s.urutan) || 1,
            produk_id: prodId,
            tanggal: date,
            jumlah: qty,
            status: statusEnum,
            payload: s.payload || { stock: qty, status: statusEnum }
          })
        });
      }
    }
  }

  // 5. Perbarui payload stok pada public.produk
  const products = nextState.products || [];
  for (const p of products) {
    if (p.id) {
      await fetch(`${url}/rest/v1/produk?id=eq.${p.id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
          payload: {
            ...(p.payload || {}),
            stock: Number(p.stock !== undefined ? p.stock : 0)
          }
        })
      });
    }
  }

  return { changes: 1 };
}

/**
 * Fallback in-memory handler dengan kontrak persis seperti RPC SQL
 */
function handleLocalFallback(operation, args) {
  if (operation === 'read') {
    return {
      revision: localRevision,
      owner_user_id: 'local-owner',
      data: JSON.stringify(localMemoryState)
    };
  }

  if (operation === 'update') {
    const nextStateStr = args[0];
    const expectedRev = Number(args[2]);

    if (expectedRev !== localRevision) {
      return { changes: 0 };
    }

    try {
      localMemoryState = JSON.parse(nextStateStr);
      localRevision += 1;
      return { changes: 1 };
    } catch {
      return { changes: 0 };
    }
  }

  if (operation === 'insert') {
    const stateStr = args[0];
    try {
      localMemoryState = JSON.parse(stateStr);
      localRevision = 1;
      return { changes: 1 };
    } catch {
      return { changes: 0 };
    }
  }

  if (operation === 'attempt') {
    return { attempts: 1 };
  }

  if (operation === 'cleanup') {
    return { changes: 1 };
  }

  throw new Error(`Operasi RPC tidak didukung: ${operation}`);
}

/**
 * Reset memory state untuk keperluan testing
 */
export function resetLocalMemory() {
  localMemoryState = JSON.parse(JSON.stringify(initialSchema1State));
  localRevision = 1;
}
