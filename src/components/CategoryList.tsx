import { wixClientServer } from "@/lib/wixClientServer";
import Link from "next/link";

const CategoryList = async () => {
  let cats;
  try {
    const wixClient = await wixClientServer();
    cats = await wixClient.collections.queryCollections().find();
  } catch (error) {
    console.error("Error fetching categories:", error);
    return <p>Error loading categories.</p>;
  }

  // Provera da li cats.items postoji pre mapiranja
  if (!cats || !cats.items || cats.items.length === 0) {
    return <p>No categories found.</p>;
  }

  return (
    <div className="px-4 overflow-x-scroll scrollbar-hide">
      <div className="flex gap-4 md:gap-8">
        {cats.items.map((item) => (
          <Link
            href={`/list?cat=${item.slug}`}
            className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/4 xl:w-1/6"
            key={item._id}
          >
            <div className="relative bg-slate-100 w-full h-96">
              <img
                src={item.media?.mainMedia?.image?.url || "/category.png"}
                alt=""
                className="object-cover w-full h-full"
              />
            </div>
            <h1 className="mt-8 font-light text-xl tracking-wide">
              {item.name}
            </h1>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
