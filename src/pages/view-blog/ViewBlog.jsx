import React, { useEffect, useState } from 'react'; 
import { useParams } from 'react-router-dom'; 
import { doc, getDoc } from 'firebase/firestore'; 
import { db } from '/firebase'; 

export default function ViewBlog() { 
  const { blogId } = useParams(); // e.g., /blog/:blogId 
  const [blog, setBlog] = useState(null); 
  const [loading, setLoading] = useState(true); 

  useEffect(() => { 
    const fetchBlog = async () => { 
      try { 
        const docRef = doc(db, 'blogs', blogId); 
        const docSnap = await getDoc(docRef); 

        if (docSnap.exists()) { 
          setBlog(docSnap.data()); 
        } else { 
          console.log('No such blog found!'); 
        } 
      } catch (error) { 
        console.error('Error fetching blog:', error); 
      } finally { 
        setLoading(false); 
      } 
    }; 

    fetchBlog(); 
  }, [blogId]); 

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fdf8',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #257D26',
            borderTop: '4px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{
            color: '#257D26',
            fontSize: '1.1rem',
            fontWeight: '500'
          }}>Loading blog...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!blog) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fdf8',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(37, 125, 38, 0.1)',
          border: '1px solid #e8f5e8'
        }}>
          <div style={{
            fontSize: '4rem',
            marginBottom: '1rem'
          }}>📄</div>
          <h2 style={{
            color: '#257D26',
            marginBottom: '0.5rem',
            fontSize: '1.5rem'
          }}>Blog not found</h2>
          <p style={{
            color: '#666',
            margin: 0
          }}>The blog post you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fdf8',
      fontFamily: 'system-ui, -apple-system, sans-serif'

    }}>
      {/* Header with gradient */}
      <div style={{
        background: 'linear-gradient(135deg, #257D26 0%, #2d8f2f 100%)',
        padding: '3rem 0',
                      paddingTop: '6rem',


        marginBottom: '2rem'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '0 1rem'
        }}>
          <h1 style={{
            color: 'white',
            fontSize: '2.5rem',
            fontWeight: '700',
            margin: '0 0 1rem 0',
            lineHeight: '1.2',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            {blog.title}
          </h1>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(255,255,255,0.2)',
              padding: '0.5rem 1rem',
              borderRadius: '25px',
              backdropFilter: 'blur(10px)'
            }}>
              {/* <span style={{
                color: 'white',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}>
                ✍️ By {blog.author}
              </span> */}
            </div>
            
            {blog.publishedDate && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#F9AF16',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '25px',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}>
                📅 {new Date(blog.publishedDate).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '0 1rem 3rem 1rem'
      }}>
        <article style={{
          backgroundColor: 'white',
          padding: '2.5rem',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(37, 125, 38, 0.08)',
          border: '1px solid #e8f5e8',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Decorative accent */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '4px',
            background: 'linear-gradient(90deg, #257D26 0%, #F9AF16 100%)'
          }}></div>
          
          <div 
            className='blog-content'
            dangerouslySetInnerHTML={{ __html: blog.content }} 
            style={{
              lineHeight: '1.7',
              color: '#333',
              fontSize: '1.1rem'
            }}
          />
          
          {/* Enhanced typography styles via CSS */}
          <style>{`
            .blog-content h1, 
            .blog-content h2, 
            .blog-content h3, 
            .blog-content h4, 
            .blog-content h5, 
            .blog-content h6 {
              color: #257D26;
              margin-top: 2rem;
              margin-bottom: 1rem;
              font-weight: 600;
            }
            
            .blog-content h1 { 
              font-size: 2rem; 
              border-bottom: 3px solid #F9AF16; 
              padding-bottom: 0.5rem; 
            }
            
            .blog-content h2 { 
              font-size: 1.6rem; 
            }
            
            .blog-content h3 { 
              font-size: 1.3rem; 
            }
            
            .blog-content p {
              margin-bottom: 1.5rem;
              text-align: justify;
            }
            
            .blog-content a {
              color: #257D26;
              text-decoration: none;
              border-bottom: 2px solid #F9AF16;
              transition: all 0.2s ease;
            }
            
            .blog-content a:hover {
              background-color: #F9AF16;
              color: white;
              padding: 2px 4px;
              border-radius: 3px;
            }
            
            .blog-content blockquote {
              border-left: 4px solid #F9AF16;
              background-color: #f8fdf8;
              margin: 1.5rem 0;
              padding: 1rem 1.5rem;
              font-style: italic;
              border-radius: 0 8px 8px 0;
            }
            
            .blog-content ul, 
            .blog-content ol {
              margin-bottom: 1.5rem;
              padding-left: 1.5rem;
            }
            
            .blog-content li {
              margin-bottom: 0.5rem;
            }
            
            .blog-content code {
              background-color: #f8fdf8;
              padding: 2px 6px;
              border-radius: 4px;
              font-size: 0.9em;
              border: 1px solid #e8f5e8;
              color: #257D26;
            }
            
            .blog-content pre {
              background-color: #f8fdf8;
              padding: 1.5rem;
              border-radius: 8px;
              overflow: auto;
              border: 1px solid #e8f5e8;
              margin-bottom: 1.5rem;
            }
            
            .blog-content img {
              max-width: 100%;
              height: auto;
              border-radius: 8px;
              margin: 1.5rem 0;
              box-shadow: 0 4px 12px rgba(37, 125, 38, 0.1);
            }
            
            .blog-content strong {
              color: #257D26;
              font-weight: 600;
            }
          `}</style>
        </article>

        {/* Back to blog section */}
        <div style={{
          marginTop: '2rem',
          textAlign: 'center'
        }}>
          <button 
            onClick={() => window.history.back()}
            style={{
              backgroundColor: '#257D26',
              color: 'white',
              padding: '0.75rem 2rem',
              border: 'none',
              borderRadius: '25px',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(37, 125, 38, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#1f6b20';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(37, 125, 38, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#257D26';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(37, 125, 38, 0.3)';
            }}
          >
            ← Back to Blogs
          </button>
        </div>
      </div>
    </div>
  ); 
}