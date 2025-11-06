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

## 📝 Adding a New Protected Route

### 1. Add route configuration to `route-access.ts`:

```typescript
{
  path: "/dashboard/new-feature",
  allowedRoles: ["admin"],
  description: "New feature - admin only",
}
```

### 2. Create your page with RoleGuard:

```tsx
// src/app/(dashboard)/dashboard/new-feature/page.tsx
"use client";

import { RoleGuard } from "@/components/auth/RoleGuard";

export default function NewFeaturePage() {
  return (
    <RoleGuard allowedRoles="auto" showUnauthorized={true}>
      <div>
        <h1>New Feature</h1>
        {/* Your content */}
      </div>
    </RoleGuard>
  );
}
```

### 3. (Optional) Add navigation item to `nav-config.ts`:

```typescript
{
  title: "New Feature",
  url: "/dashboard/new-feature",
  icon: Star,
  description: "Manage new feature",
  roles: ["admin"],
}
```

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
