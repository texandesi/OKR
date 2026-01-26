import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useWebSocket } from '@/lib/websocket';

export function useRealTimeUpdates() {
  const { socket, isConnected } = useWebSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleMessage = (event: MessageEvent) => {
      try {
        const message = JSON.parse(event.data);

        switch (message.type) {
          case 'keyresult_update':
            // Invalidate keyresults list and objectives list (as progress propagates)
            queryClient.invalidateQueries({ queryKey: ['keyresults'] });
            queryClient.invalidateQueries({ queryKey: ['objectives'] });
            break;

          // Future: handle other types like 'reaction_add', 'objective_update' etc.
        }
      } catch (error) {
        console.error('Failed to parse websocket message:', error);
      }
    };

    socket.addEventListener('message', handleMessage);

    return () => {
      socket.removeEventListener('message', handleMessage);
    };
  }, [socket, isConnected, queryClient]);
}
