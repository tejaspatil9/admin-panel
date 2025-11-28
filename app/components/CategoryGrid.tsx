"use client";

import React from "react";

type Category = {
  id: string;
  name: string;
  image?: string; // optional image url
};

export default function CategoryGrid({
  categories,
  onSelect,
}: {
  categories: Category[];
  onSelect?: (id: string) => void;
}) {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-4">Menu</h2>

      <div className="flex gap-8 items-end overflow-x-auto pb-3">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelect?.(c.id)}
            className="flex flex-col items-center text-center focus:outline-none"
          >
            <div className="w-28 h-20 md:w-32 md:h-24 border-4 border-black rounded-sm bg-white dark:bg-neutral-900 flex items-center justify-center overflow-hidden">
              {c.image ? (
                // If you later use next/image, swap this div with <Image ... />
                <img src={c.image} alt={c.name} className="object-cover w-full h-full" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">
                  Image
                </div>
              )}
            </div>
            <div className="mt-2 text-sm md:text-base font-medium">{c.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
