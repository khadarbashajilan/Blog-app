import pytest
from fastapi.testclient import TestClient
from blog.main import app

client = TestClient(app)
def test_create_blog():
    blog_data = {
        "title": "Test Blog",
        "body": "This is a test blog post."
    }
    response = client.post("/blog", json=blog_data)
    assert response.status_code == 201
    assert response.json()["title"] == blog_data["title"]
    assert response.json()["body"] == blog_data["body"]

def test_get_all_blogs():
    response = client.get("/blog")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_get_blog_by_id():
    # First, create a blog post to get an ID
    blog_data = {
        "title": "Test Blog",
        "body": "This is a test blog post."
    }
    create_response = client.post("/blog", json=blog_data)
    blog_id = create_response.json()["id"]

    # Now, get the blog post by ID
    response = client.get(f"/blog/{blog_id}")
    assert response.status_code == 200
    assert response.json()["id"] == blog_id

def test_delete_blog():
    # First, create a blog post to get an ID
    blog_data = {
        "title": "Test Blog",
        "body": "This is a test blog post."
    }
    create_response = client.post("/blog", json=blog_data)
    blog_id = create_response.json()["id"]

    # Now, delete the blog post
    response = client.delete(f"/blog/{blog_id}")
    assert response.status_code == 200
    assert response.json()["message"] == f"Blog with id {blog_id} deleted successfully"

def test_update_blog():
    # First, create a blog post to get an ID
    blog_data = {
        "title": "Test Blog",
        "body": "This is a test blog post."
    }
    create_response = client.post("/blog", json=blog_data)
    blog_id = create_response.json()["id"]

    # Now, update the blog post
    updated_data = {
        "title": "Updated Test Blog",
        "body": "This is an updated test blog post."
    }
    response = client.put(f"/blog/{blog_id}", json=updated_data)
    assert response.status_code == 200
    assert response.json()["title"] == updated_data["title"]
    assert response.json()["body"] == updated_data["body"]
import uuid

def test_register_user():
    user_data = {
        "name": "Test User",
        "mail": f"test_{uuid.uuid4()}@example.com",
        "password": "testpassword"
    }

    response = client.post("/user", json=user_data)

    assert response.status_code == 200
    assert response.json()["name"] == user_data["name"]
    assert response.json()["mail"] == user_data["mail"]
def test_show_user():
    import uuid

    user_data = {
        "name": "Test User",
        "mail": f"test_{uuid.uuid4()}@example.com",
        "password": "testpassword"
    }

    register_response = client.post("/user", json=user_data)

    user_id = register_response.json()["id"]

    response = client.get(f"/user/{user_id}")

    assert response.status_code == 200
    assert response.json()["id"] == user_id