export const getUserFromToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    // JWT มี 3 ส่วน: header.payload.signature
    // เราต้องการแค่ payload ที่เป็น Base64-encoded JSON
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload; // จะได้ object เช่น { id: 1, email: 'a@b.c', role: 'admin' }
  } catch (e) {
    console.error('Invalid token:', e);
    return null;
  }
};