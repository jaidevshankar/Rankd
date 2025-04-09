import requests

def test_add_new_item():
    url = "http://127.0.0.1:8000/compare"
    payload = {
        "user_id": 1,
        "item_id": "6pOiDiuDQqrmo5DbG0ZubR",  # Example album ID from Spotify
        "topic_name": "Albums"
    }
    response = requests.post(url, json=payload)
    
    assert response.status_code == 200
    assert "message" in response.json()
    assert "ranking" in response.json()
    assert len(response.json()["ranking"]) == 1  # Only one item should be in the ranking
    print("Test 1 Passed: New item added successfully.")

test_add_new_item()

import requests

def test_invalid_topic():
    url = "http://127.0.0.1:8000/compare"
    payload = {
        "user_id": 1,
        "item_id": "6pOiDiuDQqrmo5DbG0ZubR",
        "topic_name": "NonExistentTopic"  # Invalid topic
    }
    response = requests.post(url, json=payload)
    
    assert response.status_code == 400
    assert response.json()["detail"] == "Unsupported topic: NonExistentTopic"
    print("Test 2 Passed: Invalid topic handled correctly.")

test_invalid_topic()

import requests

def test_add_item_to_existing_rankings():
    url = "http://127.0.0.1:8000/compare"
    payload = {
        "user_id": 1,
        "item_id": "6pOiDiuDQqrmo5DbG0ZubR",  # Example album ID from Spotify
        "topic_name": "Albums"
    }
    # First, add the initial item
    requests.post(url, json=payload)

    # Now, add another item
    payload["item_id"] = "3mH6qwIy9crq0I9YQbOuDf"  # Another example album ID
    response = requests.post(url, json=payload)

    assert response.status_code == 200
    assert "message" in response.json()
    assert "ranking" in response.json()
    assert len(response.json()["ranking"]) > 1  # There should now be multiple items in the ranking
    print("Test 3 Passed: Item added to existing rankings successfully.")

test_add_item_to_existing_rankings()

def test_missing_item_id():
    url = "http://127.0.0.1:8000/compare"
    payload = {
        "user_id": 1,
        "topic_name": "Albums"
    }
    response = requests.post(url, json=payload)

    assert response.status_code == 422  # FastAPI validation error
    print("Test 4 Passed: Missing item_id properly rejected.")


def test_invalid_user_id_type():
    url = "http://127.0.0.1:8000/compare"
    payload = {
        "user_id": "one",  # Invalid type
        "item_id": "6pOiDiuDQqrmo5DbG0ZubR",
        "topic_name": "Albums"
    }
    response = requests.post(url, json=payload)

    assert response.status_code == 422  # FastAPI catches this via type checking
    print("Test 5 Passed: Invalid user_id type handled correctly.")


def test_duplicate_item_submission():
    url = "http://127.0.0.1:8000/compare"
    payload = {
        "user_id": 2,
        "item_id": "6pOiDiuDQqrmo5DbG0ZubR",
        "topic_name": "Albums"
    }
    requests.post(url, json=payload)
    response = requests.post(url, json=payload)

    assert response.status_code == 200
    assert response.json()["ranking"].count("6pOiDiuDQqrmo5DbG0ZubR") == 1
    print("Test 6 Passed: Duplicate item not re-added.")


def test_different_user_same_topic():
    url = "http://127.0.0.1:8000/compare"
    payload_user1 = {
        "user_id": 1,
        "item_id": "6pOiDiuDQqrmo5DbG0ZubR",
        "topic_name": "Albums"
    }
    payload_user2 = {
        "user_id": 99,
        "item_id": "3mH6qwIy9crq0I9YQbOuDf",
        "topic_name": "Albums"
    }

    response1 = requests.post(url, json=payload_user1)
    response2 = requests.post(url, json=payload_user2)

    assert response1.status_code == 200
    assert response2.status_code == 200
    assert len(response2.json()["ranking"]) == 1
    print("Test 7 Passed: User-specific rankings handled correctly.")