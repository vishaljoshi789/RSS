from rest_framework.permissions import BasePermission

class IsAdmin(BasePermission):
    """
    Allows access only to authenticated users.
    """

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_admin_account)

class IsStaff(BasePermission):
    """
    Allows access only to authenticated staff users.
    """

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_staff_account)