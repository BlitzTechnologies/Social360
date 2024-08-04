import React from 'react'
import { useAlert } from '../../contexts/AlertContext';
import { Alert } from '@mui/material';

function AlertComponenet() {
    const { alert, hideAlert } = useAlert();

    return (
        alert.show && (
            <Alert
                variant="filled"
                severity={alert.severity}
                onClose={hideAlert}
                sx={{ width: '100%' }}
            >
                {alert.message}
            </Alert>
        )
    );
}

export default AlertComponenet;