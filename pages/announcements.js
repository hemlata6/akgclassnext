import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Icons, LAYOUT_PADDING } from '../constants/Icons';
import Network from '../config/Network';
import instId from '../config/instituteId';
import Endpoints from '../config/endpoints';
import Layout from '../components/Layout';

const AnnouncementPage = () => {
  const router = useRouter();
  const [announcementList, setAnnouncementList] = useState([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAnnouncements = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await Network.getAnnouncementList(instId);
      if (response?.announcement) {
        setAnnouncementList(response.announcement);
      } else {
        setAnnouncementList([]);
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
      setError('Failed to load announcements. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchAnnouncements();
  }, []);

  const handleAnnouncementClick = (announcement) => {
    setSelectedAnnouncement(announcement);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setTimeout(() => setSelectedAnnouncement(null), 300);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recent';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDetailDate = (dateString) => {
    if (!dateString) return 'Recent';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 py-8 sm:py-12 lg:py-16">
        <div className={LAYOUT_PADDING}>
          {/* Header Section */}
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="text-3xl sm:text-4xl">📢</div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-700 to-emerald-900 bg-clip-text text-transparent">
                Announcements
              </h1>
            </div>
            <p className="text-sm sm:text-base lg:text-lg text-slate-600 max-w-xl mx-auto px-2">
              Stay updated with the latest news, updates, and important information
            </p>
          </div>

          {/* Refresh Button */}
          <div className="flex justify-center sm:justify-end mb-6 sm:mb-8">
            <button
              onClick={fetchAnnouncements}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              <span className={`${loading ? 'animate-spin' : ''}`}>🔄</span>
              Refresh
            </button>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-700 to-emerald-900 p-6 sm:p-8">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="text-2xl sm:text-3xl">📢</div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Latest Announcements</h2>
                <div className="ml-auto bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                  {announcementList.length} {announcementList.length === 1 ? 'announcement' : 'announcements'}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8">
              {/* Loading State */}
              {loading && (
                <div className="flex flex-col items-center justify-center py-16 sm:py-24">
                  <div className="text-4xl sm:text-5xl mb-4 animate-spin">⏳</div>
                  <p className="text-slate-600 text-sm sm:text-base">Loading announcements...</p>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="bg-red-50 border-l-4 border-red-600 p-4 mb-6 rounded">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-red-800 text-sm sm:text-base">Error Loading Announcements</h3>
                      <p className="text-red-700 text-xs sm:text-sm mt-1">{error}</p>
                    </div>
                    <button
                      onClick={fetchAnnouncements}
                      className="text-red-700 hover:text-red-800 font-medium text-xs sm:text-sm ml-4 whitespace-nowrap"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              )}

              {/* Announcements List */}
              {!loading && !error && (
                <div className="space-y-3 sm:space-y-4 max-h-96 sm:max-h-[600px] overflow-y-auto">
                  {announcementList.length > 0 ? (
                    announcementList.map((announcement, index) => (
                      <div
                        key={announcement.id || index}
                        onClick={() => handleAnnouncementClick(announcement)}
                        className="bg-gradient-to-r from-emerald-50 to-emerald-25 border border-emerald-200 rounded-xl p-4 sm:p-5 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:border-emerald-400"
                      >
                        <div className="flex items-start gap-3 sm:gap-4">
                          {/* Icon */}
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-700 to-emerald-900 rounded-full flex items-center justify-center flex-shrink-0 text-lg">
                            📢
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-slate-900 text-sm sm:text-base line-clamp-2">
                              {announcement.title || 'Important Announcement'}
                            </h3>
                            <p className="text-slate-700 text-xs sm:text-sm mt-1 line-clamp-2 sm:line-clamp-3">
                              {announcement.description || announcement.message || 'Stay updated with our latest news and updates.'}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-lg">📅</span>
                              <span className="text-emerald-700 font-medium text-xs">
                                {formatDate(announcement.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 sm:py-16">
                      <div className="text-5xl sm:text-6xl text-slate-300 mx-auto mb-3 sm:mb-4">📢</div>
                      <h3 className="font-bold text-slate-500 text-base sm:text-lg mb-1">
                        No Announcements Available
                      </h3>
                      <p className="text-slate-400 text-xs sm:text-sm">
                        Check back later for updates and important news.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Announcement Detail Modal */}
      {isDialogOpen && selectedAnnouncement && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-96 sm:max-h-[80vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-emerald-700 to-emerald-900 p-6 sm:p-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📢</span>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Announcement Details</h2>
              </div>
              <button
                onClick={closeDialog}
                className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8">
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
                {selectedAnnouncement.title || 'Important Announcement'}
              </h3>

              {/* Date */}
              <div className="flex items-center gap-2 mb-6">
                <span className="text-lg">📅</span>
                <span className="text-emerald-700 font-medium text-sm">
                  {formatDetailDate(selectedAnnouncement.createdAt)}
                </span>
              </div>

              {/* Image if exists */}
              {selectedAnnouncement.image && (
                <img
                  src={`${Endpoints?.mediaBaseUrl}${selectedAnnouncement.image}`}
                  alt={selectedAnnouncement.title}
                  className="w-full rounded-xl mb-6 max-h-64 object-cover"
                />
              )}

              {/* Description */}
              <div className="prose prose-sm max-w-none">
                <div
                  className="text-slate-700 leading-relaxed text-sm sm:text-base"
                  dangerouslySetInnerHTML={{
                    __html: selectedAnnouncement.announcement ||
                      selectedAnnouncement.description ||
                      selectedAnnouncement.message ||
                      selectedAnnouncement.content ||
                      'No detailed description available for this announcement.'
                  }}
                  style={{
                    fontSize: '14px',
                    lineHeight: '1.6'
                  }}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-slate-50 p-6 sm:p-8 border-t flex justify-end">
              <button
                onClick={closeDialog}
                className="px-6 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-medium transition-colors text-sm sm:text-base"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AnnouncementPage;
