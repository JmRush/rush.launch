import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold">Rush Launch</h1>
        <p className="text-lg text-gray-600">
          Next.js + Bun + TypeScript + SQLite
        </p>
        <p className="text-sm text-gray-500">
          API runs on a separate Bun server (port 3001)
        </p>
        <div className="flex gap-4">
          <a
            href="http://localhost:3001/health"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            API Health
          </a>
          <a
            href="http://localhost:3001/db"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            DB Test
          </a>
        </div>
      </div>
    </main>
  );
}
