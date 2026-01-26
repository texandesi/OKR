import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_create_key_result(client: AsyncClient):
    # First create an objective
    obj_response = await client.post(
        "/objectives/",
        json={"name": "Obj for KR", "description": "Desc"}
    )
    objective_id = obj_response.json()["id"]

    # Create Key Result
    response = await client.post(
        "/keyresults/",
        json={
            "objective": objective_id,
            "name": "KR 1",
            "description": "KR Description",
            "targetValue": 100,
            "currentValue": 0,
            "unit": "percent"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "KR 1"
    assert data["targetValue"] == 100
    assert data["objective"] == objective_id

@pytest.mark.asyncio
async def test_key_result_progress_calculation(client: AsyncClient):
    # Objective
    obj_res = await client.post(
        "/objectives/",
        json={"name": "Progress Obj", "description": "Desc"}
    )
    obj_id = obj_res.json()["id"]

    # KR with 50% progress
    await client.post(
        "/keyresults/",
        json={
            "objective": obj_id,
            "name": "KR 50",
            "description": "Desc",
            "targetValue": 100,
            "currentValue": 50,
            "unit": "count"
        }
    )

    # Fetch Objective to check computed progress
    # Note: Using get_objective endpoint which includes keyresults
    get_res = await client.get(f"/objectives/{obj_id}/")
    assert get_res.status_code == 200
    data = get_res.json()
    assert data["progressPercentage"] == 50.0
