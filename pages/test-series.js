import { Box, Button, Card, CardActions, CardContent, Checkbox, Chip, CircularProgress, Container, Dialog, DialogActions, DialogContent, Fade, FormControl, FormHelperText, Grid, IconButton, InputAdornment, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, Stack, Step, StepConnector, StepLabel, Stepper, styled, TextField, Typography, useMediaQuery } from '@mui/material';
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import VerifiedIcon from '@mui/icons-material/Verified';
import { useRouter } from 'next/router';
import parse from "html-react-parser";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import ViewPlanModal from '../components/AllPlans';
import Layout from '../components/Layout';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
// import { useNavigate, UNSAFE_NavigationContext } from "react-router-dom";
import { Base64 } from 'js-base64';
import Check from '@mui/icons-material/Check';
import PropTypes from 'prop-types';
import CheckIcon from '@mui/icons-material/Check';
import { PDFDocument } from 'pdf-lib';

// Modern color scheme
const modernColors = {
    primary: {
        main: '#1354C1',
        light: '#667eea',
        dark: '#0d47a1',
        gradient: 'linear-gradient(135deg, #1354C1 0%, #667eea 100%)'
    },
    secondary: {
        main: '#764ba2',
        light: '#a18cd1',
        dark: '#512da8',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    accent: {
        main: '#DD2A3D',
        light: '#ff6b6b',
        background: 'rgba(221, 42, 61, 0.1)'
    },
    success: {
        main: '#00BC78',
        light: '#4caf50',
        background: 'rgba(0, 188, 120, 0.1)'
    },
    neutral: {
        white: '#ffffff',
        light: '#f8fafc',
        gray: '#64748b',
        dark: '#1e293b'
    }
};

// Modern styled components
const ModernPlanCard = styled(Card)(({ theme, isSelected, isPremium }) => ({
    height: '100%',
    display: 'flex',
    minWidth: '260px',
    flexDirection: 'column',
    position: 'relative',
    borderRadius: '20px',
    background: isSelected
        ? 'linear-gradient(135deg, rgba(19, 84, 193, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)'
        : 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    border: isSelected
        ? '2px solid #1354C1'
        : '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: isSelected
        ? '0 12px 40px rgba(19, 84, 193, 0.2)'
        : '0 8px 32px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    overflow: 'hidden',
    width: '100%',
    maxWidth: '100%',
    margin: '0 auto',
    [theme.breakpoints.down('sm')]: {
        borderRadius: '16px',
        '&:hover': {
            transform: 'translateY(-4px)'
        }
    },
    '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: '0 20px 60px rgba(19, 84, 193, 0.25)',
        border: '1px solid rgba(19, 84, 193, 0.3)'
    },
    ...(isPremium && {
        '&::before': {
            content: '"POPULAR"',
            position: 'absolute',
            top: '16px',
            right: '-30px',
            background: modernColors.accent.main,
            color: 'white',
            padding: '4px 40px',
            fontSize: '12px',
            fontWeight: 'bold',
            transform: 'rotate(45deg)',
            zIndex: 1,
            boxShadow: '0 2px 8px rgba(221, 42, 61, 0.3)'
        }
    })
}));

const ModernPlanImage = styled('div')(({ image, title }) => ({
    width: '100%',
    height: '180px',
    borderRadius: '16px 16px 0 0',
    backgroundImage: `url(${image})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
    '&::after': {
        content: '""',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '50%',
        background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.1))',
        borderRadius: '0 0 16px 16px'
    }
}));

const ModernPlanTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 700,
    fontSize: '1.4rem',
    color: modernColors.neutral.dark,
    textAlign: 'center',
    marginBottom: '12px',
    background: modernColors.primary.gradient,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
}));

const ModernPriceContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '16px'
});

const ModernPrice = styled(Typography)(({ isDiscounted }) => ({
    fontSize: isDiscounted ? '2rem' : '1.8rem',
    fontWeight: 700,
    color: modernColors.success.main,
    textAlign: 'center'
}));

const ModernOriginalPrice = styled(Typography)({
    fontSize: '1.1rem',
    color: modernColors.neutral.gray,
    textDecoration: 'line-through'
});

const ModernDiscountBadge = styled(Chip)({
    background: modernColors.accent.main,
    color: 'white',
    fontSize: '1rem',
    fontWeight: 'bold',
    height: '28px'
});

const ModernChip = styled(Chip)(({ chipcolor = 'primary' }) => {
    const colors = {
        primary: { bg: modernColors.primary.main, color: 'white' },
        accent: { bg: modernColors.accent.background, color: modernColors.accent.main },
        success: { bg: modernColors.success.background, color: modernColors.success.main }
    };

    return {
        backgroundColor: colors[chipcolor].bg,
        color: colors[chipcolor].color,
        fontSize: '1rem',
        fontWeight: 600,
        border: 'none'
    };
});

const ModernAddButton = styled(Button)(({ isAdded }) => ({
    width: '100%',
    borderRadius: '12px',
    padding: '12px 20px',
    fontWeight: 700,
    fontSize: '1.1rem',
    textTransform: 'none',
    background: isAdded
        ? modernColors.success.main
        : modernColors.primary.gradient,
    color: 'white',
    border: 'none',
    transition: 'all 0.3s ease',
    '&:hover': {
        background: isAdded
            ? modernColors.success.light
            : 'linear-gradient(135deg, #0d47a1 0%, #5a6fc8 100%)',
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 25px rgba(19, 84, 193, 0.3)'
    },
    '&:disabled': {
        background: modernColors.neutral.gray,
        color: 'white'
    }
}));

const ModernCheckoutButton = styled(Button)({
    padding: "12px 10px",
    borderRadius: '12px',
    fontWeight: 700,
    fontSize: '16px',
    textTransform: 'none',
    background: modernColors.secondary.gradient,
    color: 'white',
    border: 'none',
    transition: 'all 0.3s ease',
    '&:hover': {
        background: 'linear-gradient(135deg, #5a6fc8 0%, #512da8 100%)',
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 25px rgba(118, 75, 162, 0.3)'
    }
});

// Modern Stepper Components
const ModernStepConnector = styled(StepConnector)(({ theme }) => ({
    '&': {
        display: 'block !important',
        visibility: 'visible !important',
    },
    '& .MuiStepConnector-line': {
        height: 3,
        border: 0,
        borderRadius: 2,
        backgroundColor: 'rgba(180, 180, 180, 0.4)', // Light black/gray color for inactive
        transition: 'all 0.3s ease',
        display: 'block !important',
        opacity: 1,
    },
    '&.Mui-active .MuiStepConnector-line': {
        background: modernColors.primary.gradient,
        boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
    },
    '&.Mui-completed .MuiStepConnector-line': {
        background: modernColors.primary.gradient,
        boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
    },
}));

const ModernStepper = styled(Stepper)(({ theme }) => ({
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    padding: '24px 0px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    margin: '20px 0',
    width: '100%',
    maxWidth: '100%',
    boxSizing: 'border-box',

    // Mobile-specific overflow scroll
    [theme.breakpoints.down('md')]: {
        overflowX: 'auto',
        '&::-webkit-scrollbar': {
            height: '4px',
        },
        '&::-webkit-scrollbar-track': {
            background: 'rgba(0,0,0,0.1)',
            borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
            background: '#667eea',
            borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
            background: '#5a67d8',
        },
    },

    // Desktop view - prevent overflow but allow content to wrap
    [theme.breakpoints.up('md')]: {
        overflowX: 'hidden',
        '& .MuiStepper-root': {
            flexWrap: 'wrap',
        },
    },

    '& .MuiStepLabel-root': {
        flex: '1 1 auto',
        minWidth: 0, // Allow shrinking below content size

        '& .MuiStepLabel-label': {
            fontSize: '0.875rem',
            fontWeight: 600,
            color: modernColors.neutral.gray,
            transition: 'all 0.3s ease',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',

            // Responsive font size
            [theme.breakpoints.down('md')]: {
                fontSize: '0.75rem',
            },

            '&.Mui-completed': {
                color: modernColors.primary.main,
                fontWeight: 700,
            },

            '&.Mui-active': {
                color: modernColors.primary.main,
                fontWeight: 700,
            },
        },
    },
}));

const ModernStepIconRoot = styled('div')(({ theme, ownerState }) => ({
    color: modernColors.neutral.gray,
    display: 'flex',
    height: 44,
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    border: `3px solid ${modernColors.neutral.gray}`,
    background: 'white',
    position: 'relative',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',

    ...(ownerState.active && {
        background: modernColors.primary.gradient,
        border: `3px solid ${modernColors.primary.main}`,
        color: 'white',
        boxShadow: `0 8px 25px ${modernColors.primary.main}30`,
        transform: 'scale(1.1)',
    }),

    ...(ownerState.completed && {
        background: modernColors.secondary.gradient,
        border: `3px solid ${modernColors.secondary.main}`,
        color: 'white',
        boxShadow: `0 8px 25px ${modernColors.secondary.main}30`,
    }),

    '& .ModernStepIcon-completedIcon': {
        color: 'white',
        zIndex: 1,
        fontSize: 20,
        fontWeight: 'bold',
    },

    '& .ModernStepIcon-circle': {
        width: 16,
        height: 16,
        borderRadius: '50%',
        backgroundColor: 'currentColor',
    },

    '& .ModernStepIcon-number': {
        fontSize: '1rem',
        fontWeight: 700,
    },
}));

function ModernStepIcon(props) {
    const { active, completed, className, icon } = props;

    return (
        <ModernStepIconRoot ownerState={{ active, completed }} className={className}>
            {completed ? (
                <CheckIcon className="ModernStepIcon-completedIcon" />
            ) : active ? (
                <span className="ModernStepIcon-number">{icon}</span>
            ) : (
                <span className="ModernStepIcon-number">{icon}</span>
            )}
        </ModernStepIconRoot>
    );
}

const QontoStepIconRoot = styled('div')(({ theme, ownerState }) => ({
    color: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#eaeaf0',
    display: 'flex',
    height: 22,
    alignItems: 'center',
    ...(ownerState.active && {
        color: '#1354C1',
    }),
    '& .QontoStepIcon-completedIcon': {
        color: '#1354C1',
        zIndex: 1,
        fontSize: 18,
    },
    '& .QontoStepIcon-circle': {
        width: 12,
        height: 12,
        borderRadius: '50%',
        backgroundColor: 'currentColor',
    },
}));

function QontoStepIcon(props) {
    const { active, completed, className } = props;

    return (
        <QontoStepIconRoot ownerState={{ active }} className={className}>
            {completed ? (
                <Check className="QontoStepIcon-completedIcon" />
            ) : (
                <div className="QontoStepIcon-circle" />
            )}
        </QontoStepIconRoot>
    );
}

QontoStepIcon.propTypes = {
    /**
     * Whether this step is active.
     * @default false
     */
    active: PropTypes.bool,
    className: PropTypes.string,
    /**
     * Mark the step as completed. Is passed to child components.
     * @default false
     */
    completed: PropTypes.bool,
};

const steps = ['Plans', 'Details', 'Checkout', 'Done'];

const TestSeries = ({
    cartNumberUpdate
}) => {

    const responsive = {
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 3,
            slidesToSlide: 3 // optional, default to 1.
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 1,
            slidesToSlide: 1 // optional, default to 1.
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 2,
            slidesToSlide: 2 // optional, default to 1.
        }
    };

    const isMobileDevice = useMediaQuery('(min-width:480px)');
    const BASE_URL = "https://prodapi.classiolabs.com/";
    // let Endpoints = ''
    // const InstId = 119;
    const InstId = 499;

    // const InstId = 49;
    // const InstId = 149
    const router = useRouter();
    const campaignId = router.query?.campaignId;
    let paramData = router.query?.data;
    let data = paramData ? JSON?.parse(Base64?.decode(paramData)) : {};
    const selectCourserout = data.courseObj;
    const basicPlanObj = data.basicPlan;
    const selectScheduleContentObj = data?.selectScheduleContent;
    const selectedPlanDataObj = data?.selectedPlanData;
    const selectedScheduleObj = data?.selectedSchedule;
    const cartRouteData = sessionStorage?.getItem('cartRoute');
    const [error, setError] = useState('');
    const [selectCourse, setSelectCourse] = useState('');
    const [selectedTag, setSelectedTag] = useState('');
    const [course, setCourse] = useState([]);
    const [filterCourse, setFilterCourse] = useState([]);
    const [suggestedCourse, setSuggestedCourse] = useState([]);
    const [tagsList, setTagsList] = useState([]);
    const [courseContentList, setCourtseContentList] = useState([]);
    const [selectShedule, setSelectShedule] = useState('');
    const [schedule, setSchedule] = useState('');
    const [activeStep, setActiveStep] = useState(0);
    const [completed, setCompleted] = useState({});
    const [title, setTitle] = useState('');
    const [number, setNumber] = useState('');
    const [email, setEmail] = useState('');
    const [addSuggestCourse, setAddSuggestCourse] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [purchaseArray, setPurchaseArray] = useState([]);
    const [skipped, setSkipped] = useState(new Set());
    const [alltreeList, setAlltreeList] = useState([]);
    const [sheduleContentList, setSheduleContentList] = useState([]);
    const [activeBtn, setActiveBtn] = useState('both');
    const [selectSubjectWise, setSelectSubjectWise] = useState([]);
    const [subjectWiseListRender, setSubjectWiseListRender] = useState([]);
    const [plansList, setPlansList] = useState([]);
    const [peviewImgVideo, setPeviewImgVideo] = useState({});
    const [checked, setChecked] = useState(false);
    const [coursePublic, setCoursesPublic] = useState({});
    const [orderBumpCourse, setOrderBumpCourse] = useState({});
    const [viewPlanModal, setViewPlanModal] = useState(false);
    const [Endpoints, setEndpoints] = useState('')
    const [addtoCartIds, setAddtoCartIds] = useState([]);
    const [addedCartPlans, setAddedCartPlans] = useState([]);
    const [courseExpandedDescriptions, setCourseExpandedDescriptions] = useState(false);
    const [fullDes, setFullDes] = useState('');
    const [filterGroupSubject, setFilterGroupSubject] = useState('group');
    const [openScheduleModal, setOpenScheduleModal] = useState(false);
    const [couponNumber, setCouponNumber] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isCouponValid, setIsCouponValid] = useState(null);
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [reedemCode, setReedemCode] = useState(false);
    const [cartArray, setCartArray] = useState([]);

    const [selectedSceduleList, setSelectedSceduleList] = useState([]);
    const [schedulePlans, setSchedulePlans] = useState([]);
    const [planList, setPlanList] = useState([]);
    const [selectedSchedule, setSelectedSchedule] = useState({});
    const [selectedAotherSchedule, setSelectedAotherSchedule] = useState({});
    const [selectedBasicPlan, setSelectedBasicPlan] = useState({});
    const [selectedForPlans, setSelectedForPlans] = useState({});
    const [imageSchedule, setImageSchedule] = useState(false);


    useEffect(() => {
        const allEntityIds = [];
        let totalPrice = 0;
        cartArray?.forEach((item) => {
            const object = getPlanPrice(item.plan, item.group, item.subject);
            let price = object?.price;
            totalPrice += object?.finalPrice === 0 ? Number(price) - (Number(price / 100) * Number(item?.plan?.discount)) : object?.finalPrice;
            object.entityId.forEach((entity) => {
                allEntityIds.push(entity);
            });
        });
        setTotalPrice(totalPrice)
        setPurchaseArray(allEntityIds);
        localStorage.setItem("purchaseArray", JSON.stringify(allEntityIds));
    }, [cartArray]);

    useEffect(() => {
        if (coursePublic?.id) {
            const matchedEntity = purchaseArray.some(purchase => purchase.entityId === coursePublic.id);
            if (matchedEntity) {
                setOrderBumpCourse({})
            } else {
                setOrderBumpCourse(coursePublic)
            }

        }
    }, [coursePublic])
    const updateCartAndPurchaseArrays = (plansList, addedCartPlans) => {
        //     const matchedPlans = [];
        //     const newAddtoCartIds = [];
        let newPurchaseArray = [];

        addedCartPlans.forEach(cartItem => {
            plansList.forEach(plan => {
                if (cartItem.plan.title === plan.title) {
                    let object = getPlanPrice(plan, cartItem.group, cartItem.subject);
                    cartItem.plan = plan;
                    newPurchaseArray.push(cartItem);
                }
            })

        })
        setCartArray(newPurchaseArray);
    };

    useEffect(() => {
        if (activeStep === -1) {
            router.push("/")
        }
    })

    function handleNextBrowse() {

        data['selectedSchedule'] = JSON.stringify(selectedSchedule);
        data['selectedAotherSchedule'] = JSON.stringify(selectedAotherSchedule);
        data['selectedBasicPlan'] = JSON.stringify(selectedBasicPlan);
        data['selectedForPlans'] = JSON.stringify(selectedForPlans);

        data['selectedTag'] = JSON.stringify(selectedTag);
        data['selectCourse'] = JSON.stringify(selectCourse);
        data['activeStep'] = activeStep;
        data['schedule'] = JSON.stringify(schedule);
        data['activeBtn'] = activeBtn;
        data['selectSubjectWise'] = JSON.stringify(selectSubjectWise);
        data['addtoCartIds'] = JSON.stringify(addtoCartIds);
        data['addedCartPlans'] = JSON.stringify(addedCartPlans);
        data['purchaseArray'] = JSON.stringify(purchaseArray);
        router.push('/test-series?data=' + Base64.encode(JSON.stringify(data), true));
    }



    function initial() {



        getCourseList();
        getTagsList();
        getInstituteDetail();
        setSelectCourse(selectCourserout);
        if (selectCourserout?.title === "CA Inter" && selectScheduleContentObj?.title === "Test Series Plus Mentorship") {

            fetchDripContent(selectScheduleContentObj?.id)
        }
        if (selectedScheduleObj) {
            setSelectedSchedule(selectedScheduleObj);
            getSheduleContentList(selectCourserout?.id, selectedScheduleObj?.id, 'second');
        }
        if (selectScheduleContentObj) {
            getSheduleContentList(selectCourserout?.id, selectScheduleContentObj?.id, 'third');
            setSelectedAotherSchedule(selectScheduleContentObj);
        }


        if (basicPlanObj?.id) {
            getSheduleContentList(selectCourserout?.id, basicPlanObj?.id, 'fourth');
            setSelectedBasicPlan(basicPlanObj);
            if ((selectScheduleContentObj?.title === "Full Length Test Series" || selectScheduleContentObj?.title === "Exam oriented Test Series") || (selectScheduleContentObj?.title === "Portion WiseTest Series" && selectCourserout?.title === "CA Final")) {
                fetchDripContent(basicPlanObj?.id)
            }
        }
        if (selectedPlanDataObj) {
            getSheduleContentList(selectCourserout?.id, selectedPlanDataObj?.id, 'fifth');
            fetchDripContent(selectedPlanDataObj?.id)
            setSelectedForPlans(selectedPlanDataObj);
        }


        if (data['selectedTag'] !== undefined) {
            setSelectedTag(JSON.parse(data['selectedTag']));
        }

        if (data['selectCourse'] !== undefined) {
            setSelectCourse(JSON.parse(data['selectCourse']));
        }

        if (data['activeStep'] !== undefined) {
            setActiveStep(data['activeStep']);
        }
        if (data['schedule'] !== undefined) {
            setSchedule(JSON.parse(data['schedule']));
        }
        if (data['activeBtn'] !== undefined) {
            setActiveBtn(data['activeBtn']);
        }
        if (data['selectSubjectWise'] !== undefined) {
            setSelectSubjectWise(JSON.parse(data['selectSubjectWise']));
        }
        if (data['addtoCartIds'] !== undefined) {
            setAddtoCartIds(JSON.parse(data['addtoCartIds']));
        }
        if (data['addedCartPlans'] !== undefined) {
            setAddedCartPlans(JSON.parse(data['addedCartPlans']));
        }
        if (data['purchaseArray'] !== undefined) {
            setPurchaseArray(JSON.parse(data['purchaseArray']));
        }
    }

    useEffect(() => {
        window.scrollTo(0, 0)
        initial();
        window.onpopstate = () => {
            handleBackBrowserBack();
            initial();
        }

        const localPlans = localStorage.getItem('addedCartPlans');
        const locaPurchase = localStorage.getItem('purchaseArray');
        const localPlansIds = localStorage.getItem('addtoCartIds');
        if (localPlans !== undefined && locaPurchase !== null) {
            setAddedCartPlans(JSON.parse(localPlans));
        }
        if (localPlansIds !== undefined && locaPurchase !== null) {
            setAddtoCartIds(JSON.parse(localPlansIds));
        }
        if (locaPurchase !== undefined && locaPurchase !== null) {
            setPurchaseArray(JSON.parse(locaPurchase));
        }
        if (cartRouteData === "cartRoute") {
            setActiveStep(1)
            const localCartArray = localStorage.getItem('cartArray');
            if (localCartArray !== undefined && localCartArray !== null) {
                setCartArray(JSON.parse(localCartArray));
            }
        }

    }, []);

    function handleBackBrowserBack() {
        handleBack();
    }

    useEffect(() => {
        if (selectCourse) {
            const filterCourseTags = course.filter(item => {
                const tagslists = item.tags || [];
                if (tagslists.some(tag => tag.id === selectCourse?.setting?.checkoutTag)) {
                    return item
                }
            });

            setSuggestedCourse(filterCourseTags);
        }
    }, [selectCourse, course])

    useEffect(() => {
        // if (selectedTag) {
        //     const filterCourseTags = course.filter(item => {
        //         const tagslists = item.tags || [];
        //         if (tagslists.some(tag => tag.id === selectedTag.id)) {
        //             return item
        //         }
        //     });
        //     setFilterCourse(filterCourseTags);
        // }
        setFilterCourse(course)
    }, [selectedTag, course])

    useEffect(() => {
        if (courseContentList && courseContentList.length > 0) {
            const firstItem = courseContentList[0];
            setSchedule(firstItem);
            // setSelectShedule(firstItem);
            getSheduleContentList(selectCourse?.id, firstItem.id, "first");
        } else {
            setSchedule("");
            // setSelectShedule('');
        }
    }, [courseContentList])

    useEffect(() => {
        if (selectCourse?.id) {
            getCourseContentList(selectCourse?.id)
        }
    }, [selectCourse]);

    // useEffect(() => {
    //     if (schedule?.id) {
    //         setSelectShedule(schedule);
    //         fetchDripContent(schedule?.id);
    //     }
    // }, [schedule])

    const getCourseContentList = async (courseId) => {
        try {
            let requestOptions = {
                // headers: { "X-Auth": token },
                withCredentials: false,
            };
            const response = await axios.get(BASE_URL + `admin/course/fetchContent-public/${courseId}/0`, requestOptions);
            if (response?.data?.errorCode === 0) {
                let filterCourseContent = response?.data?.contentList;
                let filterDripCourse = filterCourseContent.filter((data) => data?.drip === true);
                setSelectedSchedule(filterDripCourse[0])
                setCourtseContentList(filterDripCourse);
            };
        } catch (error) {
            console.log(error);
        }
    }

    const getSheduleContentList = async (courseId, contentId, value) => {
        try {
            let requestOptions = {
                // headers: { "X-Auth": token },
                withCredentials: false,
            };
            const response = await axios.get(BASE_URL + `admin/course/fetchContent-public/${courseId}/${contentId}`, requestOptions);
            if (response?.data?.errorCode === 0) {
                let filterCourseContent = response?.data?.contentList;
                if (value === "first") {
                    setSheduleContentList(filterCourseContent);
                }
                if (value === "second") {
                    setSelectedSceduleList(filterCourseContent)
                }
                if (value === "third") {
                    setSchedulePlans(filterCourseContent)
                }
                if (value === "fourth") {
                    setPlanList(filterCourseContent)
                }
                // if (value === "fifth") { 

                //     // setAlltreeList(filterCourseContent)                                     
                // }
            };
        } catch (error) {
            console.log(error);
        }
    }

    const handleSchedule = (contentId) => {
        setSelectedSchedule(contentId);
        getSheduleContentList(selectCourse?.id, contentId?.id, 'second');
    };

    const handleAnotherSchedule = (e) => {
        setSelectedBasicPlan({});
        setSelectedForPlans({});
        const value = e.target.value
        setSelectedAotherSchedule(value);
        getSheduleContentList(selectCourse?.id, value?.id, 'third');
    };

    const handleBasicPlans = (e) => {
        setSelectedForPlans({});
        const value = e.target.value
        setSelectedBasicPlan(value);
        getSheduleContentList(selectCourse?.id, value?.id, 'fourth');
        if ((selectedAotherSchedule?.title === "Full Length Test Series" || selectScheduleContentObj?.title === "Exam oriented Test Series") || (selectedAotherSchedule?.title === "Portion WiseTest Series" && selectCourse?.title === "CA Final")) {
            fetchDripContent(value?.id)
        }
    };

    const handleSelecForPlan = (e) => {
        const value = e.target.value
        setSelectedForPlans(value);
        fetchDripContent(value?.id)
        getSheduleContentList(selectCourse?.id, value?.id, 'fifth');
    };



    useEffect(() => {

        if (alltreeList?.length > 0) {
            // setActiveBtn('both')
            getPlans('both');
        }
    }, [alltreeList])

    useEffect(() => {
        getPlans(activeBtn);
    }, [selectSubjectWise, activeBtn])

    function getPlans(selectBtnType) {
        let plans = [];
        let subjectTempList = [];


        alltreeList.forEach((plan) => {
            if (selectBtnType === 'group1') {
                if (plan?.children?.length > 0) {
                    plan?.children.forEach((group) => {
                        if (group.title === 'Group 1') {
                            if (!checkPlansExists(plans, plan.title)) {
                                plans.push(plan);
                            }
                            if (group?.children?.length > 0) {
                                group.children.forEach((subject) => {
                                    if (!checkSubjectExists(subjectTempList, subject.title)) {
                                        subjectTempList.push(subject);
                                    }
                                })
                            }
                        }
                    })
                } else {
                    if (plan.title === 'Group 1') {
                        plans.push(plan);
                    }
                }
            }
            if (selectBtnType === 'group2') {
                if (plan?.children?.length > 0) {
                    plan?.children.forEach((group) => {
                        if (group.title === 'Group 2') {
                            if (!checkPlansExists(plans, plan.title)) {
                                plans.push(plan);
                            }
                            if (group?.children?.length > 0) {
                                group.children.forEach((subject) => {
                                    if (!checkSubjectExists(subjectTempList, subject.title)) {
                                        subjectTempList.push(subject);
                                    }
                                })
                            }
                        }
                    })
                } else {
                    if (plan.title === 'Group 2') {
                        plans.push(plan);
                    }
                }
            }
            if (selectBtnType === 'both') {
                if (plan?.children?.length > 0) {
                    plan?.children.forEach((group) => {
                        if (group.title === 'Group 2' || group.title === 'Group 1') {
                            if (!checkPlansExists(plans, plan.title)) {
                                plans.push(plan);
                            }
                            if (group?.children?.length > 0) {
                                group.children.forEach((subject) => {
                                    if (!checkSubjectExists(subjectTempList, subject.title)) {
                                        subjectTempList.push(subject);
                                    }
                                })
                            }
                        }
                    })
                } else {
                    plans.push(plan);
                }
            }
            if (selectSubjectWise.length > 0) {
                plans = filterPlansOnSelectedSubject(plans, selectSubjectWise);

            }
        })

        setSubjectWiseListRender(subjectTempList);
        setPlansList(plans);
    }

    function checkSubjectExists(subjectList, title) {

        let exists = false;
        subjectList.forEach((subject) => {
            if (subject.title === title) {
                exists = true;
            }
        })
        return exists;
    }
    function checkPlansExists(plansList, title) {

        let exists = false;
        plansList?.forEach((plan) => {
            if (plan.title === title) {
                exists = true;
            }
        })
        return exists;
    }

    function filterPlansOnSelectedSubject(plans, selectedSubjects) {
        let planList = [];
        plans?.forEach((plan) => {
            plan?.children?.forEach((group) => {
                group?.children?.forEach((subject) => {
                    selectedSubjects?.forEach((selectedSubject) => {
                        if (selectedSubject.title === subject.title && !checkPlansExists(planList, plan.title)) {
                            planList.push(plan);
                        }
                    })
                })
            })
        })
        return planList;
    }

    function filterSelectedSubjectListByGroup(group, sltSubject) {
        let selectedSubject = [];
        if (sltSubject?.length > 0) {
            sltSubject?.forEach((subject) => {
                if (group?.children?.length > 0) {
                    group?.children?.forEach((subjectGroup) => {
                        if (subject?.title === subjectGroup?.title) {
                            selectedSubject.push(subjectGroup);
                            // entityIdArrays.push({
                            //     purchaseType: "courseContent",
                            //     entityId: subjectGroup?.entityId
                            // })

                        }
                    })
                }

            })
        }
        return selectedSubject;
    }

    function filterSelectedSubjectListByPlan(plan, sltSubject) {
        let selectedSubject = [];
        if (sltSubject?.length > 0) {
            sltSubject?.forEach((subject) => {
                plan.children.forEach((group) => {
                    if (group?.children?.length > 0) {
                        group?.children?.forEach((subjectGroup) => {
                            if (subject?.title === subjectGroup?.title) {
                                selectedSubject.push(subjectGroup);
                            }
                        })
                    }
                })
            })
        }
        return selectedSubject;
    }

    function getPlanPrice(plan, selectedGroup, sltSubject) {
        let price = 0;
        // let discount = 0;
        let finalPrice = 0;
        let entityId = []
        let thumbLogo = ''
        if (selectedGroup === 'both') {
            let totalSubject = 0;
            let selectedSubject = filterSelectedSubjectListByPlan(plan, sltSubject);
            plan?.children?.length > 0 && plan?.children?.forEach((group) => {
                if (group?.children?.length > 0) {
                    group?.children.forEach((subject) => {
                        totalSubject += 1
                    })
                }
            })
            if (selectedSubject.length === totalSubject || selectedSubject.length === 0) {
                price = plan?.price;
                thumbLogo = plan?.description?.thumb;
                // discount = plan?.discount;
                finalPrice += plan?.price - ((plan?.price / 100) * plan?.discount);
                entityId.push({
                    purchaseType: "courseContent",
                    entityId: plan?.entityId
                })
            } else {
                plan?.children?.length > 0 && plan?.children.forEach((group) => {
                    let allSubjectSelectOfGroup = false;
                    let groupSelectedSubject = 0;
                    let selectedOfGroup = [];
                    group?.children?.forEach((subject) => {
                        if (selectedSubject?.length > 0) {
                            selectedSubject.forEach((selectedSubject) => {
                                totalSubject += 1;
                                if (subject?.title === selectedSubject?.title) {
                                    selectedOfGroup.push(selectedSubject);
                                    groupSelectedSubject += 1;

                                    if (groupSelectedSubject === group?.children?.length) {
                                        allSubjectSelectOfGroup = true;
                                    }
                                }
                            })
                        }
                    })

                    if (allSubjectSelectOfGroup && groupSelectedSubject > 0) {
                        price += group?.price;
                        finalPrice += group?.price - ((group?.price / 100) * group?.discount);
                        thumbLogo = selectedOfGroup[0]?.description?.thumb;
                        // discount += selectedSubject?.discount;
                        entityId.push({
                            purchaseType: "courseContent",
                            entityId: group?.entityId
                        })
                    } else {
                        // thumbLogo = plan?.description?.thumb;
                        selectedOfGroup.forEach((selectedSubject) => {
                            price += selectedSubject?.price;
                            finalPrice += selectedSubject?.price - ((selectedSubject?.price / 100) * selectedSubject?.discount);
                            thumbLogo = selectedOfGroup[0]?.description?.thumb;
                            // discount += selectedSubject?.discount;
                            entityId.push({
                                purchaseType: "courseContent",
                                entityId: selectedSubject?.entityId
                            })
                        })
                    }
                })
            }

        }
        else if (selectedGroup === 'group1') {
            if (plan?.children?.length > 0) {
                plan?.children.forEach((group) => {
                    if (group?.title === 'Group 1') {
                        price = group?.price;
                        thumbLogo = group?.description?.thumb;
                        finalPrice += group?.price - ((group?.price / 100) * group?.discount);
                        // discount = group?.discount;
                        entityId.push({
                            purchaseType: "courseContent",
                            entityId: group?.entityId
                        })
                        let selectedSubject = filterSelectedSubjectListByGroup(group, sltSubject);
                        if (selectedSubject?.length > 0 && selectedSubject.length !== group.children.length) {
                            price = 0;
                            // discount = 0;
                            finalPrice = 0;
                            entityId = [];
                            selectedSubject.forEach((selectedSubject) => {
                                price += selectedSubject?.price;
                                // discount += selectedSubject?.discount;
                                finalPrice += selectedSubject?.price - ((selectedSubject?.price / 100) * selectedSubject?.discount);

                                entityId.push({
                                    purchaseType: "courseContent",
                                    entityId: selectedSubject?.entityId
                                })
                            })
                        }
                    }
                })
            } else {
                if (plan?.title === 'Group 1') {
                    price = plan?.price;
                    thumbLogo = plan?.description?.thumb;
                    finalPrice += plan?.price - ((plan?.price / 100) * plan?.discount);
                    // discount = plan?.discount;
                    entityId.push({
                        purchaseType: "courseContent",
                        entityId: plan?.entityId
                    })
                }
            }

        }

        else if (selectedGroup === 'group2') {
            if (plan?.children?.length > 0) {
                plan?.children.forEach((group) => {
                    if (group?.title === 'Group 2') {
                        price = group?.price;
                        thumbLogo = group?.description?.thumb;
                        finalPrice += group?.price - ((group?.price / 100) * group?.discount);
                        // discount = group?.discount;
                        entityId.push({
                            purchaseType: "courseContent",
                            entityId: group?.entityId
                        })
                        let selectedSubject = filterSelectedSubjectListByGroup(group, sltSubject);
                        if (selectedSubject?.length > 0 && selectedSubject.length !== group.children.length) {
                            price = 0;
                            // discount = 0;
                            entityId = [];
                            finalPrice = 0;
                            selectedSubject.forEach((selectedSubject) => {
                                price += selectedSubject?.price;
                                // discount += selectedSubject?.discount;
                                finalPrice += selectedSubject?.price - ((selectedSubject?.price / 100) * selectedSubject?.discount);

                                entityId.push({
                                    purchaseType: "courseContent",
                                    entityId: selectedSubject?.entityId
                                })
                            })
                        }
                    }
                })
            } else {
                if (plan?.title === 'Group 2') {
                    price = plan?.price;
                    thumbLogo = plan?.description?.thumb;
                    finalPrice += plan?.price - ((plan?.price / 100) * plan?.discount);
                    // discount = plan?.discount;
                    entityId.push({
                        purchaseType: "courseContent",
                        entityId: plan?.entityId
                    })
                }
            }
        }
        let discount = price - finalPrice;
        let percent = discount > 0 ? (((discount) / price) * 100).toFixed(2) : 0;

        return { "price": price, "finalPrice": finalPrice, "entityId": entityId, "thumbLogo": thumbLogo, "discount": discount, "percent": percent };

    }
    const getTagsList = async () => {
        try {
            let requestOptions = {
                // headers: { "X-Auth": token },
                withCredentials: false,
            };
            const response = await axios.get(BASE_URL + "admin/course/fetch-tags-public/" + InstId, requestOptions);
            if (response?.data?.errorCode === 0) {
                setTagsList(response?.data?.tags)
                let selectedSeriesByTitle = response?.data?.tags;
                // const testByTitle = selectedSeriesByTitle.find(
                //     (item) => item.tag === "CA Test Series"
                // );
                setSelectedTag(selectedSeriesByTitle[0])
            };

        } catch (error) {
            console.log(error);
        }
    };

    const getCourseList = async () => {
        try {
            let requestOptions = {
                // headers: { "X-Auth": token },
                withCredentials: false,
            };
            const response = await axios.get(BASE_URL + "admin/course/fetch-public/" + InstId, requestOptions);
            if (response?.data?.errorCode === 0) {
                setCourse(response?.data?.courses);
            };
        } catch (error) {
            console.log(error);
        }
    };

    const fetchDripContent = async (scheduleId) => {
        try {
            let requestOptions = {
                // headers: { "X-Auth": token },
                withCredentials: false,
            };
            const response = await axios.get(BASE_URL + `/admin/content/fetch-drip-content/${scheduleId}`, requestOptions);

            if (response?.data?.errorCode === 0) {
                setAlltreeList(response?.data?.content ? response?.data?.content : response?.data?.contentList);
                updateCartAndPurchaseArrays(response?.data?.content, cartArray)
            };
        } catch (error) {
            console.log(error);
        }
    }

    const getAllCoursesPublic = async () => {
        try {
            let requestOptions = {
                // headers: { "X-Auth": token },
                withCredentials: false,
            };
            const response = await axios.get(
                BASE_URL + "admin/course/fetch/" + selectCourse?.setting?.orderBumpCourse,
                requestOptions
            );
            if (response?.data?.errorCode === 0) {

                setCoursesPublic(response?.data?.course);

            };
        } catch (error) {
            console.log(error);
        }
    };

    const getInstituteDetail = async () => {
        try {
            let requestOptions = {
                // headers: { "X-Auth": token },
                withCredentials: false,
            };
            const response = await axios.get(
                BASE_URL + "/getMetaData/fetch-institute/" + InstId,
                requestOptions
            );
            if (response?.data?.errorCode === 0) {
                setEndpoints(response?.data?.instituteTechSetting?.mediaUrl)
                // Endpoints = response?.data?.instituteTechSetting?.mediaUrl
            };
        } catch (error) {
            console.log(error);
        }
    };

    const isStepSkipped = (step) => {
        return skipped.has(step);
    };

    const totalSteps = () => {
        return steps.length;
    };

    const completedSteps = () => {
        return Object.keys(completed).length;
    };

    const isLastStep = () => {
        return activeStep === totalSteps() - 1;
    };

    const allStepsCompleted = () => {
        return completedSteps() === totalSteps();
    };

    const handleNext = () => {
        const newActiveStep = isLastStep() && !allStepsCompleted() ? steps.findIndex((step, i) => !(i in completed)) : activeStep + 1;
        setActiveStep(newActiveStep);
    };

    const handleBack = () => {
        setPeviewImgVideo({})
        setActiveStep((prevActiveStep) => prevActiveStep - 1);

    };

    const handleReset = () => {
        setActiveStep(0);
        setCompleted({});
    };

    useEffect(() => {
        localStorage.setItem("addedCartPlans", JSON.stringify(addedCartPlans));
        // localStorage.setItem("purchaseArray", JSON.stringify(purchaseArray));
        localStorage.setItem("addtoCartIds", JSON.stringify(addtoCartIds));
        localStorage.setItem("selectCourse", JSON.stringify(selectCourse));

        // cartNumberUpdate()

    }, [addedCartPlans, purchaseArray, addtoCartIds, selectCourse])

    const handleEnrollNow = (item) => {
        const id = item.id;
        const isSelected = cartArray.some(cartItem => cartItem.plan.id === id); // Check if the item is already in the cart

        if (isSelected) {
            // Remove the item from the cart
            const updatedCartArray = cartArray.filter(cartItem => cartItem.plan.id !== id);
            setCartArray(updatedCartArray);
            localStorage.setItem("cartArray", JSON.stringify(updatedCartArray));
            typeof cartNumberUpdate === 'function' && cartNumberUpdate();
        } else {
            // Add the item to the cart
            const obj = {
                group: activeBtn,
                subject: selectSubjectWise,
                plan: item
            };
            const updatedCartArray = [...cartArray, obj];
            setCartArray(updatedCartArray);
            localStorage.setItem("cartArray", JSON.stringify(updatedCartArray));
            typeof cartNumberUpdate === 'function' && cartNumberUpdate();
        }
    };

    const handleShowCart = () => {
        const newActiveStep = isLastStep() && !allStepsCompleted() ? steps.findIndex((step, i) => !(i in completed)) : activeStep + 1;


        handleNextBrowse();

        setActiveStep(newActiveStep);
        window.scrollTo(0, 0)


    }

    const handleAddToCard = () => {
        if (courseContentList?.length > 1) {
            setOpenScheduleModal(true);
        } else {
            const newActiveStep = isLastStep() && !allStepsCompleted() ? steps.findIndex((step, i) => !(i in completed)) : activeStep + 1;
            handleNextBrowse()
            setActiveStep(newActiveStep);
            getAllCoursesPublic()
        }

    }

    const handleCheckoutSubmit = () => {
        const newActiveStep = isLastStep() && !allStepsCompleted() ? steps.findIndex((step, i) => !(i in completed)) : activeStep + 1;
        handleNextBrowse()
        setActiveStep(newActiveStep);
        getAllCoursesPublic()
        setOpenScheduleModal(false);
    }

    const handleAddCourse = (item) => {
        const coursePrice = Number(item?.price) - Number(item?.price) * (Number(item.discount) / 100);
        const id = item.id;
        const purchaseObject = {
            purchaseType: "course",
            entityId: id,
        };
        const updatedPurchaseObjects = [...purchaseArray];
        const isSelected = selectedIds.includes(id);

        if (isSelected) {
            setTotalPrice((prevTotalPrice) => prevTotalPrice - coursePrice);
            setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
            const indexToRemove = updatedPurchaseObjects.findIndex((obj) => obj.entityId === id);
            updatedPurchaseObjects.splice(indexToRemove, 1);
        } else {
            setTotalPrice((prevTotalPrice) => prevTotalPrice + coursePrice);
            setSelectedIds([...selectedIds, id]);
            updatedPurchaseObjects.push(purchaseObject);
        }
        setPurchaseArray(updatedPurchaseObjects);
        setAddSuggestCourse(!addSuggestCourse);
    };


    const handleChangeCours = (event) => {
        setPurchaseArray([])
        setPeviewImgVideo({})
        setPlansList([])
        setAddedCartPlans([]);
        setAddtoCartIds([]);
        setPurchaseArray([]);
        setSelectedIds([]);
        setSelectSubjectWise([]);
        setActiveStep(0);
        let courseId = event?.target?.value?.id
        setSelectCourse(event.target.value);
        getCourseContentList(courseId);
    };

    const handleTags = (event) => {
        setPeviewImgVideo({})
        setSelectCourse('')
        setActiveStep(0)
        let courseId = event?.target?.value?.id
        setSelectedTag(event.target.value);
        getCourseList()
    };

    const handleChange = (event) => {
        const selectedValue = event.target.value;
        const selectedObject = courseContentList.find(item => item.title === selectedValue?.title);
        setSelectShedule(selectedValue)
        getSheduleContentList(selectCourse?.id, selectedObject?.id, "first");
        // fetchDripContent(selectedValue?.id)
        // setPlansList([])
    };

    const handleButtonClick = (value) => {
        setSelectSubjectWise([]);
        setActiveStep(0);
        setActiveBtn(value);
        getPlans(value);
    }

    const handleSubjectWise = (event) => {
        const {
            target: { value },
        } = event;
        setSelectSubjectWise(typeof value === 'string' ? value.split(',') : value);
    };

    const handleSubmit = async () => {
        const body = {
            "firstName": title,
            "lastName": title,
            "contact": number,
            "email": email,
            "campaignId": campaignId,
            "instId": InstId,
            "entityModals": purchaseArray,
            "coupon": isCouponValid === true ? couponNumber : null
        }
        try {
            const response = await axios.post(BASE_URL + `/admin/payment/fetch-public-checkout-url`, body);

            if (response?.data?.status === true) {

                const width = 480;
                const height = 1080;
                const left = window.screenX + (window.outerWidth / 2) - (width / 2);
                const top = window.screenY + (window.outerHeight / 2) - (height / 2);

                window.open(
                    response?.data?.url,
                    'sharer',
                    `location=no,width=${width},height=${height},top=${top},left=${left}`
                );

                // window.open(response?.data?.url, '_blank', "noopener,noreferrer");
                // window.open(response?.data?.url, 'sharer', "location=no,width=480,height=1080");

                setTitle('');
                setNumber('');
                setEmail('')
                setCartArray([])
                // localStorage.removeItem('cartArray')
                localStorage.setItem("cartArray", JSON.stringify([]));

                // handleDrawerClose()
            }
            const newActiveStep = isLastStep() && !allStepsCompleted() ? steps.findIndex((step, i) => !(i in completed)) : activeStep + 1;
            setActiveStep(newActiveStep);
            typeof cartNumberUpdate === 'function' && cartNumberUpdate();
        } catch (err) {
            console.log(err);
        };
    };

    const handlePreview = (url, type, itemId) => {
        setPeviewImgVideo((prev) => ({ ...prev, [itemId]: { url, type } }));
    };

    const handleCheckboxChange = () => {
        setChecked(!checked);

        if (!checked) {
            // Add the object when checked
            setPurchaseArray((prevArray) => [
                ...prevArray,
                {
                    purchaseType: "course",
                    entityId: Number(orderBumpCourse?.id),
                }
            ]);
        } else {
            // Remove the object when unchecked
            setPurchaseArray((prevArray) =>
                prevArray.filter(
                    (item) => item.entityId !== Number(orderBumpCourse?.id)
                )
            );
        }
    };

    const handleViewPlan = () => {
        setViewPlanModal(true)
    }

    const handleRemoveItem = (item, i) => {
        let temp = [];
        cartArray.forEach((item, x) => {
            if (x !== i) {
                temp.push(item)
            }
        })
        setCartArray(temp);
        localStorage.setItem('cartArray', JSON.stringify(temp));
        if (temp?.length === 0) {
            setActiveStep(0)
        }
        typeof cartNumberUpdate === 'function' && cartNumberUpdate();
    }

    const toggleExpandDescription = (des) => {
        setFullDes(des)
        setCourseExpandedDescriptions(true);
    };

    const truncateDescription = (description) => {
        // Replace &nbsp; and other HTML entities with plain text equivalents
        const decodedDescription = description
            .replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&') // Example for handling other entities, can add more if needed
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'");

        // Strip any remaining HTML tags
        const strippedDescription = decodedDescription
            .replace(/<[^>]*>/g, ' ') // Remove HTML tags
            .split(/\s+/)
            .slice(0, 10) // Get first 10 words
            .join(' ');

        return strippedDescription;
    };

    const chipTitle = (title) => {
        const first10Words = title
            .split(' ')
            .slice(0, 3)
            .join(' ');
        return first10Words;
    }
    const handleSelectSub = () => {
        setActiveBtn("both")
    }

    const handleNumberChange = (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value) && value.length <= 10) {
            setNumber(value);
            setError('');
            if (value.length < 10) {
                setError('Number must be 10 digits long');
            }
        }
    };


    const handleFilter = (value) => {
        if (value === "group") {
            setSelectSubjectWise([])
            setActiveBtn(activeBtn)
        } else if (value === "subject") {
            setActiveBtn("both")
        }
        setFilterGroupSubject(value);
    }

    const handleCheckCoupon = async (e) => {
        e.preventDefault();
        const body = {
            "getCheckoutUrls": purchaseArray,
            "coupon": couponNumber,
            "contact": Number(number),
            "instId": InstId,
            "amount": checked ? (orderBumpCourse.price - ((orderBumpCourse.price / 100) * orderBumpCourse.discount)) + totalPrice : (totalPrice)
        }
        try {
            const response = await axios.post(BASE_URL + `/student/coupon/verify`, body);
            // const response = await CourseNetwrok.checkCouponApi(body);
            if (response.data.errorCode === 0) {
                setCouponDiscount(response.data?.discount);
                setIsCouponValid(response.data?.valid);
                setErrorMessage("");
            } else {
                setIsCouponValid(response.data?.valid === null ? false : response.data?.valid);
                setErrorMessage(response.data?.message ? response.data?.message : "Invalid Coupon Code");
                setCouponDiscount(0)
                // setErrorMessage("Invalid Coupon Code")
            }
        } catch (err) {
            console.log(err);
        };
    };

    const handleCoupon = (e) => {
        setCouponNumber(e.target.value);
        setErrorMessage('');
        setIsCouponValid(null);
    }

    const getColor = () => {
        if (isCouponValid === null) return 'darkblue';
        return isCouponValid ? '#329908' : 'red';
    };

    const handleReedemCode = () => {
        setReedemCode(!reedemCode)
    }

    // console.log('plansList', plansList, cartArray);
    // console.log('selectedBasicPlan', selectedBasicPlan, selectedAotherSchedule);
    const handleSchedulePopUp = () => {
        setImageSchedule(true)
    }

    // console.log('selectedBasicPlan', selectedBasicPlan, selectCourse);

    const mergePDFs = async (url1, url2) => {
        try {
            // Fetch both PDFs
            const [pdf1Response, pdf2Response] = await Promise.all([
                fetch(url1),
                fetch(url2)
            ]);

            const [pdf1ArrayBuffer, pdf2ArrayBuffer] = await Promise.all([
                pdf1Response.arrayBuffer(),
                pdf2Response.arrayBuffer()
            ]);

            // Load PDFs
            const pdf1 = await PDFDocument.load(pdf1ArrayBuffer);
            const pdf2 = await PDFDocument.load(pdf2ArrayBuffer);

            // Create a new PDF
            const mergedPdf = await PDFDocument.create();

            // Copy pages from first PDF
            const pages1 = await mergedPdf.copyPages(pdf1, pdf1.getPageIndices());
            pages1.forEach((page) => mergedPdf.addPage(page));

            // Copy pages from second PDF
            const pages2 = await mergedPdf.copyPages(pdf2, pdf2.getPageIndices());
            pages2.forEach((page) => mergedPdf.addPage(page));

            // Save the merged PDF
            const mergedPdfBytes = await mergedPdf.save();

            // Create blob and open in new tab
            const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
            const blobUrl = URL.createObjectURL(blob);
            window.open(blobUrl, '_blank', 'noreferrer');

            // Clean up the blob URL after a delay
            setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
        } catch (error) {
            console.error('Error merging PDFs:', error);
            alert('Failed to merge PDFs. Please try again.');
        }
    };

    const handleSubjectView = () => {
        if (selectedBasicPlan?.title === "Cumulative") {
            const url = 'https://classio.in-maa-1.linodeobjects.com/Cumulative%20pattern%20Syllabus%20CAI%20for%20PDF%20%20(2)%20(1).pdf'
            window.open(url, '_blank', 'noreferrer');
        } else if (selectedBasicPlan?.title === "Exclusive") {
            const url = 'https://classio.in-maa-1.linodeobjects.com/Exlusive%20Pattern%20Syllabus%20CAI%20for%20PDF%20%20(1).pdf'
            window.open(url, '_blank', 'noreferrer');
        } else if (selectedAotherSchedule?.title === "Portion WiseTest Series" && selectCourse?.title === "CA Final") {
            const url = 'https://classio.in-maa-1.linodeobjects.com/final%20syllabus%20.pdf'
            window.open(url, '_blank', 'noreferrer');
        } else if (selectedAotherSchedule?.title === "Exam oriented Test Series" && selectCourse?.title === "CA Inter") {
            // Merge and open two PDFs
            const url1 = 'https://classio.in-maa-1.linodeobjects.com/ExamOrientedTestSyllabusGroup1.pdf';
            const url2 = 'https://classio.in-maa-1.linodeobjects.com/ExamOrientedTestSyllabusGroup2.pdf';
            mergePDFs(url1, url2);
        }

    }

    const handleCloseSchedule = () => {
        setImageSchedule(false);
    };

    const handleWindowStore = () => {
        const url = 'https://apps.microsoft.com/detail/9P8QKZ93ZC28?hl=en-us&gl=IN&ocid=pdpshare'
        window.open(url, '_blank', 'noreferrer');
    }

    const handlePlayStore = () => {
        const url = 'https://play.google.com/store/apps/details?id=com.classiolabs.vsmart'
        window.open(url, '_blank', 'noreferrer');
    }

    return (
        <Layout>
            <Box
                id="testseries"
                sx={{
                    width: '100%',
                    maxWidth: '100vw',
                    margin: { xs: '20px 0', sm: '40px' },
                    textAlign: 'left',
                    overflow: 'hidden',
                    overflowX: 'hidden',
                    px: { xs: 2, sm: 3 },
                    boxSizing: 'border-box',
                    // Desktop-specific overflow prevention and spacing
                    '@media (min-width: 768px)': {
                        maxWidth: '100vw',
                        overflow: 'hidden',
                        margin: '40px auto',
                        px: 6, // Add more horizontal padding on desktop
                    },
                    '@media (min-width: 1024px)': {
                        px: 8, // Even more padding on larger desktops
                    },
                    '@media (min-width: 1200px)': {
                        px: 12, // Maximum padding on very large screens
                    },
                }}
            >
                <Box sx={{ width: '100%', maxWidth: '100%', overflow: 'hidden', boxSizing: 'border-box' }}>
                    <Box sx={{ width: '100%', overflow: 'hidden', boxSizing: 'border-box' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'row', pb: 2, mt: 3 }}>
                            <Button
                                color="inherit"
                                // disabled={activeStep === 0}
                                onClick={handleBack}
                                sx={{ mr: 1, fontWeight: "bold", fontSize: "14px" }}
                            >
                                <ArrowBackIcon /> &nbsp; Back
                            </Button>
                            <Box sx={{ flex: '1 1 auto' }} />
                        </Box>
                        <div>
                            <h2 className='mobile-text-high' style={{
                                textTransform: "initial",
                                display: "flex",
                                flexWrap: "wrap",
                                alignItems: "center",
                                textAlign: "left",
                                fontWeight: "bold",
                                marginBottom: "15px",
                                justifyContent: "left",
                                background: 'linear-gradient(135deg, #2D3748 0%, #4A5568 50%, #2D3748 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                fontSize: 'clamp(1.5rem, 6vw, 2.5rem)',
                                letterSpacing: '-0.02em',
                                textShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                                position: 'relative',
                                paddingX: '12px'
                            }}>
                                🏆 Highly Rated
                                <span style={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    marginLeft: "8px",
                                    marginRight: "8px",
                                    fontWeight: "800",
                                    textShadow: '0 2px 10px rgba(102, 126, 234, 0.3)'
                                }}>CAwallah</span>
                                Test Series Program ✨
                            </h2>
                            <p style={{
                                marginBottom: '24px',
                                fontSize: 'clamp(1rem, 3.5vw, 1.3rem)',
                                color: '#4A5568',
                                fontWeight: '500',
                                background: 'linear-gradient(135deg, #4A5568 0%, #667eea 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                paddingX: '12px'
                            }}>
                                🚀 Crack CA-CS with Our Trusted and Most Loved Test Series.
                            </p>
                        </div>

                        <Grid container sx={{
                            pt: 2,
                            // pb: 4,
                            width: '100%',
                            maxWidth: '100%',
                            overflow: 'hidden',
                            boxSizing: 'border-box',
                            // Desktop-specific constraints
                            '@media (min-width: 768px)': {
                                maxWidth: '100%',
                                overflow: 'hidden'
                            }
                        }}>
                            <Grid item xs={12} sm={8} md={8} lg={8}>
                                <Box sx={{
                                    width: '100%',
                                    maxWidth: '100%',
                                    overflow: 'visible',
                                    pb: { xs: 1, sm: 0 }
                                }}>
                                    <Stack
                                        direction={{ xs: "column", sm: "row" }}
                                        spacing={3}
                                        className='stack-mobile'
                                        sx={{
                                            width: '100%',
                                            flexWrap: 'wrap',
                                            alignItems: { xs: 'stretch', sm: 'flex-start' }
                                        }}
                                    >
                                        {activeStep === 0 && (
                                            <>
                                                {/* <FormControl className='mobile-select-button'>
                                            <InputLabel id="demo-simple-select-label" sx={{ fontSize: "13px" }}>Select Exam</InputLabel>
                                            <Select
                                                className='select-option'
                                                sx={{ mb: 2, minWidth: "100px", fontSize: "12px" }}
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={selectedTag}
                                                label="Select Exam"
                                                onChange={handleTags}
                                            >
                                                {
                                                    tagsList && tagsList.map((data, index) => {
                                                        return (
                                                            <MenuItem key={index} value={data}>{data?.tag}</MenuItem>
                                                        )
                                                    })
                                                }
                                            </Select>
                                        </FormControl> */}
                                                {/* <FormControl className='mobile-select-button'>
                                            <InputLabel id="demo-simple-select-label" sx={{ fontSize: "13px" }}>Select Course</InputLabel>
                                            <Select
                                                className='select-option'
                                                sx={{ mb: 2, minWidth: "100px", fontSize: "12px" }}
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                renderValue={(val) => <div>{val.title}</div>}
                                                value={selectCourse}

                                                label="Select Course"
                                                onChange={handleChangeCours}
                                            >
                                                {selectCourse && (
                                                    <MenuItem value={selectCourse.id}>{selectCourse.title}</MenuItem>
                                                )}
                                            </Select>
                                        </FormControl> */}

                                                {
                                                    courseContentList?.length > 1 && (
                                                        <FormControl
                                                            className='mobile-select-button'
                                                            sx={{
                                                                width: { xs: '100%', sm: 'auto' },
                                                                maxWidth: { xs: '100%', sm: '300px' },
                                                                minWidth: { xs: '100%', sm: '200px' },
                                                                flex: { xs: '1 1 auto', sm: '0 0 auto' },
                                                                '& .MuiOutlinedInput-root': {
                                                                    background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
                                                                    borderRadius: '16px',
                                                                    border: '1px solid rgba(255, 255, 255, 0.3)',
                                                                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                                                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                                    width: '100%',
                                                                    '&:hover': {
                                                                        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                                                                        transform: 'translateY(-2px)',
                                                                        '& .MuiOutlinedInput-notchedOutline': {
                                                                            borderColor: 'rgba(102, 126, 234, 0.5)'
                                                                        }
                                                                    },
                                                                    '&.Mui-focused': {
                                                                        '& .MuiOutlinedInput-notchedOutline': {
                                                                            borderColor: '#667eea',
                                                                            borderWidth: '2px'
                                                                        }
                                                                    }
                                                                },
                                                                '& .MuiInputLabel-root': {
                                                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                                    WebkitBackgroundClip: 'text',
                                                                    WebkitTextFillColor: 'transparent',
                                                                    fontWeight: 600,
                                                                    '&.Mui-focused': {
                                                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                                        WebkitBackgroundClip: 'text',
                                                                        WebkitTextFillColor: 'transparent'
                                                                    }
                                                                }
                                                            }}
                                                        >
                                                            <InputLabel
                                                                id="demo-simple-select-label"
                                                                sx={{
                                                                    fontSize: { xs: "14px", sm: "15px" },
                                                                    fontWeight: 600
                                                                }}
                                                            >
                                                                Select Schedule
                                                            </InputLabel>
                                                            <Select
                                                                className='select-option'
                                                                sx={{
                                                                    mb: 2,
                                                                    width: '100%',
                                                                    maxWidth: '100%',
                                                                    fontSize: { xs: "13px", sm: "14px" },
                                                                    '& .MuiSelect-select': {
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        gap: '8px',
                                                                        whiteSpace: 'nowrap',
                                                                        overflow: 'hidden',
                                                                        textOverflow: 'ellipsis'
                                                                    }
                                                                }}
                                                                labelId="demo-simple-select-label"
                                                                id="demo-simple-select"
                                                                renderValue={(val) => <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>{val.title}</div>}
                                                                value={selectedSchedule}
                                                                label="Select Schedule"
                                                                onChange={handleSchedule}
                                                                MenuProps={{
                                                                    PaperProps: {
                                                                        sx: {
                                                                            background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.95) 100%)',
                                                                            border: '1px solid rgba(255, 255, 255, 0.3)',
                                                                            borderRadius: '16px',
                                                                            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
                                                                            '& .MuiMenuItem-root': {
                                                                                borderRadius: '8px',
                                                                                margin: '4px 8px',
                                                                                transition: 'all 0.2s ease',
                                                                                '&:hover': {
                                                                                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                                                                                    transform: 'translateX(4px)'
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }}
                                                            >
                                                                {
                                                                    courseContentList && courseContentList.map((data, index) => {
                                                                        if (data?.active === true) {
                                                                            return (
                                                                                <MenuItem key={index} value={data}>{data?.title}</MenuItem>
                                                                            )
                                                                        }

                                                                    })
                                                                }
                                                            </Select>
                                                        </FormControl>
                                                    )
                                                }

                                                <FormControl
                                                    className='mobile-select-button'
                                                    sx={{
                                                        width: { xs: '100%', sm: 'auto' },
                                                        maxWidth: { xs: '350px', sm: '300px' },
                                                        minWidth: { xs: '350px', sm: '200px' },
                                                        flex: { xs: '1 1 auto', sm: '0 0 auto' },
                                                        '& .MuiOutlinedInput-root': {
                                                            background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
                                                            borderRadius: '16px',
                                                            border: '1px solid rgba(255, 255, 255, 0.3)',
                                                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                            width: '100%',
                                                            '&:hover': {
                                                                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                                                                transform: 'translateY(-2px)',
                                                                '& .MuiOutlinedInput-notchedOutline': {
                                                                    borderColor: 'rgba(102, 126, 234, 0.5)'
                                                                }
                                                            },
                                                            '&.Mui-focused': {
                                                                '& .MuiOutlinedInput-notchedOutline': {
                                                                    borderColor: '#667eea',
                                                                    borderWidth: '2px'
                                                                }
                                                            }
                                                        },
                                                        '& .MuiInputLabel-root': {
                                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                            WebkitBackgroundClip: 'text',
                                                            WebkitTextFillColor: 'transparent',
                                                            fontWeight: 600,
                                                            '&.Mui-focused': {
                                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                                WebkitBackgroundClip: 'text',
                                                                WebkitTextFillColor: 'transparent'
                                                            }
                                                        }
                                                    }}>
                                                    <InputLabel
                                                        id="demo-simple-select-label"
                                                        sx={{
                                                            fontSize: { xs: "14px", sm: "15px" },
                                                            fontWeight: 600
                                                        }}
                                                    >
                                                        Select Portion Type
                                                    </InputLabel>
                                                    <Select
                                                        className='select-option'
                                                        sx={{
                                                            mb: 2,
                                                            width: '100%',
                                                            maxWidth: '100%',
                                                            fontSize: { xs: "13px", sm: "14px" },
                                                            '& .MuiSelect-select': {
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '8px',
                                                                whiteSpace: 'nowrap',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis'
                                                            }
                                                        }}
                                                        labelId="demo-simple-select-label"
                                                        id="demo-simple-select"
                                                        renderValue={(val) => <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>{val.title}</div>}
                                                        value={selectedAotherSchedule}
                                                        label="Select Portion Type"
                                                        onChange={handleAnotherSchedule}
                                                        MenuProps={{
                                                            PaperProps: {
                                                                sx: {
                                                                    background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.95) 100%)',
                                                                    border: '1px solid rgba(255, 255, 255, 0.3)',
                                                                    borderRadius: '16px',
                                                                    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
                                                                    '& .MuiMenuItem-root': {
                                                                        borderRadius: '8px',
                                                                        margin: '4px 8px',
                                                                        transition: 'all 0.2s ease',
                                                                        '&:hover': {
                                                                            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                                                                            transform: 'translateX(4px)'
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }}
                                                    >
                                                        {
                                                            sheduleContentList && sheduleContentList.map((data, index) => {
                                                                if (data?.active === true) {
                                                                    return (
                                                                        <MenuItem key={index} value={data}>{data?.title}</MenuItem>
                                                                    )
                                                                }

                                                            })
                                                        }
                                                    </Select>
                                                </FormControl>
                                                {
                                                    selectScheduleContentObj?.title !== "Test Series Plus Mentorship" && (
                                                        <FormControl className='mobile-select-button' sx={{
                                                            '& .MuiOutlinedInput-root': {
                                                                background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
                                                                borderRadius: '16px',
                                                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                                                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                                '&:hover': {
                                                                    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                                                                    transform: 'translateY(-2px)',
                                                                    '& .MuiOutlinedInput-notchedOutline': {
                                                                        borderColor: 'rgba(102, 126, 234, 0.5)'
                                                                    }
                                                                },
                                                                '&.Mui-focused': {
                                                                    '& .MuiOutlinedInput-notchedOutline': {
                                                                        borderColor: '#667eea',
                                                                        borderWidth: '2px'
                                                                    }
                                                                }
                                                            },
                                                            '& .MuiInputLabel-root': {
                                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                                WebkitBackgroundClip: 'text',
                                                                WebkitTextFillColor: 'transparent',
                                                                fontWeight: 600,
                                                                '&.Mui-focused': {
                                                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                                    WebkitBackgroundClip: 'text',
                                                                    WebkitTextFillColor: 'transparent'
                                                                }
                                                            }
                                                        }}>
                                                            <InputLabel
                                                                id="demo-simple-select-label"
                                                                sx={{
                                                                    fontSize: { xs: "14px", sm: "15px" },
                                                                    fontWeight: 600
                                                                }}
                                                            >
                                                                Select Plan Type
                                                            </InputLabel>
                                                            <Select
                                                                className='select-option'
                                                                sx={{
                                                                    mb: 2,
                                                                    minWidth: { xs: "120px", sm: "140px" },
                                                                    fontSize: { xs: "13px", sm: "14px" },
                                                                    '& .MuiSelect-select': {
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        gap: '8px'
                                                                    }
                                                                }}
                                                                labelId="demo-simple-select-label"
                                                                id="demo-simple-select"
                                                                renderValue={(val) => <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>{val.title}</div>}
                                                                value={selectedBasicPlan}
                                                                label="Select Plan Type"
                                                                onChange={handleBasicPlans}
                                                                MenuProps={{
                                                                    PaperProps: {
                                                                        sx: {
                                                                            background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.95) 100%)',
                                                                            border: '1px solid rgba(255, 255, 255, 0.3)',
                                                                            borderRadius: '16px',
                                                                            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
                                                                            '& .MuiMenuItem-root': {
                                                                                borderRadius: '8px',
                                                                                margin: '4px 8px',
                                                                                transition: 'all 0.2s ease',
                                                                                '&:hover': {
                                                                                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                                                                                    transform: 'translateX(4px)'
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }}
                                                            >
                                                                {
                                                                    schedulePlans && schedulePlans.map((data, index) => {
                                                                        if (data?.active === true) {
                                                                            return (
                                                                                <MenuItem key={index} value={data}>{data?.title}</MenuItem>
                                                                            )
                                                                        }

                                                                    })
                                                                }
                                                            </Select>
                                                        </FormControl>
                                                    )
                                                }

                                                {
                                                    ((selectedAotherSchedule?.title !== "Full Length Test Series" && selectScheduleContentObj?.title !== "Exam oriented Test Series" && selectScheduleContentObj?.title !== "Test Series Plus Mentorship") && (selectedAotherSchedule?.title !== "Portion WiseTest Series" && selectCourse?.title !== "CA Final")) && (
                                                        <FormControl className='mobile-select-button' sx={{
                                                            '& .MuiOutlinedInput-root': {
                                                                background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
                                                                borderRadius: '16px',
                                                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                                                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                                '&:hover': {
                                                                    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                                                                    transform: 'translateY(-2px)',
                                                                    '& .MuiOutlinedInput-notchedOutline': {
                                                                        borderColor: 'rgba(102, 126, 234, 0.5)'
                                                                    }
                                                                },
                                                                '&.Mui-focused': {
                                                                    '& .MuiOutlinedInput-notchedOutline': {
                                                                        borderColor: '#667eea',
                                                                        borderWidth: '2px'
                                                                    }
                                                                }
                                                            },
                                                            '& .MuiInputLabel-root': {
                                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                                WebkitBackgroundClip: 'text',
                                                                WebkitTextFillColor: 'transparent',
                                                                fontWeight: 600,
                                                                '&.Mui-focused': {
                                                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                                    WebkitBackgroundClip: 'text',
                                                                    WebkitTextFillColor: 'transparent'
                                                                }
                                                            }
                                                        }}>
                                                            <InputLabel
                                                                id="demo-simple-select-label"
                                                                sx={{
                                                                    fontSize: { xs: "14px", sm: "15px" },
                                                                    fontWeight: 600
                                                                }}
                                                            >
                                                                Select Program Type
                                                            </InputLabel>
                                                            <Select
                                                                className='select-option'
                                                                sx={{
                                                                    mb: 2,
                                                                    minWidth: { xs: "120px", sm: "140px" },
                                                                    fontSize: { xs: "13px", sm: "14px" },
                                                                    '& .MuiSelect-select': {
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        gap: '8px'
                                                                    }
                                                                }}
                                                                labelId="demo-simple-select-label"
                                                                id="demo-simple-select"
                                                                renderValue={(val) => <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>{val.title}</div>}
                                                                value={selectedForPlans}
                                                                label="Select Program Type"
                                                                onChange={handleSelecForPlan}
                                                                MenuProps={{
                                                                    PaperProps: {
                                                                        sx: {
                                                                            background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.95) 100%)',
                                                                            border: '1px solid rgba(255, 255, 255, 0.3)',
                                                                            borderRadius: '16px',
                                                                            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
                                                                            '& .MuiMenuItem-root': {
                                                                                borderRadius: '8px',
                                                                                margin: '4px 8px',
                                                                                transition: 'all 0.2s ease',
                                                                                '&:hover': {
                                                                                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                                                                                    transform: 'translateX(4px)'
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }}
                                                            >
                                                                {
                                                                    planList && planList.map((data, index) => {
                                                                        if (data?.active === true) {
                                                                            return (
                                                                                <MenuItem key={index} value={data}>{data?.title}</MenuItem>
                                                                            )
                                                                        }

                                                                    })
                                                                }
                                                            </Select>
                                                        </FormControl>
                                                    )
                                                }
                                                {
                                                    selectCourse?.title === "CA Inter" && selectedAotherSchedule?.title === "Portion wise Test Series" && selectedBasicPlan?.title ?
                                                        <>
                                                            {/* Desktop: Add buttons to the same row */}
                                                            <Box sx={{
                                                                display: { xs: 'none', sm: 'flex' },
                                                                gap: 2,
                                                                alignItems: 'center'
                                                            }}>
                                                                <Button
                                                                    onClick={handleSubjectView}
                                                                    sx={{
                                                                        background: "#1354C1",
                                                                        color: "#fff",
                                                                        fontWeight: "bold",
                                                                        border: "1px solid #c1c1c196",
                                                                        fontSize: "12px",
                                                                        padding: "14px 11px",
                                                                        borderRadius: "8px",
                                                                        minWidth: '100px',
                                                                        '&:hover': {
                                                                            background: "#0f4aa6",
                                                                            transform: 'translateY(-2px)',
                                                                            boxShadow: '0 4px 12px rgba(19, 84, 193, 0.3)'
                                                                        },
                                                                        transition: 'all 0.3s ease'
                                                                    }}
                                                                    className='button-hover'
                                                                >
                                                                    Syllabus
                                                                </Button>
                                                                <Button
                                                                    onClick={handleSchedulePopUp}
                                                                    sx={{
                                                                        background: "#1354C1",
                                                                        color: "#fff",
                                                                        fontWeight: "bold",
                                                                        border: "1px solid #c1c1c196",
                                                                        fontSize: "12px",
                                                                        padding: "14px 11px",
                                                                        borderRadius: "8px",
                                                                        minWidth: '100px',
                                                                        '&:hover': {
                                                                            background: "#0f4aa6",
                                                                            transform: 'translateY(-2px)',
                                                                            boxShadow: '0 4px 12px rgba(19, 84, 193, 0.3)'
                                                                        },
                                                                        transition: 'all 0.3s ease'
                                                                    }}
                                                                    className='button-hover'
                                                                >
                                                                    Schedule
                                                                </Button>
                                                            </Box>
                                                        </> : ""
                                                }
                                                {
                                                    selectCourse?.title === "CA Inter" && (selectedAotherSchedule?.title === "Full Length Test Series" || selectScheduleContentObj?.title === "Exam oriented Test Series") ?
                                                        <>
                                                            {/* Desktop: Add button to the same row */}
                                                            <Box sx={{
                                                                display: { xs: 'none', sm: 'flex' },
                                                                gap: 2,
                                                                alignItems: 'center'
                                                            }}>
                                                                <Button
                                                                    onClick={handleSchedulePopUp}
                                                                    sx={{
                                                                        background: "#1354C1",
                                                                        color: "#fff",
                                                                        fontWeight: "bold",
                                                                        border: "1px solid #c1c1c196",
                                                                        fontSize: "12px",
                                                                        padding: "14px 11px",
                                                                        borderRadius: "8px",
                                                                        minWidth: '100px',
                                                                        '&:hover': {
                                                                            background: "#0f4aa6",
                                                                            transform: 'translateY(-2px)',
                                                                            boxShadow: '0 4px 12px rgba(19, 84, 193, 0.3)'
                                                                        },
                                                                        transition: 'all 0.3s ease'
                                                                    }}
                                                                    className='button-hover'
                                                                >
                                                                    Schedule
                                                                </Button>
                                                                {selectCourse?.title === "CA Inter" && selectScheduleContentObj?.title === "Exam oriented Test Series" ?
                                                                    <Button
                                                                        onClick={handleSubjectView}
                                                                        sx={{
                                                                            background: "#1354C1",
                                                                            color: "#fff",
                                                                            fontWeight: "bold",
                                                                            border: "1px solid #c1c1c196",
                                                                            fontSize: "12px",
                                                                            padding: "14px 11px",
                                                                            borderRadius: "8px",
                                                                            minWidth: '100px',
                                                                            '&:hover': {
                                                                                background: "#0f4aa6",
                                                                                transform: 'translateY(-2px)',
                                                                                boxShadow: '0 4px 12px rgba(19, 84, 193, 0.3)'
                                                                            },
                                                                            transition: 'all 0.3s ease'
                                                                        }}
                                                                        className='button-hover'
                                                                    >
                                                                        Syllabus
                                                                    </Button> : ""
                                                                }
                                                            </Box>
                                                        </> : ""
                                                }
                                                {
                                                    selectedAotherSchedule?.title === "Portion WiseTest Series" && selectCourse?.title === "CA Final" && (
                                                        <>
                                                            {/* Desktop: Add buttons to the same row */}
                                                            <Box sx={{
                                                                display: { xs: 'none', sm: 'flex' },
                                                                gap: 2,
                                                                alignItems: 'center'
                                                            }}>
                                                                <Button
                                                                    onClick={handleSubjectView}
                                                                    sx={{
                                                                        background: "#1354C1",
                                                                        color: "#fff",
                                                                        fontWeight: "bold",
                                                                        border: "1px solid #c1c1c196",
                                                                        fontSize: "12px",
                                                                        padding: "14px 11px",
                                                                        borderRadius: "8px",
                                                                        minWidth: '100px',
                                                                        '&:hover': {
                                                                            background: "#0f4aa6",
                                                                            transform: 'translateY(-2px)',
                                                                            boxShadow: '0 4px 12px rgba(19, 84, 193, 0.3)'
                                                                        },
                                                                        transition: 'all 0.3s ease'
                                                                    }}
                                                                    className='button-hover'
                                                                >
                                                                    Syllabus
                                                                </Button>
                                                                <Button
                                                                    onClick={handleSchedulePopUp}
                                                                    sx={{
                                                                        background: "#1354C1",
                                                                        color: "#fff",
                                                                        fontWeight: "bold",
                                                                        border: "1px solid #c1c1c196",
                                                                        fontSize: "12px",
                                                                        padding: "14px 11px",
                                                                        borderRadius: "8px",
                                                                        minWidth: '100px',
                                                                        '&:hover': {
                                                                            background: "#0f4aa6",
                                                                            transform: 'translateY(-2px)',
                                                                            boxShadow: '0 4px 12px rgba(19, 84, 193, 0.3)'
                                                                        },
                                                                        transition: 'all 0.3s ease'
                                                                    }}
                                                                    className='button-hover'
                                                                >
                                                                    Schedule
                                                                </Button>
                                                            </Box>
                                                        </>
                                                    )
                                                }
                                                {/* {
                                        plansList?.length > 0 && isMobileDevice && (
                                            <Box className="mobile-view-schedule">
                                                <Typography variant='p' onClick={handleViewPlan} sx={{ fontWeight: "bold", width: "fit-content", padding: "14px 2px !important", fontSize: "12px", color: "#DD2A3D", fontWeight: "bold", cursor: "pointer" }} >View Schedules</Typography>
                                            </Box>
                                        )
                                    } */}
                                            </>)}
                                        {/* {
                                    activeStep === 1 && (
                                        <>
                                            {
                                                selectCourse?.id && (
                                                    <FormControl className='mobile-select-button'>
                                                        <InputLabel id="demo-simple-select-label" sx={{ fontSize: "13px" }}>Schedule</InputLabel>
                                                        <Select
                                                            className='select-option'
                                                            sx={{ mb: 2, minWidth: "100px", maxWidth: "300px", fontSize: "12px", mr: 2, width: "200px", fontSize: "12px" }}
                                                            labelId="demo-simple-select-label"
                                                            id="demo-simple-select"
                                                            label="Schedule"
                                                            value={selectShedule}
                                                            onChange={handleChange}
                                                        >
                                                            {
                                                                courseContentList && courseContentList.map((data, index) => {
                                                                    return (
                                                                        <MenuItem key={index} value={data}>{data?.title}</MenuItem>
                                                                    )
                                                                })
                                                            }
                                                        </Select>
                                                    </FormControl>
                                                )
                                            }
                                            
                                        </>
                                    )
                                } */}

                                    </Stack>

                                    {/* Mobile: Buttons in new row */}
                                    {
                                        selectCourse?.title === "CA Inter" && selectedAotherSchedule?.title === "Portion wise Test Series" && selectedBasicPlan?.title && (
                                            <Box sx={{
                                                display: { xs: 'flex', sm: 'none' },
                                                flexDirection: 'row',
                                                gap: 2,
                                                mt: 2,
                                                width: '100%'
                                            }}>
                                                <Button
                                                    onClick={handleSubjectView}
                                                    sx={{
                                                        background: "#1354C1",
                                                        color: "#fff",
                                                        fontWeight: "bold",
                                                        border: "1px solid #c1c1c196",
                                                        fontSize: "14px",
                                                        padding: "12px 16px",
                                                        borderRadius: "8px",
                                                        flex: 1,
                                                        '&:hover': {
                                                            background: "#0f4aa6",
                                                            transform: 'translateY(-2px)',
                                                            boxShadow: '0 4px 12px rgba(19, 84, 193, 0.3)'
                                                        },
                                                        transition: 'all 0.3s ease'
                                                    }}
                                                    className='mobile-group-btn button-hover'
                                                >
                                                    Syllabus
                                                </Button>
                                                <Button
                                                    onClick={handleSchedulePopUp}
                                                    sx={{
                                                        background: "#1354C1",
                                                        color: "#fff",
                                                        fontWeight: "bold",
                                                        border: "1px solid #c1c1c196",
                                                        fontSize: "14px",
                                                        padding: "12px 16px",
                                                        borderRadius: "8px",
                                                        flex: 1,
                                                        '&:hover': {
                                                            background: "#0f4aa6",
                                                            transform: 'translateY(-2px)',
                                                            boxShadow: '0 4px 12px rgba(19, 84, 193, 0.3)'
                                                        },
                                                        transition: 'all 0.3s ease'
                                                    }}
                                                    className='mobile-group-btn button-hover'
                                                >
                                                    Schedule
                                                </Button>
                                            </Box>
                                        )
                                    }

                                    {
                                        selectCourse?.title === "CA Inter" && (selectedAotherSchedule?.title === "Full Length Test Series" || selectScheduleContentObj?.title === "Exam oriented Test Series") && (
                                            <Box sx={{
                                                display: { xs: 'flex', sm: 'none' },
                                                flexDirection: 'row',
                                                gap: 2,
                                                mt: 2,
                                                width: '100%'
                                            }}>
                                                <Button
                                                    onClick={handleSchedulePopUp}
                                                    sx={{
                                                        background: "#1354C1",
                                                        color: "#fff",
                                                        fontWeight: "bold",
                                                        border: "1px solid #c1c1c196",
                                                        fontSize: "14px",
                                                        padding: "12px 16px",
                                                        borderRadius: "8px",
                                                        flex: 1,
                                                        '&:hover': {
                                                            background: "#0f4aa6",
                                                            transform: 'translateY(-2px)',
                                                            boxShadow: '0 4px 12px rgba(19, 84, 193, 0.3)'
                                                        },
                                                        transition: 'all 0.3s ease'
                                                    }}
                                                    className='mobile-group-btn button-hover'
                                                >
                                                    Schedule
                                                </Button>
                                            </Box>
                                        )
                                    }

                                    {
                                        selectedAotherSchedule?.title === "Portion WiseTest Series" && selectCourse?.title === "CA Final" && (
                                            <Box sx={{
                                                display: { xs: 'flex', sm: 'none' },
                                                flexDirection: 'row',
                                                gap: 2,
                                                mt: 2,
                                                width: '100%'
                                            }}>
                                                <Button
                                                    onClick={handleSubjectView}
                                                    sx={{
                                                        background: "#1354C1",
                                                        color: "#fff",
                                                        fontWeight: "bold",
                                                        border: "1px solid #c1c1c196",
                                                        fontSize: "14px",
                                                        padding: "12px 16px",
                                                        borderRadius: "8px",
                                                        flex: 1,
                                                        '&:hover': {
                                                            background: "#0f4aa6",
                                                            transform: 'translateY(-2px)',
                                                            boxShadow: '0 4px 12px rgba(19, 84, 193, 0.3)'
                                                        },
                                                        transition: 'all 0.3s ease'
                                                    }}
                                                    className='mobile-group-btn button-hover'
                                                >
                                                    Syllabus
                                                </Button>
                                                <Button
                                                    onClick={handleSchedulePopUp}
                                                    sx={{
                                                        background: "#1354C1",
                                                        color: "#fff",
                                                        fontWeight: "bold",
                                                        border: "1px solid #c1c1c196",
                                                        fontSize: "14px",
                                                        padding: "12px 16px",
                                                        borderRadius: "8px",
                                                        flex: 1,
                                                        '&:hover': {
                                                            background: "#0f4aa6",
                                                            transform: 'translateY(-2px)',
                                                            boxShadow: '0 4px 12px rgba(19, 84, 193, 0.3)'
                                                        },
                                                        transition: 'all 0.3s ease'
                                                    }}
                                                    className='mobile-group-btn button-hover'
                                                >
                                                    Schedule
                                                </Button>
                                            </Box>
                                        )
                                    }
                                </Box>
                                {/* {
                                !isMobileDevice && activeStep === 0 && (
                                    <Grid container>
                                        <Grid item xs={12} sm={12} md={12} lg={12}>
                                            {
                                                plansList?.length > 0 && (
                                                    <Box>
                                                        <Typography variant='p' onClick={handleViewPlan} sx={{ fontWeight: "bold", width: "fit-content", padding: "14px 2px !important", fontSize: "12px", color: "#DD2A3D", fontWeight: "bold", cursor: "pointer" }} >View Schedules</Typography>
                                                    </Box>
                                                )
                                            }
                                        </Grid>
                                    </Grid>
                                )
                            } */}

                            </Grid>
                        </Grid>

                        {/* Stepper Section */}
                        <Box sx={{
                            width: '100%',
                            maxWidth: '100%',
                            mb: 3,
                            overflow: 'hidden',
                            boxSizing: 'border-box'
                        }}>
                            <ModernStepper activeStep={activeStep} connector={<ModernStepConnector />}>
                                {steps.map((label, index) => {
                                    const stepProps = {};
                                    const labelProps = {};
                                    if (isStepSkipped(index)) {
                                        stepProps.completed = false;
                                    }
                                    return (
                                        <Step key={label} {...stepProps}>
                                            <StepLabel {...labelProps} StepIconComponent={(props) => (
                                                <ModernStepIcon {...props} icon={index + 1} />
                                            )}>
                                                <Typography
                                                    variant="body2"
                                                    fontWeight={600}
                                                    sx={{
                                                        fontSize: { xs: '0.75rem', sm: '1rem', md: '1.375rem' },
                                                        color: activeStep === index ? modernColors.primary.main : modernColors.neutral.gray,
                                                        transition: 'color 0.3s ease',
                                                        whiteSpace: 'nowrap'
                                                    }}
                                                >
                                                    {label}
                                                </Typography>
                                            </StepLabel>
                                        </Step>
                                    );
                                })}
                            </ModernStepper>
                        </Box>
                        {
                            activeStep === 0 && (
                                <Grid item xs={12} sm={12} md={12} lg={12}>
                                    {/* Buttons Container - Consistent on mobile and desktop */}
                                    <Box sx={{
                                        mt: 5,
                                        ml: 1,
                                        width: '100%',
                                        overflowX: { xs: 'auto', sm: 'visible' },
                                        pb: 1,
                                        '&::-webkit-scrollbar': {
                                            height: '4px',
                                            display: { xs: 'block', sm: 'none' }
                                        },
                                        '&::-webkit-scrollbar-track': {
                                            background: 'rgba(0,0,0,0.1)',
                                            borderRadius: '8px'
                                        },
                                        '&::-webkit-scrollbar-thumb': {
                                            background: '#1354C1',
                                            borderRadius: '8px'
                                        }
                                    }} className="filter-btn">
                                        <Box sx={{
                                            display: 'flex',
                                            gap: 2,
                                            alignItems: 'center',
                                            minWidth: { xs: 'max-content', sm: 'auto' },
                                            flexWrap: { xs: 'nowrap', sm: 'wrap' }
                                        }}>
                                            <Button
                                                onClick={() => handleFilter('group')}
                                                sx={{
                                                    background: filterGroupSubject === "group" ? "#1354C1" : "",
                                                    color: filterGroupSubject === "group" ? "#fff" : "#1354C1",
                                                    fontWeight: "bold",
                                                    border: "1px solid #c1c1c196",
                                                    fontSize: "13px",
                                                    padding: "12px 16px",
                                                    borderRadius: '8px',
                                                    minWidth: 'fit-content',
                                                    whiteSpace: 'nowrap',
                                                    flexShrink: 0
                                                }}
                                                className='mobile-group-btn button-hover'
                                            >
                                                Groups Wise
                                            </Button>
                                            <Button
                                                onClick={() => handleFilter('subject')}
                                                sx={{
                                                    background: filterGroupSubject === "subject" ? "#1354C1" : "",
                                                    color: filterGroupSubject === "subject" ? "#fff" : "#1354C1",
                                                    fontWeight: "bold",
                                                    border: "1px solid #c1c1c196",
                                                    fontSize: "13px",
                                                    padding: "12px 16px",
                                                    borderRadius: '8px',
                                                    minWidth: 'fit-content',
                                                    whiteSpace: 'nowrap',
                                                    flexShrink: 0
                                                }}
                                                className='mobile-group-btn button-hover'
                                            >
                                                Subjects Wise
                                            </Button>
                                        </Box>
                                    </Box>

                                    {/* Subject Selection Dropdown - Consistent positioning on all devices */}
                                    {filterGroupSubject === "subject" && (
                                        <Box sx={{
                                            mt: 2,
                                            ml: 1,
                                            display: 'block',
                                            width: '100%'
                                        }}>
                                            <FormControl
                                                className='mobile-select-button'
                                                sx={{
                                                    width: { xs: '100%', sm: '300px' },
                                                    maxWidth: '400px'
                                                }}
                                            >
                                                <InputLabel id="demo-simple-select-label" sx={{ fontSize: "13px" }}>Subject Wise</InputLabel>
                                                <Select
                                                    defaultOpen={true}
                                                    onOpen={handleSelectSub}
                                                    sx={{ fontSize: "12px" }}
                                                    labelId='channel-lable'
                                                    className='select-option'
                                                    multiple
                                                    value={selectSubjectWise}
                                                    onChange={handleSubjectWise}
                                                    renderValue={(selected) => selected?.map((x) => x?.title).join(', ')}
                                                    label="Subject Wise"
                                                >
                                                    {
                                                        subjectWiseListRender && subjectWiseListRender
                                                            .filter(item => item.title === item.title)
                                                            .map((item, index) => {
                                                                return (
                                                                    <MenuItem key={index} value={item}>
                                                                        <Checkbox checked={selectSubjectWise.indexOf(item) > -1} />
                                                                        <ListItemText primary={item?.title} />
                                                                    </MenuItem>
                                                                );
                                                            })
                                                    }
                                                </Select>
                                            </FormControl>
                                        </Box>
                                    )}

                                    <Box sx={{ mt: 0 }} className="filter-btn">
                                        {/* {
                                            plansList?.length > 0 && (
                                                <Box className="mobile-view-schedule">
                                                    <Typography variant='p' onClick={handleViewPlan} sx={{ fontWeight: "bold", width: "fit-content", padding: "14px 2px !important", fontSize: "12px", color: "#DD2A3D", fontWeight: "bold", cursor: "pointer" }} >View Schedules</Typography>
                                                </Box>
                                            )
                                        } */}
                                    </Box>
                                    <Box sx={{ mt: 3, ml: 1 }} className="filter-btn">
                                        {/* {
                                            selectCourse?.id && (
                                                <FormControl className='mobile-select-button'>
                                                    <InputLabel id="demo-simple-select-label" sx={{ fontSize: "13px" }}>Schedule</InputLabel>
                                                    <Select
                                                        className='select-option'
                                                        sx={{ mb: 2, minWidth: "100px", maxWidth: "300px", fontSize: "12px", mr: 2, width: "200px", fontSize: "12px" }}
                                                        labelId="demo-simple-select-label"
                                                        id="demo-simple-select"
                                                        label="Schedule"
                                                        value={schedule}
                                                        onChange={handleChange}
                                                    >
                                                        {
                                                            courseContentList && courseContentList.map((data, index) => {
                                                                return (
                                                                    <MenuItem key={index} value={data}>{data?.title}</MenuItem>
                                                                )
                                                            })
                                                        }
                                                    </Select>
                                                </FormControl>
                                            )
                                        } */}
                                        {/* <FormControl className='mobile-select-button' sx={{ marginRight: '16px' }} >
                                            <InputLabel id="demo-simple-select-label" sx={{ fontSize: "13px" }}>Groups/Subjects</InputLabel>
                                            <Select
                                                sx={{ minWidth: "100px", maxWidth: "300px", width: "200px", fontSize: "12px" }}
                                                labelId='channel-lable'
                                                className='select-option'
                                                value={filterGroupSubject}
                                                onChange={handleFilter}
                                                label="Groups/Subjects"
                                            >
                                                <MenuItem value={'group'}>Groups Wise</MenuItem>
                                                <MenuItem value={'subject'}>Subjects Wise</MenuItem>
                                            </Select>
                                        </FormControl> */}

                                        {
                                            filterGroupSubject === "group" && (
                                                <Box className="mobile-filter-btn">
                                                    <Button onClick={() => handleButtonClick('both')} sx={{ background: activeBtn === "both" ? "#1354C1" : "", color: activeBtn === "both" ? "#fff" : "#1354C1", fontWeight: "bold", width: "fit-content", marginRight: '16px', padding: "14px 11px!important", border: "1px solid #c1c1c196", fontSize: "12px", width: "110px" }} className='mobile-group-btn button-hover'>Both Group</Button>
                                                    <Button onClick={() => handleButtonClick('group1')} sx={{ background: activeBtn === "group1" ? "#1354C1" : "", color: activeBtn === "group1" ? "#fff" : "#1354C1", fontWeight: "bold", width: "fit-content", marginRight: '16px', padding: "14px 11px!important", border: "1px solid #c1c1c196", fontSize: "12px", width: "110px" }} className='mobile-group-btn button-hover'>Group 1</Button>
                                                    <Button onClick={() => handleButtonClick('group2')} sx={{ background: activeBtn === "group2" ? "#1354C1" : "", color: activeBtn === "group2" ? "#fff" : "#1354C1", fontWeight: "bold", width: "fit-content", marginRight: '16px', padding: "14px 11px!important", border: "1px solid #c1c1c196", fontSize: "12px", width: "110px" }} className='mobile-group-btn button-hover'>Group 2</Button>
                                                </Box>
                                            )
                                        }
                                    </Box>
                                </Grid>
                            )
                        }
                        <div>
                            {allStepsCompleted() ? (
                                <React.Fragment>
                                    <Typography sx={{ mt: 2, mb: 1 }}>
                                        All steps completed - you&apos;re finished
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                                        <Box sx={{ flex: '1 1 auto' }} />
                                        <Button onClick={handleReset}>Reset</Button>
                                    </Box>
                                </React.Fragment>
                            ) : (
                                <React.Fragment>
                                    {
                                        activeStep === 0 && schedule?.id && (
                                            <Typography sx={{ mb: 1, py: 1 }}>
                                                {cartArray?.length > 0 && (
                                                    <Box sx={{ textAlign: "right" }}>
                                                        <ModernCheckoutButton
                                                            disabled={cartArray?.length === 0}
                                                            onClick={handleShowCart}
                                                            className='button-hover mobile-view-checkout'
                                                            startIcon={<ArrowForwardIcon />}
                                                            sx={{
                                                                fontSize: '14px',
                                                                padding: '12px 20px',
                                                                background: modernColors.secondary.gradient
                                                            }}
                                                        >
                                                            Go to Cart Details
                                                        </ModernCheckoutButton>
                                                    </Box>
                                                )}
                                                {
                                                    selectCourse?.id && (
                                                        <>
                                                            <div className='react-multi-carousel-list'>
                                                                <Box sx={{ py: 2, width: '100%', maxWidth: '100%' }}>
                                                                    <Grid container spacing={3}>
                                                                        {
                                                                            plansList && plansList.map((item, i) => {
                                                                                let object = getPlanPrice(item, activeBtn, selectSubjectWise);
                                                                                let logo = object?.thumbLogo;
                                                                                let price = object?.price;
                                                                                let finalPrices = object?.finalPrice === 0 ? Number(price) - (Number(price / 100) * Number(item?.discount)) : object?.finalPrice;
                                                                                let discount = Math.round(100 - ((finalPrices / price) * 100));
                                                                                const fullDescription = item?.description?.description || "";
                                                                                const isAdded = cartArray.some(cartItem => cartItem.plan.id === item.id);
                                                                                const isPremium = discount > 20;

                                                                                return (
                                                                                    <Grid item xs={12} sm={6} md={4} lg={3} key={item.id || i}>
                                                                                        <Fade in timeout={600 + i * 100}>
                                                                                            <ModernPlanCard
                                                                                                isSelected={isAdded}
                                                                                                isPremium={isPremium}
                                                                                                onClick={() => handleEnrollNow(item)}
                                                                                            >
                                                                                                <ModernPlanImage
                                                                                                    image={filterGroupSubject === "subject" ?
                                                                                                        Endpoints + subjectWiseListRender[0]?.description?.thumb :
                                                                                                        logo ? Endpoints + logo : "img/folder-2.png"
                                                                                                    }
                                                                                                    title={item?.title}
                                                                                                />

                                                                                                <CardContent sx={{ px: { xs: 1, sm: 1.5, md: 2 }, pt: { xs: 1, sm: 1.5, md: 2 }, pb: { xs: 1, sm: 1.5, md: 2 } }}>
                                                                                                    <ModernPlanTitle variant="h6">
                                                                                                        {item?.title}
                                                                                                    </ModernPlanTitle>

                                                                                                    {/* <Typography
                                                                                                            variant="body2"
                                                                                                            sx={{
                                                                                                                color: modernColors.neutral.gray,
                                                                                                                mb: 1.5,
                                                                                                                display: '-webkit-box',
                                                                                                                WebkitLineClamp: 2,
                                                                                                                WebkitBoxOrient: 'vertical',
                                                                                                                overflow: 'hidden',
                                                                                                                textAlign: 'center',
                                                                                                                fontSize: "13px",
                                                                                                                lineHeight: '1.4',
                                                                                                            }}
                                                                                                        >
                                                                                                            {fullDescription || "Premium test series for better preparation"}
                                                                                                        </Typography> */}

                                                                                                    {selectSubjectWise?.length > 0 && (
                                                                                                        <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 0.5 }}>
                                                                                                            {selectSubjectWise.slice(0, 3).map((chipLabel, idx) => (
                                                                                                                <ModernChip
                                                                                                                    key={idx}
                                                                                                                    size="small"
                                                                                                                    label={chipTitle(chipLabel?.title)}
                                                                                                                    chipcolor="accent"
                                                                                                                />
                                                                                                            ))}
                                                                                                            {selectSubjectWise.length > 3 && (
                                                                                                                <ModernChip
                                                                                                                    size="small"
                                                                                                                    label={`+${selectSubjectWise.length - 3}`}
                                                                                                                    chipcolor="primary"
                                                                                                                />
                                                                                                            )}
                                                                                                        </Box>
                                                                                                    )}

                                                                                                    <ModernPriceContainer>
                                                                                                        {item.paid ? (
                                                                                                            <>
                                                                                                                {object.percent > 0 ? (
                                                                                                                    <>
                                                                                                                        <Box sx={{ textAlign: 'center' }}>
                                                                                                                            <ModernPrice isDiscounted>
                                                                                                                                ₹{object?.finalPrice.toFixed(0)}
                                                                                                                            </ModernPrice>
                                                                                                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 0.5 }}>
                                                                                                                                <ModernOriginalPrice>
                                                                                                                                    ₹{price}
                                                                                                                                </ModernOriginalPrice>
                                                                                                                                <ModernDiscountBadge
                                                                                                                                    label={`${Math.round(object.percent)}% OFF`}
                                                                                                                                    size="small"
                                                                                                                                />
                                                                                                                            </Box>
                                                                                                                        </Box>
                                                                                                                    </>
                                                                                                                ) : (
                                                                                                                    <ModernPrice>₹{price}</ModernPrice>
                                                                                                                )}
                                                                                                            </>
                                                                                                        ) : (
                                                                                                            <Typography
                                                                                                                variant="h6"
                                                                                                                sx={{
                                                                                                                    color: modernColors.secondary.main,
                                                                                                                    fontWeight: 700,
                                                                                                                    display: 'flex',
                                                                                                                    alignItems: 'center',
                                                                                                                    gap: 1
                                                                                                                }}
                                                                                                            >
                                                                                                                <VerifiedIcon fontSize="small" />
                                                                                                                FREE
                                                                                                            </Typography>
                                                                                                        )}
                                                                                                    </ModernPriceContainer>
                                                                                                </CardContent>

                                                                                                <CardActions sx={{ p: { xs: 1, sm: 1.5, md: 2 }, pt: { xs: 0.5, sm: 1, md: 1 } }}>
                                                                                                    <ModernAddButton
                                                                                                        isAdded={isAdded}
                                                                                                        onClick={(e) => {
                                                                                                            e.stopPropagation();
                                                                                                            handleEnrollNow(item);
                                                                                                        }}
                                                                                                        startIcon={isAdded ? <CheckCircleRoundedIcon sx={{ fontSize: { xs: '18px', sm: '20px' } }} /> : <AddCircleIcon sx={{ fontSize: { xs: '18px', sm: '20px' } }} />}
                                                                                                    >
                                                                                                        {isAdded ? "✓ Added to Cart" : "Add to Cart"}
                                                                                                    </ModernAddButton>
                                                                                                </CardActions>
                                                                                            </ModernPlanCard>
                                                                                        </Fade>
                                                                                    </Grid>
                                                                                );
                                                                            })
                                                                        }
                                                                    </Grid>
                                                                </Box>
                                                            </div>
                                                        </>
                                                    )
                                                }
                                            </Typography>
                                        )
                                    }
                                    {
                                        activeStep === 1 && (
                                            <Typography sx={{ mt: 3, mb: 3, py: 1 }}>
                                                <Box
                                                    sx={{
                                                        padding: !isMobileDevice ? "0" : "0 2rem",
                                                        margin: isMobileDevice ? "0" : "0 2rem",
                                                        display: "flex",
                                                        justifyContent: "flex-end",
                                                        alignItems: "center",
                                                        mb: 3,
                                                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%)',
                                                        borderRadius: '20px',
                                                        padding: '20px',
                                                        border: '1px solid rgba(102, 126, 234, 0.1)',
                                                        backdropFilter: 'blur(10px)',
                                                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                                                        gap: '20px',
                                                        flexWrap: 'wrap'
                                                    }}
                                                >
                                                    {/* View Detailed Schedules Button - First (left) */}
                                                    {
                                                        plansList?.length > 0 && selectShedule?.title !== "UnScheduled" && (
                                                            <Typography
                                                                variant='button'
                                                                onClick={handleViewPlan}
                                                                sx={{
                                                                    width: !isMobileDevice ? '100%' : 'auto',
                                                                    fontWeight: "700",
                                                                    padding: "16px 24px",
                                                                    fontSize: "16px",
                                                                    color: "#667eea",
                                                                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                                                                    border: "2px solid rgba(102, 126, 234, 0.2)",
                                                                    borderRadius: "16px",
                                                                    cursor: "pointer",
                                                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                                    backdropFilter: 'blur(10px)',
                                                                    textTransform: 'none',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: '8px',
                                                                    height: '56px',
                                                                    whiteSpace: 'nowrap',
                                                                    '&:hover': {
                                                                        transform: 'translateY(-2px)',
                                                                        boxShadow: '0 8px 25px rgba(102, 126, 234, 0.2)',
                                                                        border: "2px solid rgba(102, 126, 234, 0.4)",
                                                                        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)'
                                                                    },
                                                                    '&::before': {
                                                                        content: '"📋"',
                                                                        marginRight: '4px'
                                                                    }
                                                                }}
                                                            >
                                                                View Detailed Schedules
                                                            </Typography>
                                                        )
                                                    }

                                                    {/* Select Schedule - Second (right) */}
                                                    <FormControl className='mobile-select-button' sx={{
                                                        minWidth: '250px',
                                                        '& .MuiOutlinedInput-root': {
                                                            background: 'rgba(255, 255, 255, 0.9)',
                                                            borderRadius: '16px',
                                                            height: '56px',
                                                            '&:hover fieldset': {
                                                                borderColor: '#667eea',
                                                                borderWidth: '2px'
                                                            },
                                                            '&.Mui-focused fieldset': {
                                                                borderColor: '#667eea',
                                                                borderWidth: '2px',
                                                                boxShadow: '0 0 0 4px rgba(102, 126, 234, 0.1)'
                                                            }
                                                        }
                                                    }}>
                                                        <InputLabel
                                                            id="demo-simple-select-label"
                                                            sx={{
                                                                fontSize: "16px",
                                                                fontWeight: '600',
                                                                color: '#4a5568',
                                                                '&.Mui-focused': {
                                                                    color: '#667eea'
                                                                }
                                                            }}
                                                        >
                                                            📅 Select Schedule
                                                        </InputLabel>
                                                        <Select
                                                            className='select-option'
                                                            sx={{
                                                                minWidth: "100px",
                                                                maxWidth: "300px",
                                                                fontSize: "14px",
                                                                width: "250px",
                                                                borderRadius: '16px'
                                                            }}
                                                            labelId="demo-simple-select-label"
                                                            id="demo-simple-select"
                                                            label="📅 Select Schedule"
                                                            value={selectShedule}
                                                            onChange={handleChange}
                                                        >
                                                            {
                                                                courseContentList && courseContentList.map((data, index) => {
                                                                    return (
                                                                        <MenuItem key={index} value={data}>{data?.title}</MenuItem>
                                                                    )
                                                                })
                                                            }
                                                        </Select>
                                                    </FormControl>
                                                </Box>

                                                {/* Remove the separate button container below */}
                                                <Grid container sx={{
                                                    borderBottom: "1px solid rgba(128, 128, 128, 0.1)",
                                                    background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%)',
                                                    borderRadius: '24px 24px 0 0',
                                                    backdropFilter: 'blur(20px)',
                                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                                                    overflow: 'hidden',
                                                    position: 'relative',
                                                    '&::before': {
                                                        content: '""',
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        right: 0,
                                                        height: '4px',
                                                        background: 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                                                        backgroundSize: '200% 200%',
                                                        animation: 'gradientShift 3s ease infinite'
                                                    }
                                                }}>
                                                    <Grid item xs={12} sm={9.5} md={9.5} lg={9.5} sx={{
                                                        padding: '24px',
                                                        position: 'relative',
                                                        zIndex: 1
                                                    }}>
                                                        <Typography
                                                            variant="h5"
                                                            sx={{
                                                                fontWeight: '800',
                                                                mb: 3,
                                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                                WebkitBackgroundClip: 'text',
                                                                WebkitTextFillColor: 'transparent',
                                                                backgroundClip: 'text',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '12px',
                                                                '&::before': {
                                                                    content: '"🛒"',
                                                                    fontSize: '24px'
                                                                }
                                                            }}
                                                        >
                                                            Your Selected Items
                                                        </Typography>
                                                        <Grid container>
                                                            {
                                                                cartArray?.length > 0 && cartArray?.map((item, i) => {

                                                                    let object = getPlanPrice(item.plan, item.group, item.subject);
                                                                    let subjects = item.subject;
                                                                    // getEntityIdPurchase(object)
                                                                    // console.log('objectobjectobjectobject', object, item);
                                                                    // console.log('Endpoints', Endpoints);
                                                                    let logo = object?.thumbLogo
                                                                    let price = object?.price;
                                                                    let finalPrices = object?.finalPrice === 0 ? Number(price) - (Number(price / 100) * Number(item?.plan?.discount)) : object?.finalPrice;
                                                                    let discount = 100 - ((finalPrices / price) * 100)

                                                                    let details = item.plan;

                                                                    const preview = peviewImgVideo[details.id];
                                                                    const newDiscount = details.discount || 0;
                                                                    const newPrice = details.price || 0;
                                                                    const totalPrice = 0;
                                                                    const fullDescription = details?.description?.description || "";

                                                                    return <Grid item xs={12} sm={12} md={12} lg={12} key={i} sx={{
                                                                        position: "relative",
                                                                        mb: 3
                                                                    }}>
                                                                        <Box sx={{
                                                                            background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
                                                                            backdropFilter: 'blur(20px)',
                                                                            border: '1px solid rgba(255, 255, 255, 0.2)',
                                                                            borderRadius: '24px',
                                                                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                                                                            padding: '24px',
                                                                            position: 'relative',
                                                                            overflow: 'hidden',
                                                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                                            '&:hover': {
                                                                                transform: 'translateY(-4px)',
                                                                                boxShadow: '0 16px 48px rgba(0, 0, 0, 0.12)'
                                                                            }
                                                                        }}>
                                                                            <Grid container spacing={3}>
                                                                                <Grid item xs={12} sm={4} md={4} lg={4}>
                                                                                    <Box sx={{
                                                                                        background: "linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)",
                                                                                        borderRadius: "20px",
                                                                                        display: "flex",
                                                                                        justifyContent: "center",
                                                                                        padding: '16px',
                                                                                        border: '1px solid rgba(102, 126, 234, 0.1)',
                                                                                        mb: 2
                                                                                    }}>
                                                                                        <img
                                                                                            src={subjects?.length > 0 ? Endpoints + subjects[0]?.description?.thumb : logo ? Endpoints + logo : 'img/folder-2.png'}
                                                                                            style={{
                                                                                                width: '100%',
                                                                                                maxHeight: '200px',
                                                                                                objectFit: 'cover',
                                                                                                borderRadius: '12px',
                                                                                                filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))'
                                                                                            }}
                                                                                            alt="Course Preview"
                                                                                            className='mobile-view-image'
                                                                                        />
                                                                                    </Box>
                                                                                    {details?.description?.video && (
                                                                                        <Box sx={{
                                                                                            background: "linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)",
                                                                                            borderRadius: "20px",
                                                                                            display: "flex",
                                                                                            justifyContent: "center",
                                                                                            padding: '16px',
                                                                                            border: '1px solid rgba(102, 126, 234, 0.1)'
                                                                                        }}>
                                                                                            <video
                                                                                                controls
                                                                                                src={details?.description?.video ? Endpoints + details?.description?.video : ''}
                                                                                                style={{
                                                                                                    width: "100%",
                                                                                                    height: "160px",
                                                                                                    borderRadius: '12px'
                                                                                                }}
                                                                                                onClick={() => handlePreview(details?.description?.video, 'video', details.id)}
                                                                                            />
                                                                                        </Box>
                                                                                    )}
                                                                                </Grid>
                                                                                <Grid item xs={12} sm={8} md={8} lg={8}>
                                                                                    <Typography
                                                                                        variant='h5'
                                                                                        sx={{
                                                                                            fontWeight: "800",
                                                                                            color: "#2d3748",
                                                                                            mb: 2,
                                                                                            fontSize: { xs: '1.25rem', md: '1.5rem' }
                                                                                        }}
                                                                                    >
                                                                                        {details?.title}
                                                                                    </Typography>

                                                                                    <Box sx={{
                                                                                        textAlign: "left",
                                                                                        mb: 2,
                                                                                        display: 'flex',
                                                                                        flexWrap: 'wrap',
                                                                                        gap: '8px'
                                                                                    }}>
                                                                                        {
                                                                                            item.subject?.length > 0 && item.subject?.map((chipLebel, i) => {
                                                                                                return <Chip
                                                                                                    size="small"
                                                                                                    label={chipTitle(chipLebel?.title)}
                                                                                                    variant="outlined"
                                                                                                    key={i}
                                                                                                    sx={{
                                                                                                        background: "linear-gradient(135deg, rgba(221, 42, 61, 0.1) 0%, rgba(221, 42, 61, 0.05) 100%)",
                                                                                                        color: "#DD2A3D",
                                                                                                        fontWeight: "700",
                                                                                                        fontSize: "12px",
                                                                                                        border: "1px solid rgba(221, 42, 61, 0.3)",
                                                                                                        borderRadius: '12px',
                                                                                                        '&:hover': {
                                                                                                            background: "linear-gradient(135deg, rgba(221, 42, 61, 0.15) 0%, rgba(221, 42, 61, 0.1) 100%)",
                                                                                                            transform: 'translateY(-1px)'
                                                                                                        },
                                                                                                        transition: 'all 0.2s ease'
                                                                                                    }}
                                                                                                />
                                                                                            })
                                                                                        }
                                                                                    </Box>

                                                                                    <Box sx={{ mb: 2 }}>
                                                                                        {details?.paid ? (
                                                                                            <Box>
                                                                                                {discount > 0 ? (
                                                                                                    <Typography sx={{
                                                                                                        fontWeight: '800',
                                                                                                        fontSize: '18px',
                                                                                                        color: '#2f855a',
                                                                                                        display: 'flex',
                                                                                                        alignItems: 'center',
                                                                                                        gap: '8px'
                                                                                                    }}>
                                                                                                        💰 Price: ₹{object?.finalPrice.toFixed(2)}
                                                                                                    </Typography>
                                                                                                ) : (
                                                                                                    <Typography sx={{
                                                                                                        fontWeight: '800',
                                                                                                        fontSize: '18px',
                                                                                                        color: '#2f855a',
                                                                                                        display: 'flex',
                                                                                                        alignItems: 'center',
                                                                                                        gap: '8px'
                                                                                                    }}>
                                                                                                        💰 Price: ₹{(price).toFixed(2)}
                                                                                                    </Typography>
                                                                                                )}
                                                                                            </Box>
                                                                                        ) : (
                                                                                            <Typography sx={{
                                                                                                fontWeight: '800',
                                                                                                fontSize: '18px',
                                                                                                color: '#48bb78',
                                                                                                display: 'flex',
                                                                                                alignItems: 'center',
                                                                                                gap: '8px'
                                                                                            }}>
                                                                                                🎉 Free Course
                                                                                            </Typography>
                                                                                        )}
                                                                                    </Box>

                                                                                    <Typography
                                                                                        variant='body1'
                                                                                        sx={{
                                                                                            color: '#4a5568',
                                                                                            lineHeight: '1.6',
                                                                                            mb: 2,
                                                                                            fontSize: '14px'
                                                                                        }}
                                                                                        className='mobile-view-discrip'
                                                                                    >
                                                                                        {setCourseExpandedDescriptions === false ? truncateDescription(fullDescription) : truncateDescription(fullDescription)}
                                                                                        {fullDescription.length > 100 && (
                                                                                            <span
                                                                                                style={{
                                                                                                    color: '#667eea',
                                                                                                    cursor: 'pointer',
                                                                                                    marginLeft: '8px',
                                                                                                    textDecoration: 'underline',
                                                                                                    fontWeight: '600'
                                                                                                }}
                                                                                                onClick={() => toggleExpandDescription(fullDescription)}
                                                                                            >
                                                                                                Read more
                                                                                            </span>
                                                                                        )}
                                                                                    </Typography>
                                                                                    <Typography
                                                                                        variant='body1'
                                                                                        sx={{
                                                                                            color: '#4a5568',
                                                                                            lineHeight: '1.6',
                                                                                            mb: 2
                                                                                        }}
                                                                                        className='desktop-view-discrip'
                                                                                    >
                                                                                        {details?.description?.description ? details?.description?.description.replace(/<[^>]*>/g, '') : ""}
                                                                                    </Typography>

                                                                                    <Button
                                                                                        onClick={() => handleRemoveItem(item, i)}
                                                                                        sx={{
                                                                                            textTransform: "none",
                                                                                            fontSize: '14px',
                                                                                            fontWeight: '600',
                                                                                            color: '#e53e3e',
                                                                                            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)',
                                                                                            border: '1px solid rgba(239, 68, 68, 0.2)',
                                                                                            borderRadius: '12px',
                                                                                            padding: '8px 16px',
                                                                                            '&:hover': {
                                                                                                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.15) 100%)',
                                                                                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                                                                                transform: 'translateY(-1px)'
                                                                                            },
                                                                                            transition: 'all 0.3s ease'
                                                                                        }}
                                                                                    >
                                                                                        🗑️ Remove from Cart
                                                                                    </Button>
                                                                                </Grid>
                                                                            </Grid>
                                                                        </Box>
                                                                    </Grid>
                                                                })
                                                            }
                                                        </Grid>
                                                    </Grid>
                                                    <Grid item xs={12} sm={2.5} md={2.5} lg={2.5}>
                                                        {
                                                            suggestedCourse?.length > 0 && (
                                                                <>

                                                                    <Typography variant='h5' fontWeight={'bold'} ml={3} mb={1} mt={3} sx={{ fontSize: '1.5rem' }} className='mobile-suggested mobile-plan-box'>Suggested Course</Typography>
                                                                    <Carousel
                                                                        className=''
                                                                        swipeable={true}
                                                                        draggable={true}
                                                                        showDots={true}
                                                                        responsive={responsive}
                                                                        ssr={true} // means to render carousel on server-side.
                                                                        infinite={true}
                                                                        //   autoPlay={this.props.deviceType !== "mobile" ? true : false}
                                                                        autoPlaySpeed={1000}
                                                                        keyBoardControl={true}
                                                                        customTransition="all .5"
                                                                        transitionDuration={500}
                                                                        containerClass="carousel-container"
                                                                        removeArrowOnDeviceType={["tablet", "mobile"]}
                                                                        //   deviceType={this.props.deviceType}
                                                                        dotListClass="custom-dot-list-style"
                                                                        itemClass="carousel-item-padding-40-px"
                                                                    >
                                                                        {
                                                                            suggestedCourse && suggestedCourse.map((course, id) => {
                                                                                return <Grid container sx={{ justifyContent: "center", alignItems: "center", marginBottom: 2 }}>
                                                                                    <Grid item xs={12} sm={2.4} md={2.4} lg={2.4} sx={{ padding: "5px", textAlign: "left", }}>
                                                                                        <Box sx={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}>
                                                                                            <img src={Endpoints + course.logo} alt="cardthumbimage" style={{ width: "100%", height: "125px" }} />
                                                                                            <Stack gap={'0.5rem'} pl={'1rem'} pr={'1rem'}>
                                                                                                <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} textAlign={"left"}>
                                                                                                    <p style={{ width: "100%", fontWeight: "bold", margin: 0 }}>
                                                                                                        {course.title}
                                                                                                    </p>
                                                                                                </Stack>
                                                                                                {
                                                                                                    course.paid ?
                                                                                                        <>
                                                                                                            {
                                                                                                                course.discount > 0 ? <p style={{ fontWeight: "bold", color: "#f59f00", display: "flex", fontSize: "11px", margin: 0 }}>
                                                                                                                    <p>
                                                                                                                        {Number(course.price) - (Number(course.price) * (Number(course.discount) / 100))}/-
                                                                                                                    </p>

                                                                                                                    <p style={{ color: "#e5dfdf" }}> &nbsp; <s>{course.price}/-</s> &nbsp;{course.discount}%</p>
                                                                                                                </p>
                                                                                                                    : <p style={{ fontWeight: "bold", color: "#f59f00" }}>{course.price}/-</p>
                                                                                                            }
                                                                                                        </>
                                                                                                        :
                                                                                                        <p style={{ fontWeight: "bold", fontSize: "11px" }}>
                                                                                                            Free
                                                                                                        </p>
                                                                                                }
                                                                                                {/* <div>
                                                                                            <div className={course.active ? " bg-green-500 h-3 w-3 rounded-full" : " bg-red-500 w-3 h-3 rounded-full"}></div>
                                                                                        </div> */}
                                                                                            </Stack>
                                                                                            <Box sx={{ textAlign: 'right' }}>
                                                                                                <Button startIcon={selectedIds.includes(course?.id) ?
                                                                                                    <CheckCircleRoundedIcon /> :
                                                                                                    <AddCircleIcon fontSize="40px" />
                                                                                                } onClick={() => handleAddCourse(course)}>{selectedIds.includes(course?.id) ? "Added" : "Add to cart"}</Button>
                                                                                            </Box>
                                                                                        </Box>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            })
                                                                        }
                                                                    </Carousel>
                                                                </>
                                                            )
                                                        }
                                                        <div className='desktop-plan-box'>
                                                            {/* Duplicate View Schedules button removed - using modern one above */}
                                                            {
                                                                suggestedCourse?.length > 0 && (
                                                                    <Grid container sx={{ padding: 1, height: suggestedCourse?.length > 2 ? "530px" : "", overflowY: suggestedCourse?.length > 2 ? "scroll" : "none" }}>
                                                                        <Grid item xs={12} sm={12} md={12} lg={12} sx={{ padding: "10px" }}>
                                                                            <Typography variant='h5' fontWeight={'bold'} ml={3} mb={1} sx={{ color: "black", fontSize: '1.5rem' }} className='mobile-suggested'>Suggested Course</Typography>
                                                                            <Box sx={{ ml: 3 }} className='mobile-suggested'>
                                                                                <Grid container>
                                                                                    {
                                                                                        suggestedCourse?.length > 0 && suggestedCourse.map((course, i) => {
                                                                                            return <Grid item xs={12} sm={12} md={12} lg={12}>
                                                                                                <Box sx={{
                                                                                                    boxShadow: "rgba(0, 0, 0, 0.11) 0px 5px 15px", margin: "10px"
                                                                                                }} >
                                                                                                    <img src={Endpoints + course.logo} alt="cardthumbimage" style={{ width: "100%", height: "125px" }} />
                                                                                                    <Stack gap={'0.5rem'} pl={'1rem'} pr={'1rem'}>
                                                                                                        <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} textAlign={"left"}>
                                                                                                            <p style={{ width: "100%", fontWeight: "bold", margin: 0 }}>
                                                                                                                {course.title}
                                                                                                            </p>
                                                                                                        </Stack>
                                                                                                        {
                                                                                                            course.paid ?
                                                                                                                <>
                                                                                                                    {
                                                                                                                        course.discount > 0 ? <p style={{ fontWeight: "bold", color: "#f59f00", display: "flex", fontSize: "11px", margin: 0 }}>
                                                                                                                            <p>
                                                                                                                                {Number(course.price) - (Number(course.price) * (Number(course.discount) / 100))}/-
                                                                                                                            </p>

                                                                                                                            <p style={{ color: "#e5dfdf" }}> &nbsp; <s>{course.price}/-</s> &nbsp;{course.discount}%</p>
                                                                                                                        </p>
                                                                                                                            : <p style={{ fontWeight: "bold", color: "#f59f00" }}>{course.price}/-</p>
                                                                                                                    }
                                                                                                                </>
                                                                                                                :
                                                                                                                <p style={{ fontWeight: "bold", fontSize: "11px" }}>
                                                                                                                    Free
                                                                                                                </p>
                                                                                                        }
                                                                                                        {/* <div>
                                                                                            <div className={course.active ? " bg-green-500 h-3 w-3 rounded-full" : " bg-red-500 w-3 h-3 rounded-full"}"></div>
                                                                                        </div> */}
                                                                                                    </Stack>
                                                                                                    <Box sx={{ textAlign: 'right' }}>
                                                                                                        <Button startIcon={selectedIds.includes(course?.id) ?
                                                                                                            <CheckCircleRoundedIcon /> :
                                                                                                            <AddCircleIcon fontSize="40px" />
                                                                                                        } onClick={() => handleAddCourse(course)}>{selectedIds.includes(course?.id) ? "Added" : "Add to cart"}</Button>
                                                                                                    </Box>
                                                                                                </Box>
                                                                                            </Grid>
                                                                                        })
                                                                                    }
                                                                                </Grid>
                                                                            </Box>

                                                                        </Grid>
                                                                    </Grid>
                                                                )
                                                            }
                                                            {/* <Box sx={{ textAlign: 'right', mb: 3 }} className="desktop-plan-box desktop-view-checkout">
                                                                <Button sx={{ fontWeight: "bold", background: "#DD2A3D", color: "#fff", boxShadow: "4px 3px 14px 0px rgba(0,0,0,0.5)", display: "inline", padding: "14px 11px", fontSize: "12px" }} onClick={handleAddToCard} className='button-hover mobile-buy-now'>Proceed to Checkout  <span style={{ fontSize: "12px", textTransform: "initial", color: "#fbff00", padding: 0, margin: 0 }}>
                                                                    &nbsp;&nbsp;Total Price: {(totalPrice).toFixed(2)}
                                                                </span>
                                                                </Button>
                                                            </Box> */}
                                                        </div>
                                                    </Grid>
                                                </Grid>
                                                <Grid container display={'flex'} justifyContent={'end'} mt={1}>
                                                    <Grid item xs={12} sm={12} md={12} lg={12}>
                                                        <Box sx={{ textAlign: 'right', mb: 3 }} className="desktop-plan-box desktop-view-checkout">
                                                            <ModernCheckoutButton
                                                                onClick={handleCheckoutSubmit}
                                                                className='button-hover mobile-buy-now'
                                                                startIcon={<ArrowForwardIcon />}
                                                            >
                                                                🚀 Proceed to Checkout
                                                                <span style={{ textTransform: "initial", color: "#fbff00", padding: 0, margin: 0 }}>
                                                                    &nbsp;&nbsp;₹{totalPrice.toFixed(0)}
                                                                </span>
                                                            </ModernCheckoutButton>
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                            </Typography>
                                        )
                                    }
                                    {
                                        activeStep === 2 && (
                                            <Typography sx={{ mt: 3, mb: 1, py: 1 }}>
                                                <Card sx={{
                                                    width: "100%",
                                                    background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
                                                    backdropFilter: 'blur(20px)',
                                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                                    borderRadius: '24px',
                                                    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                                                    textAlign: "center",
                                                    mb: 3,
                                                    position: 'relative',
                                                    overflow: 'hidden',
                                                    '&::before': {
                                                        content: '""',
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        right: 0,
                                                        height: '4px',
                                                        background: 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                                                        backgroundSize: '200% 200%',
                                                        animation: 'gradientShift 3s ease infinite'
                                                    },
                                                    '&:hover': {
                                                        transform: 'translateY(-5px)',
                                                        boxShadow: '0 35px 60px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.15)',
                                                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                                                    },
                                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                                                }}>
                                                    <Typography
                                                        padding={2}
                                                        mt={4}
                                                        fontWeight={'800'}
                                                        variant='h4'
                                                        sx={{
                                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                            WebkitBackgroundClip: 'text',
                                                            WebkitTextFillColor: 'transparent',
                                                            backgroundClip: 'text',
                                                            fontSize: { xs: '1.75rem', md: '2.25rem' },
                                                            letterSpacing: '-0.02em',
                                                            textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                                                        }}
                                                    >
                                                        ✨ Complete Your Journey
                                                    </Typography>
                                                    <Grid container sx={{ margin: "32px 0", justifyContent: "center", px: 2 }}>
                                                        <Grid item xs={12} sm={8} md={7} lg={6}>
                                                            <TextField
                                                                className='mobile-fill-textfield'
                                                                fullWidth
                                                                variant="outlined"
                                                                type="text"
                                                                label="Full Name"
                                                                name="name"
                                                                value={title}
                                                                onChange={(e) => setTitle(e.target.value)}
                                                                InputProps={{
                                                                    style: {
                                                                        borderRadius: "16px",
                                                                        fontSize: '16px',
                                                                        background: 'rgba(255, 255, 255, 0.8)',
                                                                        backdropFilter: 'blur(10px)',
                                                                        transition: 'all 0.3s ease',
                                                                        paddingLeft: '16px' // Add left padding for placeholder
                                                                    }
                                                                }}
                                                                InputLabelProps={{
                                                                    sx: {
                                                                        fontSize: '16px',
                                                                        fontWeight: '600',
                                                                        color: '#4a5568',
                                                                        '&.Mui-focused': {
                                                                            color: '#667eea'
                                                                        }
                                                                    }
                                                                }}
                                                                sx={{
                                                                    gridColumn: "span 12",
                                                                    m: { xs: 1, sm: 2 }, // Reduced margin on mobile
                                                                    '& .MuiOutlinedInput-root': {
                                                                        '&:hover fieldset': {
                                                                            borderColor: '#667eea',
                                                                            borderWidth: '2px'
                                                                        },
                                                                        '&.Mui-focused fieldset': {
                                                                            borderColor: '#667eea',
                                                                            borderWidth: '2px',
                                                                            boxShadow: '0 0 0 4px rgba(102, 126, 234, 0.1)'
                                                                        }
                                                                    }
                                                                }}
                                                            />
                                                            <TextField
                                                                inputProps={{
                                                                    maxLength: 10
                                                                }}
                                                                className='mobile-fill-textfield'
                                                                fullWidth
                                                                variant="outlined"
                                                                type="number"
                                                                label="Phone Number"
                                                                name="number"
                                                                value={number}
                                                                onChange={handleNumberChange}
                                                                error={!!error}
                                                                helperText={error}
                                                                InputProps={{
                                                                    style: {
                                                                        borderRadius: "16px",
                                                                        fontSize: '16px',
                                                                        background: 'rgba(255, 255, 255, 0.8)',
                                                                        backdropFilter: 'blur(10px)',
                                                                        transition: 'all 0.3s ease',
                                                                        paddingLeft: '16px' // Add left padding for placeholder
                                                                    }
                                                                }}
                                                                InputLabelProps={{
                                                                    sx: {
                                                                        fontSize: '16px',
                                                                        fontWeight: '600',
                                                                        color: '#4a5568',
                                                                        '&.Mui-focused': {
                                                                            color: '#667eea'
                                                                        }
                                                                    }
                                                                }}
                                                                sx={{
                                                                    gridColumn: "span 12",
                                                                    m: { xs: 1, sm: 2 }, // Reduced margin on mobile
                                                                    '& .MuiOutlinedInput-root': {
                                                                        '&:hover fieldset': {
                                                                            borderColor: '#667eea',
                                                                            borderWidth: '2px'
                                                                        },
                                                                        '&.Mui-focused fieldset': {
                                                                            borderColor: '#667eea',
                                                                            borderWidth: '2px',
                                                                            boxShadow: '0 0 0 4px rgba(102, 126, 234, 0.1)'
                                                                        }
                                                                    }
                                                                }}
                                                            />
                                                            <TextField
                                                                className='mobile-fill-textfield'
                                                                fullWidth
                                                                variant="outlined"
                                                                type="email"
                                                                label="Email Address"
                                                                name="email"
                                                                value={email}
                                                                onChange={(e) => setEmail(e.target.value)}
                                                                InputProps={{
                                                                    style: {
                                                                        borderRadius: "16px",
                                                                        fontSize: '16px',
                                                                        background: 'rgba(255, 255, 255, 0.8)',
                                                                        backdropFilter: 'blur(10px)',
                                                                        transition: 'all 0.3s ease',
                                                                        paddingLeft: '16px' // Add left padding for placeholder
                                                                    }
                                                                }}
                                                                InputLabelProps={{
                                                                    sx: {
                                                                        fontSize: '16px',
                                                                        fontWeight: '600',
                                                                        color: '#4a5568',
                                                                        '&.Mui-focused': {
                                                                            color: '#667eea'
                                                                        }
                                                                    }
                                                                }}
                                                                sx={{
                                                                    gridColumn: "span 12",
                                                                    m: { xs: 1, sm: 2 }, // Reduced margin on mobile
                                                                    '& .MuiOutlinedInput-root': {
                                                                        '&:hover fieldset': {
                                                                            borderColor: '#667eea',
                                                                            borderWidth: '2px'
                                                                        },
                                                                        '&.Mui-focused fieldset': {
                                                                            borderColor: '#667eea',
                                                                            borderWidth: '2px',
                                                                            boxShadow: '0 0 0 4px rgba(102, 126, 234, 0.1)'
                                                                        }
                                                                    }
                                                                }}
                                                            />
                                                            {
                                                                orderBumpCourse?.price ?
                                                                    <>
                                                                        <InputLabel sx={{
                                                                            width: '100%',
                                                                            textAlign: "left",
                                                                            fontWeight: '700',
                                                                            fontSize: '16px',
                                                                            color: '#2d3748',
                                                                            ml: 2,
                                                                            mb: 1,
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            '&::before': {
                                                                                content: '"🎯"',
                                                                                marginRight: '8px'
                                                                            }
                                                                        }}>{orderBumpCourse?.title}</InputLabel>
                                                                        <div className='mobile-headint-margin'>
                                                                            <Box sx={{
                                                                                background: "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)",
                                                                                m: { xs: 1, sm: 2 }, // Reduced margin on mobile
                                                                                width: "100%",
                                                                                borderRadius: '16px',
                                                                                border: '2px solid rgba(102, 126, 234, 0.2)',
                                                                                backdropFilter: 'blur(10px)',
                                                                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                                                '&:hover': {
                                                                                    transform: 'translateY(-2px)',
                                                                                    boxShadow: '0 10px 25px rgba(102, 126, 234, 0.15)',
                                                                                    border: '2px solid rgba(102, 126, 234, 0.3)'
                                                                                }
                                                                            }}
                                                                                display={'flex'}
                                                                                alignItems={'center'}
                                                                                justifyContent={"space-between"}
                                                                                padding={"16px"}
                                                                                className='mobile-fill-textfield'>
                                                                                <Typography
                                                                                    sx={{
                                                                                        fontWeight: '800',
                                                                                        ml: 1,
                                                                                        fontSize: '18px',
                                                                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                                                        WebkitBackgroundClip: 'text',
                                                                                        WebkitTextFillColor: 'transparent',
                                                                                        backgroundClip: 'text'
                                                                                    }}
                                                                                >
                                                                                    ₹ {(orderBumpCourse.price - ((orderBumpCourse.price / 100) * orderBumpCourse.discount)).toFixed(2)}
                                                                                </Typography>
                                                                                <Checkbox
                                                                                    checked={checked}
                                                                                    onChange={handleCheckboxChange}
                                                                                    color="primary"
                                                                                    sx={{
                                                                                        transform: 'scale(1.2)',
                                                                                        '&.Mui-checked': {
                                                                                            color: '#667eea'
                                                                                        },
                                                                                        '&:hover': {
                                                                                            backgroundColor: 'rgba(102, 126, 234, 0.1)'
                                                                                        }
                                                                                    }}
                                                                                />
                                                                            </Box>
                                                                        </div>
                                                                        <Typography sx={{
                                                                            fontSize: '15px',
                                                                            color: '#718096',
                                                                            margin: '8px 16px 16px 16px',
                                                                            fontWeight: '500',
                                                                            lineHeight: '1.6',
                                                                            fontStyle: 'italic'
                                                                        }}>
                                                                            {orderBumpCourse?.setting?.orderBumpDescription}
                                                                        </Typography>
                                                                    </> : ""
                                                            }

                                                            <Box sx={{
                                                                textAlign: "end",
                                                                mb: 1
                                                            }}>
                                                                <Typography
                                                                    variant="p"
                                                                    fontWeight={'700'}
                                                                    onClick={handleReedemCode}
                                                                    sx={{
                                                                        cursor: 'pointer',
                                                                        color: "#667eea",
                                                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                                        WebkitBackgroundClip: 'text',
                                                                        WebkitTextFillColor: 'transparent',
                                                                        backgroundClip: 'text',
                                                                        margin: "8px 16px",
                                                                        fontSize: "14px",
                                                                        fontWeight: '800',
                                                                        textDecoration: 'underline',
                                                                        textDecorationColor: 'rgba(102, 126, 234, 0.5)',
                                                                        '&:hover': {
                                                                            transform: 'translateY(-1px)',
                                                                            textShadow: '0 2px 4px rgba(102, 126, 234, 0.3)'
                                                                        },
                                                                        transition: 'all 0.3s ease'
                                                                    }}
                                                                >
                                                                    🎟️ Have a Coupon Code?
                                                                </Typography>
                                                            </Box>

                                                            {
                                                                reedemCode === true && (
                                                                    <Box className='mobile-fill-textfield' sx={{
                                                                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%)',
                                                                        borderRadius: '20px',
                                                                        padding: { xs: '16px', sm: '20px' }, // Reduced padding on mobile
                                                                        margin: { xs: '12px', sm: '16px' }, // Reduced margin on mobile
                                                                        border: '1px solid rgba(102, 126, 234, 0.2)',
                                                                        backdropFilter: 'blur(10px)',
                                                                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                                                                    }}>
                                                                        <InputLabel sx={{
                                                                            width: '100%',
                                                                            textAlign: "left",
                                                                            fontWeight: '700',
                                                                            fontSize: '16px',
                                                                            color: '#2d3748',
                                                                            mb: 2,
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            '&::before': {
                                                                                content: '"🎫"',
                                                                                marginRight: '8px'
                                                                            }
                                                                        }}>Enter Your Coupon Code</InputLabel>

                                                                        <OutlinedInput
                                                                            className='mobile-coupon-field'
                                                                            fullWidth
                                                                            type="text"
                                                                            name="number"
                                                                            value={couponNumber}
                                                                            onChange={handleCoupon}
                                                                            placeholder="Enter discount code"
                                                                            id="outlined-adornment-weight"
                                                                            endAdornment={
                                                                                <InputAdornment position="end">
                                                                                    <IconButton
                                                                                        disabled={couponNumber && number ? false : true}
                                                                                        aria-label="apply coupon"
                                                                                        onClick={handleCheckCoupon}
                                                                                        edge="end"
                                                                                        sx={{
                                                                                            fontSize: "14px",
                                                                                            color: getColor(),
                                                                                            fontWeight: '700',
                                                                                            background: isCouponValid === true ?
                                                                                                'linear-gradient(135deg, #48bb78 0%, #38a169 100%)' :
                                                                                                'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                                                            color: 'white',
                                                                                            borderRadius: '12px',
                                                                                            padding: '8px 16px',
                                                                                            minWidth: 'auto',
                                                                                            '&:hover': {
                                                                                                transform: 'translateY(-2px)',
                                                                                                boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)'
                                                                                            },
                                                                                            '&:disabled': {
                                                                                                background: '#e2e8f0',
                                                                                                color: '#a0aec0'
                                                                                            },
                                                                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                                                                        }}
                                                                                    >
                                                                                        {isCouponValid === true ?
                                                                                            <>✅ Applied</> :
                                                                                            "Apply Code"
                                                                                        }
                                                                                    </IconButton>
                                                                                </InputAdornment>
                                                                            }
                                                                            aria-describedby="outlined-weight-helper-text"
                                                                            sx={{
                                                                                borderRadius: "16px",
                                                                                background: 'rgba(255, 255, 255, 0.9)',
                                                                                backdropFilter: 'blur(10px)',
                                                                                '& .MuiOutlinedInput-root': {
                                                                                    '&:hover fieldset': {
                                                                                        borderColor: '#667eea',
                                                                                        borderWidth: '2px'
                                                                                    },
                                                                                    '&.Mui-focused fieldset': {
                                                                                        borderColor: '#667eea',
                                                                                        borderWidth: '2px',
                                                                                        boxShadow: '0 0 0 4px rgba(102, 126, 234, 0.1)'
                                                                                    }
                                                                                }
                                                                            }}
                                                                        />
                                                                        {errorMessage &&
                                                                            <FormHelperText
                                                                                error
                                                                                sx={{
                                                                                    marginTop: "12px",
                                                                                    fontSize: '14px',
                                                                                    fontWeight: '600'
                                                                                }}
                                                                            >
                                                                                {errorMessage}
                                                                            </FormHelperText>
                                                                        }
                                                                    </Box>
                                                                )
                                                            }
                                                            <Box sx={{
                                                                display: "flex",
                                                                flexDirection: "row", // Keep in same row for all screen sizes
                                                                justifyContent: "space-between",
                                                                alignItems: "center",
                                                                flexWrap: "wrap", // Allow wrapping if needed
                                                                gap: { xs: 1, sm: 0 },
                                                                margin: { xs: "16px 8px", sm: "24px 16px" },
                                                                padding: { xs: "16px", sm: "20px" },
                                                                width: { xs: "calc(100% - 16px)", sm: isMobileDevice ? "calc(100% - 32px)" : "calc(90% - 32px)" },
                                                                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
                                                                borderRadius: '16px',
                                                                border: '2px solid rgba(102, 126, 234, 0.1)',
                                                                backdropFilter: 'blur(10px)'
                                                            }}>
                                                                <Typography
                                                                    variant="h6"
                                                                    sx={{
                                                                        fontWeight: '800',
                                                                        fontSize: '18px',
                                                                        color: '#2d3748',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        '&::before': {
                                                                            content: '"💰"',
                                                                            marginRight: '8px'
                                                                        }
                                                                    }}
                                                                >
                                                                    Total Amount:
                                                                </Typography>
                                                                <Typography
                                                                    variant="h6"
                                                                    sx={{
                                                                        fontWeight: '900',
                                                                        fontSize: '20px',
                                                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                                        WebkitBackgroundClip: 'text',
                                                                        WebkitTextFillColor: 'transparent',
                                                                        backgroundClip: 'text'
                                                                    }}
                                                                >
                                                                    ₹ {checked ? (orderBumpCourse.price - ((orderBumpCourse.price / 100) * orderBumpCourse.discount)) + totalPrice : totalPrice}
                                                                </Typography>
                                                            </Box>
                                                            {
                                                                isCouponValid === true && (
                                                                    <>
                                                                        <Box sx={{
                                                                            display: "flex",
                                                                            flexDirection: "row", // Keep in same row for all screen sizes
                                                                            justifyContent: "space-between",
                                                                            alignItems: "center",
                                                                            flexWrap: "wrap", // Allow wrapping if needed
                                                                            gap: { xs: 1, sm: 0 },
                                                                            margin: { xs: "12px 8px", sm: "16px" },
                                                                            padding: { xs: "12px", sm: "16px" },
                                                                            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(220, 38, 38, 0.05) 100%)',
                                                                            borderRadius: '12px',
                                                                            border: '1px solid rgba(239, 68, 68, 0.2)'
                                                                        }}>
                                                                            <Typography
                                                                                variant="h6"
                                                                                sx={{
                                                                                    fontWeight: '700',
                                                                                    color: '#e53e3e',
                                                                                    fontSize: '16px',
                                                                                    display: 'flex',
                                                                                    alignItems: 'center',
                                                                                    '&::before': {
                                                                                        content: '"🎉"',
                                                                                        marginRight: '8px'
                                                                                    }
                                                                                }}
                                                                            >
                                                                                Discount Applied:
                                                                            </Typography>
                                                                            <Typography
                                                                                variant="h6"
                                                                                sx={{
                                                                                    fontWeight: '800',
                                                                                    color: '#e53e3e',
                                                                                    fontSize: '18px'
                                                                                }}
                                                                            >
                                                                                - ₹ {couponDiscount}
                                                                            </Typography>
                                                                        </Box>
                                                                        <Box sx={{
                                                                            display: "flex",
                                                                            flexDirection: "row", // Keep in same row for all screen sizes
                                                                            justifyContent: "space-between",
                                                                            alignItems: "center",
                                                                            flexWrap: "wrap", // Allow wrapping if needed
                                                                            gap: { xs: 1, sm: 0 },
                                                                            margin: { xs: "12px 8px", sm: "16px" },
                                                                            padding: { xs: "16px", sm: "20px" },
                                                                            background: 'linear-gradient(135deg, rgba(72, 187, 120, 0.1) 0%, rgba(56, 161, 105, 0.1) 100%)',
                                                                            borderRadius: '16px',
                                                                            border: '2px solid rgba(72, 187, 120, 0.3)',
                                                                            boxShadow: '0 8px 32px rgba(72, 187, 120, 0.1)'
                                                                        }}>
                                                                            <Typography
                                                                                variant="h6"
                                                                                sx={{
                                                                                    fontWeight: '800',
                                                                                    color: '#2f855a',
                                                                                    fontSize: '18px',
                                                                                    display: 'flex',
                                                                                    alignItems: 'center',
                                                                                    '&::before': {
                                                                                        content: '"🎯"',
                                                                                        marginRight: '8px'
                                                                                    }
                                                                                }}
                                                                            >
                                                                                Final Amount:
                                                                            </Typography>
                                                                            <Typography
                                                                                variant="h6"
                                                                                sx={{
                                                                                    fontWeight: '900',
                                                                                    fontSize: '22px',
                                                                                    background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                                                                                    WebkitBackgroundClip: 'text',
                                                                                    WebkitTextFillColor: 'transparent',
                                                                                    backgroundClip: 'text'
                                                                                }}
                                                                            >
                                                                                ₹ {checked ? ((orderBumpCourse.price - ((orderBumpCourse.price / 100) * orderBumpCourse.discount)) + totalPrice) - couponDiscount : totalPrice - couponDiscount}
                                                                            </Typography>
                                                                        </Box>
                                                                    </>
                                                                )
                                                            }

                                                        </Grid>
                                                    </Grid>
                                                    <Button
                                                        variant="contained"
                                                        sx={{
                                                            width: { xs: "calc(100% - 32px)", sm: "300px" }, // Full width on mobile, fixed width on desktop
                                                            height: "56px",
                                                            margin: { xs: "24px 16px 16px 16px", sm: "32px auto 24px auto" }, // Different margins for mobile
                                                            fontSize: '16px',
                                                            fontWeight: '800',
                                                            borderRadius: '16px',
                                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                                                            backgroundSize: '200% 200%',
                                                            color: 'white',
                                                            textTransform: 'none',
                                                            boxShadow: '0 8px 32px rgba(102, 126, 234, 0.4)',
                                                            border: 'none',
                                                            position: 'relative',
                                                            overflow: 'hidden',
                                                            '&::before': {
                                                                content: '""',
                                                                position: 'absolute',
                                                                top: 0,
                                                                left: 0,
                                                                right: 0,
                                                                bottom: 0,
                                                                background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.3) 50%, transparent 70%)',
                                                                transform: 'translateX(-100%)',
                                                                transition: 'transform 0.6s ease'
                                                            },
                                                            '&:hover': {
                                                                transform: 'translateY(-3px)',
                                                                boxShadow: '0 15px 40px rgba(102, 126, 234, 0.5)',
                                                                backgroundPosition: '100% 0',
                                                                animation: 'gradientShift 2s ease infinite'
                                                            },
                                                            '&:hover::before': {
                                                                transform: 'translateX(100%)'
                                                            },
                                                            '&:active': {
                                                                transform: 'translateY(-1px)'
                                                            },
                                                            '&:disabled': {
                                                                background: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e0 100%)',
                                                                color: '#a0aec0',
                                                                boxShadow: 'none',
                                                                transform: 'none'
                                                            },
                                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '12px'
                                                        }}
                                                        onClick={handleSubmit}
                                                        disabled={title === '' || number === '' || email === ''}
                                                    >
                                                        <span style={{ fontSize: '20px' }}>🚀</span>
                                                        Complete Payment
                                                        <span style={{ fontSize: '20px' }}>💳</span>
                                                    </Button>
                                                </Card>
                                            </Typography>
                                        )
                                    }
                                    {
                                        activeStep === 3 && (
                                            <Typography sx={{ mt: 3, mb: 1, py: 1 }}>
                                                <Card sx={{
                                                    width: "100%",
                                                    background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
                                                    backdropFilter: 'blur(20px)',
                                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                                    borderRadius: '32px',
                                                    boxShadow: '0 30px 60px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                                                    textAlign: "center",
                                                    position: 'relative',
                                                    overflow: 'hidden',
                                                    '&::before': {
                                                        content: '""',
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        right: 0,
                                                        height: '6px',
                                                        background: 'linear-gradient(90deg, #48bb78 0%, #38a169 50%, #2f855a 100%)',
                                                        backgroundSize: '200% 200%',
                                                        animation: 'gradientShift 3s ease infinite'
                                                    },
                                                    '&:hover': {
                                                        transform: 'translateY(-8px)',
                                                        boxShadow: '0 40px 80px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.15)',
                                                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                                                    },
                                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                                                }}>
                                                    {/* Success Animation Background */}
                                                    <Box sx={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        right: 0,
                                                        bottom: 0,
                                                        background: 'radial-gradient(circle at 50% 50%, rgba(72, 187, 120, 0.05) 0%, transparent 70%)',
                                                        pointerEvents: 'none'
                                                    }} />

                                                    <Grid container sx={{ margin: "40px 0", justifyContent: "center", position: 'relative', zIndex: 1 }}>
                                                        <Grid item xs={12} sm={8} md={6} lg={5}>
                                                            {/* Success Icon and Title */}
                                                            <Box sx={{ mb: 4 }}>
                                                                <Box sx={{
                                                                    width: '120px',
                                                                    height: '120px',
                                                                    margin: '0 auto 20px',
                                                                    background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                                                                    borderRadius: '50%',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    boxShadow: '0 20px 40px rgba(72, 187, 120, 0.3)',
                                                                    animation: 'pulse 2s ease-in-out infinite'
                                                                }}>
                                                                    <Typography sx={{ fontSize: '48px' }}>🎉</Typography>
                                                                </Box>
                                                                <Typography
                                                                    variant='h3'
                                                                    sx={{
                                                                        fontWeight: '900',
                                                                        background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                                                                        WebkitBackgroundClip: 'text',
                                                                        WebkitTextFillColor: 'transparent',
                                                                        backgroundClip: 'text',
                                                                        fontSize: { xs: '2rem', md: '2.5rem' },
                                                                        letterSpacing: '-0.02em',
                                                                        mb: 2
                                                                    }}
                                                                >
                                                                    Enrollment Successful!
                                                                </Typography>
                                                                <Typography sx={{
                                                                    fontSize: '18px',
                                                                    color: '#4a5568',
                                                                    fontWeight: '500',
                                                                    mb: 3,
                                                                    lineHeight: '1.6'
                                                                }}>
                                                                    Welcome to your learning journey! 🚀
                                                                </Typography>
                                                            </Box>

                                                            {/* Logo Section */}
                                                            <Box sx={{ mb: 4 }}>
                                                                <Box sx={{
                                                                    background: 'rgba(255, 255, 255, 0.8)',
                                                                    borderRadius: '20px',
                                                                    padding: '24px',
                                                                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                                                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                                                    backdropFilter: 'blur(10px)'
                                                                }}>
                                                                    <img
                                                                        src="cawallah/cawallahlogo.png"
                                                                        alt="CAwalla Logo"
                                                                        style={{
                                                                            height: "80px",
                                                                            filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))'
                                                                        }}
                                                                    />
                                                                </Box>
                                                            </Box>

                                                            {/* Download Instructions */}
                                                            <Box sx={{
                                                                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
                                                                borderRadius: '20px',
                                                                padding: '24px',
                                                                margin: '24px 0',
                                                                border: '1px solid rgba(102, 126, 234, 0.1)'
                                                            }}>
                                                                <Typography sx={{
                                                                    fontWeight: "700",
                                                                    fontSize: "16px",
                                                                    color: '#2d3748',
                                                                    lineHeight: '1.7',
                                                                    mb: 3
                                                                }}>
                                                                    📱 <strong>Next Steps:</strong> Download our mobile app to access test papers and upload your answer sheets.
                                                                    The complete student dashboard is available exclusively on mobile!
                                                                </Typography>

                                                                {/* App Store Buttons */}
                                                                <Box sx={{
                                                                    display: "flex",
                                                                    justifyContent: "center",
                                                                    alignItems: "center",
                                                                    gap: 2,
                                                                    flexWrap: 'wrap'
                                                                }}>
                                                                    <Box
                                                                        component="img"
                                                                        src="img/playstore.svg"
                                                                        alt="Download from Google Play"
                                                                        onClick={handlePlayStore}
                                                                        sx={{
                                                                            height: '48px',
                                                                            cursor: 'pointer',
                                                                            borderRadius: '12px',
                                                                            transition: 'all 0.3s ease',
                                                                            filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))',
                                                                            '&:hover': {
                                                                                transform: 'translateY(-4px) scale(1.05)',
                                                                                filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.2))'
                                                                            }
                                                                        }}
                                                                    />
                                                                    <Box
                                                                        component="img"
                                                                        src="img/applestore.svg"
                                                                        alt="Download from App Store"
                                                                        sx={{
                                                                            height: '48px',
                                                                            cursor: 'pointer',
                                                                            borderRadius: '12px',
                                                                            transition: 'all 0.3s ease',
                                                                            filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))',
                                                                            '&:hover': {
                                                                                transform: 'translateY(-4px) scale(1.05)',
                                                                                filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.2))'
                                                                            }
                                                                        }}
                                                                    />
                                                                    <Box
                                                                        component="img"
                                                                        src="img/windowstore.svg"
                                                                        alt="Download from Microsoft Store"
                                                                        onClick={handleWindowStore}
                                                                        sx={{
                                                                            height: '48px',
                                                                            cursor: 'pointer',
                                                                            borderRadius: '12px',
                                                                            transition: 'all 0.3s ease',
                                                                            filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))',
                                                                            '&:hover': {
                                                                                transform: 'translateY(-4px) scale(1.05)',
                                                                                filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.2))'
                                                                            }
                                                                        }}
                                                                    />
                                                                </Box>
                                                            </Box>
                                                            {/* Action Button */}
                                                            <Button
                                                                variant="contained"
                                                                sx={{
                                                                    // width: "320px",
                                                                    height: "64px",
                                                                    margin: "32px auto",
                                                                    fontSize: '16px',
                                                                    fontWeight: '800',
                                                                    borderRadius: '20px',
                                                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                                                                    backgroundSize: '200% 200%',
                                                                    color: 'white',
                                                                    textTransform: 'none',
                                                                    boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)',
                                                                    border: 'none',
                                                                    position: 'relative',
                                                                    overflow: 'hidden',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: '12px',
                                                                    '&::before': {
                                                                        content: '""',
                                                                        position: 'absolute',
                                                                        top: 0,
                                                                        left: 0,
                                                                        right: 0,
                                                                        bottom: 0,
                                                                        background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.3) 50%, transparent 70%)',
                                                                        transform: 'translateX(-100%)',
                                                                        transition: 'transform 0.6s ease'
                                                                    },
                                                                    '&:hover': {
                                                                        transform: 'translateY(-4px)',
                                                                        boxShadow: '0 20px 50px rgba(102, 126, 234, 0.5)',
                                                                        backgroundPosition: '100% 0',
                                                                        animation: 'gradientShift 2s ease infinite'
                                                                    },
                                                                    '&:hover::before': {
                                                                        transform: 'translateX(100%)'
                                                                    },
                                                                    '&:active': {
                                                                        transform: 'translateY(-2px)'
                                                                    },
                                                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                                                }}
                                                                onClick={() => {
                                                                    setActiveStep(0);
                                                                    setAddedCartPlans([]);
                                                                    setAddtoCartIds([]);
                                                                    setPurchaseArray([]);
                                                                    setSelectedIds([]);
                                                                    setSelectSubjectWise([]);
                                                                    setChecked(false);
                                                                }}
                                                            >
                                                                <span style={{ fontSize: '24px' }}>🎯</span>
                                                                Start Another Journey
                                                                <span style={{ fontSize: '24px' }}>✨</span>
                                                            </Button>
                                                        </Grid>
                                                    </Grid>
                                                </Card>
                                            </Typography>
                                        )
                                    }
                                </React.Fragment>
                            )}
                        </div>
                    </Box>

                </Box>
            </Box>

            <Dialog open={courseExpandedDescriptions} onClose={() => setCourseExpandedDescriptions(false)}>

                <DialogContent dividers>
                    <Typography variant='body1'>
                        {parse(fullDes)}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCourseExpandedDescriptions(false)}>Close</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={viewPlanModal} onClose={() => setViewPlanModal(false)} maxWidth={'lg'} sx={{
                "& .MuiDialog-container": {
                    "& .MuiPaper-root": {
                        minWidth: "30%",
                    },
                },
            }}>
                <IconButton
                    aria-label="close"
                    onClick={() => setViewPlanModal(false)}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon sx={{ color: "black" }} />
                </IconButton>
                <ViewPlanModal handleClose={() => setViewPlanModal(false)} plansList={plansList} courseContentList={courseContentList} selectShedule={selectShedule} handleChange={handleChange} />
            </Dialog>
            <Dialog open={openScheduleModal} onClose={() => setOpenScheduleModal(false)} maxWidth={'lg'} sx={{
                "& .MuiDialog-container": {
                    "& .MuiPaper-root": {
                        minWidth: !isMobileDevice ? "90%" : "25%",
                    },
                },
            }}>
                <IconButton
                    aria-label="close"
                    onClick={() => setOpenScheduleModal(false)}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon sx={{ color: "black" }} />
                </IconButton>
                <Box sx={{
                    borderBottom: "1px solid #80808038"
                }}>


                    <Box sx={{ textAlign: "left", padding: "2rem", mt: 3 }}>
                        <Typography variant="h4" fontWeight={'bold'}>Select Schedule</Typography>
                    </Box>
                    <Box
                        sx={{
                            padding: !isMobileDevice ? "" : "0 2rem",
                            margin: isMobileDevice ? "" : "0 2rem",
                            display: "flex",
                            justifyContent: "left",
                            // borderBottom: "1px solid #80808038"
                        }}
                    >

                        <FormControl className='mobile-select-button'>
                            <InputLabel id="demo-simple-select-label" sx={{ fontSize: "13px" }}>Schedule</InputLabel>
                            <Select
                                className='select-option'
                                sx={{ mb: 2, minWidth: "100px", maxWidth: "300px", fontSize: "12px", width: "230px", fontSize: "12px" }}
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Schedule"
                                value={selectShedule}
                                onChange={handleChange}
                            >
                                {
                                    courseContentList && courseContentList.map((data, index) => {
                                        return (
                                            <MenuItem key={index} value={data}>{data?.title}</MenuItem>
                                        )
                                    })
                                }
                            </Select>
                        </FormControl>

                    </Box>
                    {/* {
                                        plansList?.length > 0 &&  (
                                            <Box sx={{justifyContent: "center", display: "flex", mb: 2}}>
                                                <Typography variant='p' onClick={handleViewPlan} sx={{ fontWeight: "bold", width: "fit-content", padding: "0px 2px 14px 2px !important", fontSize: "12px", color: "#DD2A3D", fontWeight: "bold", cursor: "pointer" }} >View Schedules</Typography>
                                            </Box>
                                        )
                                    } */}
                </Box>
                <DialogActions>
                    <Button onClick={handleCheckoutSubmit} sx={{ fontSize: "14px", color: "#DD2A3D", fontWeight: "bold" }}>Submit</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={imageSchedule} onClose={handleCloseSchedule} fullScreen>
                <Box sx={{ textAlign: 'end', width: "100%" }}>
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseSchedule}
                    >
                        <CloseIcon fontSize="large" />
                    </IconButton>
                </Box>
                <DialogContent style={{ textAlign: "center" }}>
                    {
                        selectedAotherSchedule?.title === "Portion WiseTest Series" && selectCourse?.title === "CA Final" && (
                            <img
                                src="img/WhatsApp Image 2026-03-02 at 10.22.23 AM.jpeg"
                                alt="Scheduled"
                                style={{ margin: "5px", width: isMobileDevice ? "" : "-webkit-fill-available" }}
                            />
                        )
                    }
                    {
                        selectedAotherSchedule?.title === "Full Length Test Series" ?
                            <img
                                src="img/ca-inter-full-length.jpeg"
                                alt="Scheduled"
                                style={{ margin: "5px", width: isMobileDevice ? "-webkit-fill-available" : "-webkit-fill-available" }}
                            />
                            : selectScheduleContentObj?.title === "Exam oriented Test Series" ?
                                <img
                                    src="img/Exam Oriented.jpeg"
                                    alt="Scheduled"
                                    style={{ margin: "5px", width: isMobileDevice ? "-webkit-fill-available" : "-webkit-fill-available" }}
                                />
                                :
                                <>
                                    {
                                        selectedBasicPlan?.title === "Cumulative" ?
                                            <img
                                                src="img/ca-inter-calculam.jpeg"
                                                alt="Scheduled"
                                                style={{ margin: "5px", width: isMobileDevice ? "-webkit-fill-available" : "-webkit-fill-available" }}
                                            />
                                            : selectedBasicPlan?.title === "Exclusive" ?
                                                <img
                                                    src="img/WhatsApp Image 2026-03-02 at 10.21.45 AM.jpeg"
                                                    alt="Scheduled"
                                                    style={{ margin: "5px", width: isMobileDevice ? "-webkit-fill-available" : "-webkit-fill-available" }}
                                                /> : ""
                                    }
                                </>
                    }
                </DialogContent>
            </Dialog>
        </Layout>
    );
};

export default TestSeries;
