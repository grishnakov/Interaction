# database.py

import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# load POSTGRES_PASSWORD (and any other vars) from your .env file
load_dotenv()

USER = os.getenv("POSTGRES_USER")
PASSWORD = os.getenv("POSTGRES_PASSWORD")
HOST = os.getenv("DATABASE_HOST")
PORT = os.getenv("DATABASE_PORT")
DB_NAME = os.getenv("POSTGRES_DB")

DATABASE_URL = f"postgresql://{USER}:{PASSWORD}@{HOST}:{PORT}/{DB_NAME}"

# SQLAlchemy engine and session factory
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,  # optional: test connections before using
)
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

# Base class for your ORM models
Base = declarative_base()


# Dependency for FastAPI endpoints
def get_db():
    """
    Yield a database session, and make sure to close it
    when the request is finished.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
