import {
  getBlockchainValue,
  getBlockchainEvents,
} from "@/services/blockchain.service";

export default async function HomePage() {
  // Ambil data dari backend
  const valueData = await getBlockchainValue();
  const eventsData = await getBlockchainEvents();

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="text-center border-b pb-6">
          <h1 className="text-3xl font-bold text-blue-600">Avalanche DApp Dashboard</h1>
          <p className="text-gray-500">Monitoring data blockchain secara real-time</p>
        </div>

        {/* Card Nilai Terbaru */}
        <section className="bg-white p-6 rounded-xl shadow-md border border-blue-100">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            📊 Nilai Terbaru dari Smart Contract
          </h2>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-4xl font-mono font-bold text-blue-700">
              {valueData.value ?? "0"}
            </p>
          </div>
        </section>

        {/* List Events */}
        <section className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            📜 Daftar Event Terdeteksi
          </h2>
          <div className="space-y-3">
            {eventsData.length > 0 ? (
              eventsData.map((event: any, index: number) => (
                <div key={index} className="p-3 bg-gray-50 rounded border-l-4 border-blue-500 text-sm">
                  <p className="font-mono text-gray-600">{JSON.stringify(event)}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-400 italic text-center py-4">Belum ada event terdeteksi...</p>
            )}
          </div>
        </section>

      </div>
    </main>
  );
}