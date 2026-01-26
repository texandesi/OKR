from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.core.websockets import manager

router = APIRouter(tags=["websockets"])


@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket) -> None:
    """WebSocket endpoint for real-time updates."""
    await manager.connect(websocket)
    try:
        while True:
            # We just iterate to keep connection open
            # Future: Handle incoming messages if needed
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)
