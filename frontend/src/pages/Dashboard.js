import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {
  Typography,
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Container,
  TextField,
  Button,
  CircularProgress
} from "@mui/material";
import Navbar from "../components/Navbar";

function ProductDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- ส่วนของการทำ Debounce ---
  const [searchTerm, setSearchTerm] = useState(""); // 1. State สำหรับเก็บค่าที่พิมพ์ทันที
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm); // 2. State สำหรับเก็บค่าหลังหน่วงเวลา
  // --- สิ้นสุดส่วน Debounce ---

  const navigate = useNavigate();

  // 3. useEffect นี้จะทำงานเพื่อสร้าง Debounce
  useEffect(() => {
    // ตั้งเวลา: หลังจากผู้ใช้หยุดพิมพ์ 500ms (ครึ่งวินาที) ค่อยอัปเดต debouncedSearchTerm
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    // Cleanup function: ถ้าผู้ใช้พิมพ์อีกครั้งก่อนครบ 500ms ให้ยกเลิก timer เก่า
    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]); // useEffect นี้จะทำงานทุกครั้งที่ searchTerm เปลี่ยน

  // 4. useEffect นี้จะดึงข้อมูลจาก API โดยจะทำงานเมื่อ 'debouncedSearchTerm' เปลี่ยนแปลงเท่านั้น
  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        setLoading(true);
        // ใช้ debouncedSearchTerm ในการส่ง request
        const res = await axios.get("http://localhost:5000/api/products", {
          headers: { Authorization: token },
          params: { q: debouncedSearchTerm }
        });
        
        setProducts(res.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [debouncedSearchTerm, navigate]); // เปลี่ยน dependency มาเป็น debouncedSearchTerm

  return (
    <>
      <Navbar />
      <Container sx={{ py: 2 }}>
        <Typography variant="h4" gutterBottom>
          Products
        </Typography>

        {/* 6. เพิ่มช่องค้นหา (TextField) */}
        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            label="Search Products"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Box>
        </Container>
        {loading ? (
          // ถ้า loading เป็น true ให้แสดง Spinner
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ):(
          <>        
          <Box sx={{ mx:12, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap:4 }}>
                    {products.map((product) => (
              <Grid
                item
                key={product.id}
                xs={12}
                sm={6}
                md={4}
                sx={{ display: "flex" }}
              >
                <Card
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    flexGrow: 1,
                    width: "100%", // การ์ดเต็มช่อง Grid เสมอ
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    sx={{ objectFit: "contain", backgroundColor: "#f5f5f5" }}
                    image={product.imageUrl || "https://via.placeholder.com/300"}
                    alt={product.name}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography
                      gutterBottom
                      variant="h6"
                      component="h2"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2, // จำกัด 2 บรรทัด
                        WebkitBoxOrient: "vertical",
                        maxHeight: "3.2em",
                      }}
                    >
                      {product.name}
                    </Typography>
                    <Typography variant="body1" color="primary">
                      ฿{product.price}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" component={Link} to={`/product/${product.id}`}>
                      See Details
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
        </Box>
        </>
        )}
      
    </>
  );
}

export default ProductDashboard;


