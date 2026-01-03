"""FastAPI application factory for PrimeTrade backend."""

from contextlib import asynccontextmanager
from typing import AsyncIterator

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.api.router import api_router
from app.core.config import settings
from app.core.logging import get_logger
from app.db.indices import ensure_indexes

logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:  # noqa: D401
    """Run startup and shutdown tasks."""

    # Startup: ensure MongoDB indexes exist
    try:
        await ensure_indexes()
        logger.info("MongoDB indexes ensured")
    except Exception as exc:  # noqa: BLE001
        logger.error("Failed to ensure MongoDB indexes", error=str(exc))
    yield
    # Shutdown: no-op for now


app = FastAPI(title="PrimeTrade API", version="1.0.0", lifespan=lifespan)

# CORS
if settings.cors_origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Routers
app.include_router(api_router)


# Exception handlers
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):  # noqa: D401
    logger.info("HTTP error", status_code=exc.status_code, detail=exc.detail)
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):  # noqa: D401
    logger.info("Validation error", errors=exc.errors())
    return JSONResponse(status_code=422, content={"detail": exc.errors()})


# Root
@app.get("/")
async def root():
    return {"message": "PrimeTrade API is running"}


# Entry point for `python -m app.main`

def main() -> None:  # pragma: no cover
    import uvicorn  # noqa: WPS433 (dynamic import, CLI convenience)

    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)


if __name__ == "__main__":  # pragma: no cover
    main()
