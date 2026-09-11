# Bagdad Bread Factory & Sweets

Large professional bakery website using the same file style as the existing project.

## Structure
- index.html — large homepage
- menu.html — full product menu + cart + checkout
- location.html — four branches
- my-orders.html — Google customer account
- order-status.html — order tracking
- location.js — branch data and rendering
- order-status.js — Firestore order lookup
- script.js — Firebase, products, cart, checkout and common interactions
- style.css — complete design system
- images/logo.jpg — Bagdad logo
- firebase.json — Firebase Hosting
- firestore.rules — Firestore security rules
- sitemap.xml — site URLs

## Branch data
Main, Oxygen, Nayer Hat and Jalalabad are included exactly with the supplied phone numbers and Maps links.

## Firebase
Project: bagdadbreadfactorybd

Before production:
1. Enable Google provider in Firebase Authentication.
2. Enable Firestore.
3. Deploy with Firebase CLI.
4. Configure your Firestore rules and admin custom claims for the future admin system.


## Menu update
The menu now uses the supplied menu items/prices and local bakery food photography under `images/`. See `image-sources.txt` for the source list.

## Management Panel
`admin.html` is now a responsive bakery management panel with role-based access and these modules:
- Dashboard: sales, orders, monthly revenue, expenses, profit/loss, low stock, pending deliveries and attendance.
- Inventory: raw/finished stock, minimum levels, supplier, branch stock, stock in/out and Factory → Branch transfer.
- Purchase & Cost Management: suppliers, invoices, purchase history and ingredient price increase alerts.
- Product Cost Calculator: recipe-based production cost using current ingredient prices plus electricity and labour.
- Branch Management: branch records and branch-scoped access for Branch Managers.
- Delivery Management: dispatch products, quantities, branch, driver, dispatch/received time and status.
- Staff Management: profiles, salary, working hours, leave, branch assignment and attendance with proof/photo URL.
- Order Management: customer orders plus manual/WhatsApp orders and status tracking.
- Reports: daily/weekly/monthly/custom sales, product/branch performance, expenses and profit/loss, Excel/PDF export.
- Smart Notifications: low stock, price increases, pending delivery/order and attendance alerts.
- Users & Roles: Super Admin, Manager, Branch Manager, Factory Staff, Staff, Attendance Staff, Delivery and Customer.
- Activity Log: records important management changes.

### New Firestore collections used by the panel
`inventory`, `stockMovements`, `stockTransfers`, `suppliers`, `purchases`, `productCosts`, `shipments`, `expenses`, `employees`, `attendance`, `activityLogs`, and `notifications`.

### Role setup
The panel reads the signed-in user's role from `users/{uid}.role`. For a Branch Manager, also set `users/{uid}.branchId` to the branch document ID. The included `firestore.rules` enforces role/branch access at Firestore level; UI hiding alone is not relied on for security.

### Important production setup
1. Deploy the included Firestore rules: `firebase deploy --only firestore:rules`.
2. Enable Email/Password and/or Google Authentication in Firebase Authentication.
3. Create at least one `admin` user document in `users/{uid}` before using the management panel.
4. For branch users, set both `role` and `branchId` in their user document.
5. Attendance proof currently accepts a URL. If you want direct photo uploads, enable Firebase Storage and add Storage rules/upload code.
6. The PDF/Excel buttons use SheetJS and jsPDF from CDN, so the browser needs internet access for exports.

## 2026-09-10 update
- Removed the Cake Studio page and all customer-facing Cake Studio navigation/CTAs.
- Menu checkout now allows Pickup or Delivery; delivery fee/time should be confirmed by the bakery team.
- Customer menu now attempts to load the Firestore `products` collection first, with the bundled catalog as a compatibility fallback.
- Added `products-seed.json` containing the bundled catalog for populating Firestore.
- Kept guest order tracking compatible; review the `orders` read rule before production because public `get` access is still intentionally retained for guest tracking.

### Product catalog migration
Upload the documents in `products-seed.json` into Firestore collection `products` using each object's `id` as the document ID. Once that collection has documents, the customer site will use Firestore product data (price, name, category, image, stock, tag).
