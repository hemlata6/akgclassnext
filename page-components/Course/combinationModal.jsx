import { Badge, Box, Button, Card, CardContent, CardMedia, Checkbox, Divider, FormControl, Grid, IconButton, InputLabel, ListItemText, MenuItem, Paper, Select, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react'
import CancelIcon from '@mui/icons-material/Cancel';
import instId from '../../config/instituteId';
import Network from '../../config/Network';

const SuggestedCourseDialog = ({ addedSuggestCourse, handleClose, onFinalAmountUpdate, suggestedCourseId, setCartCourses, setFinalAmounts }) => {

    // const courseId = 527;
    const theme = useTheme();
    const isMobile = useMediaQuery("(min-width:600px)");
    const [course, setCourse] = useState(null);
    const [coursePricing, setCoursePricing] = useState([]);
    const [coursePublic, setCoursesPublic] = useState([]);
    const [publicCourses, setPublicCourses] = useState([]);
    const [suggestedLength, setSuggestedLength] = useState([]);
    const [tagName, setTagName] = useState('');
    const [courseIdData, setCourseIdData] = useState({});
    const [finalCoursePricing, setFinalCoursePricing] = useState([]);
    const [selectedAccess, setSelectedAccess] = useState('');
    const [selectedVariant, setSelectedVariant] = useState("");
    const [selectedValidityType, setSelectedValidityType] = useState("");
    const [selectedDuration, setSelectedDuration] = useState(null);
    const [selectedWatchTime, setSelectedWatchTime] = useState(null);
    const [variationsList, setVariationsList] = useState([]);
    const [validityTypeList, settValidityTypeList] = useState([]);
    const [validityDateList, setValidityDateList] = useState([]);
    const [watchTimeList, setWatchTimeList] = useState([]);

    const discount = finalCoursePricing[0]?.discount ?? 0;
    const taxLab = course?.taxLab ?? 0;
    const price = finalCoursePricing[0]?.price ?? 0;

    const discountedAmount = (price * discount) / 100;
    const finalPrice = price - discountedAmount;
    const taxLabAmount = (finalPrice * taxLab) / 100;
    const finalAmount = finalPrice + taxLabAmount;


    useEffect(() => {
        if (variationsList.length === 1) {
            setSelectedVariant(variationsList[0]);
        }
        if (validityTypeList.length === 1) {
            setSelectedValidityType(validityTypeList[0]);
        }
        if (validityDateList.length === 1) {
            setSelectedDuration(validityDateList[0]);
        }
        if (watchTimeList.length === 1) {
            setSelectedWatchTime(watchTimeList[0] === "Unlimited" ? "Unlimited" : Number(watchTimeList[0]));
        }
    }, [variationsList, validityTypeList, validityDateList, watchTimeList]);

    useEffect(() => {
        const uniqueModes = getUniqueLearningModes();
        if (uniqueModes.length > 0) {
            setSelectedAccess(uniqueModes[0]);
        }
    }, [coursePricing]);

    useEffect(() => {
        filterCourses();
    }, [selectedAccess, selectedVariant, selectedValidityType, selectedDuration, selectedWatchTime]);

    useEffect(() => {
        getCourseById();
    }, [suggestedCourseId]);

    useEffect(() => {
        getAllCourses();
    }, [coursePublic]);

    useEffect(() => {
        getAllCoursesPublic();
    }, []);

    useEffect(() => {
        const activeCourses = publicCourses.filter(item => item.active === true);

        const filteredCourses = activeCourses.filter(item =>
            (item.tags || []).some(tag => tag.id === coursePublic?.setting?.checkoutTag) &&
            item.id !== Number(suggestedCourseId)
        );

        const tagNames = activeCourses.filter(item =>
            (item?.tags || []).some(tag => tag?.id === coursePublic?.setting?.checkoutTag)
        );

        function findTagById(dataArray, id) {
            let matchedTag = null;
            dataArray.forEach(item => {
                if (item?.tags && Array.isArray(item?.tags)) {
                    const tag = item?.tags.find(tag => tag.id === id);
                    if (tag) {
                        matchedTag = tag;
                        return;
                    }
                }
            });
            return matchedTag;
        }

        const matchedTag = findTagById(tagNames, coursePublic?.setting?.checkoutTag);
        setTagName(matchedTag);
        setSuggestedLength(filteredCourses);

        if (activeCourses.length > 0) {
            const selectedCourse = activeCourses.find(item => suggestedCourseId === item.id);
            if (selectedCourse) {
                setCourseIdData(selectedCourse);
            }
        }
    }, [publicCourses, suggestedCourseId, coursePublic]);

    const getCourseById = async () => {
        if (!suggestedCourseId) return;
        try {
            let response = await Network.fetchCourseById(suggestedCourseId);
            setCourse(response?.course || null);
            let coursePricing = response?.course?.coursePricing;
            setCoursePricing(coursePricing);
        } catch (error) {
            console.error("Error fetching course:", error);
        };
    };

    const getAllCoursesPublic = async () => {
        try {
            const response = await Network.getBuyCourseDetailsSecond(Number(suggestedCourseId));
            setCoursesPublic(response.course);
            // getInstituteDetail(response.course?.instId);
        } catch (error) {
            console.log(error);
        };
    };

    const getAllCourses = async () => {
        try {
            const response = await Network.getFreeCourseList(instId);
            setPublicCourses(response.courses);
        } catch (error) {
            console.log(error);
        };
    };


    const getUniqueLearningModes = () => {
        const modeSet = new Set();

        coursePricing?.forEach(course => {
            let modes = [];
            if (course.liveAccess) modes.push("Live Access");
            if (course.onlineContentAccess) modes.push("Recorded");
            if (course.offlineContentAccess) modes.push("Pendrive");
            if (course.faceToFaceAccess) modes.push("Face to Face");
            if (course.quizAccess) modes.push("Quiz Access");
            if (modes.length) {
                modeSet.add(modes.join(" + "));
            }
        });

        return Array.from(modeSet);
    };

    const filterCourses = () => {
        let filtered = [...coursePricing];
        if (selectedAccess) {

            filtered = coursePricing?.filter(course => {
                const selectedModes = selectedAccess.split(" + ");

                const matchesSelection = (
                    (selectedModes.includes("Live Access") ? course.liveAccess === true : course.liveAccess === null) &&
                    (selectedModes.includes("Recorded") ? course.onlineContentAccess === true : course.onlineContentAccess === null) &&
                    (selectedModes.includes("Pendrive") ? course.offlineContentAccess === true : course.offlineContentAccess === null) &&
                    (selectedModes.includes("Quiz Access") ? course.quizAccess === true : course.quizAccess === null) &&
                    (selectedModes.includes("Face to Face") ? course.faceToFaceAccess === true : course.faceToFaceAccess === null)
                );

                return matchesSelection;
            });
        };

        const variationsList = newgetVariationList(filtered);
        setVariationsList(variationsList)

        if (selectedVariant) {
            filtered = filtered?.filter((course) =>
                selectedVariant === "None"
                    ? !course.variation || course.variation.trim() === ""
                    : course.variation === selectedVariant
            );
        }

        const validityTypes = [...new Set(filtered.map(course => course.validityType))];
        settValidityTypeList(validityTypes);


        if (selectedValidityType) {
            filtered = filtered?.filter(course => course.validityType === selectedValidityType);
        }

        const validityDates = [
            ...new Set(
                filtered.map(course =>
                    selectedValidityType === "validity"
                        ? formatMilliseconds(course.duration)
                        : formatTimestamp(course.expiry)
                ).filter(value => value !== "N/A")
            )
        ];

        setValidityDateList(validityDates);

        if (selectedDuration) {
            filtered = filtered?.filter(course =>
                selectedValidityType === "validity"
                    ? formatMilliseconds(course.duration) === selectedDuration
                    : formatTimestamp(course.expiry) === selectedDuration
            );
        }

        const watchTimeList = filtered?.map(course =>
            course.watchTime ? course.watchTime : "Unlimited"
        );
        setWatchTimeList([...new Set(watchTimeList)]);

        if (selectedWatchTime !== null && selectedWatchTime !== undefined) {

            filtered = filtered?.filter(course =>
                selectedWatchTime === "Unlimited"
                    ? course.watchTime === null || course.watchTime === undefined || course.watchTime === ""
                    : Number(course.watchTime) === Number(selectedWatchTime)
            );
        }

        setFinalCoursePricing(filtered);
    };

    const newgetVariationList = (filtered) => {
        const variationsSet = new Set();

        filtered?.forEach((course) => {
            if (course.variation && course.variation.trim() !== "") {
                variationsSet.add(course.variation);
            }
        });

        if (filtered?.some((course) => !course.variation || course.variation === null || course.variation.trim() === "")) {
            variationsSet.add("None");
        }

        return Array.from(variationsSet);
    };

    function formatMilliseconds(ms) {
        if (!ms) return "N/A";

        const millisecondsInYear = 365 * 24 * 60 * 60 * 1000;
        const millisecondsInMonth = 30 * 24 * 60 * 60 * 1000;
        const millisecondsInDay = 24 * 60 * 60 * 1000;

        const years = Math.floor(ms / millisecondsInYear);
        ms %= millisecondsInYear;

        const months = Math.floor(ms / millisecondsInMonth);
        ms %= millisecondsInMonth;

        const days = Math.floor(ms / millisecondsInDay);

        let result = [];
        if (years > 0) result.push(`${years} Year${years > 1 ? 's' : ''}`);
        if (months > 0) result.push(`${months} Month${months > 1 ? 's' : ''}`);
        if (days > 0) result.push(`${days} Day${days > 1 ? 's' : ''}`);

        return result.length > 0 ? result.join(" ") : "N/A";
    }

    const formatTimestamp = (timestamp) => {
        if (!timestamp) return "N/A";

        return new Date(timestamp).toLocaleDateString();
    };

    const handleChangeAccess = (event) => { setSelectedAccess(event.target.value); }
    const handleSelectVariant = (event) => setSelectedVariant(event.target.value);
    const handleSelectValidityType = (event) => setSelectedValidityType(event.target.value);
    const handleSelectDuration = (event) => setSelectedDuration(event.target.value);
    const handleSelectWatchTime = (event) => setSelectedWatchTime(event.target.value !== "Unlimited" ? Number(event.target.value) : event.target.value);

    const handleAddedInCart = (course, combination) => {
        if (!combination) {
            console.error('Error: Missing combination pricing object');
            return;
        }

        setCartCourses((prevCart) => {
            const isAlreadyAdded = prevCart.some((item) => item.coursePricingId === combination.id);

            if (isAlreadyAdded) {
                const updatedCart = prevCart.filter((item) => item.coursePricingId !== combination.id);
                updateFinalAmount(updatedCart);
                return updatedCart;
            } else {
                const discount = combination.discount ?? 0;
                const price = combination.price ?? 0;
                const discountedAmount = (price * discount) / 100;
                const finalPrice = price - discountedAmount;
                const updatedCourse = {
                    ...course,
                    finalPrice,
                    coursePricingId: combination.id
                };

                const updatedCart = [...prevCart, updatedCourse];
                updateFinalAmount(updatedCart);
                localStorage.setItem('cartCourses', JSON.stringify(updatedCart));
                window.dispatchEvent(new Event('cartUpdated'));

                return updatedCart;
            }
        });
        handleClose();
    };

    const updateFinalAmount = (cartItems) => {
        const totalAmount = cartItems.reduce((sum, item) => {
            const taxLab = item.taxLab ?? 0;
            const taxLabAmount = (item.finalPrice * taxLab) / 100;
            return sum + (item.finalPrice + taxLabAmount);
        }, 0);

        setFinalAmounts(totalAmount);
    };

    return (
        <Box
            sx={{
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                borderRadius: '16px',
                overflow: 'hidden',
            }}
        >
            {/* Modern Header with Gradient */}
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    p: { xs: 2, sm: 3 },
                    position: 'relative',
                }}
            >
                <IconButton
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        top: { xs: 8, sm: 12 },
                        right: { xs: 8, sm: 12 },
                        color: '#fff',
                        background: 'rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            background: 'rgba(255, 255, 255, 0.3)',
                            transform: 'rotate(90deg)',
                        },
                    }}
                >
                    <CancelIcon />
                </IconButton>

                <Typography
                    variant="h5"
                    sx={{
                        color: '#fff',
                        fontWeight: 700,
                        mb: 1,
                        pr: { xs: 4, sm: 5 },
                        fontSize: { xs: '1rem', sm: '1rem' },
                    }}
                >
                    {course?.title}
                </Typography>
                {/* <Typography
                    variant="body2"
                    sx={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        lineHeight: 1.6,
                    }}
                >
                    {course?.shortDescription === null ? 'Configure your course preferences' : course?.shortDescription}
                </Typography> */}
            </Box>

            {/* Content Section */}
            <Box sx={{ p: { xs: 2, sm: 3 } }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        {/* Lecture Mode */}
                        <FormControl
                            fullWidth
                            sx={{
                                mb: 2,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    background: '#fff',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
                                    },
                                    '&.Mui-focused': {
                                        boxShadow: '0 4px 16px rgba(102, 126, 234, 0.25)',
                                    }
                                }
                            }}
                        >
                            <InputLabel>Lecture Mode</InputLabel>
                            <Select
                                label="Lecture Mode"
                                fullWidth
                                variant="outlined"
                                value={selectedAccess}
                                onChange={handleChangeAccess}
                            >
                                {getUniqueLearningModes()?.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        <ListItemText primary={option} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Variant */}
                        {variationsList?.length > 0 && !(variationsList?.length === 1 && variationsList[0] === "None") && selectedAccess && (
                            <FormControl
                                fullWidth
                                sx={{
                                    mb: 2,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                        background: '#fff',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
                                        },
                                        '&.Mui-focused': {
                                            boxShadow: '0 4px 16px rgba(102, 126, 234, 0.25)',
                                        }
                                    }
                                }}
                            >
                                <InputLabel>Variant</InputLabel>
                                <Select
                                    label="Variant"
                                    fullWidth
                                    variant="outlined"
                                    value={selectedVariant}
                                    onChange={handleSelectVariant}
                                >
                                    {variationsList.map((variant) => (
                                        <MenuItem key={variant} value={variant}>
                                            <ListItemText primary={variant} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}

                        {/* Validity Types */}
                        {!(validityTypeList?.length === 1 && validityTypeList[0] !== "lifetime") && selectedAccess && (
                            <FormControl
                                fullWidth
                                sx={{
                                    mb: 2,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                        background: '#fff',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
                                        },
                                        '&.Mui-focused': {
                                            boxShadow: '0 4px 16px rgba(102, 126, 234, 0.25)',
                                        }
                                    }
                                }}
                            >
                                <InputLabel>Validity Types</InputLabel>
                                <Select
                                    label="Validity Types"
                                    fullWidth
                                    variant="outlined"
                                    value={selectedValidityType}
                                    onChange={handleSelectValidityType}
                                >
                                    {validityTypeList?.map((type) => (
                                        <MenuItem key={type} value={type}>
                                            <ListItemText primary={type} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}

                        {/* Validity Date */}
                        {selectedValidityType && selectedValidityType !== "lifetime" && (
                            <FormControl
                                fullWidth
                                sx={{
                                    mb: 2,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                        background: '#fff',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
                                        },
                                        '&.Mui-focused': {
                                            boxShadow: '0 4px 16px rgba(102, 126, 234, 0.25)',
                                        }
                                    }
                                }}
                            >
                                <InputLabel id="validity-select-label">
                                    {selectedValidityType
                                        ? `${selectedValidityType.charAt(0).toUpperCase() + selectedValidityType.slice(1)} Date`
                                        : "Validity Date"}
                                </InputLabel>
                                <Select
                                    label={selectedValidityType ? `${selectedValidityType.charAt(0)?.toUpperCase() + selectedValidityType?.slice(1)} Date` : "Validity Date"}
                                    labelId="validity-select-label"
                                    id="validity-select"
                                    value={selectedDuration || ''}
                                    onChange={handleSelectDuration}
                                    fullWidth
                                    variant="outlined"
                                    displayEmpty
                                >
                                    {validityDateList?.map((duration) => (
                                        <MenuItem key={duration} value={duration}>
                                            <ListItemText primary={duration} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}

                        {/* Watch Time */}
                        {selectedValidityType && (
                            <FormControl
                                fullWidth
                                sx={{
                                    mb: 2,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                        background: '#fff',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
                                        },
                                        '&.Mui-focused': {
                                            boxShadow: '0 4px 16px rgba(102, 126, 234, 0.25)',
                                        }
                                    }
                                }}
                            >
                                <InputLabel>Watch Time</InputLabel>
                                <Select
                                    label="Watch Time"
                                    fullWidth
                                    variant="outlined"
                                    value={selectedWatchTime}
                                    onChange={handleSelectWatchTime}
                                >
                                    {watchTimeList?.map((watchTime) => (
                                        <MenuItem key={watchTime} value={watchTime ? watchTime : "Unlimited"}>
                                            <ListItemText primary={watchTime !== "Unlimited" ? `${watchTime}x` : watchTime} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}
                    </Grid>
                </Grid>

                {/* Pricing Summary Card */}
                {finalCoursePricing[0] && (
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2,
                            mb: 2,
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                            border: '1px solid rgba(102, 126, 234, 0.2)',
                        }}
                    >
                        <Stack spacing={1}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Typography variant="body2" color="text.secondary">Base Price</Typography>
                                <Typography variant="body2" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                                    ₹{price.toFixed(2)}
                                </Typography>
                            </Stack>
                            {discount > 0 && (
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                    <Typography variant="body2" color="success.main">Discount ({discount}%)</Typography>
                                    <Typography variant="body2" color="success.main">
                                        -₹{discountedAmount.toFixed(2)}
                                    </Typography>
                                </Stack>
                            )}
                            {taxLab > 0 && (
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                    <Typography variant="body2" color="text.secondary">Tax ({taxLab}%)</Typography>
                                    <Typography variant="body2">
                                        +₹{taxLabAmount.toFixed(2)}
                                    </Typography>
                                </Stack>
                            )}
                            <Divider sx={{ my: 1 }} />
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Typography variant="p" fontWeight={700}>Total Amount</Typography>
                                <Typography
                                    variant="h6"
                                    fontWeight={700}
                                    sx={{
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                    }}
                                >
                                    ₹{finalAmount.toFixed(2)}
                                </Typography>
                            </Stack>
                        </Stack>
                    </Paper>
                )}

                {/* Add to Cart Button */}
                <Button
                    fullWidth
                    onClick={() => handleAddedInCart(addedSuggestCourse, finalCoursePricing[0])}
                    disabled={!finalCoursePricing[0]}
                    sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: { xs: '1rem', sm: '1rem' },
                        // py: { xs: 1.5, sm: 2 },
                        borderRadius: '12px',
                        textTransform: 'none',
                        boxShadow: '0 4px 15px 0 rgba(102, 126, 234, 0.4)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                            boxShadow: '0 6px 20px 0 rgba(102, 126, 234, 0.6)',
                            transform: 'translateY(-2px)',
                        },
                        '&:disabled': {
                            background: 'rgba(0, 0, 0, 0.12)',
                            color: 'rgba(0, 0, 0, 0.26)',
                            boxShadow: 'none',
                        },
                    }}
                >
                    Add to Cart
                    {finalCoursePricing[0] && ` • ₹${finalAmount.toFixed(2)}`}
                </Button>
            </Box>
        </Box>
    )
}

export default SuggestedCourseDialog

