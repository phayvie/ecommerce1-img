import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Userdashboard from './pages/user-dashboard/Userdashboard.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import NavigationBar from './components/NavigationBar.jsx';
import AdminBlogEditor from './pages/admin-blog-editor/AdminBlogEditor.jsx';
import ViewBlog from './pages/view-blog/ViewBlog.jsx'
import Blogs from './pages/blogs/Blogs.jsx'
import Footer from './components/Footer.jsx'
import Contact from './pages/contact/Contact.jsx'
import BlogsAdmin from './pages/blogsAdmin/BlogsAdmin.jsx'
import AdminHome from './pages/AdminHome/AdminHome.jsx'
import ProductsAdmin from './pages/products-admin/productsAdmin.jsx'
import ProductsUser from './pages/products-user/ProductsUser.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
        <NavigationBar />

      <Routes>
        <Route path='/' element={<App />} />
        <Route path='/products' element={<ProductsUser />} />
        <Route path='/products-admin' element={
          // <ProtectedRoute>
            <ProductsAdmin />
          // </ProtectedRoute>
        } />
        <Route path='/user-dashboard' element={
          // <ProtectedRoute>
            <Userdashboard />
          // </ProtectedRoute>
        } />
        <Route path='/admin-blog-editor' element={
          // <ProtectedRoute>
            <AdminBlogEditor />
          // </ProtectedRoute>
        } />
        <Route path="/admin-blog-editor/:id" element={<AdminBlogEditor />} />

        <Route path ='/blogs' element={<Blogs/>} />
        <Route path='/blogs-admin' element={
          // <ProtectedRoute>
            <BlogsAdmin />
          // </ProtectedRoute>
        } />

        <Route path="/blog/:blogId" element={<ViewBlog />} />
        <Route path='/contact' element={<Contact />} />

        <Route path='/admin-home' element={
          // <ProtectedRoute>
            <AdminHome />
          // </ProtectedRoute>  
        } />
        <Route path='/products-admin' element={
          // <ProtectedRoute>
            <ProductsAdmin />
          // </ProtectedRoute>
        } />

        {/* Fallback route for 404 */}

        <Route path='*' element={<h1>Page Not Found</h1>} />

      </Routes>

      <Footer/>

    </BrowserRouter>
  </StrictMode>,
)
