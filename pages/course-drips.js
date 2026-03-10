import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import Network from '../config/Network';
import instId from '../config/instituteId';
import parse from 'html-react-parser';
import axios from 'axios';
import { Base64 } from 'js-base64';

// Import MUI components
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    Fade,
    Grid,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarIcon from '@mui/icons-material/Star';

const CourseDrips = () => {
    const router = useRouter();
    const theme = useTheme();
    const scheduleRef = useRef(null);
    const planRef = useRef(null);
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [courseObj, setCourseObj] = useState(null);

    // Get course data from sessionStorage on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedCourse = sessionStorage.getItem('selectedCourse');
            if (storedCourse) {
                setCourseObj(JSON.parse(storedCourse));
            }
        }
    }, []);

    const [selectedTag, setSelectedTag] = useState('');
    const [course, setCourse] = useState([]);
    const [filterCourse, setFilterCourse] = useState([]);
    const [tagsList, setTagsList] = useState([]);
    const [Endpoints, setEndpoints] = useState('');
    const [coursesList, setCoursesList] = useState([]);
    const [courseExpandedDescriptions, setCourseExpandedDescriptions] = useState(false);
    const [fullDes, setFullDes] = useState('');
    const [courseContentList, setCourseContentList] = useState([]);
    const [selectedSceduleList, setSelectedSceduleList] = useState([]);
    const [schedulePlans, setSchedulePlans] = useState([]);
    const [planList, setPlanList] = useState([]);
    const [selectedContentId, setSelectedContentId] = useState({});
    const [selectedPlan, setSelectedPlan] = useState({});
    const [selectedSchedule, setSelectedSchedule] = useState({});
    const [shouldScrollToSchedule, setShouldScrollToSchedule] = useState(false);
    const [shouldScrollToPlan, setShouldScrollToPlan] = useState(false);
    const [loading, setLoading] = useState(true);

    // Scroll effects
    useEffect(() => {
        if (shouldScrollToSchedule && schedulePlans?.length > 0 && scheduleRef.current) {
            scheduleRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setShouldScrollToSchedule(false);
        }
    }, [schedulePlans, shouldScrollToSchedule]);

    useEffect(() => {
        if (shouldScrollToPlan && planList?.length > 0 && planRef.current) {
            planRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setShouldScrollToPlan(false);
        }
    }, [planList, shouldScrollToPlan]);

    // Initial load
    useEffect(() => {
        window.scrollTo(0, 0);
        const loadData = async () => {
            setLoading(true);
            await Promise.all([getAllCourses(), getInstituteDetail()]);
            setLoading(false);
        };
        loadData();
    }, []);

    // Load course schedule when courseObj changes
    useEffect(() => {
        if (courseObj?.id) {
            getCourseSchedule(courseObj?.id, 0);
        }
    }, [courseObj]);

    // Load initial content list
    useEffect(() => {
        if (courseContentList?.length > 0) {
            setSelectedSchedule(courseContentList[0]);
            getSelectedSchedule(courseObj?.id, courseContentList[0]?.id, 'first');
        }
    }, [courseContentList]);

    const getAllCourses = async () => {
        try {
            const response = await Network.getFreeCourseList(instId);
            const course = response?.courses;
            const filterCourses = course?.filter((item) => item?.active === true);
            setCoursesList(filterCourses);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const getInstituteDetail = async () => {
        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_BASE_URL}/getMetaData/fetch-institute/${instId}`,
                { withCredentials: false }
            );
            if (response?.data?.errorCode === 0) {
                setEndpoints(response?.data?.instituteTechSetting?.mediaUrl);
            }
        } catch (error) {
            console.error('Error fetching institute:', error);
        }
    };

    const getCourseSchedule = async (courseId, contentId) => {
        try {
            const response = await Network.fetchFreePublicScheduleApi(courseId, contentId);
            if (contentId === 0) {
                setCourseContentList(response?.contentList || []);
            }
        } catch (error) {
            console.error('Error fetching course schedule:', error);
        }
    };

    const getSelectedSchedule = async (courseId, contentId, value) => {
        try {
            const response = await Network.fetchFreePublicScheduleApi(courseId, contentId);
            if (value === 'first') {
                setSelectedSceduleList(response?.contentList || []);
            }
            if (value === 'second') {
                setSchedulePlans(response?.contentList || []);
            }
            if (value === 'third') {
                setPlanList(response?.contentList || []);
            }
        } catch (error) {
            console.error('Error fetching schedule:', error);
        }
    };

    const handleContentClick = (contentId) => {
        if (
            courseObj?.title === 'CA Inter' &&
            contentId?.title === 'Test Series Plus Mentorship'
        ) {
            const testSeriesData = {
                courseObj: courseObj,
                selectedPlanData: '',
                selectedSchedule: selectedSchedule,
                selectScheduleContent: contentId,
                basicPlan: '',
            };
            sessionStorage.setItem('testSeriesData', JSON.stringify(testSeriesData));
            router.push('/test-series');
        } else {
            setPlanList([]);
            setSelectedContentId(contentId);
            getSelectedSchedule(courseObj?.id, contentId?.id, 'second');
            setShouldScrollToSchedule(true);
        }
    };

    const handleSelectPlan = (contentId) => {
        if (
            ((selectedContentId?.title === 'Full Length Test Series' ||
                selectedContentId?.title === 'Exam oriented Test Series') &&
                (courseObj?.title === 'CA Final' || courseObj?.title === 'CA Inter')) ||
            (selectedContentId?.title === 'Portion WiseTest Series' &&
                courseObj?.title === 'CA Final')
        ) {
            const testSeriesData = {
                courseObj: courseObj,
                selectedPlanData: '',
                selectedSchedule: selectedSchedule,
                selectScheduleContent: selectedContentId,
                basicPlan: contentId,
            };
            const encodedData = Base64.encode(JSON.stringify(testSeriesData), true);
            router.push('/test-series?data=' + encodedData);
        } else if (
            selectedContentId?.title === 'Full Length Test Series' &&
            courseObj?.title === 'CA Foundation'
        ) {
            const foundationTestData = {
                courseObj: courseObj,
                selectedPlanData: contentId,
                selectedSchedule: selectedSchedule,
                selectScheduleContent: selectedContentId,
                basicPlan: contentId,
            };
            const encodedData = Base64.encode(JSON.stringify(foundationTestData), true);
            router.push('/foundation-test-series?data=' + encodedData);
        } else {
            setSelectedPlan(contentId);
            getSelectedSchedule(courseObj?.id, contentId?.id, 'third');
            setShouldScrollToPlan(true);
        }
    };

    const handleTestDetail = (item) => {
        const testData = {
            courseObj: courseObj,
            selectedPlanData: item,
            selectedSchedule: selectedSchedule,
            selectScheduleContent: selectedContentId,
            basicPlan: selectedPlan,
        };
        const encodedData = Base64.encode(JSON.stringify(testData), true);

        if (courseObj?.title === 'CA Foundation Test Series') {
            router.push('/foundation-test-series?data=' + encodedData);
        } else {
            router.push('/test-series?data=' + encodedData);
        }
    };

    const toggleExpandDescription = (des) => {
        setFullDes(des);
        setCourseExpandedDescriptions(true);
    };

    if (!courseObj) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-screen">
                    <Typography variant="h6">Loading course details...</Typography>
                </div>
            </Layout>
        );
    }

    return (
        <>
            <Head>
                <title>{courseObj?.title} Test Series - CA Wallah</title>
                <meta name="description" content={`Personalize your ${courseObj?.title} test series preparation`} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <Layout>
                <Box
                    id="testseries"
                    sx={{
                        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #cbd5e1 50%, #94a3b8 100%)',
                        position: 'relative',
                        overflow: 'hidden',
                        pt: { xs: 8, md: 8 },
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: `
                                radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
                                radial-gradient(circle at 80% 70%, rgba(99, 102, 241, 0.06) 0%, transparent 50%),
                                radial-gradient(circle at 40% 80%, rgba(168, 85, 247, 0.05) 0%, transparent 40%),
                                radial-gradient(circle at 60% 20%, rgba(139, 92, 246, 0.04) 0%, transparent 40%)
                            `,
                            pointerEvents: 'none',
                        },
                    }}
                >
                    <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
                        {/* Hero Section */}
                        <Fade in timeout={1000}>
                            <Card
                                sx={{
                                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 50%, rgba(241, 245, 249, 0.85) 100%)',
                                    backdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(255, 255, 255, 0.8)',
                                    borderRadius: 6,
                                    p: { xs: 4, md: 6 },
                                    mb: 6,
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.08), 0 8px 25px rgba(59, 130, 246, 0.1)',
                                }}
                            >
                                <Grid container spacing={4} alignItems="center">
                                    <Grid item xs={12} md={8}>
                                        <Typography
                                            variant="h3"
                                            sx={{
                                                fontSize: { xs: '2.5rem', sm: '3.2rem', md: '4rem' },
                                                fontWeight: 900,
                                                background: 'linear-gradient(135deg, #1e293b 0%, #334155 30%, #475569 60%, #64748b 100%)',
                                                backgroundClip: 'text',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                                mb: 4,
                                                lineHeight: 1.1,
                                            }}
                                        >
                                            Let's Personalize Your
                                            <br />
                                            <Box
                                                component="span"
                                                sx={{
                                                    background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 25%, #8b5cf6 50%, #a855f7 75%, #6366f1 100%)',
                                                    backgroundClip: 'text',
                                                    WebkitBackgroundClip: 'text',
                                                    WebkitTextFillColor: 'transparent',
                                                }}
                                            >
                                                {courseObj?.title} Test Series
                                            </Box>
                                        </Typography>
                                        <Typography
                                            sx={{
                                                color: 'rgba(30, 41, 59, 0.85)',
                                                fontSize: { xs: '1.2rem', md: '1.4rem' },
                                                lineHeight: 1.7,
                                            }}
                                        >
                                            Personalizing your {courseObj?.title} Test Series is simple and efficient. Start by selecting the Test Series Portion Type, followed by choosing the Test Series Plan that suits your needs. Next, determine the Level of Premiumness for added benefits.
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} md={4} textAlign="center">
                                        <Box
                                            sx={{
                                                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(99, 102, 241, 0.08) 30%)',
                                                borderRadius: 5,
                                                p: 5,
                                                border: '1px solid rgba(59, 130, 246, 0.2)',
                                            }}
                                        >
                                            <StarIcon
                                                sx={{
                                                    fontSize: 64,
                                                    background: 'linear-gradient(135deg, #3b82f6, #6366f1, #8b5cf6)',
                                                    backgroundClip: 'text',
                                                    WebkitBackgroundClip: 'text',
                                                    WebkitTextFillColor: 'transparent',
                                                    mb: 3,
                                                }}
                                            />
                                            <Typography sx={{ color: 'rgba(30, 41, 59, 0.9)', fontWeight: 700, fontSize: '1.4rem' }}>
                                                Premium Experience
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Card>
                        </Fade>

                        {/* Step 1: Test Series Portion Type */}
                        <Fade in timeout={1200}>
                            <Card sx={{ background: 'linear-gradient(135deg, rgba(219, 234, 254, 0.6) 0%, rgba(241, 245, 249, 0.8) 100%)', borderRadius: 6, p: { xs: 4, md: 6 }, mb: 6 }}>
                                <Box display="flex" alignItems="center" mb={4}>
                                    <Box sx={{ background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 50%, #8b5cf6 100%)', borderRadius: '50%', width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 3 }}>
                                        <Typography sx={{ color: 'white', fontWeight: 800, fontSize: '1.4rem' }}>1</Typography>
                                    </Box>
                                    <Typography sx={{ color: 'rgba(30, 41, 59, 0.9)', fontSize: { xs: '1.3rem', md: '1.5rem' }, fontWeight: 700, display: 'flex', alignItems: 'center' }}>
                                        Select Test Series Portion Type
                                        <ArrowForwardIcon sx={{ ml: 2, fontSize: 28, color: '#3b82f6' }} />
                                    </Typography>
                                </Box>

                                <Grid container spacing={3}>
                                    {selectedSceduleList?.map((content) => (
                                        <Grid item key={content.id} xs={12} sm={6} md={3}>
                                            <Button
                                                fullWidth
                                                onClick={() => handleContentClick(content)}
                                                sx={{
                                                    background: content.id === selectedContentId?.id
                                                        ? 'linear-gradient(135deg, #2563eb 0%, #3b82f6 50%, #6366f1 100%)'
                                                        : 'linear-gradient(135deg, #3b82f6 0%, #6366f1 50%, #8b5cf6 100%)',
                                                    color: 'white',
                                                    py: 2,
                                                    px: 4,
                                                    borderRadius: 5,
                                                    fontSize: { xs: '1.1rem', md: '1.3rem' },
                                                    fontWeight: 700,
                                                    textTransform: 'none',
                                                    '&:hover': {
                                                        transform: 'translateY(-4px)',
                                                    },
                                                }}
                                            >
                                                {content.id === selectedContentId?.id && (
                                                    <CheckCircleIcon sx={{ mr: 2, fontSize: 20 }} />
                                                )}
                                                {content.title}
                                            </Button>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Card>
                        </Fade>

                        <Box ref={scheduleRef}></Box>

                        {/* Step 2: Test Series Plan Type */}
                        {schedulePlans?.length > 0 && (
                            <Fade in timeout={1400}>
                                <Card sx={{ background: 'linear-gradient(135deg, rgba(224, 231, 255, 0.6) 0%, rgba(248, 250, 252, 0.8) 100%)', borderRadius: 6, p: { xs: 4, md: 6 }, mb: 6 }}>
                                    <Box display="flex" alignItems="center" mb={4}>
                                        <Box sx={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)', borderRadius: '50%', width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 3 }}>
                                            <Typography sx={{ color: 'white', fontWeight: 800, fontSize: '1.4rem' }}>2</Typography>
                                        </Box>
                                        <Typography sx={{ color: 'rgba(30, 41, 59, 0.9)', fontSize: { xs: '1.3rem', md: '1.5rem' }, fontWeight: 700, display: 'flex', alignItems: 'center' }}>
                                            Select Test Series Plan Type
                                            <ArrowForwardIcon sx={{ ml: 2, fontSize: 28, color: '#6366f1' }} />
                                        </Typography>
                                    </Box>

                                    <Grid container spacing={4}>
                                        {schedulePlans?.map((item, i) => (
                                            <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                                                <Card sx={{ background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(15px)', border: '1px solid rgba(100, 116, 139, 0.2)', borderRadius: 6, display: 'flex', flexDirection: 'column', height: '100%' }}>
                                                    <CardContent sx={{ flexGrow: 1, p: 4, pb: 2 }}>
                                                        <Typography sx={{ fontWeight: 700, color: 'rgba(30, 41, 59, 0.9)', mb: 3, fontSize: { xs: '1.3rem', md: '1.5rem' } }}>
                                                            {item?.title}
                                                        </Typography>
                                                        <Box sx={{ color: 'rgba(30, 41, 59, 0.7)', fontSize: { xs: '1rem', md: '1.1rem' }, lineHeight: 1.6 }}>
                                                            {item?.description?.description ? parse(item?.description?.description) : ''}
                                                        </Box>
                                                    </CardContent>
                                                    <Box sx={{ p: 4, pt: 0 }}>
                                                        <Button
                                                            fullWidth
                                                            onClick={() => handleSelectPlan(item)}
                                                            sx={{
                                                                background: item.id === selectedPlan?.id
                                                                    ? 'linear-gradient(135deg, #5b21b6 0%, #7c3aed 50%, #8b5cf6 100%)'
                                                                    : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)',
                                                                color: 'white',
                                                                py: 2,
                                                                borderRadius: 4,
                                                                fontSize: { xs: '1rem', md: '1.15rem' },
                                                                fontWeight: 700,
                                                                textTransform: 'none',
                                                            }}
                                                        >
                                                            {item.id === selectedPlan?.id ? (
                                                                <>
                                                                    <CheckCircleIcon sx={{ mr: 1, fontSize: 18 }} />
                                                                    Selected
                                                                </>
                                                            ) : (
                                                                'Select Plan'
                                                            )}
                                                        </Button>
                                                    </Box>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Card>
                            </Fade>
                        )}

                        <Box ref={planRef}></Box>

                        {/* Step 3: Programme Level Type */}
                        {planList?.length > 0 && (
                            <Fade in timeout={1600}>
                                <Card sx={{ background: 'linear-gradient(135deg, rgba(237, 233, 254, 0.6) 0%, rgba(248, 250, 252, 0.8) 100%)', borderRadius: 6, p: { xs: 4, md: 6 }, mb: 6 }}>
                                    <Box display="flex" alignItems="center" mb={4}>
                                        <Box sx={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #9333ea 100%)', borderRadius: '50%', width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 3 }}>
                                            <Typography sx={{ color: 'white', fontWeight: 800, fontSize: '1.4rem' }}>3</Typography>
                                        </Box>
                                        <Typography sx={{ color: 'rgba(30, 41, 59, 0.9)', fontSize: { xs: '1.3rem', md: '1.5rem' }, fontWeight: 700, display: 'flex', alignItems: 'center' }}>
                                            Select Programme Level Type
                                            <ArrowForwardIcon sx={{ ml: 2, fontSize: 28, color: '#8b5cf6' }} />
                                        </Typography>
                                    </Box>

                                    <Grid container spacing={4}>
                                        {planList?.map((item, i) => (
                                            <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                                                <Card sx={{ background: 'rgba(255, 255, 255, 0.9)', borderRadius: 6, display: 'flex', flexDirection: 'column', height: '100%' }}>
                                                    <CardContent sx={{ flexGrow: 1, p: 4, pb: 2 }}>
                                                        <Typography sx={{ fontWeight: 700, color: 'rgba(30, 41, 59, 0.9)', mb: 3, fontSize: { xs: '1.3rem', md: '1.5rem' } }}>
                                                            {item?.title}
                                                        </Typography>
                                                        <Box sx={{ color: 'rgba(30, 41, 59, 0.7)', fontSize: { xs: '1rem', md: '1.1rem' }, lineHeight: 1.6 }}>
                                                            {item?.description?.description ? parse(item?.description?.description) : ''}
                                                        </Box>
                                                    </CardContent>
                                                    <Box sx={{ p: 4, pt: 0 }}>
                                                        <Button
                                                            fullWidth
                                                            onClick={() => handleTestDetail(item)}
                                                            sx={{
                                                                background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #9333ea 100%)',
                                                                color: 'white',
                                                                py: 2,
                                                                borderRadius: 4,
                                                                fontSize: { xs: '1rem', md: '1.15rem' },
                                                                fontWeight: 700,
                                                                textTransform: 'none',
                                                            }}
                                                        >
                                                            Select Programme
                                                        </Button>
                                                    </Box>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Card>
                            </Fade>
                        )}

                        {/* Loading State */}
                        {loading && (
                            <Fade in timeout={800}>
                                <Card sx={{ background: 'rgba(253, 246, 178, 0.4)', textAlign: 'center', p: 6 }}>
                                    <Typography variant="h6">Loading your personalized test series...</Typography>
                                </Card>
                            </Fade>
                        )}
                    </Container>

                    {/* Dialog */}
                    <Dialog
                        open={courseExpandedDescriptions}
                        onClose={() => setCourseExpandedDescriptions(false)}
                        maxWidth="md"
                        fullWidth
                    >
                        <DialogContent dividers sx={{ p: 4, fontSize: '1.1rem' }}>
                            {parse(fullDes)}
                        </DialogContent>
                        <DialogActions sx={{ p: 4 }}>
                            <Button
                                onClick={() => setCourseExpandedDescriptions(false)}
                                sx={{ background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 50%, #8b5cf6 100%)', color: 'white', px: 6 }}
                            >
                                Close
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Box>
            </Layout>
        </>
    );
};

export default CourseDrips;
