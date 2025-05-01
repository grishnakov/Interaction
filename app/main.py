import os
import secrets
from datetime import datetime, timedelta
from typing import Generator, Optional

from fastapi import (
    FastAPI,
    Depends,
    HTTPException,
    Header,
    status,
)
from fastapi.responses import HTMLResponse
from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    delete,
    select,
)
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    create_async_engine,
    async_sessionmaker,
)
from sqlalchemy.orm import declarative_base, relationship
from passlib.context import CryptContext

# DATABASE_URL example:
# postgresql+asyncpg://user:password@db:5432/appdb
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+asyncpg://user:password@db:5432/appdb",
)

# --- Database setup ---
engine = create_async_engine(DATABASE_URL, echo=True)
async_session = async_sessionmaker(bind=engine, expire_on_commit=False)
Base = declarative_base()

# --- Password hashing ---
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


# --- Models ---
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    sessions = relationship("SessionToken", back_populates="user", cascade="all,delete")


class SessionToken(Base):
    __tablename__ = "session_tokens"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    token = Column(String, unique=True, index=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    expires_at = Column(DateTime, nullable=False)

    user = relationship("User", back_populates="sessions")


# Create tables on startup
async def create_tables() -> None:
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


# Dependency: get a DB session
async def get_db() -> Generator[AsyncSession, None, None]:
    async with async_session() as session:
        yield session


# Dependency: get current user from Bearer token
async def get_current_user(
    authorization: Optional[str] = Header(None),
    db: AsyncSession = Depends(get_db),
) -> User:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid Authorization header",
        )
    token = authorization.split(" ", 1)[1]
    result = await db.execute(select(SessionToken).where(SessionToken.token == token))
    session_obj = result.scalar_one_or_none()
    if not session_obj or session_obj.expires_at < datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )
    result = await db.execute(select(User).where(User.id == session_obj.user_id))
    return result.scalar_one()


# --- FastAPI app ---
app = FastAPI()
app.add_event_handler("startup", create_tables)


@app.get("/", response_class=HTMLResponse)
async def read_root():
    return """
    <html>
      <head><title>Simple Web Server</title></head>
      <body>
        <h1>Welcome to the Simple Web Server</h1>
      </body>
    </html>
    """


@app.post("/signup")
async def signup(
    username: str,
    password: str,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(User).where(User.username == username))
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken",
        )
    user = User(
        username=username,
        hashed_password=hash_password(password),
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return {"id": user.id, "username": user.username}


@app.post("/login")
async def login(
    username: str,
    password: str,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(User).where(User.username == username))
    user = result.scalar_one_or_none()
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )
    token = secrets.token_urlsafe(32)
    expires_at = datetime.utcnow() + timedelta(hours=1)
    session_obj = SessionToken(user_id=user.id, token=token, expires_at=expires_at)
    db.add(session_obj)
    await db.commit()
    return {"access_token": token, "token_type": "bearer"}


@app.get("/me")
async def read_current_user(user: User = Depends(get_current_user)):
    return {"id": user.id, "username": user.username}


@app.post("/logout")
async def logout(
    authorization: Optional[str] = Header(None),
    db: AsyncSession = Depends(get_db),
):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid Authorization header",
        )
    token = authorization.split(" ", 1)[1]
    await db.execute(delete(SessionToken).where(SessionToken.token == token))
    await db.commit()
    return {"detail": "Logged out"}
