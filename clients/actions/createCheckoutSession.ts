"use server";

import stripe from "../lib/stripe";
import { Address } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import { CartItem } from "@/store";
import Stripe from "stripe";

export interface Metadata {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerId?: string; // this is actually your app's userId
  address?: Address | null;
}

export interface GroupedCartItems {
  product: CartItem["product"];
  quantity: number;
}

export async function createCheckoutSession(
  items: GroupedCartItems[],
  metadata: Metadata
) {
  try {
    const customers = await stripe.customers.list({
      email: metadata.customerEmail,
      limit: 1,
    });
    const customerId = customers?.data?.length > 0 ? customers.data[0].id : "";

    const sessionMetadata: Record<string, string> = {
      orderNumber: metadata.orderNumber,
      customerName: metadata.customerName,
      customerEmail: metadata.customerEmail,
      address: JSON.stringify(metadata.address),
    };
    if (metadata.customerId) {
      sessionMetadata.userId = metadata.customerId; // rename to userId for Sanity schema
    }

    const sessionPayload: Stripe.Checkout.SessionCreateParams = {
      metadata: sessionMetadata,
      mode: "payment",
      allow_promotion_codes: true,
      payment_method_types: ["card"],
      invoice_creation: { enabled: true },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}&orderNumber=${metadata.orderNumber}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
      line_items: items.map((item) => ({
        price_data: {
          currency: "USD",
          unit_amount: Math.round(Number(item.product.price) * 100),
          product_data: {
            name: item.product.name || "Unknown Product",
            description: item.product.description,
            metadata: { id: item.product._id },
            images:
              item.product.images && item.product.images.length > 0
                ? [urlFor(item.product.images[0]).url()]
                : [],
          },
        },
        quantity: item.quantity,
      })),
    };

    if (customerId) {
      sessionPayload.customer = customerId;
    } else {
      sessionPayload.customer_email = metadata.customerEmail;
    }

    const session = await stripe.checkout.sessions.create(sessionPayload);
    return session.url;
  } catch (error) {
    console.error("Error creating Checkout Session", error);
    throw error;
  }
}
