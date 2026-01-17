const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

if (!BACKEND_URL) {
  throw new Error("NEXT_PUBLIC_BACKEND_URL is not defined");
}

/**
 * Ambil nilai terbaru dari backend
 */
export async function getBlockchainValue() {
  const res = await fetch(`${BACKEND_URL}/blockchain/value`, {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Gagal mengambil value dari blockchain");
  }

  return res.json();
}

/**
 * Ambil data event dari backend
 */
export async function getBlockchainEvents() {
  const res = await fetch(`${BACKEND_URL}/blockchain/events`, {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Gagal mengambil event dari blockchain");
  }

  return res.json();
}