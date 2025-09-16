import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  CircularProgress,
} from "@mui/material";
import Navbar from "../components/Navbar";

function ProductDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/products", {
          headers: { Authorization: token },
        });
        setProducts(res.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Navbar onLogout={handleLogout} />
      <Container sx={{ py: 4 }}>
        <Grid container spacing={2} alignItems="stretch">
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
                    ${product.price}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" component={Link} to={`/product/${product.id}`}>
                    See Details
                  </Button>
                  <Button size="small" variant="contained">
                    Add to Cart
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}

export default ProductDashboard;
