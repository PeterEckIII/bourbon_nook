import { useEffect, useRef } from "react";

type Events = HTMLElementEventMap &
  WindowEventMap &
  DocumentEventMap &
  MediaQueryListEventMap;

type ListenerElements = Document | HTMLElement | Window | MediaQueryList;

export const useEventListener = <
  E extends Events[keyof Events],
  Type extends keyof Pick<
    Events,
    { [K in keyof Events]: Events[K] extends E ? K : never }[keyof Events]
  >
>(
  element: ListenerElements | undefined,
  type: Type,
  handler: (event: Events[Type]) => void,
  options?: AddEventListenerOptions | boolean
) => {
  const savedHandler = useRef(handler);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const listener: EventListenerOrEventListenerObject = (event) =>
      savedHandler.current(event as never);
    element?.addEventListener(type, listener, options);
    return () => {
      element?.removeEventListener(type, listener, options);
    };
  }, [type, element, options]);
};

export const useWindowListener = <E extends keyof WindowEventMap>(
  type: E,
  handler: (event: WindowEventMap[E]) => void,
  options?: AddEventListenerOptions | boolean
) =>
  useEventListener(
    typeof window !== "undefined" ? window : undefined,
    type,
    handler,
    options
  );

export const useDocumentListener = <E extends keyof DocumentEventMap>(
  type: E,
  handler: (event: DocumentEventMap[E]) => void,
  options?: AddEventListenerOptions | boolean
) =>
  useEventListener(
    typeof document !== "undefined" ? document.body : undefined,
    type,
    handler,
    options
  );

export const useBodyListener = <E extends keyof DocumentEventMap>(
  type: E,
  handler: (event: DocumentEventMap[E]) => void,
  options?: AddEventListenerOptions | boolean
) =>
  useEventListener(
    typeof document !== "undefined" ? document.body : undefined,
    type,
    handler,
    options
  );
