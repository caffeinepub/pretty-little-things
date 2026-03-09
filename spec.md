# Pretty Little Things

## Current State
- Full-stack accessories shop with Home (login/register), Products, Cart, Order, Confirmation, and Admin pages.
- Auth uses email/password stored in the backend. AuthContext holds userEmail and isAdminLoggedIn.
- Products page shows all products in a grid with category filters; no admin-only controls.
- Login has basic error handling with a generic catch toast.
- No social sharing feature exists.
- Email feature is disabled (paid only) -- real email notifications cannot be sent.

## Requested Changes (Diff)

### Add
- **Share button**: A "Share" button (using Web Share API with fallback to clipboard copy) on the site -- placed in the Navigation bar or as a floating button. Shares the shop URL and name.
- **Network error handling on login**: Detect network/fetch errors specifically during login and show a distinct "Network issue -- check your connection and try again" toast instead of the generic error.
- **Owner-only Add Product button on Products page**: An "Add Product" button visible only when the admin (owner) is logged in (isAdminLoggedIn === true). Opens a modal/form to add a new product. Uses the existing backend product data model.

### Modify
- **Login error handling**: Wrap the login catch block to check for network errors (TypeError / "Failed to fetch") and show a specific network error message.
- **Products page**: Import useAuth, check isAdminLoggedIn, show "Add Product" button in the header area only for owner.
- **Navigation**: Add a Share button/icon to the nav bar.

### Remove
- Nothing removed.

## Implementation Plan
1. Update `HomePage.tsx` login catch block to detect network errors and show a tailored toast.
2. Update `ProductsPage.tsx`:
   - Import useAuth
   - Show "Add Product" button only when isAdminLoggedIn is true
   - Add a modal form (name, description, price, category, imageUrl) that calls a backend addProduct endpoint if available, or stores locally
3. Update `Navigation.tsx` (or a suitable location) to add a Share button using the Web Share API; fallback to copying the URL to clipboard with a toast confirmation.
4. Note in the UI (admin panel or register success toast) that login/register notifications are tracked in the Admin panel (real email is a paid feature -- not available here).
