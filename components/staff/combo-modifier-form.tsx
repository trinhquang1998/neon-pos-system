"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Minus, Plus } from "lucide-react";
import { comboDetails } from "@/lib/mock-data";
import { getProductImage } from "@/lib/product-images";
import type { Product } from "@/lib/types";
import { cn, formatCurrency } from "@/lib/utils";

interface ComboItem {
  slot: number;
  productId: string;
  name: string;
  price: number;
}

export function ComboModifierForm({
  product,
  onAdd,
  onCancel,
  allProducts = [],
}: {
  product: Product;
  onAdd: (p: {
    quantity: number;
    comboItems: ComboItem[];
    price: number;
    modifierLabels: string[];
  }) => void;
  onCancel: () => void;
  allProducts?: Product[];
}) {
  const [quantity, setQuantity] = useState(1);
  const [expandedSlot, setExpandedSlot] = useState<number | null>(0);
  const [selectedItems, setSelectedItems] = useState<Map<number, string>>(new Map());

  const combo = useMemo(() => {
    return comboDetails.find((c) => c.comboId === product.id);
  }, [product.id]);

  if (!combo) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <p className="text-red-500">Combo không tìm thấy</p>
      </div>
    );
  }

  const comboItems: ComboItem[] = [];
  let isValid = true;

  combo.slots.forEach((slot, slotIndex) => {
    const selectedProductId = selectedItems.get(slotIndex);
    if (!selectedProductId) {
      isValid = false;
    } else {
      const prod = allProducts.find((p: any) => p.id === selectedProductId);
      if (prod) {
        comboItems.push({
          slot: slotIndex,
          productId: selectedProductId,
          name: prod.name,
          price: prod.price,
        });
      }
    }
  });

  const totalComboPrice = comboItems.reduce((sum, item) => sum + item.price, 0);
  const discountAmount = (totalComboPrice * combo.discount) / 100;
  const finalPrice = totalComboPrice - discountAmount;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden lg:grid-cols-3">
        {/* Left: Product Image */}
        <div className="border-b p-4 lg:border-b-0 lg:border-r">
          <img
            src={product.image ?? getProductImage(product.id)}
            alt=""
            className="mx-auto aspect-square max-h-48 w-full max-w-[200px] rounded-2xl object-cover"
          />
          <h1 className="mt-4 text-center text-xl font-bold">{product.name}</h1>
          <p className="text-center text-xs text-gray-500 mt-2">{combo.description}</p>
          <div className="mt-4 flex justify-center gap-3">
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-xl border"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="flex w-10 items-center justify-center text-xl font-bold">{quantity}</span>
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-xl border"
              onClick={() => setQuantity((q) => q + 1)}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Middle: Combo Slots Selection */}
        <div className="overflow-auto border-b p-4 lg:border-b-0 lg:border-r">
          <p className="text-xs font-bold uppercase text-gray-600">Chọn sản phẩm</p>
          <div className="mt-3 space-y-3">
            {combo.slots.map((slot, slotIndex) => {
              const selectedProductId = selectedItems.get(slotIndex);
              const selectedProduct = allProducts.find((p: any) => p.id === selectedProductId);

              return (
                <div key={slotIndex} className="border rounded-lg overflow-hidden">
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedSlot(expandedSlot === slotIndex ? null : slotIndex)
                    }
                    className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100"
                  >
                    <div className="text-left">
                      <p className="text-xs font-semibold text-gray-600">
                        {slot.category} ({slot.quantity} {slot.quantity === 1 ? "cái" : "cái"})
                      </p>
                      <p className="text-sm font-medium mt-1">
                        {selectedProduct?.name || "Chưa chọn"}
                      </p>
                    </div>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition",
                        expandedSlot === slotIndex && "rotate-180"
                      )}
                    />
                  </button>

                  {expandedSlot === slotIndex && (
                    <div className="p-3 space-y-2 bg-white border-t">
                      {slot.productIds.map((productId) => {
                        const prod = allProducts.find((p: any) => p.id === productId);
                        if (!prod) return null;

                        return (
                          <button
                            key={productId}
                            type="button"
                            onClick={() => {
                              const newMap = new Map(selectedItems);
                              newMap.set(slotIndex, productId);
                              setSelectedItems(newMap);
                              setExpandedSlot(null);
                            }}
                            className={cn(
                              "w-full flex items-center justify-between p-2 rounded-lg border text-sm transition",
                              selectedProductId === productId
                                ? "border-black bg-black text-white"
                                : "border-gray-200 hover:border-gray-300"
                            )}
                          >
                            <span>{prod.name}</span>
                            <span className="text-xs">
                              {formatCurrency(prod.price)}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Summary */}
        <div className="flex flex-col p-4">
          <p className="text-xs font-bold uppercase text-gray-600">Chi tiết combo</p>
          <div className="mt-3 space-y-2 flex-1">
            {comboItems.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-sm border-b pb-2"
              >
                <span>{item.name}</span>
                <span className="font-medium">{formatCurrency(item.price)}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-2 border-t pt-3">
            <div className="flex justify-between text-sm">
              <span>Tổng:</span>
              <span>{formatCurrency(totalComboPrice)}</span>
            </div>
            <div className="flex justify-between text-sm text-green-600">
              <span>Giảm ({combo.discount}%):</span>
              <span>-{formatCurrency(discountAmount)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span>Thành tiền:</span>
              <span>{formatCurrency(finalPrice)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer: Actions */}
      <div className="flex gap-2 border-t p-4">
        <button
          type="button"
          onClick={onCancel}
          className="min-h-[52px] flex-1 rounded-xl border font-semibold"
        >
          Hủy
        </button>
        <button
          type="button"
          disabled={!isValid}
          onClick={() => {
            onAdd({
              quantity,
              comboItems,
              price: finalPrice,
              modifierLabels: [`Combo ${combo.name}`, `Giảm ${combo.discount}%`],
            });
          }}
          className={cn(
            "min-h-[52px] flex-[2] rounded-xl font-bold text-white",
            isValid ? "bg-black" : "bg-gray-300 cursor-not-allowed"
          )}
        >
          {isValid
            ? `Thêm vào giỏ · ${formatCurrency(finalPrice * quantity)}`
            : "Chọn đủ sản phẩm"}
        </button>
      </div>
    </div>
  );
}
