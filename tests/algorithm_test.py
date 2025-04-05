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