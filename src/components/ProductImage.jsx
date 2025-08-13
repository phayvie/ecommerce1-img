// Product Image Component
import React, { useState } from 'react';

const ProductImage = ({ src, alt }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="product-image-box">
      {!loaded && (
        <div className="image-placeholder">
          📦 Loading...
        </div>
      )}
      <img
        src={src}
        alt={alt}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: loaded ? "block" : "none"
        }}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
};

export default ProductImage;