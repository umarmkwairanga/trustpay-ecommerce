// frontend/src/pages/AdminDashboard.jsx

export default function AdminDashboard() {
  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-4 gap-5 mt-8">
        <div className="bg-white p-6 rounded-2xl shadow">
          Users
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          Products
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          Payments
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          Reports
        </div>
      </div>
    </div>
  );
}