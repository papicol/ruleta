import 'react';

declare module 'react' {
    interface HTMLAttributes<T> extends DOMAttributes<T> {
        className?: string;
    }
}
