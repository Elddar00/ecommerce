import CategoryList from "@/components/CategoryList";
import ProductList from "@/components/ProductList";
import Skeleton from "@/components/Skeleton";
import Slider from "@/components/Slider";
import { wixClientServer } from "@/lib/wixClientServer";
import { Suspense } from "react";

const HomePage = async () => {
  try {
    console.log("Fetching categories during SSR...");
    const wixClient = await wixClientServer();
    const categories = await wixClient.collections.queryCollections().find();

    return (
      <div className="">
        <Slider />
        <div className="mt-24 px-4 md:px-8 xl:px-32 2xl:px-64">
          <h1 className="text-2xl">Featured Products</h1>
          {/* <Suspense fallback={<Skeleton />}>
            <ProductList
              categoryId={process.env.FEATURED_PRODUCTS_CATEGORY_ID!}
              limit={4}
            />
          </Suspense> */}
        </div>
        <div className="mt-24">
          <h1 className="text-2xl px-4 md:px-8 xl:px-32 2xl:px-64 mb-12">
            Categories
          </h1>
          <Suspense fallback={<Skeleton />}>
            <CategoryList categories={categories.items} />
          </Suspense>
        </div>
        <div className="mt-24 px-4 md:px-8 xl:px-32 2xl:px-64">
          <h1 className="text-2xl">New Products</h1>
          {/* <ProductList
            categoryId={process.env.FEATURED_PRODUCTS_CATEGORY_ID!}
            limit={4}
          /> */}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching categories:", error);
    return (
      <div>
        <h1>Error loading categories</h1>
      </div>
    );
  }
};

export default HomePage;
