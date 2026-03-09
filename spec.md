# Pretty Little Things

## Current State
A kawaii accessories shop with user login/register (email + custom password stored in backend), products page, cart, wishlist, order (COD, Salem only), admin panel, and owner-only product adding. Login/register currently uses non-stable in-memory Maps, so all user accounts are lost every time the backend is redeployed.

## Requested Changes (Diff)

### Add
- Stable storage for all Maps and counters so user accounts, orders, products, and login logs persist across redeploys/upgrades

### Modify
- All `let` Maps and `var` counters in the backend become `stable` so they survive upgrades

### Remove
- Nothing

## Implementation Plan
1. Regenerate backend Motoko with all Maps and counters declared as `stable`
2. Keep all existing types, functions, and logic identical -- only the storage persistence changes
