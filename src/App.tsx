/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/post/:slug" element={<PostDetail />} />
          {/* Fallback for categories to Home for now, filtering logic is in Home but can be expanded */}
          <Route path="/category/:slug" element={<Home />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
