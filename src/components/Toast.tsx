import { Alert, Snackbar } from '@mui/material';

export type ToastState = {
  open: boolean;
  message: string;
  severity: 'success' | 'info' | 'warning' | 'error';
};

interface ToastProps {
  state: ToastState;
  onClose: () => void;
}

export function Toast({ state, onClose }: ToastProps) {
  return (
    <Snackbar
      open={state.open}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert onClose={onClose} severity={state.severity} sx={{ width: '100%' }}>
        {state.message}
      </Alert>
    </Snackbar>
  );
}

