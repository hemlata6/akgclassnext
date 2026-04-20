import '../styles/globals.css';
import { AuthProvider } from '../config/AuthContext';
import { StudentProvider } from '../config/StudentContext';
import { ThemeProvider } from '../config/ThemeContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Network from '../config/Network';
import instId from '../config/instituteId';
import { Icons } from '../constants/Icons';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [announcements, setAnnouncements] = useState([]);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);

  // Fetch announcements on app load
  const fetchAnnouncements = async () => {
    try {
      const response = await Network.getAnnouncementList(instId);
      const announcementList = response?.announcement || response || [];
      const announcements = Array.isArray(announcementList) ? announcementList : [];
      setAnnouncements(announcements);

      // Show modal only if first announcement exists and has an image
      if (announcements.length > 0 && announcements[0]?.image) {
        setShowAnnouncementModal(true);
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
      setAnnouncements([]);
    }
  };

  const handleAnnouncementClick = () => {
    if (announcements[0]?.type === 'link' && announcements[0]?.contentLink) {
      // For internal links
      if (announcements[0]?.contentLink.startsWith('/')) {
        router.push(announcements[0]?.contentLink);
      } else {
        // For external links
        window.open(announcements[0]?.contentLink, '_blank');
      }
    }
  };

  useEffect(() => {
    // Fetch announcements on initial load
    fetchAnnouncements();
  }, []);

  useEffect(() => {
    // Scroll to top on route change
    const handleRouteChange = () => {
      window.scrollTo(0, 0);
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <ThemeProvider>
      <AuthProvider>
        <StudentProvider>
          <Component {...pageProps} />

          {/* Announcement Modal */}
          {showAnnouncementModal && announcements.length > 0 && announcements[0]?.image && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="relative">
                  {/* Close Button */}
                  <button
                    onClick={() => setShowAnnouncementModal(false)}
                    className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all hover:scale-110"
                  >
                    <Icons.X size={24} className="text-slate-900" />
                  </button>

                  {/* Image */}
                  <img
                    src={`${require('../config/endpoints').default?.mediaBaseUrl}${announcements[0]?.image}`}
                    alt="Announcement"
                    onClick={handleAnnouncementClick}
                    className={`w-full h-auto object-cover ${
                      announcements[0]?.type === 'link' ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''
                    }`}
                  />
                </div>
              </div>
            </div>
          )}
        </StudentProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default MyApp;

