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

    const handleRedirectAnnouncement = (link) => {
        // const rawLink = slide?.contentLink || slide?.contentlink || slide?.link;
        // if (rawLink) {
            const targetLink = /^https?:\/\//i.test(link) ? link : `https://${link}`;
            window.open(targetLink, '_blank', 'noopener,noreferrer');
        // }
    };

  return (
    <ThemeProvider>
      <AuthProvider>
        <StudentProvider>
          <Component {...pageProps} />

          {/* Announcement Modal */}
          {showAnnouncementModal && announcements.length > 0 && announcements[0]?.image && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in duration-300 relative">
                <button
                  onClick={() => setShowAnnouncementModal(false)}
                  className="absolute top-0 right-3 z-20 bg-red-600 hover:bg-red-700 rounded-full p-0 shadow-lg transition-all hover:scale-110 flex items-center justify-center"
                  title="Close"
                >
                  <Icons.X size={15} className="text-white font-bold" />
                </button>

                <div className="relative">
                  <img
                    style={{
                      cursor: 'pointer'
                    }}
                    onClick={()=> handleRedirectAnnouncement(announcements[0]?.contentLink)}
                    src={`${require('../config/endpoints').default?.mediaBaseUrl}${announcements[0]?.image}`}
                    alt="Announcement"
                    className="w-full h-auto object-cover"
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

