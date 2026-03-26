// src/pages/AdminDashboard/AdminDashBoard.tsx
import React, { useState } from 'react';
import NavBar from '../../components/layout/NavBar/Navbar';
import {
  Container,
  Title,
  Card,
  Text,
  Button,
  Group,
  Collapse,
  Paper,
} from '@mantine/core';
import styles from './AdminDashBoard.module.css';
import * as productService from '../../services/productService';
import ProductModal from '../../components/productModal/productModal';
import type { ProductData } from '../../components/productModal/productModal';

// PrimeReact Chart
import { Chart } from 'primereact/chart';

export default function AdminDashboard() {
  const stats = [
    { label: 'Total Products', value: 128 },
    { label: 'Total Orders', value: 342 },
    { label: 'Total Users', value: 76 },
  ];

  const [addOpened, setAddOpened] = useState(false);

  // collapse states
  const [trafficOpen, setTrafficOpen] = useState(false);
  const [revenueOpen, setRevenueOpen] = useState(false);

  const handleAdd = async (
    _id: string | undefined,
    data: ProductData,
    imageFile?: File | null
  ) => {
    await productService.postAddProduct(
      data.title,
      data.description,
      data.price,
      data.stock,
      imageFile
    );
  };

  // Example chart data (placeholder)
  const trafficData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [
      {
        label: 'Visitors',
        data: [120, 200, 150, 300, 250],
        fill: true,
        borderColor: '#42A5F5',
        tension: 0.4,
      },
    ],
  };

  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr'],
    datasets: [
      {
        label: 'Revenue ($)',
        data: [5000, 7000, 4000, 9000],
        backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#AB47BC'],
      },
    ],
  };

  return (
    <>
      <NavBar />

      <Container className={styles.container}>
        <Group className={styles.headerGroup}>
          <Title order={2}>Admin Dashboard</Title>
        </Group>

        {/*------------Stats------------*/}
        <div className={styles.statsContainer}>
          {stats.map((stat) => (
            <Card
              key={stat.label}
              shadow="sm"
              p="lg"
              withBorder
              className={styles.statCard}
            >
              <Text size="xl" fw={700}>
                {stat.value}
              </Text>
              <Text c="dimmed">{stat.label}</Text>
            </Card>
          ))}
        </div>

        {/*------------ Collapsible Sections ------------*/}
        <div className={styles.section}>
          <Paper
            withBorder
            p="sm"
            className={styles.sectionHeader}
            onClick={() => setTrafficOpen((o) => !o)}
          >
            <Title order={4}>Traffic Overview</Title>
          </Paper>
          <Collapse in={trafficOpen}>
            <Card p="lg" shadow="sm" withBorder>
              <Chart type="line" data={trafficData} />
            </Card>
          </Collapse>
        </div>

        <div className={styles.section}>
          <Paper
            withBorder
            p="sm"
            className={styles.sectionHeader}
            onClick={() => setRevenueOpen((o) => !o)}
          >
            <Title order={4}>Revenue Overview</Title>
          </Paper>
          <Collapse in={revenueOpen}>
            <Card p="lg" shadow="sm" withBorder>
              <Chart type="bar" data={revenueData} />
            </Card>
          </Collapse>
        </div>

        {/*------------ Manage Products ------------*/}
        <h2>Manage Products</h2>
        <Button
          variant="outline"
          size="sm"
          className={styles.addButton}
          onClick={() => setAddOpened(true)}
        >
          Add Product
        </Button>
      </Container>

      {/* -------- Add Product popup --------*/}
      <ProductModal
        opened={addOpened}
        title="Add Product"
        onClose={() => setAddOpened(false)}
        onSubmit={handleAdd}
        initialData={{ title: '', description: '', price: 0, stock: 0 }}
      />
    </>
  );
}
