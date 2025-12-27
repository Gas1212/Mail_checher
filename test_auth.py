"""
Test script for MongoDB authentication
"""
import requests
import json

BASE_URL = "http://127.0.0.1:8000/api"

def test_registration():
    """Test user registration"""
    print("\n" + "="*50)
    print("TEST 1: User Registration")
    print("="*50)

    data = {
        "email": "testuser@example.com",
        "password": "securepassword123",
        "first_name": "Test",
        "last_name": "User",
        "job_title": "Developer",
        "company": "TestCo",
        "industry": "Technology"
    }

    try:
        response = requests.post(f"{BASE_URL}/auth/register/", json=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")

        if response.status_code == 201:
            print("SUCCESS: Registration successful!")
            return response.json()
        else:
            print("FAILED: Registration failed!")
            return None
    except Exception as e:
        print(f"ERROR: {e}")
        return None


def test_login(email, password):
    """Test user login"""
    print("\n" + "="*50)
    print("TEST 2: User Login")
    print("="*50)

    data = {
        "email": email,
        "password": password
    }

    try:
        response = requests.post(f"{BASE_URL}/auth/login/", json=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")

        if response.status_code == 200:
            print("SUCCESS: Login successful!")
            return response.json()
        else:
            print("FAILED: Login failed!")
            return None
    except Exception as e:
        print(f"ERROR: {e}")
        return None


def test_get_current_user(access_token):
    """Test getting current user info"""
    print("\n" + "="*50)
    print("TEST 3: Get Current User")
    print("="*50)

    headers = {
        "Authorization": f"Bearer {access_token}"
    }

    try:
        response = requests.get(f"{BASE_URL}/auth/me/", headers=headers)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")

        if response.status_code == 200:
            print("SUCCESS: Get current user successful!")
            return response.json()
        else:
            print("FAILED: Get current user failed!")
            return None
    except Exception as e:
        print(f"ERROR: {e}")
        return None


def test_update_profile(access_token):
    """Test updating user profile"""
    print("\n" + "="*50)
    print("TEST 4: Update Profile")
    print("="*50)

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    data = {
        "job_title": "Senior Developer",
        "company": "NewCo Inc"
    }

    try:
        response = requests.put(f"{BASE_URL}/auth/update-profile/", json=data, headers=headers)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")

        if response.status_code == 200:
            print("SUCCESS: Update profile successful!")
            return response.json()
        else:
            print("FAILED: Update profile failed!")
            return None
    except Exception as e:
        print(f"ERROR: {e}")
        return None


if __name__ == "__main__":
    print("\nStarting MongoDB Authentication Tests...")
    print("Server: " + BASE_URL)

    # Test 1: Registration
    reg_result = test_registration()

    if reg_result:
        access_token = reg_result['tokens']['access']

        # Test 2: Login
        login_result = test_login("testuser@example.com", "securepassword123")

        if login_result:
            # Test 3: Get Current User
            user_info = test_get_current_user(access_token)

            # Test 4: Update Profile
            update_result = test_update_profile(access_token)

        print("\n" + "="*50)
        print("All tests completed!")
        print("="*50)
    else:
        print("\nTests stopped due to registration failure")
