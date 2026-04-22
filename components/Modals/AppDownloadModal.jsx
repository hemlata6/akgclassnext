import React from 'react';
import { Dialog, DialogContent, IconButton, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const AppDownloadModal = ({ open, onClose, brandColor = '#0d5a3e' }) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="xs" 
      fullWidth 
      sx={{ zIndex: 1300 }}
    >
      <DialogContent sx={{ p: 0 }}>
        <Box
          sx={{
            backgroundColor: 'white',
            borderRadius: '12px',
            overflow: 'hidden',
          }}
        >
          {/* Modal Header */}
          <Box sx={{ position: 'relative', p: 3, pb: 2, textAlign: 'center' }}>
            <IconButton
              onClick={onClose}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                p: 0.5,
                '&:hover': { backgroundColor: '#f3f4f6' },
              }}
            >
              <CloseIcon sx={{ fontSize: 18, color: '#64748b' }} />
            </IconButton>
            <Box 
              sx={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                width: 56, 
                height: 56, 
                backgroundColor: brandColor, 
                borderRadius: '50%', 
                mb: 1.5 
              }}
            >
              <DownloadIcon sx={{ fontSize: 20, color: 'white' }} />
            </Box>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', marginBottom: '6px', marginTop: 0 }}>
              Download App
            </h3>
            <p style={{ color: '#4b5563', fontSize: '13px', margin: 0, lineHeight: '1.4' }}>
              Get courses, offline access, and instant chat
            </p>
          </Box>

          {/* Download Options */}
          <Box sx={{ px: 4, pb: 4, space: 2 }}>
            {/* Google Play Store */}
            <a
              href="https://play.google.com/store/apps/details?id=com.classiolabs.Rahuls CA Academy"
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 14px',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                textDecoration: 'none',
                color: 'inherit',
                marginBottom: 10,
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#dcfce7';
                e.currentTarget.style.backgroundColor = '#f0fdf4';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <div style={{ flexShrink: 0 }}>
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.609 1.814L13.792 12L3.609 22.186C3.61 22.186 3.61 22.186 3.61 22.186C2.925 21.501 2.925 20.377 3.61 19.692L3.609 1.814Z" fill="#32BBFF" />
                  <path d="M20.683 10.747L17.207 8.747L13.792 12L17.207 15.253L20.683 13.253C21.368 12.898 21.368 12.102 20.683 10.747Z" fill="#32BBFF" />
                  <path d="M3.609 1.814C3.609 1.038 4.233 0.414 5.009 0.414C5.455 0.414 5.847 0.629 6.109 0.976L17.207 8.747L13.792 12L3.609 1.814Z" fill="#00D632" />
                  <path d="M13.792 12L17.207 15.253L6.109 23.024C5.847 23.371 5.455 23.586 5.009 23.586C4.233 23.586 3.609 22.962 3.609 22.186L13.792 12Z" fill="#FFBC00" />
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600', color: '#111827', fontSize: '14px' }}>Google Play</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Android</div>
              </div>
              <ChevronRightIcon sx={{ color: '#cbd5e1', fontSize: 18 }} />
            </a>

            {/* App Store */}
            <a
              href="https://play.google.com/store/apps/details?id=com.classiolabs.lpa"
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 14px',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                textDecoration: 'none',
                color: 'inherit',
                marginBottom: 10,
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#e0e7ff';
                e.currentTarget.style.backgroundColor = '#f0f4ff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <div style={{ flexShrink: 0 }}>
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0z" fill="#007AFF" />
                  <path d="M9.75 17.25h4.5c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-4.5c-.414 0-.75.336-.75.75s.336.75.75.75z" fill="white" />
                  <path d="M15.5 6.5c-.827 0-1.5.673-1.5 1.5v.5h-4V8c0-.827-.673-1.5-1.5-1.5S7 7.173 7 8v6c0 .827.673 1.5 1.5 1.5S10 14.827 10 14v-.5h4V14c0 .827.673 1.5 1.5 1.5s1.5-.673 1.5-1.5V8c0-.827-.673-1.5-1.5-1.5z" fill="white" />
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600', color: '#111827', fontSize: '14px' }}>App Store</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>iOS</div>
              </div>
              <ChevronRightIcon sx={{ color: '#cbd5e1', fontSize: 18 }} />
            </a>

            {/* Microsoft Store */}
            <a
              href="https://apps.microsoft.com/detail/9NSFM9ZHWDG6?hl=en-us&gl=IN&ocid=pdpshare"
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 14px',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#dbeafe';
                e.currentTarget.style.backgroundColor = '#eff6ff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <div style={{ flexShrink: 0 }}>
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 3.449L9.75 2.1v9.451H0z" fill="#F25022" />
                  <path d="M10.949 2.1L24 0v11.4H10.949z" fill="#7FBA00" />
                  <path d="M0 12.6h9.75V22.05L0 20.699z" fill="#00A4EF" />
                  <path d="M10.949 12.6H24V24l-13.051-1.95z" fill="#FFB900" />
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600', color: '#111827', fontSize: '14px' }}>Microsoft Store</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Windows</div>
              </div>
              <ChevronRightIcon sx={{ color: '#cbd5e1', fontSize: 18 }} />
            </a>

            {/* Mac Download */}
            {/* <a
              href="https://baseclassio.b-cdn.net/VG%20Study%20Hub.zip"
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 14px',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                textDecoration: 'none',
                color: 'inherit',
                marginTop: 10,
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#d1fae5';
                e.currentTarget.style.backgroundColor = '#ecfdf5';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <div style={{ flexShrink: 0 }}>
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="4" width="18" height="13" rx="2" fill="#111827" />
                  <rect x="9" y="18" width="6" height="1.5" rx="0.75" fill="#6B7280" />
                  <path d="M8 20h8" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="12" cy="10.5" r="2" fill="#34D399" />
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600', color: '#111827', fontSize: '14px' }}>MacOS</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>macOS</div>
              </div>
              <ChevronRightIcon sx={{ color: '#cbd5e1', fontSize: 18 }} />
            </a> */}
          </Box>

          {/* Footer */}
          <Box sx={{ backgroundColor: '#f9fafb', px: 4, py: 3, textAlign: 'center' }}>
            <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>
              Study Anywhere, Anytime
            </p>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AppDownloadModal;
