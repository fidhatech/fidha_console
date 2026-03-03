import { MdOutlineDashboard } from "react-icons/md";
import { FaUserAlt } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { TbSquareRoundedPercentage } from "react-icons/tb";
import { GiWallet } from "react-icons/gi";
import { MdOutlineLocalOffer } from "react-icons/md";
import { MdOutlineNotificationsActive } from "react-icons/md";
import { BiLineChartDown } from "react-icons/bi";
import { BiLineChart } from "react-icons/bi";
import { VscPercentage } from "react-icons/vsc";
import { CiPlay1 } from "react-icons/ci";
import { CiPause1 } from "react-icons/ci";
import { FaEye } from "react-icons/fa6";
import { FaPen } from "react-icons/fa6";
import { FaRegTrashCan } from "react-icons/fa6";
import { FaCoins } from "react-icons/fa6";
import { FaRupeeSign } from "react-icons/fa";
export { type IconType } from "react-icons";
import { TiThMenu } from "react-icons/ti";
import { MdSecurity } from "react-icons/md";

export const Icons = {
    Dashboard: MdOutlineDashboard,
    UserManagement: FaUserAlt,
    Verification: MdVerified,
    CommissionPayout: TbSquareRoundedPercentage,
    WalletTransactions: GiWallet,
    OfferFestival: MdOutlineLocalOffer,
    Notification: MdOutlineNotificationsActive,
    Growth: BiLineChart,
    Degrowth: BiLineChartDown,
    Percentage: VscPercentage,
    Play: CiPlay1,
    Pause: CiPause1,
    View: FaEye,
    Pen: FaPen,
    Bin: FaRegTrashCan,
    Coin: FaCoins,
    Rupee: FaRupeeSign,
    Menu: TiThMenu,
    Secure: MdSecurity,
} as const
