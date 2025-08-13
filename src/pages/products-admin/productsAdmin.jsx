import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '/firebase';
import { Plus, Edit2, Trash2, Save, X, Filter, Search, AlertTriangle } from 'lucide-react';
import { supabase } from '/supabase'; // adjust path as needed

const ProductsAdmin = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);

  // Confirmation modal state
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    onConfirm: () => { },
    type: 'danger' // 'danger' or 'warning'
  });

  // Product form state
  const [productForm, setProductForm] = useState({
    name: '',
    picture: '',
    description: '',
    category: ''
  });

  // Category form state
  const [categoryForm, setCategoryForm] = useState('');
  // Add state for file and preview
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  // Add state for image loading states
  const [imageLoadingStates, setImageLoadingStates] = useState({});
  // Add notification state
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'error' // 'error', 'success', 'warning'
  });

  // Add notification helper function
  const showNotification = (message, type = 'error') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'error' });
    }, 5000); // Auto-hide after 5 seconds
  };

  // Update the handleFileChange function to use Supabase:
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showNotification('Please select an image file', 'error');
        return
      }

      // Update file size limit to 1MB and provide graceful feedback
      const maxSize = 1 * 1024 * 1024; // 1MB in bytes
      if (file.size > maxSize) {
        const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
        showNotification(`File size (${fileSizeMB}MB) exceeds the 1MB limit. Please choose a smaller image file.`, 'error');
        return
      }

      setPreviewUrl(URL.createObjectURL(file))
      uploadToSupabase(file)
    }
  }

  // Function to set image loading state
  const setImageLoading = (productId, isLoading) => {
    setImageLoadingStates(prev => ({
      ...prev,
      [productId]: isLoading
    }));
  };

  // Function to handle image load success
  const handleImageLoad = (productId) => {
    setImageLoading(productId, false);
  };

  // Function to handle image load error
  const handleImageError = (productId, e) => {
    setImageLoading(productId, false);
    e.target.style.display = 'none';
    e.target.nextSibling.style.display = 'flex';
  };

  // Also fix the delete function
  const deleteOldImage = async (imageUrl) => {
    try {
      if (!imageUrl.includes('supabase')) return

      // Extract just the filename from the URL
      const urlParts = imageUrl.split('/object/public/product-images/')
      if (urlParts.length > 1) {
        const fileName = urlParts[1].split('?')[0] // Remove query params if any

        console.log('Deleting file:', fileName)

        const { error } = await supabase.storage
          .from('product-images')
          .remove([fileName])

        if (error) {
          console.error('Error deleting old image:', error)
        } else {
          console.log('Successfully deleted old image')
        }
      }
    } catch (error) {
      console.error('Error deleting old image:', error)
    }
  }

  // Fixed upload function - remove the extra folder path
  const uploadToSupabase = async (file) => {
    try {
      setUploading(true);

      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

      // DON'T add "product-images/" here - just use the filename
      // The bucket name is already specified in .from('product-images')
      const filePath = fileName

      console.log('Uploading file:', fileName, 'to bucket: product-images')

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('product-images') // Bucket name
        .upload(filePath, file, {  // Just the filename
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error('Supabase upload error:', error)
        showNotification('Upload failed: ' + error.message, 'error');
        setUploading(false)
        return
      }

      console.log('Upload successful:', data)

      // Get public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath)

      console.log('Public URL:', publicUrl)

      // Update form with the public URL
      setProductForm((prev) => ({ ...prev, picture: publicUrl }))
      setUploading(false)

    } catch (error) {
      console.error('Upload failed:', error)
      showNotification('Upload failed: ' + error.message, 'error');
      setUploading(false)
    }
  }

  // Custom confirmation function
  const showConfirmation = (config) => {
    setConfirmConfig({
      title: config.title || 'Confirm Action',
      message: config.message || 'Are you sure?',
      confirmText: config.confirmText || 'Confirm',
      cancelText: config.cancelText || 'Cancel',
      onConfirm: config.onConfirm || (() => { }),
      type: config.type || 'danger'
    });
    setShowConfirmModal(true);
  };

  const handleConfirm = () => {
    confirmConfig.onConfirm();
    setShowConfirmModal(false);
  };

  const handleCancel = () => {
    setShowConfirmModal(false);
  };

  // Fetch products from Firebase
  const fetchProducts = async () => {
    try {
      const productsCollection = collection(db, 'products');
      const productSnapshot = await getDocs(productsCollection);
      const productList = productSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Sort alphabetically by name
      const sortedProducts = productList.sort((a, b) => a.name.localeCompare(b.name));
      setProducts(sortedProducts);
      setFilteredProducts(sortedProducts);
      
      // Initialize loading states for all products with images
      const loadingStates = {};
      sortedProducts.forEach(product => {
        if (product.picture) {
          loadingStates[product.id] = true;
        }
      });
      setImageLoadingStates(loadingStates);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Fetch categories from Firebase
  const fetchCategories = async () => {
    try {
      const settingsRef = doc(db, 'settings', 'products');
      const settingsSnap = await getDoc(settingsRef);

      if (settingsSnap.exists()) {
        const data = settingsSnap.data();
        const categoryList = data.category || [];
        // Sort alphabetically
        const sortedCategories = categoryList.sort((a, b) => a.localeCompare(b));
        setCategories(sortedCategories);
      } else {
        // Create default categories if document doesn't exist
        const defaultCategories = [
          'earpod', 'headset', 'earpiece', 'smart watches', 'chargers',
          'screen guards', 'phone pouches', 'ring lights', 'phone stands', 'cables'
        ].sort();
        await setDoc(settingsRef, { category: defaultCategories });
        setCategories(defaultCategories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Initial data fetch
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchProducts(), fetchCategories()]);
      setLoading(false);
    };
    loadData();
  }, []);

  // Filter and search products
  useEffect(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchTerm]);

  // Product CRUD operations
  const handleAddProduct = async () => {
    try {
      await addDoc(collection(db, 'products'), productForm);
      await fetchProducts();
      resetProductForm();
      setShowProductModal(false);
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  // Update handleEditProduct to optionally delete old image:
  const handleEditProduct = async () => {
    try {
      const productRef = doc(db, 'products', editingProduct.id)

      // If image was changed, delete old image
      if (editingProduct.picture &&
        productForm.picture !== editingProduct.picture &&
        editingProduct.picture.includes('supabase')) {
        await deleteOldImage(editingProduct.picture)
      }

      await updateDoc(productRef, productForm)
      await fetchProducts()
      resetProductForm()
      setShowProductModal(false)
    } catch (error) {
      console.error('Error updating product:', error)
    }
  }

  // Update handleDeleteProduct to also delete associated image:
  const handleDeleteProduct = async (productId) => {
    showConfirmation({
      title: 'Delete Product',
      message: 'Are you sure you want to delete this product? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger',
      onConfirm: async () => {
        try {
          // Find the product to get image URL
          const product = products.find(p => p.id === productId)

          // Delete image from Supabase if it exists
          if (product?.picture && product.picture.includes('supabase')) {
            await deleteOldImage(product.picture)
          }

          // Delete product from Firestore
          await deleteDoc(doc(db, 'products', productId))
          await fetchProducts()
        } catch (error) {
          console.error('Error deleting product:', error)
        }
      }
    })
  }

  // Category CRUD operations
  const handleAddCategory = async () => {
    try {
      const newCategories = [...categories, categoryForm].sort((a, b) => a.localeCompare(b));
      const settingsRef = doc(db, 'settings', 'products');
      await setDoc(settingsRef, { category: newCategories });
      setCategories(newCategories);
      setCategoryForm('');
      setShowCategoryModal(false);
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleEditCategory = async () => {
    try {
      const updatedCategories = categories.map(cat =>
        cat === editingCategory ? categoryForm : cat
      ).sort((a, b) => a.localeCompare(b));

      const settingsRef = doc(db, 'settings', 'products');
      await setDoc(settingsRef, { category: updatedCategories });
      setCategories(updatedCategories);
      setCategoryForm('');
      setEditingCategory(null);
      setShowCategoryModal(false);
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const handleDeleteCategory = async (categoryToDelete) => {
    showConfirmation({
      title: 'Delete Category',
      message: `Are you sure you want to delete the "${categoryToDelete}" category? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger',
      onConfirm: async () => {
        try {
          const updatedCategories = categories.filter(cat => cat !== categoryToDelete);
          const settingsRef = doc(db, 'settings', 'products');
          await setDoc(settingsRef, { category: updatedCategories });
          setCategories(updatedCategories);

          // Reset filter if deleted category was selected
          if (selectedCategory === categoryToDelete) {
            setSelectedCategory('all');
          }
        } catch (error) {
          console.error('Error deleting category:', error);
        }
      }
    });
  };

  // Helper function to convert Google Drive sharing link to direct image link
  // Helper function to convert Google Drive sharing link to direct image link
  const formatGoogleDriveImageUrl = (url) => {
    if (!url) return '';

    url = url.trim();

    // Always try to extract the file ID from any Google Drive link
    let fileId = null;

    // Match standard Google Drive share link formats
    let match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (match) fileId = match[1];

    if (!fileId) {
      match = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      if (match) fileId = match[1];
    }

    if (!fileId && /^[a-zA-Z0-9_-]{25,}$/.test(url)) {
      fileId = url; // Just the file ID
    }

    // If a file ID is found, return direct-view link
    if (fileId) {
      return `https://drive.google.com/uc?export=view&id=${fileId}`;
    }

    // If it's not a Google Drive link, return original URL
    return url;
  };

  // Form handlers
  const resetProductForm = () => {
    setProductForm({ name: '', picture: '', description: '', category: '' });
    setEditingProduct(null);
    setPreviewUrl(''); // Clear preview URL when resetting form
  };

  const openProductModal = (product = null) => {
    if (product) {
      setProductForm(product);
      setEditingProduct(product);
    } else {
      resetProductForm();
    }
    setShowProductModal(true);
  };

  const openCategoryModal = (category = null) => {
    if (category) {
      setCategoryForm(category);
      setEditingCategory(category);
    } else {
      setCategoryForm('');
      setEditingCategory(null);
    }
    setShowCategoryModal(true);
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingText}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Notification Component */}
      {notification.show && (
        <div style={styles.notification}>
          <div style={{
            ...styles.notificationContent,
            backgroundColor: notification.type === 'error' ? '#fef2f2' : 
                           notification.type === 'success' ? '#f0fdf4' : '#fffbeb',
            borderColor: notification.type === 'error' ? '#fecaca' : 
                        notification.type === 'success' ? '#bbf7d0' : '#fed7aa',
            color: notification.type === 'error' ? '#dc2626' : 
                  notification.type === 'success' ? '#16a34a' : '#d97706'
          }}>
            <span>{notification.message}</span>
            <button 
              onClick={() => setNotification({ show: false, message: '', type: 'error' })}
              style={styles.notificationClose}
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      <div style={styles.wrapper}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>Admin Dashboard</h1>
          <p style={styles.subtitle}>Manage your products and categories</p>
        </div>

        {/* Action Buttons */}
        <div style={styles.actionButtons}>
          <button
            onClick={() => openProductModal()}
            style={styles.primaryButton}
          >
            <Plus size={20} />
            Add Product
          </button>
          <button
            onClick={() => openCategoryModal()}
            style={styles.secondaryButton}
          >
            <Plus size={20} />
            Add Category
          </button>
        </div>

        {/* Filters and Search */}
        <div style={styles.filterSection}>
          <div style={styles.filterContent}>
            <div style={styles.filterGroup}>
              <Filter size={20} color="#6b7280" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={styles.select}
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.searchGroup}>
              <Search size={20} color="#6b7280" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
              />
            </div>
          </div>
        </div>

        {/* Category Management */}
        <div style={styles.categorySection}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Categories</h2>
          </div>
          <div style={styles.categoriesContent}>
            <div style={styles.categoryTags}>
              {categories.map(category => (
                <div key={category} style={styles.categoryTag}>
                  <span style={styles.categoryName}>{category}</span>
                  <button
                    onClick={() => openCategoryModal(category)}
                    style={styles.editButton}
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category)}
                    style={styles.deleteButton}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div style={styles.productsSection}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>
              Products ({filteredProducts.length})
            </h2>
          </div>

          {filteredProducts.length === 0 ? (
            <div style={styles.emptyState}>
              No products found. {searchTerm || selectedCategory !== 'all' ? 'Try adjusting your filters.' : 'Add your first product to get started.'}
            </div>
          ) : (
            <div style={styles.productsGrid}>
              {filteredProducts.map(product => (
                <div key={product.id} style={styles.productCard}>

                  <div style={styles.productImage}>
                    {product.picture ? (
                      <>
                        {imageLoadingStates[product.id] && (
                          <div style={styles.imageLoader}>
                            <div style={styles.loadingSpinner}></div>
                            <div style={styles.loadingText}>Loading image...</div>
                          </div>
                        )}
                        <img
                          src={product.picture} // Use product.picture directly (no need for formatGoogleDriveImageUrl for Supabase)
                          alt={product.name}
                          loading="lazy"
                          style={{
                            ...styles.image,
                            display: imageLoadingStates[product.id] ? 'none' : 'block'
                          }}
                          onLoad={() => handleImageLoad(product.id)}
                          onError={(e) => handleImageError(product.id, e)}
                        />
                      </>
                    ) : null}

                    <div
                      style={{
                        ...styles.noImage,
                        display: product.picture && !imageLoadingStates[product.id] ? 'none' : 'flex'
                      }}
                    >
                      {product.picture ? 'Image Failed to Load' : 'No Image'}
                    </div>
                  </div>
                  <div style={styles.productInfo}>
                    <h3 style={styles.productName}>{product.name}</h3>
                    <p style={styles.productCategory}>{product.category}</p>
                    <p style={styles.productDescription}>{product.description}</p>

                    <div style={styles.productActions}>
                      <button
                        onClick={() => openProductModal(product)}
                        style={styles.editActionButton}
                      >
                        <Edit2 size={16} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        style={styles.deleteActionButton}
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Product Modal */}
      {showProductModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>
                {editingProduct ? 'Edit Product' : 'Add Product'}
              </h3>
              <button
                onClick={() => setShowProductModal(false)}
                style={styles.closeButton}
              >
                <X size={24} />
              </button>
            </div>

            <div style={styles.modalContent}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Name</label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  style={styles.input}
                  placeholder="Product name"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Picture</label>
                <div style={styles.imageSizeInfo}>
                  📏 Recommended: Square images (1:1 aspect ratio), max 1MB. Best sizes: 500x500px or 800x800px for optimal display quality.
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={styles.input}
                />
                {uploading && (
                  <div style={styles.uploadingMessage}>
                    <div style={styles.loadingSpinner}></div>
                    Uploading image...
                  </div>
                )}

                {previewUrl && (
                  <div style={styles.previewSection}>
                    <div style={styles.previewLabel}>Preview:</div>
                    <img src={previewUrl} alt="Preview" style={styles.previewImage} />
                  </div>
                )}

                {productForm.picture && !previewUrl && (
                  <div style={styles.previewSection}>
                    <div style={styles.previewLabel}>Preview:</div>
                    <img src={productForm.picture} alt="Preview" style={styles.previewImage} />
                  </div>
                )}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Category</label>
                <select
                  value={productForm.category}
                  onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                  style={styles.input}
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Description</label>
                <textarea
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  style={styles.textarea}
                  placeholder="Product description"
                />
              </div>
            </div>

            <div style={styles.modalFooter}>
              <button
                onClick={() => setShowProductModal(false)}
                style={styles.cancelButton}
              >
                Cancel
              </button>
              <button
                onClick={editingProduct ? handleEditProduct : handleAddProduct}
                disabled={!productForm.name || !productForm.category}
                style={{
                  ...styles.saveButton,
                  backgroundColor: (!productForm.name || !productForm.category) ? '#9ca3af' : '#3b8a3c',
                  cursor: (!productForm.name || !productForm.category) ? 'not-allowed' : 'pointer',
                  opacity: (!productForm.name || !productForm.category) ? 0.5 : 1
                }}
              >
                <Save size={16} />
                {editingProduct ? 'Update' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>
                {editingCategory ? 'Edit Category' : 'Add Category'}
              </h3>
              <button
                onClick={() => setShowCategoryModal(false)}
                style={styles.closeButton}
              >
                <X size={24} />
              </button>
            </div>

            <div style={styles.modalContent}>
              <label style={styles.label}>Category Name</label>
              <input
                type="text"
                value={categoryForm}
                onChange={(e) => setCategoryForm(e.target.value)}
                style={styles.input}
                placeholder="Category name"
              />
            </div>

            <div style={styles.modalFooter}>
              <button
                onClick={() => setShowCategoryModal(false)}
                style={styles.cancelButton}
              >
                Cancel
              </button>
              <button
                onClick={editingCategory ? handleEditCategory : handleAddCategory}
                disabled={!categoryForm.trim()}
                style={{
                  ...styles.categorySaveButton,
                  backgroundColor: !categoryForm.trim() ? '#9ca3af' : '#f9af16',
                  cursor: !categoryForm.trim() ? 'not-allowed' : 'pointer',
                  opacity: !categoryForm.trim() ? 0.5 : 1
                }}
              >
                <Save size={16} />
                {editingCategory ? 'Update' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Confirmation Modal */}
      {showConfirmModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.confirmModal}>
            <div style={styles.confirmModalContent}>
              <div style={styles.confirmIcon}>
                <AlertTriangle
                  size={48}
                  color={confirmConfig.type === 'danger' ? '#dc2626' : '#f59e0b'}
                />
              </div>

              <div style={styles.confirmText}>
                <h3 style={styles.confirmTitle}>{confirmConfig.title}</h3>
                <p style={styles.confirmMessage}>{confirmConfig.message}</p>
              </div>

              <div style={styles.confirmActions}>
                <button
                  onClick={handleCancel}
                  style={styles.confirmCancelButton}
                >
                  {confirmConfig.cancelText}
                </button>
                <button
                  onClick={handleConfirm}
                  style={{
                    ...styles.confirmButton,
                    backgroundColor: confirmConfig.type === 'danger' ? '#dc2626' : '#f59e0b'
                  }}
                >
                  {confirmConfig.confirmText}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
    padding: '24px',
    paddingTop: '6.5rem',
  },
  wrapper: {
    maxWidth: '1280px',
    margin: '0 auto'
  },
  loadingContainer: {
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  loadingText: {
    fontSize: '20px',
    color: '#6b7280'
  },
  header: {
    marginBottom: '32px'
  },
  title: {
    fontSize: '30px',
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: '8px',
    margin: 0
  },
  subtitle: {
    color: '#6b7280',
    margin: 0
  },
  actionButtons: {
    marginBottom: '24px',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px'
  },
  primaryButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#3b8a3c',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background-color 0.2s'
  },
  secondaryButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#f9af16',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background-color 0.2s'
  },
  filterSection: {
    marginBottom: '24px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    padding: '16px'
  },
  filterContent: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px'
  },
  filterGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  select: {
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    padding: '8px 12px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s'
  },
  searchGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flex: '1',
    maxWidth: '384px'
  },
  searchInput: {
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    padding: '8px 12px',
    flex: '1',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s'
  },
  categorySection: {
    marginBottom: '32px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  },
  sectionHeader: {
    padding: '16px',
    borderBottom: '1px solid #e5e7eb'
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#111827',
    margin: 0
  },
  categoriesContent: {
    padding: '16px'
  },
  categoryTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px'
  },
  categoryTag: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#f3f4f6',
    borderRadius: '8px',
    padding: '4px 12px'
  },
  categoryName: {
    textTransform: 'capitalize'
  },
  editButton: {
    color: '#2563eb',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '2px',
    display: 'flex',
    alignItems: 'center'
  },
  deleteButton: {
    color: '#dc2626',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '2px',
    display: 'flex',
    alignItems: 'center'
  },
  productsSection: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  },
  emptyState: {
    padding: '32px',
    textAlign: 'center',
    color: '#6b7280'
  },
  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '24px',
    padding: '24px'
  },
  productCard: {
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    overflow: 'hidden',
    transition: 'box-shadow 0.2s'
  },
  productImage: {
    aspectRatio: '1',
    backgroundColor: '#f3f4f6',
    position: 'relative'
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  imageLoader: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
    color: '#9ca3af',
    fontSize: '14px',
    gap: '8px'
  },
  loadingSpinner: {
    width: '24px',
    height: '24px',
    border: '3px solid #e5e7eb',
    borderTop: '3px solid #3b8a3c',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  noImage: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#9ca3af'
  },
  productInfo: {
    padding: '16px'
  },
  productName: {
    fontWeight: '600',
    color: '#111827',
    marginBottom: '4px',
    margin: '0 0 4px 0'
  },
  productCategory: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '8px',
    textTransform: 'capitalize',
    margin: '0 0 8px 0'
  },
  productDescription: {
    fontSize: '14px',
    color: '#374151',
    marginBottom: '12px',
    lineHeight: '1.4',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    margin: '0 0 12px 0'
  },
  productActions: {
    display: 'flex',
    gap: '8px'
  },
  editActionButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    color: '#2563eb',
    fontSize: '14px',
    background: 'none',
    border: 'none',
    cursor: 'pointer'
  },
  deleteActionButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    color: '#dc2626',
    fontSize: '14px',
    background: 'none',
    border: 'none',
    cursor: 'pointer'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
    zIndex: 10000
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '8px',
    maxWidth: '448px',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto'
  },
  modalHeader: {
    padding: '16px',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  modalTitle: {
    fontSize: '18px',
    fontWeight: '600',
    margin: 0
  },
  closeButton: {
    color: '#6b7280',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center'
  },
  modalContent: {
    padding: '16px'
  },
  formGroup: {
    marginBottom: '16px'
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '4px'
  },
  input: {
    width: '100%',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    padding: '8px 12px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box'
  },
  textarea: {
    width: '100%',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    padding: '8px 12px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
    minHeight: '80px',
    resize: 'vertical',
    fontFamily: 'inherit',
    boxSizing: 'border-box'
  },
  imageSizeInfo: {
    fontSize: '12px',
    color: '#6b7280',
    backgroundColor: '#f9fafb',
    padding: '8px 12px',
    borderRadius: '6px',
    marginBottom: '8px',
    border: '1px solid #e5e7eb',
    lineHeight: '1.4'
  },
  uploadingMessage: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '8px',
    color: '#6b7280',
    fontSize: '14px'
  },
  modalFooter: {
    padding: '16px',
    borderTop: '1px solid #e5e7eb',
    display: 'flex',
    gap: '8px',
    justifyContent: 'flex-end'
  },
  cancelButton: {
    padding: '8px 16px',
    color: '#6b7280',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    background: 'white',
    cursor: 'pointer',
    fontSize: '14px'
  },
  saveButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    color: 'white',
    borderRadius: '8px',
    border: 'none',
    fontSize: '14px',
    transition: 'background-color 0.2s'
  },
  categorySaveButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    color: 'white',
    borderRadius: '8px',
    border: 'none',
    fontSize: '14px',
    transition: 'background-color 0.2s'
  },
  // Custom Confirmation Modal Styles
  confirmModal: {
    backgroundColor: 'white',
    borderRadius: '12px',
    maxWidth: '400px',
    width: '100%',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)'
  },
  confirmModalContent: {
    padding: '24px',
    textAlign: 'center'
  },
  confirmIcon: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '16px'
  },
  confirmText: {
    marginBottom: '24px'
  },
  confirmTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '8px',
    margin: '0 0 8px 0'
  },
  confirmMessage: {
    fontSize: '14px',
    color: '#6b7280',
    lineHeight: '1.5',
    margin: 0
  },
  confirmActions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center'
  },
  confirmCancelButton: {
    padding: '10px 20px',
    color: '#6b7280',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    background: 'white',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s',
    minWidth: '80px'
  },
  confirmButton: {
    padding: '10px 20px',
    color: 'white',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s',
    minWidth: '80px'
  },
  inputHint: {
    fontSize: '12px',
    color: '#6b7280',
    marginTop: '4px',
    lineHeight: '1.4'
  },
  previewSection: {
    marginTop: '12px',
    padding: '12px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    border: '1px solid #e5e7eb'
  },
  previewLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '8px'
  },
  previewImageContainer: {
    position: 'relative',
    width: '80px',
    height: '80px',
    backgroundColor: '#f3f4f6',
    borderRadius: '6px',
    overflow: 'hidden',
    marginBottom: '8px'
  },
  previewImage: {
    width: '80px',
    height: '80px',
    objectFit: 'cover',
    borderRadius: '6px'
  },
  previewError: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '10px',
    color: '#9ca3af',
    textAlign: 'center',
    position: 'absolute',
    top: 0,
    left: 0
  },
  formattedUrl: {
    fontSize: '11px',
    color: '#6b7280',
    wordBreak: 'break-all',
    lineHeight: '1.3'
  },
  // Notification styles
  notification: {
    position: 'fixed',
    top: '80px',
    right: '24px',
    zIndex: 60,
    maxWidth: '400px'
  },
  notificationContent: {
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    fontSize: '14px',
    fontWeight: '500'
  },
  notificationClose: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    opacity: 0.7,
    transition: 'opacity 0.2s'
  }
}

export default ProductsAdmin;