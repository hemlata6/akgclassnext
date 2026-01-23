import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../config/AuthContext';
import { Loader } from '../../components/Shared/SharedComponents';
import BookDetailPage from './BookDetailPage';
import Network from '../../config/Network';
import instId from '../../config/instituteId';

function BookDetailWrapper() {
  const router = useRouter();
  const { bookId } = router.query;
  const { authToken } = useAuth();
  const [bookData, setBookData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bookId) return;

    // Fetch book detail from API
    const fetchBookDetail = async () => {
      try {
        setLoading(true);
        const response = authToken 
          ? await Network.getStudentAuthCourse(authToken) 
          : await Network.getFreeCourseList(instId);
        const courses = response?.courses || response || [];
        // Convert bookId to number for comparison
        const book = courses.find(c => c.id === parseInt(bookId) && c.type === "books");
        setBookData(book || null);
      } catch (err) {
        console.error('Error fetching book:', err);
        setBookData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetail();
  }, [bookId, authToken]);

  if (loading) return <Loader />;

  if (!bookData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-emerald-50">
        <div className="text-center animate-in fade-in zoom-in duration-500">
          <div className="text-6xl mb-4">📚</div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Book Not Found</h1>
          <p className="text-slate-600 mb-6">The book you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={() => router.push('/')} 
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-bold shadow-lg transition-all active:scale-95"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <BookDetailPage
      bookData={bookData}
      onBack={() => router.push('/')}
    />
  );
}

export default BookDetailWrapper;

