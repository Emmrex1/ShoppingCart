
"use server";

import { Metadata } from "@/actions/createCheckoutSession";
import { backendClient } from "@/lib/backendClient";
import stripe from "@/lib/stripe";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  console.log("Webhook endpoint called");
  const body = await req.text();
  const headersList = await headers();
  const sig = headersList.get("stripe-signature");

  if (!sig) {
    return NextResponse.json(
      { error: "No Signature found for stripe" },
      { status: 400 }
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.log("Stripe webhook secret is not set");
    return NextResponse.json(
      {
        error: "Stripe webhook secret is not set",
      },
      { status: 400 }
    );
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json(
      {
        error: `Webhook Error: ${error}`,
      },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const invoice = session.invoice
      ? await stripe.invoices.retrieve(session.invoice as string)
      : null;

    try {
      await createOrderInSanity(session, invoice);
    } catch (error) {
      console.error("Error creating order in sanity:", error);
      return NextResponse.json(
        {
          error: `Error creating order: ${error}`,
        },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}

async function createOrderInSanity(
  session: Stripe.Checkout.Session,
  invoice: Stripe.Invoice | null
) {
  const {
    id,
    amount_total,
    currency,
    metadata,
    payment_intent,
    total_details,
    customer
  } = session;

  const { orderNumber, customerName, customerEmail, customerId, address } =
    metadata as unknown as Metadata & { address: string };
  
  const parsedAddress = address ? safeJsonParse(address) : null;

  const lineItemsWithProduct = await stripe.checkout.sessions.listLineItems(
    id,
    { expand: ["data.price.product"] }
  );

  // Create Sanity product references and prepare stock updates
  const sanityProducts: Array<any> = [];
  const stockUpdates: Array<{ productId: string; quantity: number }> = [];
  
  for (const item of lineItemsWithProduct.data) {
    const productId = (item.price?.product as Stripe.Product)?.metadata?.id;
    const quantity = item?.quantity || 0;

    if (!productId) continue;

    sanityProducts.push({
      _key: randomUUID(),
      product: {
        _type: "reference",
        _ref: productId,
      },
      quantity,
    });
    stockUpdates.push({ productId, quantity });
  }

  // Prepare order data
  const orderData = {
    _type: "order",
    orderNumber,
    stripeCheckoutSessionId: id,
    stripePaymentIntentId: payment_intent,
    customerName,
    stripeCustomerId: customer || customerEmail,
    userId: customerId || undefined, // Handle guest orders
    email: customerEmail,
    currency,
    amountDiscount: total_details?.amount_discount
      ? total_details.amount_discount / 100
      : 0,
    products: sanityProducts,
    totalPrice: amount_total ? amount_total / 100 : 0,
    status: "paid",
    orderDate: new Date().toISOString(),
    invoice: invoice
      ? {
          id: invoice.id,
          number: invoice.number,
          hosted_invoice_url: invoice.hosted_invoice_url,
        }
      : null,
    address: parsedAddress
      ? {
          state: parsedAddress.state,
          zip: parsedAddress.zip,
          city: parsedAddress.city,
          address: parsedAddress.address,
          name: parsedAddress.name,
        }
      : null,
  };

  console.log("Creating order in Sanity:", JSON.stringify(orderData, null, 2));

  try {
    const order = await backendClient.create(orderData);
    console.log("Order created in Sanity:", order);

    // Update stock levels in Sanity
    await updateStockLevels(stockUpdates);
    return order;
  } catch (error) {
    console.error("Failed to create order in Sanity:", error);
    throw error;
  }
}

async function updateStockLevels(
  stockUpdates: { productId: string; quantity: number }[]
) {
  for (const { productId, quantity } of stockUpdates) {
    try {
      const product = await backendClient.getDocument(productId);

      if (!product || typeof product.stock !== "number") {
        console.warn(
          `Product with ID ${productId} not found or stock is invalid.`
        );
        continue;
      }

      const newStock = Math.max(product.stock - quantity, 0);
      await backendClient.patch(productId).set({ stock: newStock }).commit();
    } catch (error) {
      console.error(`Failed to update stock for product ${productId}:`, error);
    }
  }
}

function safeJsonParse(str: string) {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
}