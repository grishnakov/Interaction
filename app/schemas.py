# schemas.py

from pydantic import BaseModel, EmailStr
from typing import List, Optional

# ── LOCATION SCHEMAS ─────────────────────────────────────────────────────────────


class LocationBase(BaseModel):
    name: str
    address: Optional[str] = None  # if you want to store more info


class LocationCreate(LocationBase):
    pass


class Location(LocationBase):
    id: int
    # owner_id can link back to the User who checked it off
    owner_id: int

    class Config:
        orm_mode = True


# ── USER SCHEMAS ─────────────────────────────────────────────────────────────────


class UserBase(BaseModel):
    email: EmailStr


class UserCreate(UserBase):
    # no password since you’re using OAuth2
    pass


class User(UserBase):
    id: int
    # list of locations they’ve visited
    locations: List[Location] = []

    class Config:
        orm_mode = True


# ── VISIT TOGGLE SCHEMA ──────────────────────────────────────────────────────────


class VisitToggle(BaseModel):
    """
    When a user checks/unchecks a location.
    """

    location_id: int
    visited: bool
