# Role-Based Access Control (RBAC) System

## 🎯 Overview

This application implements a **centralized Role-Based Access Control (RBAC)** system to secure dashboard routes. All role configurations are managed in **ONE file**, making it easy to update permissions without modifying multiple components.

---

## 📁 Key Files

### 1. **`src/lib/route-access.ts`** ⭐ (MAIN CONFIGURATION FILE)
This is the **single source of truth** for all route permissions. Update this file to change access control for any route.

```typescript
export const ROUTE_ACCESS_MAP: RouteAccess[] = [
  {
    path: "/dashboard/users",
    allowedRoles: ["admin", "staff"],
    description: "User management - admin and staff only",
  },
  // Add or modify routes here
];
```

### 2. **`src/components/auth/RoleGuard.tsx`**
React component that protects routes based on user roles. Uses the centralized config automatically.

### 3. **`src/middleware.ts`**
Server-side middleware that checks authentication before accessing dashboard routes.

### 4. **`src/app/(dashboard)/dashboard/_components/nav-config.ts`**
Defines navigation items and their role requirements.

---

## 🚀 How to Use

### Protecting a Page (Recommended - Auto Mode)

Simply wrap your page content with `RoleGuard` using `allowedRoles="auto"`:

```tsx
import { RoleGuard } from "@/components/auth/RoleGuard";

export default function MyPage() {
  return (
    <RoleGuard allowedRoles="auto" showUnauthorized={true}>
      {/* Your page content */}
    </RoleGuard>
  );
}
```

The component will **automatically** read permissions from `route-access.ts` based on the current URL path.

### Manual Role Specification (Optional)

If you need to override the centralized config:

```tsx
<RoleGuard allowedRoles={["admin", "staff"]} showUnauthorized={true}>
  {/* Content */}
</RoleGuard>
```

---

## ⚙️ Changing Route Permissions

### Step 1: Edit `src/lib/route-access.ts`

Find the route in the `ROUTE_ACCESS_MAP` array and update the `allowedRoles`:

```typescript
{
  path: "/dashboard/users",
  allowedRoles: ["admin", "staff", "field_worker"], // ✅ Added field_worker
  description: "User management",
}
```

### Step 2: Done! 🎉

That's it! No need to modify individual page files if you're using `allowedRoles="auto"`.

---

## 📋 Available Roles

- `admin` - Full system access
- `staff` - Staff member access
- `volunteer` - Volunteer access
- `member` - Regular member access
- `field_worker` - Field worker access
- `audience` - Default role for authenticated users without specific roles
- `"all"` - Special value meaning any authenticated user can access

---

## 🔐 Security Layers

1. **Middleware (`middleware.ts`)**: Checks if user is authenticated before accessing dashboard
2. **RoleGuard Component**: Verifies user has required role for the specific page
3. **API Backend**: Django backend validates permissions on API calls
4. **Navigation Filter**: Only shows menu items user has access to

---

## 📝 Adding a New Protected Route (Complete Step-by-Step)

### Step 1: Create Route Folder Structure

Create the following structure under `src/app/(dashboard)/dashboard/`:

```
your-route-name/
├── page.tsx       (Required - main component)
├── layout.tsx     (Required - for RoleGuard wrapper)
├── loading.tsx    (Optional - loading state)
└── error.tsx      (Optional - error boundary)
```

### Step 2: Create Layout with RoleGuard

**File: `src/app/(dashboard)/dashboard/your-route-name/layout.tsx`**

```tsx
import { RoleGuard } from "@/components/auth/RoleGuard";

export default function YourRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={["admin", "staff"]} showUnauthorized={true}>
      {children}
    </RoleGuard>
  );
}
```

**Important:** Use `layout.tsx` instead of wrapping content in `page.tsx` for cleaner separation.

### Step 3: Add Route Access Configuration

**File: `src/lib/route-access.ts`**

Add your route to the `ROUTE_ACCESS_MAP` array:

```typescript
{
  path: "/dashboard/your-route-name",
  allowedRoles: ["admin", "staff"],
  description: "Your feature description - admin and staff only",
}
```

### Step 4: Add Navigation Menu Item

**File: `src/app/(dashboard)/dashboard/_components/nav-config.ts`**

Add to the appropriate section in the navigation array:

```typescript
{
  name: "Your Route Name",
  href: "/dashboard/your-route-name",
  icon: YourIcon, // Import from lucide-react
  roles: ["admin", "staff"],
}
```

### Step 5: Create Your Page Component

**File: `src/app/(dashboard)/dashboard/your-route-name/page.tsx`**

```tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function YourRoutePage() {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Feature</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Your content here */}
        </CardContent>
      </Card>
    </div>
  );
}
```

### Step 6 (Optional): Add Loading State

**File: `src/app/(dashboard)/dashboard/your-route-name/loading.tsx`**

```tsx
export default function Loading() {
  return (
    <div className="container mx-auto p-6">
      <div className="h-64 bg-muted animate-pulse rounded" />
    </div>
  );
}
```

### Step 7 (Optional): Add Error Boundary

**File: `src/app/(dashboard)/dashboard/your-route-name/error.tsx`**

```tsx
"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Error:", error);
  }, [error]);

  return (
    <div className="container mx-auto p-6">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Something went wrong!</AlertTitle>
        <AlertDescription className="mt-2">
          {error.message || "An error occurred."}
        </AlertDescription>
        <Button variant="outline" size="sm" onClick={reset} className="mt-4">
          Try again
        </Button>
      </Alert>
    </div>
  );
}
```

---

## ✅ Complete Checklist for New Routes

- [ ] **Step 1:** Create route folder structure
- [ ] **Step 2:** Create `layout.tsx` with `RoleGuard`
- [ ] **Step 3:** Add route to `route-access.ts`
- [ ] **Step 4:** Add navigation item to `nav-config.ts`
- [ ] **Step 5:** Create `page.tsx` with your component
- [ ] **Step 6 (Optional):** Add `loading.tsx`
- [ ] **Step 7 (Optional):** Add `error.tsx`
- [ ] **Test:** Login as different roles and verify access control works
- [ ] **Verify:** Check that navigation item appears only for authorized roles

---

## 🎯 Quick Example: Country-State Management Route

Here's a real example from the codebase:

**1. Folder structure:**
```
dashboard/country-state-management/
├── page.tsx
├── layout.tsx
├── loading.tsx
└── error.tsx
```

**2. Layout (`layout.tsx`):**
```tsx
import { RoleGuard } from "@/components/auth/RoleGuard";

export default function CountryStateManagementLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={["admin", "staff"]} showUnauthorized={true}>
      {children}
    </RoleGuard>
  );
}
```

**3. Route access (`route-access.ts`):**
```typescript
{
  path: "/dashboard/country-state-management",
  allowedRoles: ["admin", "staff"],
  description: "Country and State management - admin and staff only",
}
```

**4. Navigation (`nav-config.ts`):**
```typescript
{
  name: "Country Management",
  href: "/dashboard/country-state-management",
  icon: Globe,
  roles: ["admin", "staff"],
}
```

---

## 🔑 Key Points to Remember

1. **Always use `layout.tsx`** for `RoleGuard` - don't wrap content in `page.tsx`
2. **Match roles exactly** between `route-access.ts`, `nav-config.ts`, and `layout.tsx`
3. **Test thoroughly** by logging in as different user roles
4. **Keep roles consistent** - if you add a new role, update it everywhere
5. **Error boundaries are important** - add `error.tsx` for production-ready routes

---

## 🛠️ Current Route Permissions

| Route | Allowed Roles | Description |
|-------|--------------|-------------|
| `/dashboard` | All authenticated | Dashboard home |
| `/dashboard/users` | admin, staff | User management |
| `/dashboard/payments` | admin, staff | Payment management |
| `/dashboard/payments/mannual` | admin, staff | Manual payment entry |
| `/dashboard/vyapari` | admin, staff | Business directory |
| `/dashboard/volunteer-management` | admin, staff | Volunteer management |
| `/dashboard/referrals` | admin, staff | Referral management |
| `/dashboard/shikayat-portal` | member | Complaint portal |
| `/dashboard/id-card-management` | member, volunteer | ID card collection |
| `/dashboard/volunteer-registration` | volunteer, member | Volunteer registration |
| `/dashboard/volunteer-info` | volunteer, member | Volunteer information |
| `/dashboard/country-state-management` | admin, staff | Country and state management |

---

## 🔧 Troubleshooting

### User can't access a page they should have access to

1. Check user's role flags in the database (User model)
2. Verify `ROUTE_ACCESS_MAP` in `route-access.ts`
3. Check `DASHBOARD_ROLE_DEFINITIONS` in `nav-config.ts`
4. Clear browser cache and re-login

### Navigation item not showing

1. Verify the `roles` array in the navigation item matches user's roles
2. Check if the item is commented out in `nav-config.ts`

### "Access Denied" error

This means the user is authenticated but doesn't have the required role. Check:
1. User's role flags in database
2. Route permissions in `route-access.ts`

---

## 🎓 Best Practices

✅ **DO:**
- Use `allowedRoles="auto"` in pages to read from centralized config
- Update permissions in `route-access.ts` only
- Test permission changes thoroughly
- Document any special access requirements

❌ **DON'T:**
- Hardcode role arrays in multiple files
- Forget to protect sensitive pages with RoleGuard
- Rely only on frontend protection (backend must validate too)
- Give users unnecessary permissions

---

## 🔄 Migration from Old System

If you have pages with hardcoded roles like:

```tsx
<RoleGuard allowedRoles={["admin", "staff"]} showUnauthorized={true}>
```

Simply change to:

```tsx
<RoleGuard allowedRoles="auto" showUnauthorized={true}>
```

The system will automatically read the correct roles from `route-access.ts`.

---

## 📞 Support

For security concerns or permission issues, contact the development team.

**Remember: All role changes should be made in `src/lib/route-access.ts` only!** ⭐
