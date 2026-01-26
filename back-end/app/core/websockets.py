from typing import Any

from fastapi import WebSocket


class ConnectionManager:
    """Manages active WebSocket connections."""

    def __init__(self) -> None:
        self.active_connections: set[WebSocket] = set()

    async def connect(self, websocket: WebSocket) -> None:
        """Accept connection and add to set."""
        await websocket.accept()
        self.active_connections.add(websocket)

    def disconnect(self, websocket: WebSocket) -> None:
        """Remove connection from set (O(1) operation)."""
        self.active_connections.discard(websocket)

    async def broadcast(self, message: dict[str, Any]) -> None:
        """Broadcast JSON message to all active connections.

        Failed connections are removed from the active set.
        """
        failed_connections: list[WebSocket] = []

        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                failed_connections.append(connection)

        # Clean up failed connections
        for connection in failed_connections:
            self.active_connections.discard(connection)


manager = ConnectionManager()

