import Catalog from "../../components/cards/Catalog";
import superwormImage from "../../assets/catalogs/superworm.webp";

export default function OrderNow() {
    const products = [
        {
            productImage:superwormImage,
            productName: "Superworm",
            productDescription: "Description of Superworm",
            productBundleInfo: [
                { size: "Small-Medium", price: 300, pieces: 1000, perPiecePrice: 0.3 },
                { size: "Large-XL", price: 350, pieces: 1000, perPiecePrice: 0.35 },
                { size: "Mix Sizes", price: 320, pieces: 1000,}
            ],
            productFreebies: "100 per 1000"
        },
    ];

  return (
    <main className="page-container">
      <div className="flex flex-col items-center justify-center gap-2 text-center">
        <h1 className="text-2xl font-bold text-green-800">Make Your Order Now</h1>
        <p className="text-sm text-gray-600">
          Browse our catalog, build your order, and send it straight to our
          Messenger in seconds.
        </p>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-4">
        {products.map((product, index) => (
          <Catalog
            key={index}
            productImage={product.productImage}
            productName={product.productName}
            productDescription={product.productDescription}
            productBundleInfo={product.productBundleInfo}
            productFreebies={product.productFreebies}
          />
        ))}
      </div>
    </main>
  );
}
