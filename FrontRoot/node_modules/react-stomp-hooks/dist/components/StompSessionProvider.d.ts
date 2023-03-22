/// <reference types="react" />
import { StompSessionProviderProps } from '../interfaces/StompSessionProviderProps';
/**
 * The StompSessionProvider manages the STOMP connection
 * All Hooks and HOCs in this library require an ancestor of this type.
 * The URL to connect to can be specified via the url prop.
 * Depending on the Schema of the URL either Sockjs or a raw Websocket is used.
 * You can override this behavior with the brokerURL or webSocketFactory props, which will then be forwarded to @stomp/stompjs
 * Custom @stomp/stompjs options can be used as props.
 * Please consult the @stomp/stompjs documentation for more information.
 */
declare function StompSessionProvider(props: StompSessionProviderProps): JSX.Element;
export default StompSessionProvider;
