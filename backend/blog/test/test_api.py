import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from blog.main import app
from blog.database import Base, get_db

# -------------------------
# TEST DATABASE (SQLite)
# -------------------------

SQLALCHEMY_DATABASE_URL = "sqlite:///./blog.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False}
)

TestingSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# create tables
Base.metadata.create_all(bind=engine)

# dependency override
def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

# -------------------------
# USER TESTS
# -------------------------

def test_register_user():
    response = client.post(
        "/user",
        json={
            "name": "John",
            "mail": "john@test.com",
            "password": "1234"
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert data["name"] == "John"
    assert data["mail"] == "john@test.com"
    assert "id" in data

    return data["id"]


def test_duplicate_user():
    response = client.post(
        "/user",
        json={
            "name": "John",
            "mail": "john@test.com",
            "password": "1234"
        }
    )

    assert response.status_code == 400
    assert response.json()["detail"] == "Email already registered"


def test_get_user():
    response = client.get("/user/1")

    assert response.status_code == 200

    data = response.json()

    assert data["id"] == 1
    assert data["mail"] == "john@test.com"
    assert isinstance(data["blogs"], list)


# -------------------------
# BLOG TESTS
# -------------------------

def test_create_blog():

    response = client.post(
        "/blog",
        json={
            "title": "My First Blog",
            "body": "FastAPI is amazing"
        }
    )

    assert response.status_code == 201

    data = response.json()

    assert data["title"] == "My First Blog"
    assert data["body"] == "FastAPI is amazing"
    assert data["user_id"] == 1

    return data["id"]


def test_get_all_blogs():

    response = client.get("/blog")

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, list)
    assert len(data) >= 1


def test_get_single_blog():

    response = client.get("/blog/1")

    assert response.status_code == 200

    data = response.json()

    assert data["title"] == "My First Blog"
    assert "creator" in data


def test_update_blog():

    response = client.put(
        "/blog/1",
        json={
            "title": "Updated Blog Title"
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert data["title"] == "Updated Blog Title"


def test_delete_blog():

    response = client.delete("/blog/1")

    assert response.status_code == 200

    assert response.json()["message"] == "Blog with id 1 deleted successfully"