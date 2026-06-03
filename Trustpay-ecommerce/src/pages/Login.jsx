// frontend/src/pages/Login.jsx

export default function Login() {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-10 rounded-3xl shadow-lg w-[420px]">
        <h1 className="text-4xl font-bold mb-8">
          Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-4 rounded-xl mb-4"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-4 rounded-xl mb-6"
        />

        <button className="bg-orange-500 text-white w-full py-4 rounded-xl">
          Login
        </button>
      </div>
    </div>
  );
}