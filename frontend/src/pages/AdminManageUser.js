import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    Container, Typography, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Paper, IconButton, 
    Select, MenuItem, FormControl
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Navbar from '../components/Navbar';

function AdminManageUser() {
    const [users, setUsers] = useState([]);
    const token = localStorage.getItem('token');

    const fetchUsers = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/users', {
                headers: { Authorization: token }
            });
            setUsers(res.data);
        } catch (error) {
            console.error("Failed to fetch users:", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleRoleChange = async (userId, newRole) => {
        try {
            await axios.put(`http://localhost:5000/api/users/${userId}/role`, 
                { role: newRole },
                { headers: { Authorization: token } }
            );
            // อัปเดตข้อมูลใน state ทันที
            setUsers(users.map(user => 
                user.id === userId ? { ...user, role: newRole } : user
            ));
        } catch (error) {
            console.error("Failed to update role:", error);
            alert('Could not update user role.');
        }
    };

    const handleDelete = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            try {
                await axios.delete(`http://localhost:5000/api/users/${userId}`, {
                    headers: { Authorization: token }
                });
                fetchUsers(); // โหลดข้อมูลใหม่หลังลบ
            } catch (error) {
                console.error("Failed to delete user:", error);
                alert('Could not delete user.');
            }
        }
    };

    return (
        <>
            <Navbar />
            <Container>
                <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>
                    User Management
                </Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Email</TableCell>
                                <TableCell>Display Name</TableCell>
                                <TableCell>Role</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.displayName}</TableCell>
                                    <TableCell>
                                        <FormControl size="small">
                                            <Select
                                                value={user.role}
                                                onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                            >
                                                <MenuItem value="user">User</MenuItem>
                                                <MenuItem value="admin">Admin</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton onClick={() => handleDelete(user.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
        </>
    );
}

export default AdminManageUser; 