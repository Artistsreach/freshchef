import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { appsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getUser } from "@/auth/stack-auth";

export async function POST(req: Request) {
  try {
    const user = await getUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { appId, title, description, price, subscriptionDetails } = body;

    if (!appId || !title || !description || price === undefined || !subscriptionDetails) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Verify the user has permission to update this app
    const app = await db.query.appsTable.findFirst({
      where: (appsTable, { eq }) => eq(appsTable.id, appId),
    });

    if (!app) {
      return new NextResponse("App not found", { status: 404 });
    }

    // Create a product in Stripe
    const product = await stripe.products.create({
      name: title,
      description: `${description}\n\n${subscriptionDetails}`,
      metadata: {
        appId,
      },
    });

    // Create a price for the product
    const stripePrice = await stripe.prices.create({
      product: product.id,
      unit_amount: Math.round(price * 100), // Convert to cents
      currency: "usd",
      recurring: {
        interval: "month",
      },
    });

    // Update the app in the database with the Stripe product ID
    await db
      .update(appsTable)
      .set({
        stripeProductId: product.id,
        stripePriceId: stripePrice.id,
        isMonetized: true,
        subscriptionDetails,
      })
      .where(eq(appsTable.id, appId));

    return NextResponse.json({
      productId: product.id,
      priceId: stripePrice.id,
    });
  } catch (error) {
    console.error("Error creating Stripe product:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
