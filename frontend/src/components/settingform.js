// frontend/components/settingform.js (แก้ไขใหม่)
import React, { useState, useEffect } from 'react';
import { Button, TextField, Box, DialogActions } from '@mui/material';

// เปลี่ยนชื่อ props ให้สื่อความหมายมากขึ้น
function SettingForm({ currentUser, onSubmit, onCancel }) {
    // ใช้ State ที่ตรงกับข้อมูล User จริง: displayName และ email
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');

    // เมื่อข้อมูล currentUser เปลี่ยน (ตอนเปิด Dialog) ให้ตั้งค่าเริ่มต้นในฟอร์ม
    useEffect(() => {
        if (currentUser) {
            setDisplayName(currentUser.displayName || '');
            setEmail(currentUser.email || '');
        }
    }, [currentUser]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // ส่งเฉพาะข้อมูลที่ต้องการอัปเดตกลับไป
        onSubmit({ displayName });
    };

    return (
        // ใช้ <form> เพื่อให้กด Enter แล้ว Submit ได้
        <Box component="form" onSubmit={handleSubmit} sx={{ minWidth: 400 }}>
            <TextField
                margin="normal"
                fullWidth
                id="displayName"
                label="Display Name"
                name="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                autoFocus
                required
            />
            <TextField
                margin="normal"
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                value={email}
                disabled // ทำให้ Email แก้ไขไม่ได้
            />
            
            {/* จัดกลุ่มปุ่มด้วย DialogActions เพื่อให้มี Layout ที่สวยงาม */}
            <DialogActions sx={{ mt: 2, p: 0, }}>
                <Button onClick={onCancel} color='black'  >Cancel</Button>
                <Button type="submit" variant="contained" sx={{backgroundColor: 'black', ":hover": { backgroundColor: '#333' }}}>
                    Save Changes
                </Button>
            </DialogActions>
        </Box>
    );
}

export default SettingForm;