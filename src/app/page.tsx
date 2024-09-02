import CategoryList from "@/components/CategoryList";
import ProductList from "@/components/ProductList";
import Skeleton from "@/components/Skeleton";
import Slider from "@/components/Slider";
import { wixClientServer } from "@/lib/wixClientServer";
import { Suspense } from "react";

const HomePage = async () => {
  // Preuzmite podatke sa servera
  const wixClient = await wixClientServer();
  const catsResponse = await wixClient.collections.queryCollections().find();
  const cats = catsResponse.items;

  // Konvertovanje Collection[] u Category[]
  const categories = cats.map((item) => ({
    _id: item._id || "", // Pretvorite u string ako je null
    slug: item.slug || "", // Pretvorite u string ako je null
    name: item.name,
    media: item.media,
  }));

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
      <div className="mt-24 ">
        <h1 className="text-2xl  px-4 md:px-8 xl:px-32 2xl:px-64 mb-12">
          Categories
        </h1>
        <Suspense fallback={<Skeleton />}>
          <CategoryList cats={categories} />
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
};

export default HomePage;
