import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_create_objective(client: AsyncClient):
    response = await client.post(
        "/objectives/",
        json={
            "name": "Test Objective",
            "description": "This is a test objective",
            "start_date": "2024-01-01",
            "end_date": "2024-12-31"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Test Objective"
    assert data["id"] is not None

@pytest.mark.asyncio
async def test_list_objectives(client: AsyncClient):
    # Create one first
    await client.post(
        "/objectives/",
        json={
            "name": "Objective 1",
            "description": "Desc 1"
        }
    )

    response = await client.get("/objectives/")
    assert response.status_code == 200
    data = response.json()
    assert "results" in data
    assert len(data["results"]) >= 1
    assert data["results"][0]["name"] == "Objective 1"
