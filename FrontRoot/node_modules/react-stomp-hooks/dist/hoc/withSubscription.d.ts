/// <reference types="react" />
import { StompHeaders } from '@stomp/stompjs';
import { StompMessageReceiver } from '../interfaces/StompMessageReceiver';
declare function withSubscription<P>(WrappedComponent: StompMessageReceiver<P>, destinations: string | string[], headers?: StompHeaders): (props: P) => JSX.Element;
export default withSubscription;
