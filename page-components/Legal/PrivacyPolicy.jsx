import React from 'react';
import { useRouter } from 'next/router';
import { Icons, LAYOUT_PADDING } from '../../constants/Icons';

const PrivacyPolicy = () => {
    const router = useRouter();

    return (
        <div className="bg-white min-h-screen pb-16 md:pb-0">
            {/* Header */}
            <div className="bg-gradient-to-br from-blue-50 to-white border-b border-slate-200">
                <div className={LAYOUT_PADDING}>
                    <div className="py-8">
                        <button
                            onClick={() => router.push('/')}
                            className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-700 mb-4 transition-colors"
                        >
                            <Icons.ChevronLeft size={16} />
                            Back to Home
                        </button>
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Privacy Policy</h1>
                        <p className="text-slate-600 text-sm">Last updated: January 16, 2026</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className={LAYOUT_PADDING}>
                <div className="max-w-4xl mx-auto py-12">
                    <div className="prose prose-slate max-w-none">

                        <section className="mb-8">
                            <p className="text-slate-700 leading-relaxed mb-4">
                                This Privacy Policy (the "Policy") governs the manner in which the Platform collects, uses, maintains and discloses information of its users. The Policy also describes the practices that We apply to such user information, user's privacy rights and choices regarding their information. To clarify, this Policy applies to all users of the Platform (referred to as "Learners", "You", "Your").
                            </p>
                            <p className="text-slate-700 leading-relaxed mb-4">
                                By accessing and using the Platform, providing Your Personal Information, or by otherwise signalling Your agreement when the option is presented to You, You consent to the collection, use, and disclosure of information described in this Policy and Terms of Use and we disclaim all the liabilities arising therefrom. If You do not agree with any provisions of this Policy and/or the Terms of Use, You should not access or use the Platform or engage in communications with us and are required to leave the Platform immediately. If any information You have provided or uploaded on the Platform violates the terms of this Policy or Terms of Use, we may be required to delete such information upon informing You of the same and revoke Your access if required without incurring any liability to You. Capitalized terms used but not defined in this Privacy Policy can be found in our Terms of Use. Please read this Policy carefully prior to accessing our Platform and using any of the services or products offered therein. If you have any questions, please contact us at the contact information provided below.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">PERSONAL INFORMATION</h2>
                            <p className="text-slate-700 leading-relaxed mb-4">
                                "Personal Information" shall mean the information which identifies a Learner i.e., first and last name, identification number, email address, age, gender, location, photograph and/or phone number provided at the time of registration or any time thereafter on the Platform.
                            </p>
                            <p className="text-slate-700 leading-relaxed mb-4">
                                "Sensitive Personal Information" shall include (i) passwords and financial data (except the truncated last four digits of credit/debit card), (ii) health data, (iii) official identifier (such as biometric data, aadhar number, social security number, driver's license, passport, etc.,), (iv) information about sexual life, sexual identifier, race, ethnicity, political or religious belief or affiliation, (v) account details and passwords, or (vi) other data/information categorized as 'sensitive personal data' or 'special categories of data' under the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011, General Data Protection Regulation (GDPR) and / or the California Consumer Privacy Act (CCPA) ("Data Protection Laws") and in context of this Policy or other equivalent / similar legislations.
                            </p>
                            <p className="text-slate-700 leading-relaxed mb-4">
                                Usage of the term 'Personal Information' shall include 'Sensitive Personal Information' as may be applicable to the context of its usage.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">INFORMATION WE COLLECT:</h2>
                            <p className="text-slate-700 leading-relaxed mb-4">
                                We may collect both personal and non-personal identifiable information from You in a variety of ways, including, but not limited to, when You visit our Platform, register on the Platform, and in connection with other activities, services, features or resources we make available on our Platform. However, please note that-
                            </p>
                            <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
                                <li>We do not ask You for Personal Information unless we truly need it; like when You are registering for any Content on the Platform.</li>
                                <li>We do not share Your Personal Information with anyone except to comply with the applicable laws, develop our products and services, or protect our rights.</li>
                                <li>We do not store Personal Information on our servers unless required for the on-going operation of our Platform.</li>
                            </ul>

                            <h3 className="text-xl font-semibold text-slate-800 mb-3 mt-6">Personal Identifiable Information:</h3>
                            <p className="text-slate-700 leading-relaxed mb-4">
                                We may collect personal-identifiable information such as Your name and emails address to enable Your access to the Platform and services/products offered therein. We will collect personal-identifiable information from You only if such information is voluntarily submitted by You to us. You can always refuse to provide such personal identification information; however, it may prevent You from accessing services or products provided on the Platform or from engaging in certain activities on the Platform.
                            </p>

                            <h3 className="text-xl font-semibold text-slate-800 mb-3 mt-6">Non-Personal Identifiable Information:</h3>
                            <p className="text-slate-700 leading-relaxed mb-4">
                                When You interact with our Platform, we may collect non-personal-identifiable information such as the browser name, language preference, referring site, and the date and time of each user request, operating system and the Internet service providers utilized and other similar information.
                            </p>

                            <h3 className="text-xl font-semibold text-slate-800 mb-3 mt-6">Cookies:</h3>
                            <p className="text-slate-700 leading-relaxed mb-4">
                                To enhance User experience, our Platform may use 'cookies'. A cookie is a string of information that a website stores on a visitor's computer, and that the visitor's browser provides to the website each time the visitor returns for record-keeping purposes. You may choose to set Your web browser to refuse cookies, or to notify You when cookies are being sent; however, please note that in doing so, some parts of the Platform may not function properly.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">HOW WE USE and SHARE THE INFORMATION COLLECTED</h2>
                            <p className="text-slate-700 leading-relaxed mb-4">
                                We may collect and use Your Personal Information for the following purposes:
                            </p>

                            <h3 className="text-xl font-semibold text-slate-800 mb-3 mt-6">To provide access to our Platform and/or the services/products offered therein:</h3>
                            <p className="text-slate-700 leading-relaxed mb-4">
                                We use the Your information as collected by us to allow You to access the Platform and the services/products offered therein, including without limitation to provide customer service, fulfil purchases through the Platform, verify User information and to resolve any glitches with our Platform. The legal basis for this processing is consent or, where applicable, our legitimate interests in the proper administration of our Platform, and/or the performance of a contract between You and us.
                            </p>

                            <h3 className="text-xl font-semibold text-slate-800 mb-3 mt-6">To improve our Platform and maintain safety:</h3>
                            <p className="text-slate-700 leading-relaxed mb-4">
                                We use Your information to improve and customize the Platform and services/products offered by us. Further, we also use Your information to prevent, detect, investigate, and take measures against criminal activity, fraud, misuse of or damage to our Platform or network, and other threats and violations to a third party's or our rights and property, or the safety of our Users, or others. The legal basis for this processing is consent or, where applicable, our legitimate interests in the proper administration of our Platform, and/or the performance of a contract between You and us.
                            </p>

                            <h3 className="text-xl font-semibold text-slate-800 mb-3 mt-6">To communicate with You or market our services/products:</h3>
                            <p className="text-slate-700 leading-relaxed mb-4">
                                We may use the email address submitted by You to communicate with You about Your orders on our Platform, our offers, new products, services or even receive Your feedback on the Platform or any services/products offered therein. It may also be used to respond to Your inquiries, questions, and/or other requests. If at any time You would like to unsubscribe from receiving future emails, please write to us at the contact information provided below. The legal basis for this processing is consent or, where applicable, our legitimate interests in the proper administration of our Platform, and/or the performance of a contract between You and us.
                            </p>

                            <p className="text-slate-700 leading-relaxed mb-4">
                                We do not use Personal Information for making any automated decisions affecting or creating profiles other than what is described in this Policy.
                            </p>

                            <p className="text-slate-700 leading-relaxed mb-4">
                                We do not sell, trade, or otherwise exploit Your personal-identifiable information to others. Limited to the purposes stated hereinabove, we may share generic aggregated demographic information not linked to any personal-identifiable information regarding visitors and Users with our business partners and trusted affiliates.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">YOUR CHOICES:</h2>

                            <h3 className="text-xl font-semibold text-slate-800 mb-3">Limit the information You provide:</h3>
                            <p className="text-slate-700 leading-relaxed mb-4">
                                You always have an option to choose the information You provide to us, including the option to update or delete Your information. However, please note that lack of certain information may not allow You access to the Platform or any of its features, in part or in full. For example: information required for Your registration on the Platform.
                            </p>

                            <h3 className="text-xl font-semibold text-slate-800 mb-3 mt-6">Limit the communications You receive from us:</h3>
                            <p className="text-slate-700 leading-relaxed mb-4">
                                Further, You will also have the option to choose what kind of communication You would like to receive from us. However, there may be certain communications that are required for legal or security purposes, including changes to various legal agreements, that you may not be able to limit.
                            </p>

                            <h3 className="text-xl font-semibold text-slate-800 mb-3 mt-6">Reject Cookies and other similar technologies:</h3>
                            <p className="text-slate-700 leading-relaxed mb-4">
                                You may reject or remove cookies from Your web browser; You will always have the option to change the default settings on Your web browser if the same is set to 'accept cookies'. However, please note that some of the services/products offered on the Platform may not function or be available to You, when the cookies are rejected, removed or disabled.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">YOUR RIGHTS:</h2>
                            <p className="text-slate-700 leading-relaxed mb-4">
                                In general, all Learners have the rights specified herein this section. However, depending on where you are situated, you may have certain specific rights in respect of your Personal Information accorded by the laws of the country you are situated in. To understand Your rights, please refer to the Country Specific Additional Rights below.
                            </p>
                            <p className="text-slate-700 leading-relaxed mb-4">
                                If you are a Learner, you may exercise any of these rights by using the options provided to you within the Platform upon your login. If however, you are facing any issues or require any clarifications, you can always write to us at the address noted in the 'Grievances' section below, and we will address your concerns to the extent required by the applicable law.
                            </p>

                            <ul className="list-disc pl-6 text-slate-700 space-y-3 mb-4">
                                <li><strong>Right to Confirmation and Access:</strong> You have the right to get confirmation and access to your Personal Information that is with us along with other supporting information.</li>
                                <li><strong>Right to Correction:</strong> You have the right to ask us to rectify your Personal Information that is with us that you think is inaccurate. You also have the right to ask us to update your Personal Information that you think is incomplete or out-of-date.</li>
                                <li><strong>Right to be Forgotten:</strong> You have the right to restrict or prevent the continuing disclosure of your Personal Information under certain circumstances.</li>
                                <li><strong>Right to Erasure:</strong> If you wish to withdraw/remove your Personal Information from our Platform, you have the right to request erasure of your Personal Information from our Platform. However, please note that such erasure will remove all your Personal Information from our Platform (except as specifically stated in this Policy) and may result in deletion of your account on the Platform permanently, and the same will not be retrievable.</li>
                            </ul>

                            <p className="text-slate-700 leading-relaxed mb-4">
                                Remember, you are entitled to exercise your rights as stated above only with respect to your information, including Personal Information, and not that of other Learners. Further, when we receive any requests or queries over email to the address specified in the 'Grievances' section below, then, as per the applicable Data Protection Laws, we may need to ask you a few additional information to verify your identity in association with the Platform and the request received.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">PROTECTION OF YOUR INFORMATION:</h2>
                            <p className="text-slate-700 leading-relaxed mb-4">
                                We take all measures reasonably necessary to protect against the unauthorized access, use, alteration or destruction of Personal Information or such other data on the Platform. Our disclosure of any such information is limited to –
                            </p>
                            <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
                                <li>our employees, contractors and affiliated organizations (if any) that (i) need to know that information in order to process it on our behalf or to provide services available on our Platform, and (ii) that have agreed not to disclose it to others.</li>
                                <li>a response to a court order, or other governmental request. Without imitation to the foregoing, we reserve the right to disclose such information where we believe in good faith that such disclosure is necessary to:
                                    <ul className="list-circle pl-6 mt-2 space-y-1">
                                        <li>comply with applicable laws, regulations, court orders, government and law enforcement agencies' requests;</li>
                                        <li>protect and defend a third party's or our rights and property, or the safety of our users, our employees, or others; or</li>
                                        <li>prevent, detect, investigate and take measures against criminal activity, fraud and misuse or unauthorized use of our Platform and/or to enforce our Terms of Use or other agreements or policies.</li>
                                    </ul>
                                </li>
                            </ul>
                            <p className="text-slate-700 leading-relaxed mb-4">
                                To the extent permitted by law, we will attempt to give You prior notice before disclosing Your information in response to such a request.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">THIRD PARTY WEBSITES</h2>
                            <p className="text-slate-700 leading-relaxed mb-4">
                                You may find links to the websites and services of our partners, suppliers, advertisers, sponsors, licensors and other third parties. The content or links that appear on these sites are not controlled by us in any manner and we are not responsible for the practices employed by such websites. Further, these websites/links thereto, including their content, may be constantly changing and the may have their own terms of use and privacy policies. Browsing and interaction on any other website, including websites which have a link to our Site, is subject to that terms and policies published on such websites.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">CROSS-BORDER DATA TRANSFER</h2>
                            <p className="text-slate-700 leading-relaxed mb-4">
                                Your information including any Personal Information is stored, processed, and transferred in and to the Amazon Web Service (AWS) servers and databases located in India. We may also store, process, and transfer information in and to servers in other countries depending on the location of our affiliates and service providers.
                            </p>
                            <p className="text-slate-700 leading-relaxed mb-4">
                                Please note that these countries may have differing (and potentially less stringent) privacy laws and that Personal Information can become subject to the laws and disclosure requirements of such countries, including disclosure to governmental bodies, regulatory agencies, and private persons, as a result of applicable governmental or regulatory inquiry, court order or other similar process.
                            </p>
                            <p className="text-slate-700 leading-relaxed mb-4">
                                If you use our Platform from outside India, including in the USA, EU, EEA, and UK, your information may be transferred to, stored, and processed in India. By accessing our Platform or otherwise giving us information, you consent to the transfer of information to India and other countries outside your country of residence.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">DURATION FOR WHICH YOUR INFORMATION IS STORED</h2>
                            <p className="text-slate-700 leading-relaxed mb-4">
                                We will retain Your information for as long as it is required for us to retain for the purposes stated hereinabove, including for the purpose of complying with legal obligation or business compliances.
                            </p>
                            <p className="text-slate-700 leading-relaxed mb-4">
                                Further, please note that we may not be able to delete all communications or photos, files, or other documents publicly made available by you on the Platform (for example: comments, feedback, etc.), however, we shall anonymize your Personal Information in such a way that you can no longer be identified as an individual in association with such information made available by you on the Platform. We will never disclose aggregated or de-identified information in a manner that could identify you as an individual.
                            </p>
                            <p className="text-slate-700 leading-relaxed mb-4">
                                <strong>Note:</strong> If you wish to exercise any of your rights (as specified in 'Your Rights' section below) to access, modify and delete any or all information stored about you, then you may do so by using the options provided within the Platform. You can always write to us at the email address specified in the 'Grievances' section below.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">MODIFICATION TO PRIVACY POLICY:</h2>
                            <p className="text-slate-700 leading-relaxed mb-4">
                                We may modify, revise or change our Policy from time to time; when we do, we will revise the 'updated date' at the beginning of this page. We encourage You to check our Platform frequently to see the recent changes. Unless stated otherwise, our current Policy applies to all information that we have about You.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">GRIEVANCES:</h2>
                            <p className="text-slate-700 leading-relaxed mb-4">
                                If you have any questions about this Policy, wish to exercise your rights, concerns about privacy or grievances, please write to us with a thorough description via email to <strong>admin@Next Gen CA.com</strong>.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">COUNTRY SPECIFIC ADDITIONAL RIGHTS</h2>

                            <h3 className="text-xl font-semibold text-slate-800 mb-3 mt-6">TERMS APPLICABLE IF YOU ARE AN INDIAN RESIDENT</h3>
                            <p className="text-slate-700 leading-relaxed mb-4">
                                <strong>Your Rights:</strong> If you are located in India, you may have the following rights under the Personal Data Protection Bill (PDPB) when it becomes a legislation. All requests can be made by using the option provided to you within the Platform upon your login. You may also write to us as stated in the "Grievances" section above, and we will address you concerns to the extent required by law.
                            </p>
                            <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-6">
                                <li><strong>Right to Confirmation and Access:</strong> You have the right to get confirmation and access to your Personal Information that is with us along with other supporting information.</li>
                                <li><strong>Right to Correction:</strong> You have the right to ask us to rectify your Personal Information that is with us that you think is inaccurate. You also have the right to ask us to update your Personal Information that you think is incomplete or out-of-date.</li>
                                <li><strong>Right to Data Portability:</strong> You have the right to ask that we transfer the Personal Information you gave us to another organisation, or to you, under certain circumstances.</li>
                                <li><strong>Right to be Forgotten:</strong> You have the right to restrict or prevent the continuing disclosure of your Personal Information under certain circumstances.</li>
                                <li><strong>Right to Erasure:</strong> If you wish to withdraw/remove your Personal Information from our Platform, you have the right to request erasure of your Personal Information from our Platform. However, please note that such erasure will remove all your Personal Information from our Platform (except as specifically stated in this Policy) and may result in deletion of your account on the Platform permanently, and the same will not be retrievable.</li>
                            </ul>

                            <h3 className="text-xl font-semibold text-slate-800 mb-3 mt-8">TERMS APPLICABLE IF YOU ARE A RESIDENT OF UNITED KINGDOM (UK), A EUROPEAN UNION (EU) COUNTRY OR EUROPEAN ECONOMIC AREA (EEA)</h3>
                            <p className="text-slate-700 leading-relaxed mb-4">
                                <strong>Your Rights:</strong> If you are located in the United Kingdom (UK) or European Union (EU) or European Economic Area (EEA), you have the following rights under the UK and EU General Data Protection Regulation (GDPR) respectively. All requests should be sent to the address noted in the "Grievances" section above, and we will fulfil requests to the extent required by applicable law.
                            </p>
                            <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-6">
                                <li><strong>Right to access Your Personal Information:</strong> You have the right to receive confirmation as to whether or not Personal Information concerning you is being processed and, where that is the case, access to the Personal Information can be sought;</li>
                                <li><strong>Right to Rectification:</strong> Our goal is to keep your Personal Information accurate, current and complete. Please contact us if you believe your information is inaccurate or incomplete;</li>
                                <li><strong>Right to Erasure:</strong> In some cases, you have a legal right to request that we erase your Personal Information;</li>
                                <li><strong>Right to object to Processing:</strong> You have the right to object to our processing of your Personal Information under certain conditions;</li>
                                <li><strong>Right to restrict Processing:</strong> You have the right to request that we restrict the processing of your Personal Information, under certain conditions;</li>
                                <li><strong>Right to Data Portability:</strong> You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions;</li>
                                <li><strong>Right to make a complaint to a government supervisory authority:</strong> If you believe we have not processed your Personal Information in accordance with applicable provisions of the GDPR, we encourage you to contact us at email address provided in the 'Grievances' section above. You also have the right to make a GDPR complaint to the relevant Supervisory Authority or seek a remedy through the courts. A list of Supervisory Authorities is available at: https://edpb.europa.eu/about-edpb/board/members_en. If you need further assistance regarding your rights, please contact us using the contact information provided below, and we will consider your request in accordance with applicable law. You can identify the supervising authority of your concern by visiting https://edpb.europa.eu/about-edpb/board/members_en.</li>
                                <li><strong>Right to not be subject to automated decision-making, including profiling:</strong> You have the right not to be subject to a decision based solely on automated processing, including profiling, which produces legal or similarly significant effects concerning you.</li>
                            </ul>
                            <p className="text-slate-700 leading-relaxed mb-4">
                                We collect and process Personal Information about you only where we have a legal rationale to do so. Specific legal rationale applied for the same will depend on the type of Personal Information collected and the context in which the same is being processed, including the Services involved.
                            </p>

                            <h3 className="text-xl font-semibold text-slate-800 mb-3 mt-8">TERMS APPLICABLE IF YOU ARE A CALIFORNIA STATE RESIDENT</h3>
                            <p className="text-slate-700 leading-relaxed mb-4">
                                If you are a California state resident, then you have the following rights to the extent, and in the manner, set out in the CCPA:
                            </p>
                            <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-6">
                                <li>The right to access the Personal Information that we hold on you;</li>
                                <li>The right to know what Personal Information we intend on collecting from them before the point of collection;</li>
                                <li>The right to opt in or out of marketing, analytics, and other similar activities;</li>
                                <li>The right to equal services without discrimination; and</li>
                                <li>The right to request deletion of Personal Information.</li>
                            </ul>
                            <p className="text-slate-700 leading-relaxed mb-4">
                                The above rights, the manner in which you can exercise the same and the category of and the manner in which we collect your information, are detailed below.
                            </p>

                            <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 mb-6">
                                <h4 className="text-lg font-bold text-slate-900 mb-3">CCPA NOTICE AT COLLECTION:</h4>
                                <p className="text-slate-700 leading-relaxed mb-4">
                                    For purposes of the CCPA, in collecting the information described above, we collect the categories of Personal Information listed below from you:
                                </p>
                                <ul className="list-disc pl-6 text-slate-700 space-y-2">
                                    <li><strong>Identifiers:</strong> We may collect your name, email address, mobile number, username, unique personal identifier, and Internet Protocol (IP) address.</li>
                                    <li><strong>Characteristics of Personal Information described in the California Customer Records statute:</strong> We may collect your name, email address, username, unique personal identifier, and gender.</li>
                                    <li><strong>Internet or other electronic network activity information:</strong> We collect cookies as described above, we will automatically receive information from your browser and your device.</li>
                                    <li><strong>Geolocation data:</strong> We may collect your IP address.</li>
                                    <li><strong>Audio, electronic, visual or similar information:</strong> We may collect your profile picture or other audio or visual information uploaded as content to the Platform.</li>
                                    <li><strong>Inferences:</strong> We may make inferences based upon the Personal Information collected.</li>
                                </ul>
                            </div>

                            <p className="text-slate-700 leading-relaxed mb-4">
                                For complete details on CCPA data practices, consumer rights, and requests under the CCPA, please refer to the full policy document or contact us at <strong>admin@Next Gen CA.com</strong>.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;

