import { useEffect, useRef } from 'react';
import { Toast } from '@base-ui/react/toast';
import { useStore } from '@/store/useStore';

export function RoleSwitchNotifier() {
  const role = useStore((s) => s.role);
  const toastManager = Toast.useToastManager();
  const prevRole = useRef(null);

  useEffect(() => {
    if (prevRole.current === null) {
      prevRole.current = role;
      return;
    }
    if (prevRole.current !== role) {
      prevRole.current = role;
      const isAdmin = role === 'admin';
      toastManager.add({
        title: isAdmin ? '🔑 Admin Mode' : '👁️ Viewer Mode',
        description: isAdmin
          ? 'You can now add, edit and delete transactions.'
          : 'Switched to read-only view.',
        timeout: 3000,
      });
    }
  }, [role, toastManager]);

  return null;
}

