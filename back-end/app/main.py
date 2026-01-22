from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import create_tables
from app.routers import (
    objectives,
    keyresults,
    kpis,
    users,
    roles,
    groups,
    organizations,
    polls,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: create database tables
    await create_tables()
    yield
    # Shutdown: cleanup if needed


app = FastAPI(
    title=settings.app_name,
    description="OKR Management API",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS middleware
if settings.cors_allow_all:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
else:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Include routers
app.include_router(objectives.router)
app.include_router(keyresults.router)
app.include_router(kpis.router)
app.include_router(users.router)
app.include_router(roles.router)
app.include_router(groups.router)
app.include_router(organizations.router)
app.include_router(polls.router)


@app.get("/")
async def root():
    return {
        "message": "Welcome to OKR API",
        "docs": "/docs",
        "redoc": "/redoc",
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}
