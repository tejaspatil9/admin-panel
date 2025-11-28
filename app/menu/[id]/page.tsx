// app/menu/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function DishListPage() {
  const { id } = useParams();
  const [category, setCategory] = useState<any>(null);
  const [dishes, setDishes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    async function loadData() {
      const { data: cat } = await supabase.from("categories").select("name").eq("id", id).single();
      setCategory(cat);
      const { data: dishData } = await supabase.from("dishes").select("*").eq("category_id", id);
      setDishes(dishData || []);
      setLoading(false);
    }
    loadData();
  }, [id]);

  return (
    <div className="p-4 sm:p-6">
      <nav className="flex items-center gap-3 mb-6 p-3 bg-white dark:bg-neutral-900 shadow-md rounded-lg">
        <Link href="/menu" className="text-lg font-semibold dark:text-white">← Back</Link>
        <Image src="/murli-logo.png" width={40} height={40} alt="Murli Logo" className="rounded-full" />
        <h1 className="text-2xl font-bold dark:text-white">{category?.name || "Loading..."}</h1>
      </nav>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => <div key={i} className="animate-pulse bg-gray-200 dark:bg-neutral-700 rounded-xl h-56" />)}
        </div>
      ) : (
        <>
          {dishes.length === 0 && <p className="text-center text-gray-500 dark:text-gray-300 mt-10">No dishes found in this category.</p>}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {dishes.map((dish: any) => (
              <div key={dish.id} className="bg-white dark:bg-neutral-800 rounded-xl overflow-hidden shadow hover:shadow-xl transition-all">
                <div className="w-full h-40 bg-gray-100 dark:bg-neutral-700 overflow-hidden">
                  {dish.imageurl ? (
                    <Image src={dish.imageurl} alt={dish.name} width={500} height={300} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                  )}
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-bold text-black dark:text-white">{dish.name}</h2>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">{dish.description}</p>
                  <p className="text-green-600 dark:text-green-400 font-bold mt-3 text-lg">₹ {dish.price}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
