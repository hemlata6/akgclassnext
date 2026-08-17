import '../styles/globals.css';
import { AuthProvider } from '../config/AuthContext';
import { StudentProvider } from '../config/StudentContext';
import { ThemeProvider } from '../config/ThemeContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Network from '../config/Network';
import instId from '../config/instituteId';
import { Icons } from '../constants/Icons';
import Endpoints from '../config/endpoints';
import { Loader } from '../components/Shared/SharedComponents';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [announcements, setAnnouncements] = useState([]);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [isRouteLoading, setIsRouteLoading] = useState(false);

  // Fetch announcements on app load
  const fetchAnnouncements = async () => {
    try {
      const response = await Network.getAnnouncementList(instId);
      const announcementList = response?.announcement || response || [];
      const list = Array.isArray(announcementList) ? announcementList : [];
      setAnnouncements(list);

      // Show modal only if first announcement exists and has an image
      if (list.length > 0 && list[0]?.image) {
        setShowAnnouncementModal(true);
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
      setAnnouncements([]);
    }
  };

  useEffect(() => {
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

  useEffect(() => {
    // Show a loader while navigating between pages
    const handleRouteStart = () => setIsRouteLoading(true);
    const handleRouteEnd = () => setIsRouteLoading(false);

    router.events.on('routeChangeStart', handleRouteStart);
    router.events.on('routeChangeComplete', handleRouteEnd);
    router.events.on('routeChangeError', handleRouteEnd);

    return () => {
      router.events.off('routeChangeStart', handleRouteStart);
      router.events.off('routeChangeComplete', handleRouteEnd);
      router.events.off('routeChangeError', handleRouteEnd);
    };
  }, [router.events]);

  return (
    <ThemeProvider>
      <AuthProvider>
        <StudentProvider>
          <Component {...pageProps} />
          {isRouteLoading && <Loader />}

          {/* Announcement Modal */}
          {showAnnouncementModal && announcements.length > 0 && announcements[0]?.image && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden">
                <div className="relative">
                  {/* Close Button */}
                  <button
                    onClick={() => setShowAnnouncementModal(false)}
                    className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white rounded-full p-1 shadow-lg transition-all hover:scale-110"
                  >
                    <Icons.X size={10} className="text-slate-900" />
                  </button>

                  {/* Image */}
                  <img
                    src={`${Endpoints?.mediaBaseUrl}${announcements[0]?.image}`}
                    alt="Announcement"
                    className={`w-full h-auto object-cover ${announcements[0]?.type === 'link' && announcements[0]?.contentLink ? 'cursor-pointer' : ''}`}
                    onClick={() => {
                      if (announcements[0]?.type === 'link' && announcements[0]?.contentLink) {
                        window.open(announcements[0].contentLink, '_blank', 'noopener,noreferrer');
                      }
                    }}
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

