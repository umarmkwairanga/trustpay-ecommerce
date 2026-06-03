// frontend/src/components/Navbar.jsx

export default function Navbar() {
  return (
    <div className="bg-[#04153b] text-white flex justify-between items-center px-6 py-4">
      <div className="flex items-center gap-3">
        <img src="/logo.png" className="w-14" />
        
        <h1 className="text-3xl font-bold">
          Trust<span className="text-orange-500">Pay</span>
        </h1>
      </div>

      <div className="flex gap-4 items-center">
        <input
          type="text"
          placeholder="Search products..."
          className="w-[450px] px-4 py-3 rounded-lg text-black"
        />

        <button className="bg-orange-500 px-5 py-3 rounded-lg">
          Search
        </button>
      </div>
    </div>
  );
}