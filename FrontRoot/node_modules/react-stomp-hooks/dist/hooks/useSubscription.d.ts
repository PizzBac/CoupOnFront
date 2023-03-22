import { messageCallbackType, StompHeaders } from '@stomp/stompjs';
/**
 *
 * @param destinations The destinations to subscribe to. Can be a string for a single destination or an array of strings for multiple.
 * @param onMessage Callback called when a message arrives for this subscription
 * @param headers Additional Headers for this subscription, consult @stomp/stompjs docs.
 */
declare function useSubscription(destinations: string | string[], onMessage: messageCallbackType, headers?: StompHeaders): void;
export default useSubscription;
