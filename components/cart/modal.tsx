"use client";

import clsx from "clsx";
import { Dialog, Transition } from "@headlessui/react";
import { ShoppingCartIcon, XMarkIcon } from "@heroicons/react/24/outline";
import LoadingDots from "components/loading-dots";
import Price from "components/price";
import { DEFAULT_OPTION } from "lib/constants";
import { createUrl } from "lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { createCartAndSetCookie, redirectToCheckout } from "./actions";
import { useCart } from "./cart-context";
import { DeleteItemButton } from "./delete-item-button";
import { EditItemQuantityButton } from "./edit-item-quantity-button";
import OpenCart from "./open-cart";
import { parseFitmentTag } from "@/lib/utils/vehicle";
import { Badge } from "@/components/ui/badge";

type MerchandiseSearchParams = {
  [key: string]: string;
};

export default function CartModal() {
  const { cart, updateCartItem } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const quantityRef = useRef(cart?.totalQuantity);
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  useEffect(() => {
    if (!cart) {
      createCartAndSetCookie();
    }
  }, [cart]);

  useEffect(() => {
    if (
      cart?.totalQuantity &&
      cart?.totalQuantity !== quantityRef.current &&
      cart?.totalQuantity > 0
    ) {
      if (!isOpen) {
        setIsOpen(true);
      }
      quantityRef.current = cart?.totalQuantity;
    }
  }, [isOpen, cart?.totalQuantity, quantityRef]);

  return (
    <>
      <button aria-label="Open cart" onClick={openCart}>
        <OpenCart quantity={cart?.totalQuantity} />
      </button>
      <Transition show={isOpen}>
        <Dialog onClose={closeCart} className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="opacity-0 backdrop-blur-none"
            enterTo="opacity-100 backdrop-blur-[.5px]"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="opacity-100 backdrop-blur-[.5px]"
            leaveTo="opacity-0 backdrop-blur-none"
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="fixed bottom-0 right-0 top-0 flex h-full w-full flex-col border-l border-neutral-200 bg-white/80 p-4 text-black backdrop-blur-xl md:w-[390px] dark:border-neutral-700 dark:bg-black/80 dark:text-white">
              <div className="flex items-center justify-between mb-4">
                <p className="text-base font-semibold">My Cart</p>
                <button aria-label="Close cart" onClick={closeCart}>
                  <CloseCart />
                </button>
              </div>

              {!cart || cart.lines.length === 0 ? (
                <div className="mt-16 flex w-full flex-col items-center justify-center overflow-hidden px-4">
                  <ShoppingCartIcon className="h-12 text-neutral-400" />
                  <p className="mt-4 text-center text-lg font-semibold">
                    Your cart is empty
                  </p>
                  <p className="mt-1.5 text-center text-xs text-neutral-500 dark:text-neutral-400">
                    Add some premium BMW parts to get started
                  </p>
                  <Link href="/">
                    <button
                      onClick={closeCart}
                      className="mt-5 rounded-full bg-blue-600 px-5 py-2.5 text-xs font-medium text-white transition-all duration-200 hover:bg-blue-700"
                    >
                      Browse Products
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="flex h-full flex-col justify-between overflow-hidden">
                  <ul className="grow overflow-auto py-2">
                    {cart.lines
                      .sort((a, b) =>
                        a.merchandise.product.title.localeCompare(
                          b.merchandise.product.title,
                        ),
                      )
                      .map((item, i) => {
                        const merchandiseSearchParams =
                          {} as MerchandiseSearchParams;

                        item.merchandise.selectedOptions.forEach(
                          ({ name, value }) => {
                            if (value !== DEFAULT_OPTION) {
                              merchandiseSearchParams[name.toLowerCase()] =
                                value;
                            }
                          },
                        );

                        const merchandiseUrl = createUrl(
                          `/product/${item.merchandise.product.handle}`,
                          new URLSearchParams(merchandiseSearchParams),
                        );

                        return (
                          <li
                            key={i}
                            className="flex w-full flex-col border-b border-neutral-300 dark:border-neutral-700"
                          >
                            <div className="relative flex w-full flex-row justify-between gap-4 py-3">
                              <div className="flex flex-row gap-2.5">
                                <div className="relative h-14 w-14 flex-shrink-0 rounded-md border border-neutral-300 bg-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800">
                                  {/* Delete button overlaying image */}
                                  <div className="absolute left-1 top-1 z-40">
                                    <DeleteItemButton
                                      item={item}
                                      optimisticUpdate={updateCartItem}
                                    />
                                  </div>
                                  <Image
                                    className="h-full w-full object-contain"
                                    width={56}
                                    height={56}
                                    alt={
                                      item.merchandise.product.featuredImage
                                        .altText ||
                                      item.merchandise.product.title
                                    }
                                    src={
                                      item.merchandise.product.featuredImage.url
                                    }
                                  />
                                </div>
                                <Link
                                  href={merchandiseUrl}
                                  onClick={closeCart}
                                  className="z-30 flex flex-1 flex-row"
                                >
                                  <div className="flex flex-1 flex-col text-sm">
                                    <span className="leading-tight font-medium line-clamp-2">
                                      {item.merchandise.product.title}
                                    </span>
                                    {item.merchandise.title !==
                                    DEFAULT_OPTION ? (
                                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                                        {item.merchandise.title}
                                      </p>
                                    ) : null}
                                    {/* Fitment badge for BMW parts */}
                                    {(() => {
                                      const tags =
                                        item.merchandise.product.tags;
                                      const bmwTags = tags?.filter((tag) =>
                                        tag.startsWith("BMW"),
                                      );
                                      const fitmentTag = bmwTags?.[0];
                                      const parsedFitment = fitmentTag
                                        ? parseFitmentTag(fitmentTag)
                                        : null;

                                      if (parsedFitment) {
                                        return (
                                          <div className="mt-1">
                                            <Badge
                                              variant="secondary"
                                              className="text-[11px] h-5 px-1.5 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                                            >
                                              Fits: {parsedFitment.model}{" "}
                                              {parsedFitment.year}
                                            </Badge>
                                          </div>
                                        );
                                      } else if (
                                        tags?.some((tag) =>
                                          tag
                                            .toLowerCase()
                                            .includes("universal"),
                                        )
                                      ) {
                                        return (
                                          <div className="mt-1">
                                            <Badge
                                              variant="secondary"
                                              className="text-[11px] h-5 px-1.5"
                                            >
                                              Universal Fit
                                            </Badge>
                                          </div>
                                        );
                                      }
                                      return null;
                                    })()}
                                  </div>
                                </Link>
                              </div>
                              <div className="flex h-14 flex-col justify-between items-end">
                                <Price
                                  className="flex justify-end text-right text-sm font-semibold"
                                  amount={item.cost.totalAmount.amount}
                                  currencyCode={
                                    item.cost.totalAmount.currencyCode
                                  }
                                />
                                <div className="flex h-7 flex-row items-center rounded-full border border-neutral-200 dark:border-neutral-700">
                                  <EditItemQuantityButton
                                    item={item}
                                    type="minus"
                                    optimisticUpdate={updateCartItem}
                                  />
                                  <p className="w-6 text-center">
                                    <span className="w-full text-xs">
                                      {item.quantity}
                                    </span>
                                  </p>
                                  <EditItemQuantityButton
                                    item={item}
                                    type="plus"
                                    optimisticUpdate={updateCartItem}
                                  />
                                </div>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                  </ul>
                  <div className="py-3 text-xs text-neutral-400 dark:text-neutral-400 space-y-2">
                    <div className="flex items-center justify-between border-b border-neutral-200 pb-2 dark:border-neutral-700">
                      <p className="text-neutral-300 dark:text-neutral-300">Taxes</p>
                      <Price
                        className="text-right text-sm text-black dark:text-white font-semibold"
                        amount={cart.cost.totalTaxAmount.amount}
                        currencyCode={cart.cost.totalTaxAmount.currencyCode}
                      />
                    </div>
                    <div className="flex items-center justify-between border-b border-neutral-200 pb-2 dark:border-neutral-700">
                      <p className="text-neutral-300 dark:text-neutral-300">Shipping</p>
                      <p className="text-right text-xs text-neutral-300 dark:text-neutral-300">Calculated at checkout</p>
                    </div>
                    <div className="flex items-center justify-between border-b border-neutral-200 pb-2 dark:border-neutral-700">
                      <p className="font-medium text-neutral-200 dark:text-neutral-200">Total</p>
                      <Price
                        className="text-right text-base text-black dark:text-white font-semibold"
                        amount={cart.cost.totalAmount.amount}
                        currencyCode={cart.cost.totalAmount.currencyCode}
                      />
                    </div>
                  </div>
                  <form action={redirectToCheckout}>
                    <CheckoutButton />
                  </form>
                </div>
              )}
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}

function CloseCart({ className }: { className?: string }) {
  return (
    <div className="relative flex h-9 w-9 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors dark:border-neutral-700 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800">
      <XMarkIcon
        className={clsx(
          "h-5 transition-all ease-in-out hover:scale-110",
          className,
        )}
      />
    </div>
  );
}

function CheckoutButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="block w-full rounded-full bg-blue-600 p-2.5 text-center text-sm font-medium text-white opacity-90 hover:opacity-100 transition-opacity"
      type="submit"
      disabled={pending}
    >
      {pending ? <LoadingDots className="bg-white" /> : "Proceed to Checkout"}
    </button>
  );
}
