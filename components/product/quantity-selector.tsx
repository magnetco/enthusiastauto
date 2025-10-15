"use client";

import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export function QuantitySelector({
  onChange,
}: {
  onChange: (qty: number) => void;
}) {
  const [quantity, setQuantity] = useState(1);

  const handleChange = (newQty: number) => {
    const validQty = Math.max(1, newQty);
    setQuantity(validQty);
    onChange(validQty);
  };

  return (
    <div className="mb-4">
      <label
        htmlFor="quantity"
        className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2 block"
      >
        Quantity
      </label>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => handleChange(quantity - 1)}
          disabled={quantity <= 1}
          className="flex items-center justify-center h-10 w-10 rounded-md border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Decrease quantity"
        >
          <MinusIcon className="h-4 w-4" />
        </button>
        <span
          id="quantity"
          className="w-16 text-center text-lg font-medium"
          aria-live="polite"
        >
          {quantity}
        </span>
        <button
          type="button"
          onClick={() => handleChange(quantity + 1)}
          className="flex items-center justify-center h-10 w-10 rounded-md border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          aria-label="Increase quantity"
        >
          <PlusIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
