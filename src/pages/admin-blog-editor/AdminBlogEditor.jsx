import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getDoc, updateDoc } from "firebase/firestore";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Heading from "@tiptap/extension-heading";
import {TextStyle} from "@tiptap/extension-text-style";
import Image from "@tiptap/extension-image";
import { db, storage } from "/firebase";
import { collection, addDoc, serverTimestamp, doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Custom Popup Component
const Popup = ({ isVisible, message, onClose, isError = false }) => {
  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        padding: '2rem',
        maxWidth: '400px',
        width: '90%',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        textAlign: 'center',
        animation: 'fadeIn 0.3s ease-out'
      }}>
        <div style={{
          fontSize: '3rem',
          marginBottom: '1rem'
        }}>
          {isError ? '❌' : '✅'}
        </div>
        <h3 style={{
          margin: '0 0 1rem 0',
          fontSize: '1.5rem',
          fontWeight: '600',
          color: isError ? '#dc2626' : '#059669'
        }}>
          {isError ? 'Error' : 'Success!'}
        </h3>
        <p style={{
          margin: '0 0 1.5rem 0',
          fontSize: '1rem',
          color: '#6b7280',
          lineHeight: '1.5'
        }}>
          {message}
        </p>
        <button
          onClick={onClose}
          style={{
            backgroundColor: isError ? '#dc2626' : '#059669',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            minWidth: '100px'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = isError ? '#b91c1c' : '#047857';
            e.target.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = isError ? '#dc2626' : '#059669';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          OK
        </button>
      </div>
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

// Font size extension
const FontSize = TextStyle.extend({
  addAttributes() {
    return {
      fontSize: {
        default: null,
        parseHTML: element => element.style.fontSize || null,
        renderHTML: attributes => {
          if (!attributes.fontSize) return {};
          return { style: `font-size: ${attributes.fontSize}` };
        },
      },
    };
  },
});

export default function AdminBlogEditor() {
  const { id: blogId } = useParams();
  const [loadingBlog, setLoadingBlog] = useState(!!blogId); // only load if editing
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  
  // Popup state
  const [popup, setPopup] = useState({
    isVisible: false,
    message: '',
    isError: false
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Heading.configure({ levels: [1, 2, 3] }),
      FontSize,
      Image,
    ],
    content: "",
    autofocus: true,
  });

  // Function to show popup
  const showPopup = (message, isError = false) => {
    setPopup({
      isVisible: true,
      message,
      isError
    });
  };

  // Function to hide popup
  const hidePopup = () => {
    setPopup({
      isVisible: false,
      message: '',
      isError: false
    });
  };

// Fetch blog if editing
  useEffect(() => {
    if (!blogId) return;
    const fetchBlog = async () => {
      try {
        const blogRef = doc(db, "blogs", blogId);
        const blogSnap = await getDoc(blogRef);
        if (blogSnap.exists()) {
          const data = blogSnap.data();
          setTitle(data.title || "");
          setAuthor(data.author || "");
          editor?.commands.setContent(data.content || "");
        }
      } catch (error) {
        console.error("Error loading blog:", error);
      } finally {
        setLoadingBlog(false);
      }
    };
    fetchBlog();
  }, [blogId, editor]);

  const handleSave = async (status) => {
    if (!editor || !editor.getHTML().trim() || !title.trim() || !author.trim()) {
      showPopup("Title, author, and content are required", true);
      return;
    }
    setSaving(true);
    try {
      if (blogId) {
        // update existing blog
        const blogRef = doc(db, "blogs", blogId);
        await updateDoc(blogRef, {
          title,
          author,
          content: editor.getHTML(),
          status,
        });
        showPopup(`Blog updated as ${status}`);
      } else {
        // create new blog
        const docRef = doc(collection(db, "blogs"));
        await setDoc(docRef, {
          id: docRef.id,
          title,
          author,
          content: editor.getHTML(),
          status,
          createdAt: serverTimestamp(),
        });
        showPopup(`Blog saved as ${status}`);
      }
      editor.commands.clearContent();
      setTitle("");
      setAuthor("");
    } catch (err) {
      console.error(err);
      showPopup("An error occurred while saving the blog", true);
    } finally {
      setSaving(false);
    }
  };

  if (loadingBlog) {
    return <p style={{ textAlign: "center", padding: "2rem" }}>Loading blog...</p>;
  }

  if (!editor) return null;

  const toolbarButtonStyle = {
    padding: '8px 12px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#ffffff',
    color: '#374151',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    minWidth: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const activeButtonStyle = {
    ...toolbarButtonStyle,
    backgroundColor: '#f9af16',
    color: '#ffffff',
    borderColor: '#f9af16'
  };

  const actionButtonStyle = {
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    disabled: saving
  };

  const draftButtonStyle = {
    ...actionButtonStyle,
    backgroundColor: '#f3f4f6',
    color: '#374151',
    border: '2px solid #d1d5db'
  };

  const publishButtonStyle = {
    ...actionButtonStyle,
    backgroundColor: '#257d26',
    color: '#ffffff',
    boxShadow: '0 4px 6px -1px rgba(37, 125, 38, 0.1)'
  };

  return (
    <div 
    style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      padding: '2rem 1rem',
    }}>
      {/* Popup Component */}
      <Popup 
        isVisible={popup.isVisible}
        message={popup.message}
        isError={popup.isError}
        onClose={hidePopup}
      />

      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #f9af16 0%, #ffcc4a 100%)',
          padding: '2rem',
          color: '#ffffff'
        }}>
          <h2 

          style={{
            margin: '0',
            marginTop: '2.5rem',
            fontSize: '2rem',
            fontWeight: '700',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}>Create Blog Post</h2>
          <p style={{
            margin: '0.5rem 0 0 0',
            opacity: '0.9',
            fontSize: '1.1rem'
          }}>Craft your story with our modern editor</p>
        </div>

        {/* Editor Container */}
        <div style={{ padding: '2rem' }}>
          {/* Title Field */}
          <div style={{ marginBottom: '1.5rem' }}>
            <input
              type="text"
              placeholder="Enter your blog post title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '1rem 1.5rem',
                fontSize: '1.25rem',
                fontWeight: '600',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                backgroundColor: '#ffffff',
                color: '#374151',
                outline: 'none',
                transition: 'border-color 0.2s ease',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#f9af16'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          {/* Author Field */}
          <div style={{ marginBottom: '1.5rem' }}>
            <input
              type="text"
              placeholder="Enter author name..."
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              style={{
                width: '100%',
                padding: '1rem 1.5rem',
                fontSize: '1.1rem',
                fontWeight: '500',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                backgroundColor: '#ffffff',
                color: '#374151',
                outline: 'none',
                transition: 'border-color 0.2s ease',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#f9af16'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          {/* Toolbar */}
          <div style={{
            marginBottom: '1.5rem',
            padding: '1rem',
            backgroundColor: '#f8fafc',
            borderRadius: '12px',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
              alignItems: 'center'
            }}>
              <button
                style={editor.isActive('bold') ? activeButtonStyle : toolbarButtonStyle}
                onClick={() => editor.chain().focus().toggleBold().run()}
                onMouseEnter={(e) => {
                  if (!editor.isActive('bold')) {
                    e.target.style.backgroundColor = '#f1f5f9';
                    e.target.style.borderColor = '#cbd5e1';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!editor.isActive('bold')) {
                    e.target.style.backgroundColor = '#ffffff';
                    e.target.style.borderColor = '#e2e8f0';
                  }
                }}
              >
                <strong>B</strong>
              </button>

              <button
                style={editor.isActive('italic') ? activeButtonStyle : toolbarButtonStyle}
                onClick={() => editor.chain().focus().toggleItalic().run()}
                onMouseEnter={(e) => {
                  if (!editor.isActive('italic')) {
                    e.target.style.backgroundColor = '#f1f5f9';
                    e.target.style.borderColor = '#cbd5e1';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!editor.isActive('italic')) {
                    e.target.style.backgroundColor = '#ffffff';
                    e.target.style.borderColor = '#e2e8f0';
                  }
                }}
              >
                <em>I</em>
              </button>

              <button
                style={editor.isActive('underline') ? activeButtonStyle : toolbarButtonStyle}
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                onMouseEnter={(e) => {
                  if (!editor.isActive('underline')) {
                    e.target.style.backgroundColor = '#f1f5f9';
                    e.target.style.borderColor = '#cbd5e1';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!editor.isActive('underline')) {
                    e.target.style.backgroundColor = '#ffffff';
                    e.target.style.borderColor = '#e2e8f0';
                  }
                }}
              >
                <u>U</u>
              </button>

              <div style={{
                width: '1px',
                height: '32px',
                backgroundColor: '#e2e8f0',
                margin: '0 8px'
              }}></div>

              <button
                style={editor.isActive('heading', { level: 1 }) ? activeButtonStyle : toolbarButtonStyle}
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                onMouseEnter={(e) => {
                  if (!editor.isActive('heading', { level: 1 })) {
                    e.target.style.backgroundColor = '#f1f5f9';
                    e.target.style.borderColor = '#cbd5e1';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!editor.isActive('heading', { level: 1 })) {
                    e.target.style.backgroundColor = '#ffffff';
                    e.target.style.borderColor = '#e2e8f0';
                  }
                }}
              >
                H1
              </button>

              <button
                style={editor.isActive('heading', { level: 2 }) ? activeButtonStyle : toolbarButtonStyle}
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                onMouseEnter={(e) => {
                  if (!editor.isActive('heading', { level: 2 })) {
                    e.target.style.backgroundColor = '#f1f5f9';
                    e.target.style.borderColor = '#cbd5e1';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!editor.isActive('heading', { level: 2 })) {
                    e.target.style.backgroundColor = '#ffffff';
                    e.target.style.borderColor = '#e2e8f0';
                  }
                }}
              >
                H2
              </button>

              <button
                style={editor.isActive('heading', { level: 3 }) ? activeButtonStyle : toolbarButtonStyle}
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                onMouseEnter={(e) => {
                  if (!editor.isActive('heading', { level: 3 })) {
                    e.target.style.backgroundColor = '#f1f5f9';
                    e.target.style.borderColor = '#cbd5e1';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!editor.isActive('heading', { level: 3 })) {
                    e.target.style.backgroundColor = '#ffffff';
                    e.target.style.borderColor = '#e2e8f0';
                  }
                }}
              >
                H3
              </button>

              <div style={{
                width: '1px',
                height: '32px',
                backgroundColor: '#e2e8f0',
                margin: '0 8px'
              }}></div>

              {/* <button
                style={toolbarButtonStyle}
                onClick={handleImageUpload}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#f1f5f9';
                  e.target.style.borderColor = '#cbd5e1';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#ffffff';
                  e.target.style.borderColor = '#e2e8f0';
                }}
              >
                🖼️
              </button> */}
            </div>
          </div>

          {/* Editor */}
          <div style={{
            border: '2px solid #e2e8f0',
            borderRadius: '12px',
            overflow: 'hidden',
            transition: 'border-color 0.2s ease',
            position: 'relative'
          }}
          onFocus={(e) => e.currentTarget.style.borderColor = '#f9af16'}
          onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}>
            <EditorContent 
              editor={editor} 
              style={{
                padding: '1.5rem',
                minHeight: '400px',
                fontSize: '16px',
                lineHeight: '1.6',
                color: '#374151',
                backgroundColor: '#ffffff'
              }} 
            />
          </div>

          {/* Action Buttons */}
          <div style={{
            marginTop: '2rem',
            display: 'flex',
            gap: '1rem',
            justifyContent: 'flex-end',
            flexWrap: 'wrap'
          }}>
            {/* <button
              style={draftButtonStyle}
              onClick={() => handleSave("draft")}
              disabled={saving}
              onMouseEnter={(e) => {
                if (!saving) {
                  e.target.style.backgroundColor = '#e5e7eb';
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (!saving) {
                  e.target.style.backgroundColor = '#f3f4f6';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }
              }}
            >
              {saving ? '⏳ Saving...' : '📝 Save as Draft'}
            </button> */}

            <button
              style={publishButtonStyle}
              onClick={() => handleSave("published")}
              disabled={saving}
              onMouseEnter={(e) => {
                if (!saving) {
                  e.target.style.backgroundColor = '#1f6b24';
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 8px 15px -3px rgba(37, 125, 38, 0.2)';
                }
              }}
              onMouseLeave={(e) => {
                if (!saving) {
                  e.target.style.backgroundColor = '#257d26';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 6px -1px rgba(37, 125, 38, 0.1)';
                }
              }}
            >
              {saving ? '⏳ Publishing...' : '🚀 Publish'}
            </button>
          </div>
        </div>
      </div>

      {/* Custom styles for editor content */}
      <style>{`
        .ProseMirror {
          outline: none;
         background-color: rgb(248, 250, 252); 
        }
        
        .ProseMirror h1 {
          font-size: 2rem;
          font-weight: 700;
          margin: 1.5rem 0 1rem 0;
          color: #1f2937;
        }
        
        .ProseMirror h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 1.25rem 0 0.75rem 0;
          color: #374151;
        }
        
        .ProseMirror h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 1rem 0 0.5rem 0;
          color: #4b5563;
        }
        
        .ProseMirror p {
          margin: 0.75rem 0;
          line-height: 1.7;
        }
        
        .ProseMirror img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          margin: 1rem 0;
        }
        
        .ProseMirror strong {
          color: #1f2937;
        }
        
        .ProseMirror em {
          color: #4b5563;
        }
        
        .ProseMirror:empty:before {
          content: 'Start writing your blog post...';
          color: #9ca3af;
          font-style: italic;
          pointer-events: none;
        }
        
        @media (max-width: 768px) {
          .editor-container {
            margin: 1rem;
            border-radius: 12px;
          }
          
          .toolbar-container {
            padding: 0.75rem;
          }
          
          .editor-content {
            padding: 1rem;
          }
          
          .action-buttons {
            flex-direction: column;
          }
          
          .action-buttons button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}