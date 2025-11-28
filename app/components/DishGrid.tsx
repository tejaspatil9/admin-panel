"use client";

import React from "react";

type Dish = {
  id: string;
  name: string;
  price?: number | string;
  image?: string;
};

export default function DishGrid({
  dishes,
  columns = 3,
}: {
  dishes: Dish[];
  columns?: number;
}) {
  const colClass =
    columns === 1 ? "grid-cols-1" : columns === 2 ? "grid-cols-2" : "grid-cols-3";
  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className={`grid ${colClass} gap-6`}>
        {dishes.map((d) => (
          <div
            key={d.id}
            className="border rounded-md p-3 flex flex-col items-center bg-white dark:bg-neutral-900"
          >
            <div className="w-full h-36 border-2 border-black rounded-sm overflow-hidden mb-3 flex items-center justify-center bg-gray-50 dark:bg-neutral-800">
              {d.image ? (
                <img src={d.image} alt={d.name} className="object-cover w-full h-full" />
              ) : (
                <div className="text-gray-400">No image</div>
              )}
            </div>
            <div className="w-full flex items-center justify-between">
              <div className="text-sm font-medium">{d.name}</div>
              <div className="text-sm font-semibold">₹{d.price ?? ""}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
