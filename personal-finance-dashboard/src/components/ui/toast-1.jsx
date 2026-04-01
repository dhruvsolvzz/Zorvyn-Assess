import { Toast } from '@base-ui/react/toast';
import { FiX } from 'react-icons/fi';
import { cn } from '@/lib/utils';

export function ToastViewport() {
  const { toasts } = Toast.useToastManager();

  return (
    <Toast.Viewport className="fixed bottom-4 right-4 z-9999 flex w-[300px] flex-col gap-2 sm:bottom-6 sm:right-6">
      {toasts.map((toast) => (
        <Toast.Root
          key={toast.id}
          toast={toast}
          className={cn(
            'relative flex w-full flex-col gap-1 rounded-lg border bg-background p-4 shadow-lg',
            'transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
            'data-starting-style:translate-y-4 data-starting-style:opacity-0',
            'data-ending-style:translate-y-4 data-ending-style:opacity-0',
          )}
        >
          <Toast.Title className="text-sm font-semibold text-foreground" />
          <Toast.Description className="text-xs text-muted-foreground" />
          <Toast.Close
            className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <FiX className="h-3.5 w-3.5" />
          </Toast.Close>
        </Toast.Root>
      ))}
    </Toast.Viewport>
  );
}

