"""Middleware that enforces admin-only routes based on custom route attribute.

If a route has the attribute `requires_admin = True`, this middleware ensures the
current authenticated user (resolved via dependency) has admin role.

We mark routes by setting `router.route_class` to this custom class or by adding
`@router.get(..., dependencies=[Depends(require_admin)])` wrappers per handler.
For simplicity we instead rely on dependency injection (`get_current_admin`).
This file keeps a placeholder for future global enforcement.
"""

from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import Response


class AdminOnlyMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:  # noqa: D401
        # No-op for now; actual enforcement is done via dependencies.
        return await call_next(request)
