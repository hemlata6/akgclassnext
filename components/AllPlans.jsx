import React from 'react';
import { Box, FormControl, Grid, InputLabel, MenuItem, Select, Typography } from '@mui/material';

const stripHtml = (value) => {
  if (!value || typeof value !== 'string') return '';
  return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
};

const ViewPlanModal = ({ plansList = [], courseContentList = [], selectShedule = '', handleChange }) => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
        Plans Overview
      </Typography>

      {courseContentList.length > 0 && (
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel id="view-plan-schedule-label">Schedule</InputLabel>
          <Select
            labelId="view-plan-schedule-label"
            value={selectShedule || ''}
            label="Schedule"
            onChange={handleChange}
            renderValue={(value) => value?.title || 'Select Schedule'}
          >
            {courseContentList.map((item, index) => (
              <MenuItem key={item?.id || index} value={item}>
                {item?.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      <Grid container spacing={2}>
        {plansList.map((plan, index) => (
          <Grid item xs={12} sm={6} md={4} key={plan?.id || index}>
            <Box
              sx={{
                height: '100%',
                p: 2,
                borderRadius: 2,
                border: '1px solid #e5e7eb',
                backgroundColor: '#fff',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                {plan?.title || `Plan ${index + 1}`}
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', mb: 1 }}>
                {stripHtml(plan?.description?.description)}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#1354C1' }}>
                {plan?.paid ? `Rs. ${plan?.price || 0}` : 'Free'}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ViewPlanModal;