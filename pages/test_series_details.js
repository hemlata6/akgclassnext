import {
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	Checkbox,
	Chip,
	Dialog,
	DialogActions,
	DialogContent,
	Fade,
	FormControl,
	FormHelperText,
	Grid,
	IconButton,
	InputAdornment,
	InputLabel,
	ListItemText,
	MenuItem,
	OutlinedInput,
	Select,
	Stack,
	Step,
	StepConnector,
	StepLabel,
	Stepper,
	styled,
	TextField,
	Typography,
	useMediaQuery,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import VerifiedIcon from '@mui/icons-material/Verified';
import { useRouter } from 'next/router';
import parse from 'html-react-parser';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import ViewPlanModal from '../components/AllPlans';
import Layout from '../components/Layout';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AndroidIcon from '@mui/icons-material/Android';
import AppleIcon from '@mui/icons-material/Apple';
import WindowIcon from '@mui/icons-material/Window';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import { Base64 } from 'js-base64';
import Check from '@mui/icons-material/Check';
import PropTypes from 'prop-types';
import CheckIcon from '@mui/icons-material/Check';
import { PDFDocument } from 'pdf-lib';
import instId from '../config/instituteId';

const modernColors = {
	primary: {
		main: '#D4AF37',
		light: '#E8CA68',
		dark: '#B8960F',
		gradient: 'linear-gradient(135deg, #D4AF37 0%, #B8960F 100%)',
	},
	secondary: {
		main: '#1E293B',
		light: '#334155',
		dark: '#0F172A',
		gradient: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
	},
	accent: {
		main: '#7C5E10',
		light: '#A37A14',
		background: 'rgba(212, 175, 55, 0.12)',
	},
	success: {
		main: '#2F855A',
		light: '#276749',
		background: 'rgba(47, 133, 90, 0.12)',
	},
	neutral: {
		white: '#ffffff',
		light: '#F8FAFC',
		gray: '#64748b',
		dark: '#0F172A',
	},
};

const ModernPlanCard = styled(Card)({
	position: 'relative',
	width: '350px',
	borderRadius: '16px',
	background: '#FFFFFF',
	border: '1px solid #E5E7EB',
	boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
	transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
	overflow: 'hidden',
	cursor: 'pointer',
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'space-between',
	'&:hover': {
		transform: 'translateY(-8px)',
		boxShadow: '0 12px 24px rgba(0, 0, 0, 0.12)',
	},
	'&::before': {
		content: '""',
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		height: '3px',
		background: modernColors.primary.main,
	},
});

const ModernPlanImage = styled('div')(({ image }) => ({
	width: '100%',
	aspectRatio: '16 / 9',
	backgroundImage: `url(${image})`,
	backgroundSize: 'contain',
	backgroundRepeat: 'no-repeat',
	backgroundPosition: 'center',
	borderRadius: '16px 16px 0 0',
	position: 'relative',
	backgroundColor: '#f5f5f5',
	'&::after': {
		content: '""',
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		height: '40%',
		background: 'linear-gradient(transparent, rgba(0,0,0,0.1))',
		borderRadius: '0 0 16px 16px',
	},
}));

const ModernPlanTitle = styled(Typography)({
	fontWeight: 700,
	fontSize: '1rem',
	color: modernColors.neutral.dark,
	textAlign: 'center',
	marginBottom: '12px',
});

const ModernPriceContainer = styled(Box)({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	gap: '8px',
	marginBottom: '16px',
});

const ModernPrice = styled(Typography)({
	fontSize: '1.5rem',
	fontWeight: 700,
	color: modernColors.success.main,
	textAlign: 'center',
});

const ModernOriginalPrice = styled(Typography)({
	fontSize: '1rem',
	color: modernColors.neutral.gray,
	textDecoration: 'line-through',
});

const ModernDiscountBadge = styled(Chip)({
	background: modernColors.accent.main,
	color: 'white',
	fontSize: '0.8rem',
	fontWeight: 'bold',
	height: '28px',
});

const ModernChip = styled(Chip)(({ chipcolor = 'primary' }) => {
	const colors = {
		primary: { bg: modernColors.primary.main, color: 'white' },
		accent: { bg: modernColors.accent.background, color: modernColors.accent.main },
		success: { bg: modernColors.success.background, color: modernColors.success.main },
	};

	return {
		backgroundColor: colors[chipcolor].bg,
		color: colors[chipcolor].color,
		fontSize: '1rem',
		fontWeight: 600,
		border: 'none',
	};
});

const ModernAddButton = styled(Button)(({ isAdded }) => ({
	width: '100%',
	borderRadius: '12px',
	padding: '12px 20px',
	fontWeight: 600,
	fontSize: '1rem',
	textTransform: 'none',
	background: isAdded ? modernColors.success.main : modernColors.primary.gradient,
	color: 'white',
	border: 'none',
	transition: 'all 0.3s ease',
	'&:hover': {
		background: isAdded
			? modernColors.success.light
			: `linear-gradient(135deg, ${modernColors.primary.dark} 0%, ${modernColors.primary.main} 100%)`,
		transform: 'translateY(-2px)',
		boxShadow: '0 8px 25px rgba(212, 175, 55, 0.28)',
	},
	'&:disabled': {
		background: modernColors.neutral.gray,
		color: 'white',
	},
}));

const ModernCheckoutButton = styled(Button)({
	padding: '12px 10px',
	borderRadius: '12px',
	fontWeight: 700,
	fontSize: '16px',
	textTransform: 'none',
	background: modernColors.secondary.gradient,
	color: 'white',
	border: 'none',
	transition: 'all 0.3s ease',
	'&:hover': {
		background: `linear-gradient(135deg, ${modernColors.secondary.dark} 0%, ${modernColors.secondary.main} 100%)`,
		transform: 'translateY(-2px)',
		boxShadow: '0 8px 25px rgba(15, 23, 42, 0.22)',
	},
});

const ModernStepConnector = styled(StepConnector)({
	'&': {
		display: 'block !important',
		visibility: 'visible !important',
	},
	'& .MuiStepConnector-line': {
		height: 3,
		border: 0,
		borderRadius: 2,
		backgroundColor: 'rgba(180, 180, 180, 0.4)',
		transition: 'all 0.3s ease',
		display: 'block !important',
		opacity: 1,
	},
	'&.Mui-active .MuiStepConnector-line': {
		background: modernColors.primary.gradient,
		boxShadow: '0 2px 8px rgba(212, 175, 55, 0.28)',
	},
	'&.Mui-completed .MuiStepConnector-line': {
		background: modernColors.primary.gradient,
		boxShadow: '0 2px 8px rgba(212, 175, 55, 0.28)',
	},
});

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
	[theme.breakpoints.down('md')]: {
		overflowX: 'auto',
		'&::-webkit-scrollbar': { height: '4px' },
		'&::-webkit-scrollbar-track': { background: 'rgba(0,0,0,0.1)', borderRadius: '4px' },
		'&::-webkit-scrollbar-thumb': { background: modernColors.primary.main, borderRadius: '4px' },
	},
	[theme.breakpoints.up('md')]: {
		overflowX: 'hidden',
		'& .MuiStepper-root': { flexWrap: 'wrap' },
	},
	'& .MuiStepLabel-root': {
		flex: '1 1 auto',
		minWidth: 0,
		'& .MuiStepLabel-label': {
			fontSize: '0.875rem',
			fontWeight: 600,
			color: modernColors.neutral.gray,
			transition: 'all 0.3s ease',
			overflow: 'hidden',
			textOverflow: 'ellipsis',
			whiteSpace: 'nowrap',
			[theme.breakpoints.down('md')]: { fontSize: '0.75rem' },
			'&.Mui-completed': { color: modernColors.primary.main, fontWeight: 700 },
			'&.Mui-active': { color: modernColors.primary.main, fontWeight: 700 },
		},
	},
}));

const ModernStepIconRoot = styled('div')(({ ownerState }) => ({
	color: modernColors.neutral.gray,
	display: 'flex',
	height: 24,
	width: 24,
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
	'& .ModernStepIcon-number': {
		fontSize: '0.8rem',
		fontWeight: 600,
	},
}));

function ModernStepIcon(props) {
	const { active, completed, className, icon } = props;

	return (
		<ModernStepIconRoot ownerState={{ active, completed }} className={className}>
			{completed ? <CheckIcon className="ModernStepIcon-completedIcon" /> : <span className="ModernStepIcon-number">{icon}</span>}
		</ModernStepIconRoot>
	);
}

const QontoStepIconRoot = styled('div')(({ theme, ownerState }) => ({
	color: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#eaeaf0',
	display: 'flex',
	height: 22,
	alignItems: 'center',
	...(ownerState.active && { color: modernColors.primary.main }),
	'& .QontoStepIcon-completedIcon': { color: modernColors.primary.main, zIndex: 1, fontSize: 18 },
	'& .QontoStepIcon-circle': { width: 12, height: 12, borderRadius: '50%', backgroundColor: 'currentColor' },
}));

function QontoStepIcon(props) {
	const { active, completed, className } = props;

	return (
		<QontoStepIconRoot ownerState={{ active }} className={className}>
			{completed ? <Check className="QontoStepIcon-completedIcon" /> : <div className="QontoStepIcon-circle" />}
		</QontoStepIconRoot>
	);
}

QontoStepIcon.propTypes = {
	active: PropTypes.bool,
	className: PropTypes.string,
	completed: PropTypes.bool,
};

const steps = ['Plans', 'Details', 'Checkout', 'Done'];

const stripHtml = (value) => {
	if (!value || typeof value !== 'string') return '';
	return value
		.replace(/&nbsp;/g, ' ')
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/<[^>]*>/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
};

const TestSeriesDetails = ({ cartNumberUpdate }) => {
	const responsive = {
		desktop: { breakpoint: { max: 3000, min: 1024 }, items: 3, slidesToSlide: 3 },
		tablet: { breakpoint: { max: 1024, min: 464 }, items: 1, slidesToSlide: 1 },
		mobile: { breakpoint: { max: 464, min: 0 }, items: 2, slidesToSlide: 2 },
	};

	const isMobileDevice = useMediaQuery('(min-width:480px)');
	const BASE_URL = 'https://prodapi.classiolabs.com/';
	// const InstId = 499;
	const router = useRouter();
	const campaignId = router.query?.campaignId;
	const paramData = router.query?.data;
	const parseRouteData = () => {
		if (!paramData) return {};

		try {
			return JSON.parse(Base64.decode(paramData));
		} catch (error) {
			console.error('Failed to parse route payload:', error);
			return {};
		}
	};

	const data = parseRouteData();
	const selectedItemFromStorage =
		typeof window !== 'undefined'
			? (() => {
				try {
					const raw = sessionStorage.getItem('selectedTestSeriesItem');
					return raw ? JSON.parse(raw) : null;
				} catch (error) {
					return null;
				}
			})()
			: null;
	const selectCourserout = data.courseObj || selectedItemFromStorage?.course;
	const basicPlanObj = data.basicPlan;
	const selectScheduleContentObj = data?.selectScheduleContent || data?.selectedItem || selectedItemFromStorage;
	const selectedPlanDataObj = data?.selectedPlanData;
	const selectedScheduleObj = data?.selectedSchedule || data?.selectedItem || selectedItemFromStorage;
	const cartRouteData = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('cartRoute') : null;

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
	const [Endpoints, setEndpoints] = useState('');
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
		let nextTotalPrice = 0;
		cartArray?.forEach((item) => {
			const object = getPlanPrice(item.plan, item.group, item.subject);
			const price = object?.price;
			nextTotalPrice += object?.finalPrice === 0 ? Number(price) - Number(price / 100) * Number(item?.plan?.discount) : object?.finalPrice;
			object.entityId.forEach((entity) => {
				allEntityIds.push(entity);
			});
		});
		setTotalPrice(nextTotalPrice);
		setPurchaseArray(allEntityIds);
		localStorage.setItem('purchaseArray', JSON.stringify(allEntityIds));
	}, [cartArray]);

	useEffect(() => {
		if (coursePublic?.id) {
			const matchedEntity = purchaseArray.some((purchase) => purchase.entityId === coursePublic.id);
			setOrderBumpCourse(matchedEntity ? {} : coursePublic);
		}
	}, [coursePublic, purchaseArray]);

	const updateCartAndPurchaseArrays = (incomingPlansList, incomingAddedCartPlans) => {
		const newPurchaseArray = [];
		incomingAddedCartPlans.forEach((cartItem) => {
			incomingPlansList.forEach((plan) => {
				if (cartItem.plan.title === plan.title) {
					cartItem.plan = plan;
					newPurchaseArray.push(cartItem);
				}
			});
		});
		setCartArray(newPurchaseArray);
	};

	useEffect(() => {
		if (activeStep === -1) {
			router.push('/');
		}
	}, [activeStep, router]);

	function handleNextBrowse() {
		const nextData = {
			...data,
			selectedSchedule: JSON.stringify(selectedSchedule),
			selectedAotherSchedule: JSON.stringify(selectedAotherSchedule),
			selectedBasicPlan: JSON.stringify(selectedBasicPlan),
			selectedForPlans: JSON.stringify(selectedForPlans),
			selectedTag: JSON.stringify(selectedTag),
			selectCourse: JSON.stringify(selectCourse),
			activeStep,
			schedule: JSON.stringify(schedule),
			activeBtn,
			selectSubjectWise: JSON.stringify(selectSubjectWise),
			addtoCartIds: JSON.stringify(addtoCartIds),
			addedCartPlans: JSON.stringify(addedCartPlans),
			purchaseArray: JSON.stringify(purchaseArray),
		};

		if (typeof window !== 'undefined') {
			sessionStorage.setItem('testSeriesDetailsData', Base64.encode(JSON.stringify(nextData), true));
		}
	}

	function initial() {
		getCourseList();
		getTagsList();
		getInstituteDetail();
		setSelectCourse(selectCourserout);
		if (selectCourserout?.title === 'CA Inter' && selectScheduleContentObj?.title === 'Test Series Plus Mentorship') {
			fetchDripContent(selectScheduleContentObj?.id);
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
			if ((selectScheduleContentObj?.title === 'Full Length Test Series' || selectScheduleContentObj?.title === 'Exam oriented Test Series') || (selectScheduleContentObj?.title === 'Portion WiseTest Series' && selectCourserout?.title === 'CA Final')) {
				fetchDripContent(basicPlanObj?.id);
			}
		}
		if (selectedPlanDataObj) {
			getSheduleContentList(selectCourserout?.id, selectedPlanDataObj?.id, 'fifth');
			fetchDripContent(selectedPlanDataObj?.id);
			setSelectedForPlans(selectedPlanDataObj);
		}
		if (data.selectedTag !== undefined) setSelectedTag(JSON.parse(data.selectedTag));
		if (data.selectCourse !== undefined) setSelectCourse(JSON.parse(data.selectCourse));
		if (data.activeStep !== undefined) setActiveStep(data.activeStep);
		if (data.schedule !== undefined) setSchedule(JSON.parse(data.schedule));
		if (data.activeBtn !== undefined) setActiveBtn(data.activeBtn);
		if (data.selectSubjectWise !== undefined) setSelectSubjectWise(JSON.parse(data.selectSubjectWise));
		if (data.addtoCartIds !== undefined) setAddtoCartIds(JSON.parse(data.addtoCartIds));
		if (data.addedCartPlans !== undefined) setAddedCartPlans(JSON.parse(data.addedCartPlans));
		if (data.purchaseArray !== undefined) setPurchaseArray(JSON.parse(data.purchaseArray));
	}

	useEffect(() => {
		window.scrollTo(0, 0);
		initial();
		window.onpopstate = () => {
			handleBackBrowserBack();
			initial();
		};

		const localPlans = localStorage.getItem('addedCartPlans');
		const locaPurchase = localStorage.getItem('purchaseArray');
		const localPlansIds = localStorage.getItem('addtoCartIds');
		if (localPlans !== undefined && locaPurchase !== null) setAddedCartPlans(JSON.parse(localPlans));
		if (localPlansIds !== undefined && locaPurchase !== null) setAddtoCartIds(JSON.parse(localPlansIds));
		if (locaPurchase !== undefined && locaPurchase !== null) setPurchaseArray(JSON.parse(locaPurchase));
		if (cartRouteData === 'cartRoute') {
			setActiveStep(1);
			const localCartArray = localStorage.getItem('cartArray');
			if (localCartArray !== undefined && localCartArray !== null) setCartArray(JSON.parse(localCartArray));
		}
	}, []);

	function handleBackBrowserBack() {
		handleBack();
	}

	useEffect(() => {
		if (selectCourse) {
			const filterCourseTags = course.filter((item) => {
				const tagslists = item.tags || [];
				return tagslists.some((tag) => tag.id === selectCourse?.setting?.checkoutTag);
			});
			setSuggestedCourse(filterCourseTags);
		}
	}, [selectCourse, course]);

	useEffect(() => {
		setFilterCourse(course);
	}, [selectedTag, course]);

	useEffect(() => {
		if (courseContentList && courseContentList.length > 0) {
			const firstItem = courseContentList[0];
			setSchedule(firstItem);
			getSheduleContentList(selectCourse?.id, firstItem.id, 'first');
		} else {
			setSchedule('');
		}
	}, [courseContentList, selectCourse]);

	useEffect(() => {
		if (selectCourse?.id) getCourseContentList(selectCourse?.id);
	}, [selectCourse]);

	const getCourseContentList = async (courseId) => {
		try {
			const response = await axios.get(BASE_URL + `admin/course/fetchContent-public/${courseId}/0`, { withCredentials: false });
			if (response?.data?.errorCode === 0) {
				const filterCourseContent = response?.data?.contentList;
				const filterDripCourse = filterCourseContent.filter((entry) => entry?.drip === true);
				setSelectedSchedule(filterDripCourse[0]);
				setCourtseContentList(filterDripCourse);
			}
		} catch (requestError) {
			console.log(requestError);
		}
	};

	const buildListFromFirstResponse = (items = []) => {
		const mergedList = [];
		items.forEach((plan) => {
			if (Array.isArray(plan?.children) && plan.children.length > 0) {
				plan.children.forEach((group) => {
					if (Array.isArray(group?.children) && group.children.length > 0) {
						group.children.forEach((subject) => {
							mergedList.push({ ...subject, __groupTitle: group?.title, __groupId: group?.id });
						});
					} else {
						mergedList.push({ ...group, __groupTitle: group?.title, __groupId: group?.id });
					}
				});
			} else {
				mergedList.push(plan);
			}
		});
		return mergedList;
	};

	const fetchMergedSubjectList = async (courseId, groupItems = []) => {
		if (!courseId || !Array.isArray(groupItems)) return [];

		const normalize = (value) => String(value || '').toLowerCase().replace(/\s+/g, ' ').trim();
		const targetGroups = groupItems.filter((item) => {
			const title = normalize(item?.title);
			return title === 'group 1' || title === 'group 2' || title === 'group1' || title === 'group2';
		});

		const merged = [];

		for (const group of targetGroups) {
			try {
				const response = await axios.get(BASE_URL + `admin/course/fetchContent-public/${courseId}/${group?.id}`, {
					withCredentials: false,
				});

				if (response?.data?.errorCode === 0) {
					const children = response?.data?.contentList || [];
					children.forEach((child) => {
						merged.push({
							...child,
							__groupTitle: group?.title,
							__groupId: group?.id,
						});
					});
				}
			} catch (error) {
				console.log(error);
			}
		}

		return merged;
	};

	const applyParentContentByMode = async (parentItems = [], mode = filterGroupSubject, targetCourseId = selectCourse?.id) => {
		if (!Array.isArray(parentItems)) {
			setAlltreeList([]);
			return;
		}

		if (mode === 'subject') {
			const mergedSubjects = await fetchMergedSubjectList(targetCourseId, parentItems);
			setAlltreeList(mergedSubjects);
			return;
		}

		setAlltreeList(parentItems);
	};

	const getSheduleContentList = async (courseId, contentId, value) => {
		try {
			const response = await axios.get(BASE_URL + `admin/course/fetchContent-public/${courseId}/${contentId}`, { withCredentials: false });
			if (response?.data?.errorCode === 0) {
				const filterCourseContent = response?.data?.contentList;
				if (value === 'first') setSheduleContentList(filterCourseContent);
				if (value === 'second') setSelectedSceduleList(filterCourseContent);
				if (value === 'third') {
					setSchedulePlans(filterCourseContent || []);
					await applyParentContentByMode(buildListFromFirstResponse(filterCourseContent || []), filterGroupSubject, courseId);
				}
				if (value === 'fourth') {
					setPlanList(filterCourseContent);
					setAlltreeList(filterCourseContent || []);
				}
				if (value === 'fifth') setAlltreeList(filterCourseContent || []);
			}
		} catch (requestError) {
			console.log(requestError);
		}
	};

	const handleSchedule = (event) => {
		const value = event.target.value;
		setSelectedSchedule(value);
		setSelectedAotherSchedule({});
		setSchedulePlans([]);
		setAlltreeList([]);
		getSheduleContentList(selectCourse?.id, value?.id, 'second');
	};

	const handleAnotherSchedule = (event) => {
		setSelectSubjectWise([]);
		setSelectedBasicPlan({});
		setSelectedForPlans({});
		setActiveBtn('both');
		const value = event.target.value;
		setSelectedAotherSchedule(value);
		getSheduleContentList(selectCourse?.id, value?.id, 'third');
	};

	useEffect(() => {
		if (!selectedSceduleList?.length || !selectCourse?.id) return;

		const hasSelected = selectedSceduleList.some((item) => item?.id === selectedAotherSchedule?.id);
		if (hasSelected) return;

		const firstActive = selectedSceduleList.find((item) => item?.active !== false) || selectedSceduleList[0];
		if (firstActive) {
			setSelectedAotherSchedule(firstActive);
			getSheduleContentList(selectCourse?.id, firstActive?.id, 'third');
		}
	}, [selectedSceduleList, selectCourse?.id]);

	useEffect(() => {
		if (!schedulePlans?.length || !selectCourse?.id || !selectedAotherSchedule?.id) return;

		const syncByMode = async () => {
			await applyParentContentByMode(schedulePlans, filterGroupSubject, selectCourse?.id);
		};

		syncByMode();
	}, [filterGroupSubject]);

	useEffect(() => {
		if (alltreeList?.length > 0) getPlans('both');
	}, [alltreeList]);

	useEffect(() => {
		getPlans(activeBtn);
	}, [selectSubjectWise, activeBtn]);

	function getPlans(selectBtnType) {
		let plans = [];
		const subjectTempList = [];
		const matchGroup = (groupTitle) => {
			if (selectBtnType === 'both') return groupTitle === 'Group 1' || groupTitle === 'Group 2';
			if (selectBtnType === 'group1') return groupTitle === 'Group 1';
			if (selectBtnType === 'group2') return groupTitle === 'Group 2';
			return false;
		};

		alltreeList.forEach((plan) => {
			if (plan?.__groupTitle) {
				if (matchGroup(plan.__groupTitle)) {
					plans.push(plan);
					if (plan?.title && !checkSubjectExists(subjectTempList, plan.title)) subjectTempList.push(plan);
				}
				return;
			}
			if (Array.isArray(plan?.children) && plan.children.length > 0) {
				let groupMatched = false;
				plan.children.forEach((group) => {
					if (matchGroup(group?.title)) {
						groupMatched = true;
						if (Array.isArray(group?.children)) {
							group.children.forEach((subject) => {
								if (!checkSubjectExists(subjectTempList, subject.title)) subjectTempList.push(subject);
							});
						}
					}
				});
				if (groupMatched) plans.push(plan);
				return;
			}
			if (matchGroup(plan?.title)) {
				plans.push(plan);
				return;
			}
			if (selectBtnType === 'both') plans.push(plan);
		});

		if (selectSubjectWise.length > 0) plans = filterPlansOnSelectedSubject(plans, selectSubjectWise);
		setSubjectWiseListRender(subjectTempList);
		setPlansList(plans);
	}

	function checkSubjectExists(subjectList, title) {
		let exists = false;
		subjectList.forEach((subject) => {
			if (subject.title === title) exists = true;
		});
		return exists;
	}

	function checkPlansExists(candidatePlans, title) {
		let exists = false;
		candidatePlans?.forEach((plan) => {
			if (plan.title === title) exists = true;
		});
		return exists;
	}

	function filterPlansOnSelectedSubject(plans, selectedSubjects) {
		const planListResult = [];
		plans?.forEach((plan) => {
			if (plan?.__groupTitle) {
				selectedSubjects?.forEach((selectedSubject) => {
					if (selectedSubject?.title === plan?.title && !checkPlansExists(planListResult, plan.title)) {
						planListResult.push(plan);
					}
				});
				return;
			}

			plan?.children?.forEach((group) => {
				if (Array.isArray(group?.children)) {
					group.children.forEach((subject) => {
						selectedSubjects?.forEach((selectedSubject) => {
							if (selectedSubject.title === subject.title && !checkPlansExists(planListResult, plan.title)) {
								planListResult.push(plan);
							}
						});
					});
				} else {
					selectedSubjects?.forEach((selectedSubject) => {
						if (selectedSubject.title === group?.title && !checkPlansExists(planListResult, plan.title)) {
							planListResult.push(plan);
						}
					});
				}
			});
		});
		return planListResult;
	}

	function filterSelectedSubjectListByGroup(group, sltSubject) {
		const selectedSubject = [];
		if (sltSubject?.length > 0) {
			sltSubject.forEach((subject) => {
				if (group?.children?.length > 0) {
					group.children.forEach((subjectGroup) => {
						if (subject?.title === subjectGroup?.title) selectedSubject.push(subjectGroup);
					});
				}
			});
		}
		return selectedSubject;
	}

	function filterSelectedSubjectListByPlan(plan, sltSubject) {
		const selectedSubject = [];
		if (sltSubject?.length > 0) {
			sltSubject.forEach((subject) => {
				(plan?.children || []).forEach((group) => {
					if (group?.children?.length > 0) {
						group.children.forEach((subjectGroup) => {
							if (subject?.title === subjectGroup?.title) selectedSubject.push(subjectGroup);
						});
					} else if (subject?.title === group?.title) {
						selectedSubject.push(group);
					}
				});
			});
		}
		return selectedSubject;
	}

	function getPlanPrice(plan, selectedGroup, sltSubject) {
		let price = 0;
		let finalPrice = 0;
		let entityId = [];
		let thumbLogo = '';
		if (selectedGroup === 'both') {
			let totalSubject = 0;
			const selectedSubject = filterSelectedSubjectListByPlan(plan, sltSubject);
			plan?.children?.forEach((group) => {
				if (group?.children?.length > 0) group.children.forEach(() => { totalSubject += 1; });
			});
			if (selectedSubject.length === totalSubject || selectedSubject.length === 0) {
				price = plan?.price;
				thumbLogo = plan?.description?.thumb;
				finalPrice += plan?.price - plan?.price / 100 * plan?.discount;
				entityId.push({ purchaseType: 'courseContent', entityId: plan?.entityId });
			} else {
				plan?.children?.forEach((group) => {
					let allSubjectSelectOfGroup = false;
					let groupSelectedSubject = 0;
					const selectedOfGroup = [];
					group?.children?.forEach((subject) => {
						if (selectedSubject?.length > 0) {
							selectedSubject.forEach((selectedSubjectItem) => {
								totalSubject += 1;
								if (subject?.title === selectedSubjectItem?.title) {
									selectedOfGroup.push(selectedSubjectItem);
									groupSelectedSubject += 1;
									if (groupSelectedSubject === group?.children?.length) allSubjectSelectOfGroup = true;
								}
							});
						}
					});
					if (allSubjectSelectOfGroup && groupSelectedSubject > 0) {
						price += group?.price;
						finalPrice += group?.price - group?.price / 100 * group?.discount;
						thumbLogo = selectedOfGroup[0]?.description?.thumb;
						entityId.push({ purchaseType: 'courseContent', entityId: group?.entityId });
					} else {
						selectedOfGroup.forEach((selectedSubjectItem) => {
							price += selectedSubjectItem?.price;
							finalPrice += selectedSubjectItem?.price - selectedSubjectItem?.price / 100 * selectedSubjectItem?.discount;
							thumbLogo = selectedOfGroup[0]?.description?.thumb;
							entityId.push({ purchaseType: 'courseContent', entityId: selectedSubjectItem?.entityId });
						});
					}
				});
			}
		} else if (selectedGroup === 'group1') {
			if (plan?.children?.length > 0) {
				plan.children.forEach((group) => {
					if (group?.title === 'Group 1') {
						price = group?.price;
						thumbLogo = group?.description?.thumb;
						finalPrice += group?.price - group?.price / 100 * group?.discount;
						entityId.push({ purchaseType: 'courseContent', entityId: group?.entityId });
						const selectedSubject = filterSelectedSubjectListByGroup(group, sltSubject);
						if (selectedSubject?.length > 0 && selectedSubject.length !== group.children.length) {
							price = 0;
							finalPrice = 0;
							entityId = [];
							selectedSubject.forEach((selectedSubjectItem) => {
								price += selectedSubjectItem?.price;
								finalPrice += selectedSubjectItem?.price - selectedSubjectItem?.price / 100 * selectedSubjectItem?.discount;
								entityId.push({ purchaseType: 'courseContent', entityId: selectedSubjectItem?.entityId });
							});
						}
					}
				});
			} else if (plan?.title === 'Group 1') {
				price = plan?.price;
				thumbLogo = plan?.description?.thumb;
				finalPrice += plan?.price - plan?.price / 100 * plan?.discount;
				entityId.push({ purchaseType: 'courseContent', entityId: plan?.entityId });
			}
		} else if (selectedGroup === 'group2') {
			if (plan?.children?.length > 0) {
				plan.children.forEach((group) => {
					if (group?.title === 'Group 2') {
						price = group?.price;
						thumbLogo = group?.description?.thumb;
						finalPrice += group?.price - group?.price / 100 * group?.discount;
						entityId.push({ purchaseType: 'courseContent', entityId: group?.entityId });
						const selectedSubject = filterSelectedSubjectListByGroup(group, sltSubject);
						if (selectedSubject?.length > 0 && selectedSubject.length !== group.children.length) {
							price = 0;
							entityId = [];
							finalPrice = 0;
							selectedSubject.forEach((selectedSubjectItem) => {
								price += selectedSubjectItem?.price;
								finalPrice += selectedSubjectItem?.price - selectedSubjectItem?.price / 100 * selectedSubjectItem?.discount;
								entityId.push({ purchaseType: 'courseContent', entityId: selectedSubjectItem?.entityId });
							});
						}
					}
				});
			} else if (plan?.title === 'Group 2') {
				price = plan?.price;
				thumbLogo = plan?.description?.thumb;
				finalPrice += plan?.price - plan?.price / 100 * plan?.discount;
				entityId.push({ purchaseType: 'courseContent', entityId: plan?.entityId });
			}
		}
		const discount = price - finalPrice;
		const percent = discount > 0 ? ((discount / price) * 100).toFixed(2) : 0;
		return { price, finalPrice, entityId, thumbLogo, discount, percent };
	}

	const getTagsList = async () => {
		try {
			const response = await axios.get(BASE_URL + 'admin/course/fetch-tags-public/' + instId, { withCredentials: false });
			if (response?.data?.errorCode === 0) {
				setTagsList(response?.data?.tags);
				const selectedSeriesByTitle = response?.data?.tags;
				setSelectedTag(selectedSeriesByTitle[0]);
			}
		} catch (requestError) {
			console.log(requestError);
		}
	};

	const getCourseList = async () => {
		try {
			const response = await axios.get(BASE_URL + 'admin/course/fetch-public/' + instId, { withCredentials: false });
			if (response?.data?.errorCode === 0) setCourse(response?.data?.courses);
		} catch (requestError) {
			console.log(requestError);
		}
	};

	const fetchDripContent = async (scheduleId) => {
		try {
			const response = await axios.get(BASE_URL + `/admin/content/fetch-drip-content/${scheduleId}`, { withCredentials: false });
			if (response?.data?.errorCode === 0) {
				setAlltreeList(response?.data?.content ? response?.data?.content : response?.data?.contentList);
				updateCartAndPurchaseArrays(response?.data?.content, cartArray);
			}
		} catch (requestError) {
			console.log(requestError);
		}
	};

	const getAllCoursesPublic = async () => {
		try {
			const response = await axios.get(BASE_URL + 'admin/course/fetch/' + selectCourse?.setting?.orderBumpCourse, { withCredentials: false });
			if (response?.data?.errorCode === 0) setCoursesPublic(response?.data?.course);
		} catch (requestError) {
			console.log(requestError);
		}
	};

	const getInstituteDetail = async () => {
		try {
			const response = await axios.get(BASE_URL + '/getMetaData/fetch-institute/' + instId, { withCredentials: false });
			if (response?.data?.errorCode === 0) setEndpoints(response?.data?.instituteTechSetting?.mediaUrl);
		} catch (requestError) {
			console.log(requestError);
		}
	};

	const isStepSkipped = (step) => skipped.has(step);
	const totalSteps = () => steps.length;
	const completedSteps = () => Object.keys(completed).length;
	const isLastStep = () => activeStep === totalSteps() - 1;
	const allStepsCompleted = () => completedSteps() === totalSteps();

	const handleBack = () => {
		setPeviewImgVideo({});
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	};

	useEffect(() => {
		localStorage.setItem('addedCartPlans', JSON.stringify(addedCartPlans));
		localStorage.setItem('addtoCartIds', JSON.stringify(addtoCartIds));
		localStorage.setItem('selectCourse', JSON.stringify(selectCourse));
	}, [addedCartPlans, purchaseArray, addtoCartIds, selectCourse]);

	const handleEnrollNow = (item) => {
		const id = item.id;
		const isSelected = cartArray.some((cartItem) => cartItem.plan.id === id);
		if (isSelected) {
			const updatedCartArray = cartArray.filter((cartItem) => cartItem.plan.id !== id);
			setCartArray(updatedCartArray);
			localStorage.setItem('cartArray', JSON.stringify(updatedCartArray));
			if (typeof cartNumberUpdate === 'function') cartNumberUpdate();
		} else {
			const obj = { group: activeBtn, subject: selectSubjectWise, plan: item };
			const updatedCartArray = [...cartArray, obj];
			setCartArray(updatedCartArray);
			localStorage.setItem('cartArray', JSON.stringify(updatedCartArray));
			if (typeof cartNumberUpdate === 'function') cartNumberUpdate();
		}
	};

	const handleShowCart = () => {
		const newActiveStep = isLastStep() && !allStepsCompleted() ? steps.findIndex((step, i) => !(i in completed)) : activeStep + 1;
		handleNextBrowse();
		setActiveStep(newActiveStep);
		window.scrollTo(0, 0);
	};

	const handleAddToCard = () => {
		if (courseContentList?.length > 1) {
			setOpenScheduleModal(true);
		} else {
			const newActiveStep = isLastStep() && !allStepsCompleted() ? steps.findIndex((step, i) => !(i in completed)) : activeStep + 1;
			handleNextBrowse();
			setActiveStep(newActiveStep);
			getAllCoursesPublic();
		}
	};

	const handleCheckoutSubmit = () => {
		const newActiveStep = isLastStep() && !allStepsCompleted() ? steps.findIndex((step, i) => !(i in completed)) : activeStep + 1;
		handleNextBrowse();
		setActiveStep(newActiveStep);
		getAllCoursesPublic();
		setOpenScheduleModal(false);
	};

	const handleAddCourse = (item) => {
		const coursePrice = Number(item?.price) - Number(item?.price) * (Number(item.discount) / 100);
		const id = item.id;
		const purchaseObject = { purchaseType: 'course', entityId: id };
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
		setPurchaseArray([]);
		setPeviewImgVideo({});
		setPlansList([]);
		setAddedCartPlans([]);
		setAddtoCartIds([]);
		setPurchaseArray([]);
		setSelectedIds([]);
		setSelectSubjectWise([]);
		setActiveStep(0);
		const courseId = event?.target?.value?.id;
		setSelectCourse(event.target.value);
		getCourseContentList(courseId);
	};

	const handleTags = (event) => {
		setPeviewImgVideo({});
		setSelectCourse('');
		setActiveStep(0);
		setSelectedTag(event.target.value);
		getCourseList();
	};

	const handleChange = (event) => {
		const selectedValue = event.target.value;
		const selectedObject = courseContentList.find((item) => item.title === selectedValue?.title) || selectedValue;
		setSelectShedule(selectedValue);
		getSheduleContentList(selectCourse?.id, selectedObject?.id, 'first');
	};

	const handleButtonClick = (value) => {
		setSelectSubjectWise([]);
		setActiveStep(0);
		setActiveBtn(value);
		getPlans(value);
	};

	const handleSubjectWise = (event) => {
		const { target: { value } } = event;
		setSelectSubjectWise(typeof value === 'string' ? value.split(',') : value);
	};

	const handleSubmit = async () => {
		const body = {
			firstName: title,
			lastName: title,
			contact: number,
			email,
			campaignId,
			instId: instId,
			entityModals: purchaseArray,
			coupon: isCouponValid === true ? couponNumber : null,
		};
		try {
			const response = await axios.post(BASE_URL + '/admin/payment/fetch-public-checkout-url', body);
			if (response?.data?.status === true) {
				const width = 480;
				const height = 1080;
				const left = window.screenX + window.outerWidth / 2 - width / 2;
				const top = window.screenY + window.outerHeight / 2 - height / 2;
				window.open(response?.data?.url, 'sharer', `location=no,width=${width},height=${height},top=${top},left=${left}`);
				setTitle('');
				setNumber('');
				setEmail('');
				setCartArray([]);
				localStorage.setItem('cartArray', JSON.stringify([]));
			}
			const newActiveStep = isLastStep() && !allStepsCompleted() ? steps.findIndex((step, i) => !(i in completed)) : activeStep + 1;
			setActiveStep(newActiveStep);
			if (typeof cartNumberUpdate === 'function') cartNumberUpdate();
		} catch (requestError) {
			console.log(requestError);
		}
	};

	const handleCheckboxChange = () => {
		setChecked(!checked);
		if (!checked) {
			setPurchaseArray((prevArray) => [...prevArray, { purchaseType: 'course', entityId: Number(orderBumpCourse?.id) }]);
		} else {
			setPurchaseArray((prevArray) => prevArray.filter((item) => item.entityId !== Number(orderBumpCourse?.id)));
		}
	};

	const handleViewPlan = () => setViewPlanModal(true);
	const handleRemoveItem = (item, i) => {
		const temp = [];
		cartArray.forEach((entry, x) => {
			if (x !== i) temp.push(entry);
		});
		setCartArray(temp);
		localStorage.setItem('cartArray', JSON.stringify(temp));
		if (temp?.length === 0) setActiveStep(0);
		if (typeof cartNumberUpdate === 'function') cartNumberUpdate();
	};

	const toggleExpandDescription = (des) => {
		setFullDes(des);
		setCourseExpandedDescriptions(true);
	};

	const truncateDescription = (description) => stripHtml(description).split(/\s+/).slice(0, 10).join(' ');
	const chipTitle = (titleValue) => titleValue.split(' ').slice(0, 3).join(' ');
	const handleSelectSub = () => setActiveBtn('both');

	const handleNumberChange = (event) => {
		const value = event.target.value;
		if (/^\d*$/.test(value) && value.length <= 10) {
			setNumber(value);
			setError('');
			if (value.length < 10) setError('Number must be 10 digits long');
		}
	};

	const handleFilter = (value) => {
		setSelectSubjectWise([]);
		setActiveBtn('both');
		setFilterGroupSubject(value);
	};

	const handleCheckCoupon = async (event) => {
		event.preventDefault();
		const body = {
			getCheckoutUrls: purchaseArray,
			coupon: couponNumber,
			contact: Number(number),
			instId: instId,
			amount: checked ? orderBumpCourse.price - orderBumpCourse.price / 100 * orderBumpCourse.discount + totalPrice : totalPrice,
		};
		try {
			const response = await axios.post(BASE_URL + '/student/coupon/verify', body);
			if (response.data.errorCode === 0) {
				setCouponDiscount(response.data?.discount);
				setIsCouponValid(response.data?.valid);
				setErrorMessage('');
			} else {
				setIsCouponValid(response.data?.valid === null ? false : response.data?.valid);
				setErrorMessage(response.data?.message ? response.data?.message : 'Invalid Coupon Code');
				setCouponDiscount(0);
			}
		} catch (requestError) {
			console.log(requestError);
		}
	};

	const handleCoupon = (event) => {
		setCouponNumber(event.target.value);
		setErrorMessage('');
		setIsCouponValid(null);
	};

	const getColor = () => {
		if (isCouponValid === null) return 'darkblue';
		return isCouponValid ? '#329908' : 'red';
	};

	const handleReedemCode = () => setReedemCode(!reedemCode);
	const handleSchedulePopUp = () => setImageSchedule(true);

	const mergePDFs = async (url1, url2) => {
		try {
			const [pdf1Response, pdf2Response] = await Promise.all([fetch(url1), fetch(url2)]);
			const [pdf1ArrayBuffer, pdf2ArrayBuffer] = await Promise.all([pdf1Response.arrayBuffer(), pdf2Response.arrayBuffer()]);
			const pdf1 = await PDFDocument.load(pdf1ArrayBuffer);
			const pdf2 = await PDFDocument.load(pdf2ArrayBuffer);
			const mergedPdf = await PDFDocument.create();
			const pages1 = await mergedPdf.copyPages(pdf1, pdf1.getPageIndices());
			pages1.forEach((page) => mergedPdf.addPage(page));
			const pages2 = await mergedPdf.copyPages(pdf2, pdf2.getPageIndices());
			pages2.forEach((page) => mergedPdf.addPage(page));
			const mergedPdfBytes = await mergedPdf.save();
			const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
			const blobUrl = URL.createObjectURL(blob);
			window.open(blobUrl, '_blank', 'noreferrer');
			setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
		} catch (requestError) {
			console.error('Error merging PDFs:', requestError);
			alert('Failed to merge PDFs. Please try again.');
		}
	};

	const handleSubjectView = () => {
		if (selectedBasicPlan?.title === 'Cumulative') {
			window.open('https://classio.in-maa-1.linodeobjects.com/Cumulative%20pattern%20Syllabus%20CAI%20for%20PDF%20%20(2)%20(1).pdf', '_blank', 'noreferrer');
		} else if (selectedBasicPlan?.title === 'Exclusive') {
			window.open('https://classio.in-maa-1.linodeobjects.com/Exlusive%20Pattern%20Syllabus%20CAI%20for%20PDF%20%20(1).pdf', '_blank', 'noreferrer');
		} else if (selectedAotherSchedule?.title === 'Portion WiseTest Series' && selectCourse?.title === 'CA Final') {
			window.open('https://classio.in-maa-1.linodeobjects.com/final%20syllabus%20.pdf', '_blank', 'noreferrer');
		} else if (selectedAotherSchedule?.title === 'Exam oriented Test Series' && selectCourse?.title === 'CA Inter') {
			mergePDFs('https://classio.in-maa-1.linodeobjects.com/ExamOrientedTestSyllabusGroup1.pdf', 'https://classio.in-maa-1.linodeobjects.com/ExamOrientedTestSyllabusGroup2.pdf');
		}
	};

	const handleCloseSchedule = () => setImageSchedule(false);
	const handleWindowStore = () => window.open('https://apps.microsoft.com/detail/9PG3KXKV4XKM?hl=en-us&gl=IN&ocid=pdpshare', '_blank', 'noreferrer');
	const handlePlayStore = () => window.open('https://play.google.com/store/apps/details?id=com.classiolabs.percept&pcampaignid=web_share', '_blank', 'noreferrer');

	return (
		<Layout>
			<Box id="testseries" sx={{ width: '100%', maxWidth: '100vw', margin: { xs: '20px 0', sm: '40px' }, textAlign: 'left', overflow: 'hidden', overflowX: 'hidden', px: { xs: 2, sm: 3 }, boxSizing: 'border-box', '@media (min-width: 768px)': { maxWidth: '100vw', overflow: 'hidden', margin: '40px auto', px: 6 }, '@media (min-width: 1024px)': { px: 8 }, '@media (min-width: 1200px)': { px: 12 } }}>
				<Box sx={{ width: '100%', maxWidth: '100%', overflow: 'hidden', boxSizing: 'border-box' }}>
					<Box sx={{ width: '100%', overflow: 'hidden', boxSizing: 'border-box' }}>
						<Box sx={{ display: 'flex', flexDirection: 'row', pb: 2, mt: 3 }}>
							<Button color="inherit" onClick={handleBack} sx={{ mr: 1, fontWeight: 'bold', fontSize: '14px' }}>
								<ArrowBackIcon /> &nbsp; Back
							</Button>
							<Box sx={{ flex: '1 1 auto' }} />
						</Box>

						<div>
							<h2 className="mobile-text-high" style={{ textTransform: 'initial', display: 'flex', flexWrap: 'wrap', alignItems: 'center', textAlign: 'left', fontWeight: 'bold', marginBottom: '15px', justifyContent: 'left', color: '#0F172A', fontSize: 'clamp(1.5rem, 6vw, 2.5rem)', letterSpacing: '-0.02em', position: 'relative', paddingX: '12px' }}>
								MyEduNeeds
								<span style={{ color: modernColors.primary.main, marginLeft: '8px', marginRight: '8px', fontWeight: '800' }}>Test Series</span>
								Enrollment
							</h2>
							<p style={{ marginBottom: '24px', fontSize: 'clamp(1rem, 3.5vw, 1.3rem)', color: '#475569', fontWeight: '500', paddingX: '12px' }}>
								Choose your schedule, review your plans, and complete enrollment in the same flow.
							</p>
						</div>

						<Grid container sx={{ pt: 2, width: '100%', maxWidth: '100%', overflow: 'hidden', boxSizing: 'border-box', '@media (min-width: 768px)': { maxWidth: '100%', overflow: 'hidden' } }}>
							<Grid item xs={12} sm={8} md={8} lg={8}>
								<Box sx={{ width: '100%', maxWidth: '100%', overflow: 'visible', pb: { xs: 1, sm: 0 } }}>
									<Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} className="stack-mobile" sx={{ width: '100%', flexWrap: 'wrap', alignItems: { xs: 'stretch', sm: 'flex-start' } }}>
										{activeStep === 0 && (
											<>
												{courseContentList?.length > 1 && (
													<FormControl className="mobile-select-button" sx={{ width: { xs: '100%', sm: 'auto' }, maxWidth: { xs: '100%', sm: '300px' }, minWidth: { xs: '100%', sm: '200px' }, flex: { xs: '1 1 auto', sm: '0 0 auto' }, '& .MuiOutlinedInput-root': { background: '#fff', borderRadius: '16px', boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', width: '100%', '&:hover': { boxShadow: '0 12px 32px rgba(15, 23, 42, 0.12)', transform: 'translateY(-2px)', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(212, 175, 55, 0.55)' } }, '&.Mui-focused': { '& .MuiOutlinedInput-notchedOutline': { borderColor: modernColors.primary.main, borderWidth: '2px' } } }, '& .MuiInputLabel-root': { color: '#475569', fontWeight: 600 }, '& .MuiInputLabel-root.Mui-focused': { color: modernColors.primary.dark } }}>
														<InputLabel id="schedule-select-label" sx={{ fontSize: { xs: '14px', sm: '15px' }, fontWeight: 600 }}>
															Select Schedule
														</InputLabel>
														<Select className="select-option" sx={{ mb: 2, width: '100%', maxWidth: '100%', fontSize: { xs: '13px', sm: '14px' } }} labelId="schedule-select-label" id="schedule-select" renderValue={(val) => <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>{val?.title}</div>} value={selectedSchedule} label="Select Schedule" onChange={handleSchedule}>
															{courseContentList && courseContentList.map((entry, index) => entry?.active === true ? <MenuItem key={index} value={entry}>{entry?.title}</MenuItem> : null)}
														</Select>
													</FormControl>
												)}

															{selectedSceduleList?.length > 0 && (
																<FormControl className="mobile-select-button" sx={{ width: { xs: '100%', sm: 'auto' }, maxWidth: { xs: '100%', sm: '340px' }, minWidth: { xs: '100%', sm: '220px' }, flex: { xs: '1 1 auto', sm: '0 0 auto' } }}>
																	<InputLabel id="portion-type-select-label" sx={{ fontSize: { xs: '14px', sm: '15px' }, fontWeight: 600 }}>
																		Select Portion Type
																	</InputLabel>
																	<Select
																		className="select-option"
																		sx={{ mb: 2, width: '100%', maxWidth: '100%', fontSize: { xs: '13px', sm: '14px' } }}
																		labelId="portion-type-select-label"
																		id="portion-type-select"
																		renderValue={(val) => <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>{val?.title}</div>}
																		value={selectedAotherSchedule}
																		label="Select Portion Type"
																		onChange={handleAnotherSchedule}
																	>
																		{selectedSceduleList.map((entry, index) => (
																			<MenuItem key={index} value={entry}>{entry?.title}</MenuItem>
																		))}
																	</Select>
																</FormControl>
															)}
											</>
										)}
									</Stack>
								</Box>
							</Grid>
						</Grid>

						<Box sx={{ width: '100%', maxWidth: '100%', mb: 3, overflow: 'hidden', boxSizing: 'border-box' }}>
							<ModernStepper activeStep={activeStep} connector={<ModernStepConnector />}>
								{steps.map((label, index) => {
									const stepProps = {};
									const labelProps = {};
									if (isStepSkipped(index)) stepProps.completed = false;
									return (
										<Step key={label} {...stepProps}>
											<StepLabel {...labelProps} StepIconComponent={(props) => <ModernStepIcon {...props} icon={index + 1} />}>
												<Typography variant="body2" fontWeight={600} sx={{ fontSize: { xs: '0.75rem', sm: '1rem', md: '1rem' }, color: activeStep === index ? modernColors.primary.main : modernColors.neutral.gray, transition: 'color 0.3s ease', whiteSpace: 'nowrap' }}>
													{label}
												</Typography>
											</StepLabel>
										</Step>
									);
								})}
							</ModernStepper>
						</Box>

						{activeStep === 0 && selectedAotherSchedule?.id && (
							<Grid item xs={12} sm={12} md={12} lg={12}>
								<Box sx={{ mt: 2, ml: 1, display: 'flex', gap: 2, flexWrap: 'wrap' }} className="filter-btn">
									<Button
										onClick={() => handleFilter('group')}
										sx={{
													background: filterGroupSubject === 'group' ? modernColors.primary.main : '#fff',
													color: filterGroupSubject === 'group' ? '#fff' : modernColors.primary.dark,
											fontWeight: 'bold',
													border: `1px solid ${filterGroupSubject === 'group' ? modernColors.primary.main : 'rgba(212, 175, 55, 0.35)'}`,
											fontSize: '13px',
											padding: '10px 14px',
											borderRadius: '8px',
										}}
									>
										Group Wise
									</Button>
									<Button
										onClick={() => handleFilter('subject')}
										sx={{
													background: filterGroupSubject === 'subject' ? modernColors.primary.main : '#fff',
													color: filterGroupSubject === 'subject' ? '#fff' : modernColors.primary.dark,
											fontWeight: 'bold',
													border: `1px solid ${filterGroupSubject === 'subject' ? modernColors.primary.main : 'rgba(212, 175, 55, 0.35)'}`,
											fontSize: '13px',
											padding: '10px 14px',
											borderRadius: '8px',
										}}
									>
										Subject Wise
									</Button>
								</Box>
							</Grid>
						)}

						<div>
							{allStepsCompleted() ? (
								<React.Fragment>
									<Typography sx={{ mt: 2, mb: 1 }}>All steps completed - you&apos;re finished</Typography>
								</React.Fragment>
							) : (
								<React.Fragment>
									{activeStep === 0 && schedule?.id && (
										<Typography sx={{ mb: 1, py: 1 }}>
											{cartArray?.length > 0 && (
												<Box sx={{ textAlign: 'right' }}>
													<ModernCheckoutButton disabled={cartArray?.length === 0} onClick={handleShowCart} className="button-hover mobile-view-checkout" startIcon={<ArrowForwardIcon />} sx={{ fontSize: '14px', padding: '12px 20px', background: modernColors.secondary.gradient }}>
														Go to Cart Details
													</ModernCheckoutButton>
												</Box>
											)}
											{selectCourse?.id && (
												<div className="react-multi-carousel-list">
													<Box sx={{ py: 2, width: '100%', maxWidth: '100%' }}>
														<Grid container spacing={3} display="flex" justifyContent={['center', 'start']}>
															{plansList && plansList.map((item, i) => {
																const object = getPlanPrice(item, activeBtn, selectSubjectWise);
																const logo = object?.thumbLogo;
																		const itemThumb = item?.description?.thumb || logo;
																const price = object?.price;
																const fullDescription = item?.description?.description || '';
																const isAdded = cartArray.some((cartItem) => cartItem.plan.id === item.id);

																return (
																	<Grid item xs={12} sm={6} md={4} lg={3} key={item.id || i}>
																		<Fade in timeout={600 + i * 100}>
																			<ModernPlanCard onClick={() => handleEnrollNow(item)}>
																								<ModernPlanImage image={itemThumb ? Endpoints + itemThumb : 'img/folder-2.png'} title={item?.title} />
																				<CardContent sx={{ px: { xs: 1, sm: 1.5, md: 2 }, pt: { xs: 1, sm: 1.5, md: 2 }, pb: { xs: 1, sm: 1.5, md: 2 } }}>
																					<ModernPlanTitle variant="h6">{item?.title}</ModernPlanTitle>
																					<Typography variant="body2" sx={{ color: modernColors.neutral.gray, mb: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textAlign: 'center', fontSize: '13px', lineHeight: '1.4' }}>
																						<div className="description text-md text-slate-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: fullDescription }} />
																					</Typography>

																					{selectSubjectWise?.length > 0 && (
																						<Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 0.5 }}>
																							{selectSubjectWise.slice(0, 3).map((chipLabel, idx) => <ModernChip key={idx} size="small" label={chipTitle(chipLabel?.title)} chipcolor="accent" />)}
																							{selectSubjectWise.length > 3 && <ModernChip size="small" label={`+${selectSubjectWise.length - 3}`} chipcolor="primary" />}
																						</Box>
																					)}

																					<ModernPriceContainer>
																						{item.paid ? (
																							object.percent > 0 ? (
																								<Box sx={{ textAlign: 'center' }}>
																									<ModernPrice>₹{object?.finalPrice.toFixed(0)}</ModernPrice>
																									<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 0.5 }}>
																										<ModernOriginalPrice>₹{price}</ModernOriginalPrice>
																										<ModernDiscountBadge label={`${Math.round(object.percent)}% OFF`} size="small" />
																									</Box>
																								</Box>
																							) : <ModernPrice>₹{price}</ModernPrice>
																						) : (
																							<Typography variant="h6" sx={{ color: modernColors.secondary.main, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}><VerifiedIcon fontSize="small" />FREE</Typography>
																						)}
																					</ModernPriceContainer>
																				</CardContent>
																				<CardActions sx={{ p: { xs: 1, sm: 1.5, md: 2 }, pt: { xs: 0.5, sm: 1, md: 1 } }}>
																					<ModernAddButton isAdded={isAdded} onClick={(event) => { event.stopPropagation(); handleEnrollNow(item); }} startIcon={isAdded ? <CheckCircleRoundedIcon sx={{ fontSize: { xs: '18px', sm: '20px' } }} /> : <AddCircleIcon sx={{ fontSize: { xs: '18px', sm: '20px' } }} />}>
																						{isAdded ? 'Added to Cart' : 'Add to Cart'}
																					</ModernAddButton>
																				</CardActions>
																			</ModernPlanCard>
																		</Fade>
																	</Grid>
																);
															})}
														</Grid>
													</Box>
												</div>
											)}
										</Typography>
									)}

									{activeStep === 1 && (
										<Typography sx={{ mt: 3, mb: 3, py: 1 }}>
											<Grid container sx={{ borderBottom: '1px solid rgba(128, 128, 128, 0.1)', background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%)', borderRadius: '24px 24px 0 0', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.2)', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)', overflow: 'hidden', position: 'relative' }}>
												<Grid item xs={12} sm={9.5} md={9.5} lg={9.5} sx={{ padding: '24px', position: 'relative', zIndex: 1 }}>
													<Typography variant="h5" sx={{ fontWeight: '800', mb: 3, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '12px' }}>
														Your Selected Items
													</Typography>
													<Grid container>
														{cartArray?.length > 0 && cartArray?.map((item, i) => {
															const object = getPlanPrice(item.plan, item.group, item.subject);
															const subjects = item.subject;
															const logo = object?.thumbLogo;
															const price = object?.price;
															const finalPrices = object?.finalPrice === 0 ? Number(price) - Number(price / 100) * Number(item?.plan?.discount) : object?.finalPrice;
															const discount = 100 - finalPrices / price * 100;
															const details = item.plan;
															const fullDescription = details?.description?.description || '';
															return (
																<Grid item xs={12} sm={12} md={12} lg={12} key={i} sx={{ position: 'relative', mb: 3 }}>
																	<Box sx={{ background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '24px', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)', padding: '24px' }}>
																		<Grid container spacing={3}>
																			<Grid item xs={12} sm={4} md={4} lg={4}>
																				<Box sx={{ background: 'rgba(212, 175, 55, 0.08)', borderRadius: '20px', display: 'flex', justifyContent: 'center', padding: '16px', border: '1px solid rgba(212, 175, 55, 0.16)', mb: 2 }}>
																					<img src={subjects?.length > 0 ? Endpoints + subjects[0]?.description?.thumb : logo ? Endpoints + logo : 'img/folder-2.png'} style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '12px' }} alt="Course Preview" className="mobile-view-image" />
																				</Box>
																			</Grid>
																			<Grid item xs={12} sm={8} md={8} lg={8}>
																				<Typography variant="h5" sx={{ fontWeight: '800', color: '#2d3748', mb: 2, fontSize: { xs: '1.25rem', md: '1.5rem' } }}>{details?.title}</Typography>
																				<Box sx={{ textAlign: 'left', mb: 2, display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
																					{item.subject?.length > 0 && item.subject.map((chipLebel, idx) => <Chip size="small" label={chipTitle(chipLebel?.title)} variant="outlined" key={idx} sx={{ background: 'rgba(212, 175, 55, 0.12)', color: modernColors.primary.dark, fontWeight: '700', fontSize: '12px', border: '1px solid rgba(212, 175, 55, 0.35)', borderRadius: '12px' }} />)}
																				</Box>
																				<Box sx={{ mb: 2 }}>
																					{details?.paid ? (
																						<Box>
																							{discount > 0 ? <Typography sx={{ fontWeight: '800', fontSize: '18px', color: modernColors.primary.dark }}>Price: ₹{object?.finalPrice.toFixed(2)}</Typography> : <Typography sx={{ fontWeight: '800', fontSize: '18px', color: modernColors.primary.dark }}>Price: ₹{price?.toFixed(2)}</Typography>}
																						</Box>
																					) : <Typography sx={{ fontWeight: '800', fontSize: '18px', color: modernColors.success.main }}>Free Course</Typography>}
																				</Box>
																				<Typography variant="body1" sx={{ color: '#4a5568', lineHeight: '1.6', mb: 2, fontSize: '14px' }} className="mobile-view-discrip">
																					{truncateDescription(fullDescription)}
																					{fullDescription.length > 100 && <span style={{ color: modernColors.primary.dark, cursor: 'pointer', marginLeft: '8px', textDecoration: 'underline', fontWeight: '600' }} onClick={() => toggleExpandDescription(fullDescription)}>Read more</span>}
																				</Typography>
																				<Typography variant="body1" sx={{ color: '#4a5568', lineHeight: '1.6', mb: 2 }} className="desktop-view-discrip">{stripHtml(details?.description?.description || '')}</Typography>
																				<Button onClick={() => handleRemoveItem(item, i)} sx={{ textTransform: 'none', fontSize: '14px', fontWeight: '600', color: '#e53e3e', background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '12px', padding: '8px 16px' }}>🗑️ Remove from Cart</Button>
																			</Grid>
																		</Grid>
																	</Box>
																</Grid>
															);
														})}
													</Grid>
												</Grid>
												<Grid item xs={12} sm={2.5} md={2.5} lg={2.5}>
													{suggestedCourse?.length > 0 && (
														<>
															<Typography variant="h5" fontWeight="bold" ml={3} mb={1} mt={3} sx={{ fontSize: '1.5rem' }} className="mobile-suggested mobile-plan-box">Suggested Course</Typography>
															<Carousel swipeable draggable showDots responsive={responsive} ssr infinite autoPlaySpeed={1000} keyBoardControl customTransition="all .5" transitionDuration={500} containerClass="carousel-container" removeArrowOnDeviceType={['tablet', 'mobile']} dotListClass="custom-dot-list-style" itemClass="carousel-item-padding-40-px">
																{suggestedCourse.map((courseItem, id) => (
																	<Grid key={id} container sx={{ justifyContent: 'center', alignItems: 'center', marginBottom: 2 }}>
																		<Grid item xs={12} sm={2.4} md={2.4} lg={2.4} sx={{ padding: '5px', textAlign: 'left' }}>
																			<Box sx={{ boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px' }}>
																				<img src={Endpoints + courseItem.logo} alt="cardthumbimage" style={{ width: '100%', height: '125px' }} />
																				<Stack gap="0.5rem" pl="1rem" pr="1rem">
																					<Stack direction="row" justifyContent="space-between" alignItems="center" textAlign="left">
																						<p style={{ width: '100%', fontWeight: 'bold', margin: 0 }}>{courseItem.title}</p>
																					</Stack>
																					{courseItem.paid ? (courseItem.discount > 0 ? <p style={{ fontWeight: 'bold', color: '#f59f00', display: 'flex', fontSize: '11px', margin: 0 }}><p>{Number(courseItem.price) - Number(courseItem.price) * (Number(courseItem.discount) / 100)}/-</p><p style={{ color: '#e5dfdf' }}>&nbsp; <s>{courseItem.price}/-</s> &nbsp;{courseItem.discount}%</p></p> : <p style={{ fontWeight: 'bold', color: '#f59f00' }}>{courseItem.price}/-</p>) : <p style={{ fontWeight: 'bold', fontSize: '11px' }}>Free</p>}
																				</Stack>
																				<Box sx={{ textAlign: 'right' }}>
																					<Button startIcon={selectedIds.includes(courseItem?.id) ? <CheckCircleRoundedIcon /> : <AddCircleIcon fontSize="40px" />} onClick={() => handleAddCourse(courseItem)}>{selectedIds.includes(courseItem?.id) ? 'Added' : 'Add to cart'}</Button>
																				</Box>
																			</Box>
																		</Grid>
																	</Grid>
																))}
															</Carousel>
														</>
													)}
												</Grid>
											</Grid>
											<Grid container display="flex" justifyContent="end" mt={1}>
												<Grid item xs={12} sm={12} md={12} lg={12}>
													<Box sx={{ textAlign: 'right', mb: 3 }} className="desktop-plan-box desktop-view-checkout">
															<ModernCheckoutButton onClick={handleCheckoutSubmit} className="button-hover mobile-buy-now">
																Proceed to Checkout
															<span style={{ textTransform: 'initial', color: '#fbff00', padding: 0, margin: 0 }}>&nbsp;&nbsp;₹{totalPrice.toFixed(0)}</span>
														</ModernCheckoutButton>
													</Box>
												</Grid>
											</Grid>
										</Typography>
									)}

									{activeStep === 2 && (
										<Typography sx={{ mt: 3, mb: 1, py: 1 }}>
												<Card sx={{ width: '100%', maxWidth: 680, mx: 'auto', background: '#fff', border: '1px solid #E2E8F0', borderRadius: '20px', boxShadow: '0 12px 32px rgba(15, 23, 42, 0.08)', textAlign: 'left', mb: 3, overflow: 'hidden' }}>
													<Box sx={{ px: { xs: 3, sm: 4 }, py: { xs: 3, sm: 3.5 }, borderBottom: '1px solid #E2E8F0' }}>
														<Typography fontWeight="800" variant="h5" sx={{ color: '#0F172A', mb: 0.75 }}>
															Checkout Details
														</Typography>
														<Typography sx={{ color: '#64748B', fontSize: '0.95rem' }}>
															Enter your details below to continue with payment.
														</Typography>
													</Box>
													<Box sx={{ p: { xs: 2.5, sm: 4 }, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
														<TextField
															fullWidth
															variant="outlined"
															type="text"
															label="Full Name"
															name="name"
															value={title}
															onChange={(event) => setTitle(event.target.value)}
															InputProps={{ startAdornment: <InputAdornment position="start"><PersonOutlineIcon sx={{ color: '#94A3B8' }} /></InputAdornment> }}
															sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#F8FAFC', borderRadius: '14px', '& fieldset': { borderColor: 'rgba(148, 163, 184, 0.35)' }, '&:hover fieldset': { borderColor: 'rgba(212, 175, 55, 0.45)' }, '&.Mui-focused fieldset': { borderColor: modernColors.primary.main } }, '& .MuiInputLabel-root.Mui-focused': { color: modernColors.primary.dark } }}
														/>
														<TextField
															inputProps={{ maxLength: 10 }}
															fullWidth
															variant="outlined"
															type="number"
															label="Phone Number"
															name="number"
															value={number}
															onChange={handleNumberChange}
															error={!!error}
															helperText={error}
															InputProps={{ startAdornment: <InputAdornment position="start"><PhoneOutlinedIcon sx={{ color: '#94A3B8' }} /></InputAdornment> }}
															sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#F8FAFC', borderRadius: '14px', '& fieldset': { borderColor: 'rgba(148, 163, 184, 0.35)' }, '&:hover fieldset': { borderColor: 'rgba(212, 175, 55, 0.45)' }, '&.Mui-focused fieldset': { borderColor: modernColors.primary.main } }, '& .MuiInputLabel-root.Mui-focused': { color: modernColors.primary.dark } }}
														/>
														<TextField
															fullWidth
															variant="outlined"
															type="email"
															label="Email Address"
															name="email"
															value={email}
															onChange={(event) => setEmail(event.target.value)}
															InputProps={{ startAdornment: <InputAdornment position="start"><MailOutlineIcon sx={{ color: '#94A3B8' }} /></InputAdornment> }}
															sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#F8FAFC', borderRadius: '14px', '& fieldset': { borderColor: 'rgba(148, 163, 184, 0.35)' }, '&:hover fieldset': { borderColor: 'rgba(212, 175, 55, 0.45)' }, '&.Mui-focused fieldset': { borderColor: modernColors.primary.main } }, '& .MuiInputLabel-root.Mui-focused': { color: modernColors.primary.dark } }}
														/>

														{orderBumpCourse?.price ? (
															<Box sx={{ backgroundColor: '#FFFBEB', border: '1px solid rgba(212, 175, 55, 0.2)', borderRadius: '16px', p: 2.25 }}>
																<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
																	<Box>
																		<Typography sx={{ fontWeight: 800, fontSize: '1rem', color: '#0F172A', mb: 0.5 }}>{orderBumpCourse?.title}</Typography>
																		<Typography sx={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.6 }}>{orderBumpCourse?.setting?.orderBumpDescription}</Typography>
																	</Box>
																	<Box sx={{ textAlign: 'right', minWidth: 'fit-content' }}>
																		<Typography sx={{ fontWeight: 900, fontSize: '1.1rem', color: modernColors.primary.dark }}>₹ {(orderBumpCourse.price - orderBumpCourse.price / 100 * orderBumpCourse.discount).toFixed(2)}</Typography>
																		<Checkbox checked={checked} onChange={handleCheckboxChange} color="primary" sx={{ p: 0.5, color: modernColors.primary.main, '&.Mui-checked': { color: modernColors.primary.main } }} />
																	</Box>
																</Box>
															</Box>
														) : null}

														<Box sx={{ border: '1px solid #E2E8F0', borderRadius: '16px', p: 2.25, backgroundColor: '#fff' }}>
															<Button onClick={handleReedemCode} sx={{ p: 0, minWidth: 'auto', color: modernColors.primary.dark, fontWeight: 700, textTransform: 'none', justifyContent: 'flex-start' }} startIcon={<LocalOfferOutlinedIcon />}>
																{reedemCode ? 'Hide Coupon Code' : 'Have a Coupon Code?'}
															</Button>
															{reedemCode === true && (
																<Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
																	<OutlinedInput
																		fullWidth
																		type="text"
																		name="number"
																		value={couponNumber}
																		onChange={handleCoupon}
																		placeholder="Enter discount code"
																		startAdornment={<InputAdornment position="start"><LocalOfferOutlinedIcon sx={{ color: '#94A3B8' }} /></InputAdornment>}
																		endAdornment={<InputAdornment position="end"><IconButton disabled={!(couponNumber && number)} aria-label="apply coupon" onClick={handleCheckCoupon} edge="end" sx={{ fontSize: '14px', color: getColor(), fontWeight: '700' }}>{isCouponValid === true ? 'Applied' : 'Apply'}</IconButton></InputAdornment>}
																		sx={{ backgroundColor: '#fff', borderRadius: '14px', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(148, 163, 184, 0.35)' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(212, 175, 55, 0.45)' }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: modernColors.primary.main } }}
																	/>
																	{errorMessage && <FormHelperText error sx={{ mt: 0, fontSize: '13px', fontWeight: '600' }}>{errorMessage}</FormHelperText>}
																	{isCouponValid === true && <FormHelperText sx={{ mt: 0, color: modernColors.success.main, fontSize: '13px', fontWeight: '600' }}>Coupon applied successfully</FormHelperText>}
																</Box>
															)}
														</Box>

														<Box sx={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '16px', p: 2.25, display: 'flex', flexDirection: 'column', gap: 1.25 }}>
															<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
																<Typography sx={{ fontWeight: 700, color: '#334155' }}>Subtotal</Typography>
																<Typography sx={{ fontWeight: 800, color: '#0F172A' }}>₹ {checked ? orderBumpCourse.price - orderBumpCourse.price / 100 * orderBumpCourse.discount + totalPrice : totalPrice}</Typography>
															</Box>
															{isCouponValid === true && (
																<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
																	<Typography sx={{ fontWeight: 700, color: '#DC2626' }}>Coupon Discount</Typography>
																	<Typography sx={{ fontWeight: 800, color: '#DC2626' }}>- ₹ {couponDiscount}</Typography>
																</Box>
															)}
															<Box sx={{ mt: 0.5, pt: 2, borderTop: '1px solid rgba(148, 163, 184, 0.18)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
																<Typography sx={{ fontWeight: 800, fontSize: '1rem', color: '#0F172A' }}>Total Amount</Typography>
																<Typography sx={{ fontWeight: 900, fontSize: '1.45rem', color: modernColors.primary.dark }}>₹ {checked ? orderBumpCourse.price - orderBumpCourse.price / 100 * orderBumpCourse.discount + totalPrice - (isCouponValid === true ? couponDiscount : 0) : totalPrice - (isCouponValid === true ? couponDiscount : 0)}</Typography>
															</Box>
														</Box>

														<Button variant="contained" sx={{ width: '100%', height: '52px', mt: 0.5, fontSize: '15px', fontWeight: '800', borderRadius: '14px', background: modernColors.primary.gradient, color: 'white', textTransform: 'none', boxShadow: 'none', '&:hover': { background: `linear-gradient(135deg, ${modernColors.primary.dark} 0%, ${modernColors.primary.main} 100%)`, boxShadow: 'none' } }} onClick={handleSubmit} disabled={title === '' || number === '' || email === ''} startIcon={<CreditCardOutlinedIcon />}>
															Complete Payment
														</Button>
													</Box>
												</Card>
										</Typography>
									)}

									{activeStep === 3 && (
										<Typography sx={{ mt: 3, mb: 1, py: 1 }}>
											<Card sx={{ width: '100%', background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '32px', boxShadow: '0 30px 60px rgba(0, 0, 0, 0.15)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
												<Grid container sx={{ margin: '40px 0', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
													<Grid item xs={12} sm={8} md={6} lg={5}>
														<Box sx={{ mb: 4 }}>
															<Box sx={{ width: '120px', height: '120px', margin: '0 auto 20px', background: modernColors.primary.gradient, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 40px rgba(212, 175, 55, 0.28)' }}>
																<Typography sx={{ fontSize: '48px', color: '#fff' }}>✓</Typography>
															</Box>
															<Typography variant="h3" sx={{ fontWeight: '900', color: modernColors.primary.dark, fontSize: { xs: '2rem', md: '2.5rem' }, letterSpacing: '-0.02em', mb: 2 }}>Enrollment Successful</Typography>
															<Typography sx={{ fontSize: '18px', color: '#4a5568', fontWeight: '500', mb: 3, lineHeight: '1.6' }}>Welcome to the MyEduNeeds learning journey.</Typography>
														</Box>
														<Box sx={{ mb: 4 }}>
															<Box sx={{ background: 'rgba(255, 255, 255, 0.8)', borderRadius: '20px', padding: '24px', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)' , display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
																<img src="myeduneed/logo.png" alt="MyEduNeeds Logo" style={{ height: '80px' }} />
															</Box>
														</Box>
														<Box sx={{ background: 'rgba(212, 175, 55, 0.08)', borderRadius: '20px', padding: '24px', margin: '24px 0', border: '1px solid rgba(212, 175, 55, 0.16)' }}>
															<Typography sx={{ fontWeight: '700', fontSize: '16px', color: '#2d3748', lineHeight: '1.7', mb: 3 }}><strong>Next Steps:</strong> Download the mobile app to access test papers and upload your answer sheets. The student dashboard is available on mobile.</Typography>
															<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
																		<Button
																			variant="outlined"
																			onClick={handlePlayStore}
																			startIcon={<AndroidIcon />}
																			sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 700, color: modernColors.primary.dark, borderColor: 'rgba(212, 175, 55, 0.45)', '&:hover': { borderColor: modernColors.primary.main, backgroundColor: 'rgba(212, 175, 55, 0.08)' } }}
																		>
																			Play Store
																		</Button>
																		<Button
																			variant="outlined"
																			startIcon={<AppleIcon />}
																			sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 700, color: modernColors.primary.dark, borderColor: 'rgba(212, 175, 55, 0.45)', '&:hover': { borderColor: modernColors.primary.main, backgroundColor: 'rgba(212, 175, 55, 0.08)' } }}
																		>
																			App Store
																		</Button>
																		<Button
																			variant="outlined"
																			onClick={handleWindowStore}
																			startIcon={<WindowIcon />}
																			sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 700, color: modernColors.primary.dark, borderColor: 'rgba(212, 175, 55, 0.45)', '&:hover': { borderColor: modernColors.primary.main, backgroundColor: 'rgba(212, 175, 55, 0.08)' } }}
																		>
																			Microsoft Store
																		</Button>
															</Box>
														</Box>
																<Button variant="contained" sx={{ height: '64px', margin: '32px auto', fontSize: '16px', fontWeight: '800', borderRadius: '20px', background: modernColors.primary.gradient, color: 'white', textTransform: 'none', '&:hover': { background: `linear-gradient(135deg, ${modernColors.primary.dark} 0%, ${modernColors.primary.main} 100%)` } }} onClick={() => { setActiveStep(0); setAddedCartPlans([]); setAddtoCartIds([]); setPurchaseArray([]); setSelectedIds([]); setSelectSubjectWise([]); setChecked(false); }}>
																	Browse More Plans
														</Button>
													</Grid>
												</Grid>
											</Card>
										</Typography>
									)}
								</React.Fragment>
							)}
						</div>
					</Box>
				</Box>
			</Box>

			<Dialog open={courseExpandedDescriptions} onClose={() => setCourseExpandedDescriptions(false)}>
				<DialogContent dividers>
					<Typography variant="body1">{parse(fullDes)}</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setCourseExpandedDescriptions(false)}>Close</Button>
				</DialogActions>
			</Dialog>

			<Dialog open={viewPlanModal} onClose={() => setViewPlanModal(false)} maxWidth="lg" sx={{ '& .MuiDialog-container': { '& .MuiPaper-root': { minWidth: '30%' } } }}>
				<IconButton aria-label="close" onClick={() => setViewPlanModal(false)} sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}>
					<CloseIcon sx={{ color: 'black' }} />
				</IconButton>
				<ViewPlanModal handleClose={() => setViewPlanModal(false)} plansList={plansList} courseContentList={courseContentList} selectShedule={selectShedule} handleChange={handleChange} />
			</Dialog>

			<Dialog open={openScheduleModal} onClose={() => setOpenScheduleModal(false)} maxWidth="lg" sx={{ '& .MuiDialog-container': { '& .MuiPaper-root': { minWidth: !isMobileDevice ? '90%' : '25%' } } }}>
				<IconButton aria-label="close" onClick={() => setOpenScheduleModal(false)} sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}>
					<CloseIcon sx={{ color: 'black' }} />
				</IconButton>
				<Box sx={{ borderBottom: '1px solid #80808038' }}>
					<Box sx={{ textAlign: 'left', padding: '2rem', mt: 3 }}>
						<Typography variant="h4" fontWeight="bold">Select Schedule</Typography>
					</Box>
					<Box sx={{ padding: !isMobileDevice ? '' : '0 2rem', margin: isMobileDevice ? '' : '0 2rem', display: 'flex', justifyContent: 'left' }}>
						<FormControl className="mobile-select-button">
							<InputLabel id="schedule-popup-label" sx={{ fontSize: '13px' }}>Schedule</InputLabel>
							<Select className="select-option" sx={{ mb: 2, minWidth: '100px', maxWidth: '300px', fontSize: '12px', width: '230px' }} labelId="schedule-popup-label" id="schedule-popup" label="Schedule" value={selectShedule} onChange={handleChange}>
								{courseContentList && courseContentList.map((entry, index) => <MenuItem key={index} value={entry}>{entry?.title}</MenuItem>)}
							</Select>
						</FormControl>
					</Box>
				</Box>
				<DialogActions>
					<Button onClick={handleCheckoutSubmit} sx={{ fontSize: '14px', color: modernColors.primary.dark, fontWeight: 'bold' }}>Submit</Button>
				</DialogActions>
			</Dialog>

			<Dialog open={imageSchedule} onClose={handleCloseSchedule} fullScreen>
				<Box sx={{ textAlign: 'end', width: '100%' }}>
					<IconButton aria-label="close" onClick={handleCloseSchedule}><CloseIcon fontSize="large" /></IconButton>
				</Box>
				<DialogContent style={{ textAlign: 'center' }}>
					{selectedAotherSchedule?.title === 'Portion WiseTest Series' && selectCourse?.title === 'CA Final' && <img src="img/WhatsApp Image 2026-03-02 at 10.22.23 AM.jpeg" alt="Scheduled" style={{ margin: '5px', width: isMobileDevice ? '' : '-webkit-fill-available' }} />}
					{selectedAotherSchedule?.title === 'Full Length Test Series' ? <img src="img/ca-inter-full-length.jpeg" alt="Scheduled" style={{ margin: '5px', width: '-webkit-fill-available' }} /> : selectScheduleContentObj?.title === 'Exam oriented Test Series' ? <img src="img/Exam Oriented.jpeg" alt="Scheduled" style={{ margin: '5px', width: '-webkit-fill-available' }} /> : <>{selectedBasicPlan?.title === 'Cumulative' ? <img src="img/ca-inter-calculam.jpeg" alt="Scheduled" style={{ margin: '5px', width: '-webkit-fill-available' }} /> : selectedBasicPlan?.title === 'Exclusive' ? <img src="img/WhatsApp Image 2026-03-02 at 10.21.45 AM.jpeg" alt="Scheduled" style={{ margin: '5px', width: '-webkit-fill-available' }} /> : ''}</>}
				</DialogContent>
			</Dialog>
		</Layout>
	);
};

export default TestSeriesDetails;
