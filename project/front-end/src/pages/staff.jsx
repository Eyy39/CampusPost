import React from 'react';
import Layout from '../components/Layout';

export default function StaffPage() {
  return (
    <Layout activePage="Staff">
      <div style={{ padding: '40px 24px', minHeight: '70vh' }}>
        <h1>University Staff Dashboard</h1>
        <p>This page is for university staff users.</p>
      </div>
    </Layout>
  );
}
