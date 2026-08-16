// frontend/src/components/Hero.jsx

export default function Hero() {
  return (
    <div className="bg-[#04153b] rounded-3xl p-10 text-white flex justify-between items-center">
      <div>
        <h1 className="text-6xl font-bold leading-tight">
          Buy & Sell
          <br />
          With TrustPayEcommerceEcommerce
        </h1>

        <p className="mt-5 text-xl text-gray-300">
          The most secure marketplace for buyers and sellers.
        </p>

        <div className="mt-8 flex gap-5">
          <button className="bg-orange-500 px-8 py-4 rounded-xl font-bold">
            Start Shopping
          </button>

          <button className="border border-white px-8 py-4 rounded-xl font-bold">
            Start Selling
          </button>
        </div>
      </div>

      <img src="/hero.png" className="w-[450px]" />
    </div>
  );
}