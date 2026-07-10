// frontend/src/components/Sidebar.jsx

const categories = [
  "Electronics",
  "Phones & Tablets",
  "Computers",
  "Fashion",
  "Furniture",
  "Gaming",
  "Beauty",
  "Sports",
  "Agriculture",
  "Digital Products",
];

export default function Sidebar() {
  return (
    <div className="bg-white shadow-lg rounded-xl p-4 w-[250px]">
      <h2 className="font-bold text-xl mb-4">
        All Categories
      </h2>

      {categories.map((item, index) => (
        <div
          key={index}
          className="py-3 border-b hover:text-orange-500 cursor-pointer"
        >
          {item}
        </div>
      ))}
    </div>
  );
}