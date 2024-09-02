"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const CategoryList = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();
        console.log("Fetched categories:", data);
        setCategories(data);
      } catch (error) {
        console.error("Greška prilikom preuzimanja kategorija:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="px-4 overflow-x-scroll scrollbar-hide">
      <div className="flex gap-4 md:gap-8">
        {categories.map((item: any) => {
          const imageUrl = item.media?.mainMedia?.image?.url || "/category.png";
          console.log("Category item:", item);
          console.log("Image URL:", imageUrl);
          return (
            <Link
              href={`/list?cat=${item.slug}`}
              className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/4 xl:w-1/6"
              key={item._id}
            >
              <div className="relative bg-slate-100 w-full h-96">
                <Image
                  src={imageUrl}
                  alt={item.name || "Category Image"}
                  fill
                  sizes="20vw"
                  className="object-cover"
                  priority // Dodajte priority ako je potrebno
                />
              </div>
              <h1 className="mt-8 font-light text-xl tracking-wide">
                {item.name}
              </h1>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryList;
