# Role and Access Management Requirements

Improve admin controls for managing internal user access.

Admins must be able to:
- assign a role to a user
- revoke a role from a user
- review a user’s current permissions before making changes

Additional constraints:
- changes should be logged for audit review
- users must not be able to grant permissions above their own authority level
- permission updates should take effect without a manual restart
