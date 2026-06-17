import type { ToastTone } from "./providers/ToastProvider";

export type Notify = (message: string, type?: ToastTone) => void;
