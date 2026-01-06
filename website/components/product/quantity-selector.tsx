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
    <div>
      <label
        htmlFor="quantity"
        className="mb-2 block text-sm font-medium text-neutral-900"
      >
        Quantity
      </label>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => handleChange(quantity - 1)}
          disabled={quantity <= 1}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-700 transition-all hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Decrease quantity"
        >
          <MinusIcon className="h-4 w-4" />
        </button>
        <span
          id="quantity"
          className="w-12 text-center text-lg font-semibold text-neutral-900"
          aria-live="polite"
        >
          {quantity}
        </span>
        <button
          type="button"
          onClick={() => handleChange(quantity + 1)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-700 transition-all hover:bg-neutral-50"
          aria-label="Increase quantity"
        >
          <PlusIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
