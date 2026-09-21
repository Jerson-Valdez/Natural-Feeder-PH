import Catalog from "../../components/cards/Catalog";
import superwormImg from "../../assets/catalogs/superworm.webp";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";

export default function OrderNow() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const imageDictionary = {
    superworm: superwormImg,
    // "dubia": dubiaImg,
    // "mealworm": mealwormImg,
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));

        const productsArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProducts(productsArray);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="flex w-full h-screen items-center justify-center">
        <p className="text-green-800 font-bold animate-pulse">
          Loading Live Stock...
        </p>
      </div>
    );
  }

  return (
    <main className="page-container">
      <div className="flex flex-col items-center justify-center gap-2 text-center">
        <h1 className="text-2xl font-bold text-green-800">
          Make Your Order Now
        </h1>
        <p className="text-sm text-gray-600">
          Browse our catalog, build your order, and send it straight to our
          Messenger in seconds.
        </p>
      </div>
      <div className="flex flex-col md:flex-row w-full items-center justify-start gap-4 mt-4">
        {products.map((product, index) => {
          const resolvedImage = imageDictionary[product.productImage] || null;
          return (
            <Catalog
              key={index}
              productImage={resolvedImage}
              productName={product.productName}
              productDescription={product.productDescription}
              productBundleInfo={product.productBundleInfo}
              productFreebies={product.productFreebies}
            />
          );
        })}
      </div>
    </main>
  );
}
