import { Box, FormControl, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

export default function ViewPlanModal({ plansList, courseContentList, selectShedule, handleChange, handleClose }) {
    const [subjectList, setSubjectList] = useState(0);
    const [allPlanListData, setAllPlanListData] = useState([]);
    const [schedule, setSchedule] = useState('');

    useEffect(() => {
        if (plansList && plansList.length > 0) {
            extractAndPushChildren(plansList);
        }
    }, [plansList]);

    const extractAndPushChildren = (data) => {
        const newData = data.map((item) => {
            if (item.children) {
                // Flatten second level children (groups) and their third level children (subjects)
                const updatedSecondLevelChildren = item.children.map((secondLevelItem) => {
                    if (secondLevelItem.children) {
                        const updatedThirdLevelChildren = [];
                        secondLevelItem.children.forEach((thirdLevelItem) => {
                            updatedThirdLevelChildren.push(thirdLevelItem);
                            // If third level has children, add them too
                            if (thirdLevelItem.children) {
                                updatedThirdLevelChildren.push(...thirdLevelItem.children);
                            }
                        });
                        return {
                            ...secondLevelItem,
                            children: updatedThirdLevelChildren,
                        };
                    }
                    return secondLevelItem;
                });
                return {
                    ...item,
                    children: updatedSecondLevelChildren,
                };
            }
            return item;
        });

        // Calculate max number of subjects across all plans
        const maxChildren = Math.max(
            ...newData.map((plan) =>
                plan.children?.reduce((acc, child) => acc + (child.children?.length || 0), 0) || 0
            ),
            1 // At least 1 row
        );

        setSubjectList(maxChildren);
        setAllPlanListData(newData);
    };

    const handleChangePlan = (event) => {
        const selectedValue = event.target.value;
        setSchedule(selectedValue);

        if (selectedValue === 'all') {
            extractAndPushChildren(plansList);
        } else if (selectedValue?.id) {
            const filterPlan = plansList.filter((item) => selectedValue.id === item.id);
            extractAndPushChildren(filterPlan);
        }
    };

    return (
        <React.Fragment>
            <Box
                sx={{
                    padding: "2rem",
                    mt: 3
                }}
            >
                <Box sx={{ textAlign: "left" }}>
                    <Typography variant="h3" fontWeight={'bold'} sx={{ mb: 4 }}>
                        📋 Plan Schedule Details
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                        <FormControl className='mobile-select-button' sx={{ minWidth: 200 }}>
                            <InputLabel id="schedule-select-label" sx={{ fontSize: "14px" }}>
                                Schedule
                            </InputLabel>
                            <Select
                                className='select-option'
                                labelId="schedule-select-label"
                                id="schedule-select"
                                label="Schedule"
                                value={selectShedule || ''}
                                onChange={handleChange}
                                sx={{
                                    fontSize: "14px",
                                    borderRadius: '12px'
                                }}
                            >
                                {courseContentList && courseContentList.map((data, index) => (
                                    <MenuItem key={index} value={data}>
                                        {data?.title}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl className='mobile-select-button' sx={{ minWidth: 250 }}>
                            <InputLabel id="plan-select-label" sx={{ fontSize: "14px" }}>
                                Plan
                            </InputLabel>
                            <Select
                                className='select-option'
                                labelId="plan-select-label"
                                id="plan-select"
                                label="Plan"
                                value={schedule}
                                onChange={handleChangePlan}
                                sx={{
                                    fontSize: "14px",
                                    borderRadius: '12px'
                                }}
                            >
                                <MenuItem value="all">All Plans</MenuItem>
                                {plansList && plansList.map((data, index) => (
                                    <MenuItem key={index} value={data}>
                                        {data?.title}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>

                    <Box sx={{ mb: 3, p: 2, background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)', borderRadius: '12px', border: '1px solid rgba(102, 126, 234, 0.2)' }}>
                        <Typography variant="body2" sx={{ fontSize: "13px", color: "#4a5568", lineHeight: 1.6 }}>
                            {selectShedule?.title === "UnScheduled" 
                                ? "ℹ️ It is recommended to submit the answer sheet within 1-3 days of the exam date, however you can also submit it later for checking."
                                : "ℹ️ Question papers are available as per this schedule. You can submit copies for checking any time before the start of the CA exams"
                            }
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ overflowX: 'auto' }}>
                    <TableContainer component={Paper} sx={{
                        borderRadius: '12px',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                        border: '1px solid rgba(0, 0, 0, 0.08)'
                    }}>
                        <Table aria-label="plan schedule table" sx={{
                            '& .MuiTableCell-root': {
                                border: '1px solid rgba(224, 224, 224, 1)',
                                padding: '12px 16px'
                            },
                            '& .MuiTableCell-head': {
                                background: '#001C4A',
                                color: '#fff',
                                fontWeight: 'bold'
                            }
                        }}>
                            <TableHead>
                                {/* Plan Names Row */}
                                <TableRow sx={{ background: "#001C4A" }}>
                                    {allPlanListData.map((plan, i) => (
                                        <TableCell 
                                            key={i} 
                                            colSpan={2} 
                                            align="center"
                                            sx={{
                                                fontWeight: "700",
                                                fontSize: "15px",
                                                borderRight: i < allPlanListData.length - 1 ? '1px solid #ffffff50 !important' : '1px solid #ffffff50 !important',
                                                color: '#fff',
                                                background: '#001C4A'
                                            }}
                                        >
                                            {plan?.title}
                                        </TableCell>
                                    ))}
                                </TableRow>

                                {/* Subject & Date Header Row */}
                                <TableRow sx={{ background: "#397df0", color: "#fff" }}>
                                    {allPlanListData.map((plan, i) => (
                                        <React.Fragment key={i}>
                                            <TableCell 
                                                sx={{
                                                    fontSize: "13px",
                                                    fontWeight: "700",
                                                    color: '#fff',
                                                    background: '#397df0',
                                                    textAlign: 'center'
                                                }}
                                            >
                                                📚 Subject
                                            </TableCell>
                                            <TableCell 
                                                sx={{
                                                    fontSize: "13px",
                                                    fontWeight: "700",
                                                    color: '#fff',
                                                    background: '#397df0',
                                                    borderRight: i < allPlanListData?.length - 1 ? '1px solid rgba(255,255,255,0.3) !important' : 'none',
                                                    textAlign: 'center'
                                                }}
                                            >
                                                📅 {selectShedule?.title === "UnScheduled" ? "Available From" : "Exam Date"}
                                            </TableCell>
                                        </React.Fragment>
                                    ))}
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {Array.from({ length: subjectList }).map((_, rowIndex) => (
                                    <TableRow key={rowIndex} sx={{
                                        '&:hover': {
                                            background: 'rgba(102, 126, 234, 0.05)'
                                        }
                                    }}>
                                        {allPlanListData.map((plan, planIndex) => {
                                            // Flatten all children to get subjects
                                            const children = plan.children?.flatMap(child => child.children || []) || [];
                                            const child = children[rowIndex];

                                            return (
                                                <React.Fragment key={planIndex}>
                                                    {child?.entityType === "folder" ? (
                                                        <>
                                                            <TableCell 
                                                                colSpan={2}
                                                                sx={{
                                                                    fontWeight: "700",
                                                                    borderRight: planIndex < allPlanListData?.length - 1 ? '1px solid rgba(0,0,0,0.12) !important' : 'none',
                                                                    fontSize: "13px",
                                                                    background: 'rgba(102, 126, 234, 0.08)',
                                                                    padding: '14px 16px'
                                                                }}
                                                            >
                                                                📁 {child?.title}
                                                            </TableCell>
                                                        </>
                                                    ) : child ? (
                                                        <>
                                                            <TableCell 
                                                                sx={{
                                                                    fontSize: "12px",
                                                                    color: '#2d3748',
                                                                    fontWeight: '500',
                                                                    textAlign: 'center'
                                                                }}
                                                            >
                                                                {child?.title}
                                                            </TableCell>
                                                            <TableCell 
                                                                sx={{
                                                                    fontSize: "12px",
                                                                    color: '#2d3748',
                                                                    fontWeight: '500',
                                                                    borderRight: planIndex < allPlanListData?.length - 1 ? '1px solid rgba(0,0,0,0.12) !important' : 'none',
                                                                    textAlign: 'center'
                                                                }}
                                                            >
                                                                {child?.createdAt ? new Date(child?.createdAt).toLocaleDateString('en-IN', { 
                                                                    year: 'numeric',
                                                                    month: 'short',
                                                                    day: 'numeric'
                                                                }) : "—"}
                                                            </TableCell>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <TableCell sx={{ borderRight: planIndex < allPlanListData?.length - 1 ? '1px solid rgba(0,0,0,0.12) !important' : 'none' }}>
                                                                {/* Empty cell */}
                                                            </TableCell>
                                                            <TableCell sx={{ borderRight: planIndex < allPlanListData?.length - 1 ? '1px solid rgba(0,0,0,0.12) !important' : 'none' }}>
                                                                {/* Empty cell */}
                                                            </TableCell>
                                                        </>
                                                    )}
                                                </React.Fragment>
                                            );
                                        })}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Box>
        </React.Fragment>
    );
}
