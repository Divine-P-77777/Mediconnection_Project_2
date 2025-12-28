

export const isBrowser = (): boolean =>
    typeof window !== "undefined";

export const safeWindow: Window | undefined =
    typeof window !== "undefined" ? window : undefined;


export const safeDocument: Document | undefined =
    typeof document !== "undefined" ? document : undefined;


export const safeQuerySelector = <T extends Element = Element>(
    selector: string,
    parent: Document | Element | undefined = safeDocument
): T | null => {
    if (!parent) return null;
    return parent.querySelector<T>(selector);
};
