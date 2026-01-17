import {
  getBlockchainValue,
  getBlockchainEvents,
} from "./services/blockchain.service";

export default async function HomePage() {
  // Ambil data dari backend (menggunakan try-catch agar tidak crash jika backend mati)
  let valueData = { value: "0" };
  let eventsData = [];

  try {
    valueData = await getBlockchainValue();
    eventsData = await getBlockchainEvents();
  } catch (error) {
    console.error("Gagal mengambil data:", error);
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="text-center border-b pb-6">
          <h1 className="text-3xl font-bold text-blue-600">Avalanche DApp Dashboard</h1>
          <p className="text-gray-500 font-medium">Monitoring data blockchain secara real-time</p>
        </div>

        {/* Card Nilai Terbaru */}
        <section className="bg-white p-6 rounded-xl shadow-md border border-blue-100">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <span>📊</span> Nilai Terbaru dari Smart Contract
          </h2>
          <div className="bg-blue-50 p-6 rounded-lg text-center">
            <p className="text-5xl font-mono font-bold text-blue-700">
              {valueData.value ?? "0"}
            </p>
            <p className="text-sm text-blue-400 mt-2 font-medium">Data diperbarui otomatis dari Backend</p>
          </div>
        </section>

        {/* List Events */}
        <section className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <span>📜</span> Daftar Event Terdeteksi
          </h2>
          <div className="space-y-3">
            {eventsData && eventsData.length > 0 ? (
              eventsData.map((event: any, index: number) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500 shadow-sm">
                  <p className="font-mono text-gray-600 text-xs break-all">
                    {JSON.stringify(event)}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-400 italic">Belum ada event yang tersimpan di blockchain</p>
              </div>
            )}
          </div>
        </section>

        {/* Footer info (Opsional) */}
        <div className="text-center text-gray-400 text-xs pt-4">
          Built for Avalanche Indonesia Short Course - Day 5
        </div>

      </div>
    </main>
  );
}