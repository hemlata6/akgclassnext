import { useAuth } from '@/config/AuthContext';
import instId from '@/config/instituteId';
import { Network } from 'lucide-react';
import React, { useEffect, useState } from 'react'

function AnnouncementsHeader() {

  const { user, logout, institute, instituteAppSettingsModals } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [announcementIndex, setAnnouncementIndex] = useState(0);

  useEffect(() => {

    // fetchCoursesData();
    fetchAnnouncements();
  }, [user]);

  const fetchAnnouncements = async () => {
    try {
      const response = await Network.getAnnouncementList(instId);
      const announcementList = response?.announcement || response || [];
      setAnnouncements(Array.isArray(announcementList) ? announcementList : []);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      setAnnouncements([]);
    }
  };

  const announcementTitles = announcements.length > 0
    ? announcements.map((item) => item?.title).filter(Boolean)
    : [
      'New CA Inter Batches Starting Soon!',
      'Get 10% Off on All Video Lectures'
    ];

  useEffect(() => {
    const timer = setInterval(() => {
      setAnnouncementIndex((prev) => (prev + 1) % Math.max(announcementTitles.length, 1));
    }, 5000);

    return () => clearInterval(timer);
  }, [announcementTitles.length]);


  return (
    <>
      {/* --- A. TOP ANNOUNCEMENT STRIP --- */}
      <div className="text-white py-3 text-[13px] font-bold px-4">
        <div className="flex justify-between items-center">
          <div
            className="flex-1 text-left transition-all duration-700 ease-in-out tracking-wide cursor-pointer"
            onClick={() => router.push('/announcements')}
          >
            <div
              className="flex-1 text-left text-white transition-all duration-700 ease-in-out tracking-wide cursor-pointer"
              onClick={() => router.push('/announcements')}
            >
              <span className="bg-[#e11d48] text-white px-3 py-1 rounded-full mr-4 text-[9px] animate-pulse shadow-lg shadow-[#e11d48]/30 uppercase">
                Update
              </span>

              {announcementTitles[announcementIndex]}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AnnouncementsHeader