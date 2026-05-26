"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ModifierForm } from "@/components/staff/modifier-form";
import { useNeonStore } from "@/store/neon-store";

function Content() {
  const router = useRouter();
  const productId = useSearchParams().get("productId");
  const products = useNeonStore((s) => s.products);
  const addToCart = useNeonStore((s) => s.addToCart);
  const product = products.find((p) => p.id === productId);

  if (!product) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <Link href="/staff/pos" className="underline">Về POS</Link>
      </div>
    );
  }

  return (
    <ModifierForm
      product={product}
      onCancel={() => router.push("/staff/pos")}
      onAdd={({ quantity, modifiers, price, modifierLabels }) => {
        addToCart({
          productId: product.id,
          name: product.name,
          basePrice: product.price,
          price,
          quantity,
          modifiers,
          modifierLabels,
        });
        router.push("/staff/pos");
      }}
    />
  );
}

export default function ModifierPage() {
  return (
    <Suspense fallback={<div className="p-6">Đang tải...</div>}>
      <Content />
    </Suspense>
  );
}
