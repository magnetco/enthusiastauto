"use client";

import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { addItem } from "components/cart/actions";
import { useProduct } from "components/product/product-context";
import { Product, ProductVariant } from "lib/shopify/types";
import { useActionState, useState } from "react";
import { useCart } from "./cart-context";
import { QuantitySelector } from "components/product/quantity-selector";

function SubmitButton({
  availableForSale,
  selectedVariantId,
}: {
  availableForSale: boolean;
  selectedVariantId: string | undefined;
}) {
  const baseClasses =
    "relative flex w-full items-center justify-center gap-2 rounded-lg px-6 py-4 text-sm font-semibold tracking-wide transition-all duration-200";

  if (!availableForSale) {
    return (
      <button
        disabled
        className={clsx(
          baseClasses,
          "cursor-not-allowed border border-border bg-muted text-muted-foreground"
        )}
      >
        Out Of Stock
      </button>
    );
  }

  if (!selectedVariantId) {
    return (
      <button
        aria-label="Please select an option"
        disabled
        className={clsx(
          baseClasses,
          "cursor-not-allowed border border-border bg-muted text-muted-foreground"
        )}
      >
        <ShoppingCartIcon className="h-5 w-5" />
        Select Options
      </button>
    );
  }

  return (
    <button
      aria-label="Add to cart"
      className={clsx(
        baseClasses,
        "bg-foreground text-background hover:bg-foreground/90 active:scale-[0.98]"
      )}
    >
      <ShoppingCartIcon className="h-5 w-5" />
      Add To Cart
    </button>
  );
}

export function AddToCart({ product }: { product: Product }) {
  const { variants, availableForSale } = product;
  const { addCartItem } = useCart();
  const { state } = useProduct();
  const [message, formAction] = useActionState(addItem, null);
  const [quantity, setQuantity] = useState(1);

  const variant = variants.find((variant: ProductVariant) =>
    variant.selectedOptions.every(
      (option) => option.value === state[option.name.toLowerCase()],
    ),
  );
  const defaultVariantId = variants.length === 1 ? variants[0]?.id : undefined;
  const selectedVariantId = variant?.id || defaultVariantId;
  const addItemAction = formAction.bind(null, selectedVariantId);
  const finalVariant = variants.find(
    (variant) => variant.id === selectedVariantId,
  )!;

  return (
    <form
      action={async () => {
        // Add items based on selected quantity
        for (let i = 0; i < quantity; i++) {
          addCartItem(finalVariant, product);
        }
        addItemAction();
      }}
      className="space-y-4"
    >
      <QuantitySelector onChange={setQuantity} />
      <SubmitButton
        availableForSale={availableForSale}
        selectedVariantId={selectedVariantId}
      />
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}
