import { SessionEvent, BehaviorSignals } from "@/types";

export function processEvents(events: SessionEvent[]): BehaviorSignals {
  const productViews: string[] = [];
  let searches = 0;
  let cartCount = 0;
  let checkoutStarted = false;
  let purchaseCompleted = false;
  let cartAbandoned = false;
  let wishlistAdds = 0;
  let couponSearches = 0;
  let discountClicks = 0;
  let categoryBrowses = 0;
  let priceSorts = 0;
  let pageViews = 0;
  let hasPreviousSession = false;

  for (const event of events) {
    switch (event.type) {
      case "page_view":
        pageViews++;
        break;
      case "search":
        searches++;
        const q = (event.query || "").toLowerCase();
        if (
          q.includes("coupon") ||
          q.includes("discount") ||
          q.includes("promo") ||
          q.includes("sale") ||
          q.includes("deal")
        ) {
          couponSearches++;
        }
        break;
      case "product_view":
        if (event.product) productViews.push(event.product.toLowerCase());
        break;
      case "add_to_cart":
        cartCount++;
        break;
      case "cart_abandon":
        cartAbandoned = true;
        break;
      case "checkout_start":
        checkoutStarted = true;
        break;
      case "purchase":
        purchaseCompleted = true;
        break;
      case "wishlist_add":
        wishlistAdds++;
        break;
      case "coupon_search":
        couponSearches++;
        break;
      case "discount_click":
        discountClicks++;
        break;
      case "category_browse":
        categoryBrowses++;
        break;
      case "price_sort":
        priceSorts++;
        break;
    }
  }

  const uniqueProducts = new Set(productViews);
  const repeatViews = productViews.length - uniqueProducts.size;

  // Estimate session duration: ~40s per event on average
  const estimatedMinutes = Math.round((events.length * 40) / 60);

  return {
    total_events: events.length,
    page_views: pageViews,
    unique_products_viewed: uniqueProducts.size,
    repeat_product_views: repeatViews,
    searches,
    add_to_cart: cartCount > 0,
    cart_count: cartCount,
    checkout_started: checkoutStarted,
    purchase_completed: purchaseCompleted,
    cart_abandoned: cartAbandoned,
    wishlist_adds: wishlistAdds,
    coupon_searches: couponSearches,
    discount_clicks: discountClicks,
    category_browses: categoryBrowses,
    price_sorts: priceSorts,
    has_previous_session: hasPreviousSession,
    estimated_session_minutes: estimatedMinutes,
  };
}
