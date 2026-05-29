"use client";

import { useEffect, useRef } from "react";
import QRCode from "qrcode";
import { formatCurrency } from "@/lib/utils";
import type { CartItem } from "@/lib/types";

interface BillProps {
  items: CartItem[];
  subtotal: number;
  discount: number;
  discountLabel?: string;
  total: number;
  method: string;
  pagerId?: string;
  orderId?: string;
}

export function PrintBill({
  items,
  subtotal,
  discount,
  discountLabel,
  total,
  method,
  pagerId,
  orderId,
}: BillProps) {
  const qrRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (qrRef.current && method === "qr") {
      // Tạo QR code cho thanh toán
      const paymentUrl = `https://payment.example.com?amount=${total}&orderId=${orderId || "pending"}`;
      QRCode.toCanvas(qrRef.current, paymentUrl, { width: 200, margin: 1 }, (error) => {
        if (error) console.error(error);
      });
    }
  }, [total, orderId, method]);

  return (
    <div className="w-80 bg-white text-black p-4 font-mono text-sm print:p-0 print:text-xs">
      {/* Header */}
      <div className="text-center border-b pb-3 mb-3">
        <h1 className="font-bold text-lg print:text-base">NEON COFFEE</h1>
        <p className="text-xs text-gray-600">Lê Lợi, Q.1, TPHCM</p>
        {orderId && <p className="text-xs text-gray-600">Đơn #: {orderId}</p>}
        <p className="text-xs text-gray-600">{new Date().toLocaleString("vi-VN")}</p>
      </div>

      {/* Items */}
      <div className="border-b pb-3 mb-3">
        <table className="w-full">
          <tbody>
            {items.map((item) => (
              <tr key={item.lineId} className="text-xs">
                <td className="text-left">{item.quantity}x</td>
                <td className="text-left flex-1 px-1">{item.name}</td>
                <td className="text-right">{formatCurrency(item.price * item.quantity)}</td>
              </tr>
            ))}
            {items.map((item) =>
              item.modifierLabels?.map((label) => (
                <tr key={`${item.lineId}-${label}`} className="text-xs text-gray-600">
                  <td colSpan={3} className="text-left pl-4">
                    • {label}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="border-b pb-3 mb-3 space-y-1">
        <div className="flex justify-between">
          <span>Tạm tính:</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>{discountLabel || "Giảm"}:</span>
            <span>-{formatCurrency(discount)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-base">
          <span>Tổng cộng:</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>

      {/* Payment Method */}
      <div className="border-b pb-3 mb-3">
        <p className="text-xs">Thanh toán: <strong>{getMethodLabel(method)}</strong></p>
      </div>

      {/* QR Code for Payment */}
      {method === "qr" && (
        <div className="text-center border-b pb-3 mb-3">
          <p className="text-xs mb-2 font-bold">Quét mã QR để thanh toán</p>
          <div className="flex justify-center">
            <canvas ref={qrRef} />
          </div>
          <p className="text-xs text-gray-600 mt-2">Số tiền: {formatCurrency(total)}</p>
        </div>
      )}

      {/* Pager */}
      {pagerId && (
        <div className="text-center border-b pb-3 mb-3">
          <p className="text-xs">Pager số:</p>
          <p className="text-3xl font-bold print:text-2xl">{pagerId}</p>
        </div>
      )}

      {/* Footer */}
      <div className="text-center text-xs text-gray-600">
        <p>Cảm ơn bạn đã mua hàng!</p>
        <p>Vui lòng lấy đơn khi thấy số pager</p>
        <p className="mt-2 text-gray-500">{new Date().toLocaleTimeString("vi-VN")}</p>
      </div>
    </div>
  );
}

function getMethodLabel(method: string): string {
  const labels: Record<string, string> = {
    cash: "Tiền mặt",
    card: "Thẻ ngân hàng",
    qr: "QR Code",
    ewallet: "Ví điện tử",
    transfer: "Chuyển khoản",
    split: "Chia thanh toán",
  };
  return labels[method] || method;
}
