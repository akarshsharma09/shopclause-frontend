const bestsellerImages = [
  "/images/bestseller/breakfast.webp",
  "/images/bestseller/coffee.webp",
  "/images/bestseller/cycle.webp",
  "/images/bestseller/dryfruits.webp",
  "/images/bestseller/education.webp",
  "/images/bestseller/food.webp",
  "/images/bestseller/honey.webp",
  "/images/bestseller/monitor.webp",
  "/images/bestseller/printer.webp",
  "/images/bestseller/speaker.webp",
  "/images/bestseller/tea.webp",
  "/images/bestseller/toy.webp",
];

export default function BestSellers() {
  return (
    <div className="mt-10 px-2 md:px-10 pb-10">
      <h2 className="text-lg md:text-xl font-semibold mb-4">Best Sellers</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {bestsellerImages.map((img, i) => (
          <div
            key={i}
            className="bg-white p-3 rounded-lg shadow hover:shadow-lg cursor-pointer transition"
          >
            <img
              src={img}
              alt={`Bestseller ${i + 1}`}
              className="w-full h-32 object-contain mb-2"
            />
            <h3 className="text-sm font-medium text-gray-700">
              Item {i + 1}
            </h3>
            <p className="text-blue-600 font-semibold">₹{(i + 1) * 499}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
