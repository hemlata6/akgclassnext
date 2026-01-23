import Butter from 'buttercms';

const butter = Butter(process.env.NEXT_PUBLIC_BUTTER_CMS_API_KEY || "4803f1f5eb03b06779ab025fdcd127fefe01d63a");

export default butter;

