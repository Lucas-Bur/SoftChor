from pydantic import BaseModel
from typing import Optional

class Users(BaseModel):
    id: Optional[str] = None
    name: str
    email: str
    emailVerified: bool = None
    image: Optional[str]
    createdAt: str = None
    updatedAt: str = None

    class Config:
        from_attributes = True

class Sessions(BaseModel):
    id: Optional[str] = None
    expiresAt: str
    token: str
    createdAt: str = None
    updatedAt: str
    ipAddress: Optional[str]
    userAgent: Optional[str]
    userId: str

    class Config:
        from_attributes = True

class Accounts(BaseModel):
    id: Optional[str] = None
    accountId: str
    providerId: str
    userId: str
    accessToken: Optional[str]
    refreshToken: Optional[str]
    idToken: Optional[str]
    accessTokenExpiresAt: Optional[str]
    refreshTokenExpiresAt: Optional[str]
    scope: Optional[str]
    password: Optional[str]
    createdAt: str = None
    updatedAt: str

    class Config:
        from_attributes = True

class Verifications(BaseModel):
    id: Optional[str] = None
    identifier: str
    value: str
    expiresAt: str
    createdAt: str = None
    updatedAt: str = None

    class Config:
        from_attributes = True

class Users(BaseModel):
    id: Optional[int] = None
    name: str
    age: int
    email: str

    class Config:
        from_attributes = True

class Posts(BaseModel):
    id: Optional[int] = None
    title: str
    content: str
    userId: int
    createdAt: str = None
    updatedAt: str

    class Config:
        from_attributes = True

class Songs(BaseModel):
    id: Optional[str] = None
    title: str
    status: Optional[str] = None
    startedAt: Optional[str]
    finishedAt: Optional[str]
    errorMessage: Optional[str]
    createdAt: Optional[str] = None
    progress: Optional[int] = None

    class Config:
        from_attributes = True

class Files(BaseModel):
    id: Optional[str] = None
    songId: str
    voiceId: Optional[str]
    fileType: str
    s3Key: str
    originalName: Optional[str]
    sizeBytes: Optional[int]
    createdAt: Optional[str] = None

    class Config:
        from_attributes = True

class Voices(BaseModel):
    id: Optional[str] = None
    songId: str
    labelRaw: str
    voiceType: Optional[str] = None
    createdAt: Optional[str] = None

    class Config:
        from_attributes = True
