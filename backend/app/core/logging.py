"""Structured logging initialization using structlog."""

import logging
from typing import Any

import structlog


def _configure_logging() -> None:
    """Configure standard logging & structlog processors."""

    logging.basicConfig(format="%(message)s", level=logging.INFO, force=True)

    structlog.configure(
        processors=[
            structlog.processors.TimeStamper(fmt="iso"),
            structlog.processors.add_log_level,
            structlog.processors.StackInfoRenderer(),
            structlog.processors.format_exc_info,
            structlog.processors.UnicodeDecoder(),
            structlog.processors.JSONRenderer(),
        ],
        context_class=dict,
        logger_factory=structlog.stdlib.LoggerFactory(),
        wrapper_class=structlog.make_filtering_bound_logger(logging.INFO),
        cache_logger_on_first_use=True,
    )


# Run once on import
_configure_logging()


def get_logger(name: str | None = None, **kwargs: Any):  # type: ignore[return-value]
    """Return a structlog logger instance."""

    return structlog.get_logger(name, **kwargs)
