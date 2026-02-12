"use client";
import { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, X } from "lucide-react";
import { Nunito } from "next/font/google";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-nunito",
});

const RedStarSVG = () => (
  <svg
    width="85"
    height="139"
    viewBox="0 0 85 139"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M56.3656 134.146C56.4544 134.113 56.5426 134.079 56.6292 134.039C65.5086 130.738 64.5483 124.611 64.5483 124.611L62.4542 116.198L58.7248 121.824L49.4507 87.1697C49.2591 86.4532 49.4512 85.6846 49.9512 85.1638L77.7654 56.197C79.5845 54.3023 80.1139 51.5655 79.1468 49.0528C78.1798 46.5401 75.9552 44.8728 73.3414 44.7025L33.3714 42.0859C32.6528 42.0391 31.9962 41.6001 31.6585 40.9416L15.3087 9.02472L21.8357 10.6649L17.7515 3.02532C17.7515 3.02532 14.8642 -2.38587 6.01308 1.26558C6.01212 1.26596 6.01404 1.2652 6.01308 1.26558C5.94602 1.29069 5.88087 1.3114 5.8134 1.33986L5.81023 1.35238C4.14591 2.01055 2.81664 3.34611 2.1548 5.14298L-13.1043 43.037C-13.3575 43.7237 -13.9554 44.2213 -14.6642 44.3352L-54.0703 50.6712C-56.0287 50.986 -57.6999 52.1646 -58.6579 53.9062C-59.6222 55.6602 -59.7678 57.8279 -59.0457 59.7039C-58.6296 60.7853 -57.9321 61.7563 -57.0291 62.5126L-25.75 88.7091C-25.4717 88.9418 -25.2556 89.2444 -25.1244 89.5855C-24.9932 89.9267 -24.9503 90.2966 -25.0007 90.6559L-30.5976 131.188C-30.7592 132.358 -30.6267 133.548 -30.2085 134.63C-29.4856 136.505 -27.9287 138.01 -26.04 138.655C-24.1652 139.295 -22.1389 139.037 -20.4806 137.945L12.9116 115.98C13.5122 115.585 14.2865 115.549 14.9337 115.886L51.0785 133.825C52.7738 134.707 54.6533 134.796 56.3273 134.154C56.3439 134.152 56.3531 134.151 56.3656 134.146Z"
      fill="#AE3234"
    />
    <path
      d="M-25.7039 131.694C-26.1087 130.643 -26.2316 129.482 -26.0595 128.339L-20.1085 88.7273C-20.0552 88.3757 -20.0961 88.0144 -20.2223 87.6831C-20.3497 87.3515 -20.5625 87.0578 -20.8373 86.8338L-51.7622 61.5578C-52.6547 60.8287 -53.3409 59.8867 -53.7455 58.8353C-54.4474 57.0116 -54.2835 54.8947 -53.3055 53.1733C-52.3348 51.4647 -50.6578 50.2981 -48.7046 49.9732L-9.38145 43.4212C-8.67418 43.3031 -8.07428 42.8116 -7.81531 42.1395L6.54684 4.76898C7.48656 2.32604 9.68538 0.718204 12.288 0.574213C14.8906 0.430223 17.2533 1.7854 18.4531 4.11067L36.806 39.6737C37.1355 40.3132 37.7856 40.7356 38.5022 40.7745L78.3042 42.9549C80.9073 43.0972 83.1083 44.7034 84.0489 47.1472C84.9892 49.5901 84.4367 52.2679 82.6066 54.1336L54.6246 82.6642C54.1215 83.1773 53.9233 83.9294 54.1074 84.6266L64.3441 123.343C65.0139 125.875 64.1725 128.476 62.1511 130.129C60.1295 131.783 57.4258 132.082 55.0956 130.909L19.4496 112.98C18.808 112.657 18.035 112.7 17.4339 113.091L-16.0424 134.84C-17.7052 135.919 -19.7264 136.192 -21.5889 135.583C-23.4622 134.973 -25.001 133.517 -25.7039 131.694Z"
      fill="#F57C7E"
    />
    <path
      d="M81.0024 52.5436L53.0203 81.0742C51.9552 82.1601 51.5402 83.7318 51.9305 85.2065L62.1665 123.924C63.1152 127.512 59.4072 130.546 56.1028 128.884L20.4568 110.955C19.0998 110.272 17.484 110.362 16.21 111.19L-17.2653 132.939C-20.3679 134.955 -24.3855 132.347 -23.8329 128.676L-17.8809 89.0644C-17.6543 87.556 -18.2381 86.0395 -19.4155 85.0769L-50.3415 59.8013C-53.2072 57.4586 -51.9812 52.8133 -48.3377 52.2057L-9.01369 45.6533C-7.51567 45.4038 -6.2615 44.3773 -5.71491 42.955L8.64724 5.5845C9.97808 2.12166 14.7534 1.85715 16.4542 5.15293L34.8067 40.715C35.5051 42.0688 36.8643 42.9508 38.3796 43.0345L78.1814 45.214C81.8709 45.4174 83.5962 49.8998 81.0024 52.5436Z"
      fill="#F14145"
    />
    <path
      opacity="0.313433"
      d="M-17.2636 132.939L16.2118 111.191C17.4868 110.362 19.102 110.273 20.4587 110.955L56.1047 128.885C59.4077 130.546 63.1171 127.512 62.1684 123.924L56.2722 101.624C12.3988 109.545 -7.37917 83.6011 -7.15572 44.8518C-7.69536 45.2553 -8.32542 45.5394 -9.01191 45.6536L-48.3359 52.206C-51.9807 52.8131 -53.2063 57.4593 -50.3399 59.8006L-19.4141 85.0762C-18.2367 86.0388 -17.653 87.5554 -17.8794 89.0638L-23.8314 128.676C-24.3836 132.347 -20.3661 134.955 -17.2636 132.939Z"
      fill="#D90E13"
    />
    <path
      d="M58.4757 55.662C53.9676 55.7913 50.262 54.0604 50.1972 51.7952C50.1322 49.53 53.7345 47.5882 58.2416 47.4592C62.7497 47.3299 66.4554 49.0608 66.5202 51.326C66.5852 53.5912 62.9839 55.5325 58.4757 55.662Z"
      fill="#FFF8E1"
    />
    <path
      d="M45.4164 54.0135C43.9662 54.5772 42.3352 53.8532 41.7743 52.3958C41.2134 50.9384 41.9343 49.3004 43.3852 48.7362C44.8353 48.1725 46.4653 48.897 47.0262 50.3542C47.5878 51.8102 46.8663 53.4497 45.4164 54.0135Z"
      fill="#FFF8E1"
    />
  </svg>
);

const FireSVG = () => (
  <svg
    width="58"
    height="142"
    viewBox="0 0 58 142"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M58 104.218C58.0637 130.689 33.0041 141.521 6.79351 140.059C-25.5988 138.251 -40.7772 118.607 -42.9491 95.7637C-44.7223 77.1189 -37.5457 61.0184 -27.4091 50.8648C-28.3149 59.5027 -19.1619 67.5922 -11.624 64.9217C-6.61497 63.0525 -5.24054 56.6348 -6.54633 51.6217C-7.85211 46.6077 -10.9916 42.1692 -12.2532 37.145C-14.3018 28.9808 -11.0022 20.1838 -5.28879 13.8329C0.424648 7.48193 8.27984 3.26185 16.3262 -6.10352e-05C11.4879 5.45643 10.8465 13.9814 14.8186 20.051C18.6125 25.8493 25.5639 28.8597 30.944 33.3487C39.9938 40.9006 44.355 54.1189 39.2314 64.535C37.8488 67.3458 35.8681 69.8547 34.4846 72.6647C33.1012 75.4747 32.3527 78.8065 33.5899 81.6793C34.827 84.5522 38.6129 86.4936 41.4614 85.023C44.7553 83.3236 39.8068 80.083 37.9176 75.1744C49.119 79.2143 57.9722 92.6075 58 104.218Z"
      fill="#BE2B2B"
    />
    <path
      d="M54.8918 102.889C54.9533 129.359 28.3695 143.358 3.1207 141.896C-28.0829 140.088 -42.7044 120.444 -44.7966 97.6007C-46.5047 78.9559 -37.1738 61.0184 -27.4091 50.8648C-27.75 54.9261 -27.391 59.2397 -25.1618 62.6534C-22.9334 66.0678 -18.4261 68.2325 -14.621 66.7587C-9.79573 64.8895 -8.47174 58.4718 -9.72961 53.4587C-10.9875 48.4447 -14.0117 44.0061 -15.2271 38.982C-17.2005 30.8178 -14.022 22.0208 -8.51821 15.6699C-3.01445 9.31891 4.55251 5.09883 12.3036 1.83691C7.64286 7.29341 7.02494 15.8183 10.8513 21.888C14.506 27.6863 21.2023 30.6967 26.385 35.1856C35.1027 42.7376 39.3038 55.9559 34.3683 66.372C33.0364 69.1828 31.1283 71.6917 29.7957 74.5017C28.463 77.3117 27.742 80.6435 28.9337 83.5163C30.1255 86.3892 33.7724 88.3306 36.5164 86.86C39.6895 85.1606 39.7374 80.083 37.9176 75.1744C48.7079 79.2144 54.8651 91.278 54.8918 102.889Z"
      fill="#D54747"
    />
    <path
      d="M44.8247 113.843C40.1843 123.025 31.8383 130.111 22.3022 134.002C21.2953 134.413 20.2759 134.79 19.2459 135.133C8.86773 138.589 -2.51841 137.652 -12.0442 132.28C-19.1667 128.263 -25.7145 121.611 -29.8769 110.33C-34.1996 98.6138 -33.9431 86.8403 -27.3207 76.8488C-22.1674 87.0553 -6.69116 78.2528 -3.59584 71.5407C-1.5413 67.0029 -1.23576 61.8828 -1.27561 56.9023C-1.3144 51.9218 -1.66383 46.8986 -0.80055 41.9937C-0.0100021 37.4652 0.693058 34.896 5.83955 29.6709C1.19622 38.7246 7.19356 42.9133 11.9107 50.4182C16.6279 57.9231 22.6999 60.5389 25.8998 73.3733C28.145 82.3785 23.6115 91.0065 32.6784 93.4208C39.67 95.2824 42.9043 91.8397 42.5589 87.0918C46.3796 96.4065 46.658 104.295 44.8247 113.843Z"
      fill="#FF6011"
    />
    <path
      d="M42.6159 118.556C37.9756 127.739 29.6296 134.825 20.0935 138.716C19.0866 139.127 18.0672 139.503 17.0372 139.846C6.65902 143.302 -4.72713 142.366 -14.2529 136.993C-21.3754 132.976 -27.9232 126.324 -32.0857 115.044C-36.4083 103.327 -33.943 86.8403 -27.3206 76.8488C-27.2726 81.8293 -21.9191 85.6641 -16.957 85.1683C-11.9938 84.6736 -7.85909 80.7917 -5.80456 76.2541C-3.75002 71.7164 -3.44447 66.5962 -3.48433 61.6157C-3.52312 56.6352 -3.87255 51.612 -3.00927 46.7071C-2.14694 41.8022 0.850899 34.0685 5.83962 29.6709C1.1963 38.7246 4.98484 47.6267 9.70203 55.1316C14.4192 62.6365 20.4912 65.2523 23.6911 78.0867C25.9363 87.0919 21.4027 95.7199 30.4697 98.1342C37.4613 99.9959 42.9044 91.8397 42.559 87.0918C46.807 96.462 47.2563 109.373 42.6159 118.556Z"
      fill="#FF884D"
    />
    <g opacity="0.935821">
      <path
        d="M24.3797 129.441C20.2399 135.144 14.7164 138.32 5.32653 137.943C-4.3661 137.555 -10.152 132.094 -14.1817 124.506C-17.7533 117.78 -20.4582 113.116 -18.7722 105.904C-15.5582 111.928 -8.60718 111.032 -3.36923 111.248C-8.94258 101.412 -6.48828 87.6242 6.30347 78.3115C3.75018 82.2837 6.48526 83.5294 8.59123 87.6991C10.6972 91.8679 14.1948 95.3526 17.6095 98.7896C21.0243 102.226 24.4664 105.769 26.4212 109.994C29.3196 116.26 28.5204 123.738 24.3797 129.441Z"
        fill="#F6B600"
      />
    </g>
    <path
      d="M22.1707 133.243C18.031 138.946 12.5075 142.122 3.11762 141.745C-6.575 141.357 -12.3609 135.896 -16.3906 128.308C-19.9622 121.582 -20.4583 113.116 -18.7724 105.904C-15.6363 111.85 -11.3824 114.268 -5.57813 115.05C-11.1515 105.214 -6.48839 87.6242 6.30336 78.3115C3.75007 82.2837 4.27636 87.3313 6.38233 91.501C8.4883 95.6698 11.9859 99.1545 15.4006 102.592C18.8154 106.028 22.2575 109.571 24.2123 113.796C27.1107 120.062 26.3115 127.54 22.1707 133.243Z"
      fill="#FFCF57"
    />
    <path
      opacity="0.691045"
      d="M43.2806 110.217C42.1873 114.596 39.5241 117.703 37.3313 117.158C35.1384 116.612 34.2467 112.62 35.3402 108.241C36.4335 103.862 39.0966 100.755 41.2895 101.301C43.4823 101.846 44.374 105.838 43.2806 110.217Z"
      fill="#FFF8E1"
    />
    <path
      opacity="0.691045"
      d="M38.1708 122.36C38.3206 123.909 37.1845 125.286 35.6337 125.436C34.0826 125.586 32.7041 124.451 32.5543 122.901C32.4044 121.352 33.5403 119.976 35.0914 119.827C36.6413 119.676 38.0211 120.811 38.1708 122.36Z"
      fill="#FFF8E1"
    />
    <path
      opacity="0.691045"
      d="M27.7408 43.7237C29.203 47.2012 29.5414 50.4601 28.4963 51.0042C27.4515 51.5485 25.4187 49.1705 23.9568 45.6936C22.4946 42.2161 22.1569 38.9572 23.2014 38.413C24.2461 37.8688 26.2784 40.2462 27.7408 43.7237Z"
      fill="#FFF8E1"
    />
  </svg>
);

interface GuidePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GuidePopup({ isOpen, onClose }: GuidePopupProps) {
  const [step, setStep] = useState(1);

  const handleNext = () => {
    setStep(2);
  };

  const handleFinish = () => {
    onClose();
    // Re-triggering a reset might be needed if they open it again
    setTimeout(() => setStep(1), 300);
  };

  if (step === 1) {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent
          className={`sm:max-w-[480px] p-0 bg-transparent border-0 shadow-none ${nunito.variable} focus:outline-none`}
        >
          <div className="relative w-[480px] h-[496px] bg-white rounded-[16px] flex flex-col items-center justify-center p-[41px_0px] gap-6 shadow-[0px_4px_12px_rgba(0,0,0,0.2)] border-[1.6px] border-[#ECECEC] border-b-[4px]">
            {/* Image */}
            <div className="w-[190px] h-[190px] relative flex-none order-0 flex-grow-0">
              <Image
                src="/images/3.png"
                alt="Welcome"
                width={190}
                height={190}
                className="object-contain"
                onError={(e) => {
                  e.currentTarget.src = "/images/PANDA.png";
                }}
              />
            </div>

            {/* Text Content */}
            <div className="flex flex-col items-center gap-0 w-full px-8">
              <h2 className="w-full text-center font-almarai font-extrabold text-[28px] leading-[36px] text-[#282828] mb-2 order-1">
                مرحباً بك في Zayd AI Chinese 👋
              </h2>
              <p className="w-full text-center font-nunito font-semibold text-[18px] leading-[28px] text-[#454545] tracking-[-0.005em] order-2 font-sans">
                تعلم اللغة الصينية خطوة بخطوة وبطريقة ممتعة 🎉
              </p>
            </div>

            {/* Button */}
            <button
              onClick={handleNext}
              className="flex flex-row justify-center items-center p-[16px_0px] gap-[10px] w-[388px] h-[56px] bg-[#35AB4E] border-b-[3px] border-[#20672F] rounded-[12px] hover:bg-[#2f9c46] active:border-b-0 active:translate-y-[2px] transition-all order-3"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
              <span className="font-nunito font-bold text-[16px] leading-[22px] text-white">
                هيا نبدأ
              </span>
            </button>

            {/* Pagination Dots */}
            <div className="flex flex-row items-center p-0 gap-[8px] width-[64px] h-[8px] order-4">
              <div className="w-[32px] h-[8px] bg-[#35AB4E] rounded-[100px]" />
              <div className="w-[8px] h-[8px] bg-[#B1B1B1] rounded-[100px]" />
              <div className="w-[8px] h-[8px] bg-[#B1B1B1] rounded-[100px]" />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (step === 2) {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && handleFinish()}>
        <DialogContent
          className={`fixed p-0 bg-transparent border-0 shadow-none ${nunito.variable} focus:outline-none flex justify-center items-center max-w-none w-screen h-screen`}
        >
          <div className="flex flex-row items-center gap-[20px] transition-all duration-300">
            {/* Popup 2 (Left): Guide Tooltip */}
            <div
              className="box-border flex flex-col items-center p-4 gap-[22px] w-[305px] h-[246px] bg-white border-[1.6px] border-[#ECECEC] border-b-[4px] shadow-[0px_4px_12px_rgba(0,0,0,0.2)]"
              style={{ borderRadius: "16px 16px 16px 0px" }}
            >
              {/* Tooltip Header */}
              <div className="relative flex flex-row items-center w-full h-[36px]">
                <button
                  onClick={handleFinish}
                  className="ms-10 absolute left-0 box-border flex items-center justify-center p-2 w-8 h-8 bg-[#E2E2E2] border border-[#ECECEC] rounded-[8px] hover:bg-gray-300 transition-colors"
                >
                  <X className="w-4 h-4 text-[#454545]" />
                </button>
                <div className="flex flex-row items-center justify-center gap-2 w-full">
                  <span className="text-[24px] me-6">✨</span>
                  <h3 className="me-16 font-almarai font-bold text-[24px] leading-[32px] text-[#282828] text-center">
                    كلمة الأسبوع
                  </h3>
                </div>
              </div>

              {/* Tooltip Description */}
              <p className="font-nunito font-semibold text-[16px] leading-[24px] text-[#454545] text-start self-stretch tracking-[-0.0025em]">
                تعلم كلمة جديدة كل أسبوع مع النطق والمعنى
              </p>

              {/* Tooltip Button */}
              <button
                onClick={() => setStep(3)}
                className="box-border flex flex-row justify-center items-center p-[16px_0px] gap-2 w-full h-[56px] bg-[#35AB4E] border-b-[3px] border-[#20672F] rounded-[12px] hover:bg-[#2f9c46] active:translate-y-[2px] transition-all"
              >
                <span className="font-nunito font-bold text-[16px] leading-[22px] text-white">
                  فهمت
                </span>
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>

              {/* Pagination */}
              <div className="flex flex-row items-center gap-2 w-[64px] h-2">
                <div className="w-8 h-2 bg-[#35AB4E] rounded-full" />
                <div className="w-2 h-2 bg-[#B1B1B1] rounded-full" />
                <div className="w-2 h-2 bg-[#B1B1B1] rounded-full" />
              </div>
            </div>

            {/* Popup 1 (Right): Word of the Week Content Card */}
            <div className="box-border flex flex-col justify-center items-end p-6 gap-[15px] w-[538px] h-[258px] bg-white border-2 border-[#E5E5E5] rounded-[13px] shadow-lg relative">
              {/* Header */}
              <div className="flex flex-row justify-between items-center gap-[10px] w-full h-[28px] self-stretch">
                <h3 className="font-almarai font-extrabold text-[18px] leading-[28px] text-[#454545] text-right">
                  كلمة الأسبوع
                </h3>
                <span className="text-[#FFCB08] text-2xl">✨</span>
              </div>

              {/* Content (Word & Translation) */}
              <div className="flex flex-col items-center gap-2 w-full">
                <div className="w-full text-center font-bold text-[30px] leading-[36px] text-[#35AB4E]">
                  你好
                </div>
                <div className="w-full text-center font-semibold text-[20px] leading-[28px] text-[#4B4B4B]">
                  مرحباً
                </div>
                <div className="w-full text-center font-normal text-[14px] leading-[20px] text-[#808080]">
                  تستخدم في الجمل عادةً ردًا على الامتنان
                </div>
              </div>

              {/* Button */}
              <button className="box-border flex flex-row justify-center items-center p-[6px_16px] gap-2 w-[139px] h-[36px] bg-[#35AB4E] border-b-[3px] border-[#20672F] rounded-[12px] hover:bg-[#2f9c46] transition-all self-center">
                <span className="font-inter font-normal text-[14px] leading-[20px] text-white">
                  استمع للنطق
                </span>
                <ChevronLeft className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Step 3: Streaks Guide
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleFinish()}>
      <DialogContent
        className={`fixed p-0 bg-transparent border-0 shadow-none ${nunito.variable} focus:outline-none flex justify-center items-center max-w-none w-screen h-screen`}
      >
        <div className="flex flex-row items-center gap-[20px] transition-all duration-300">
          {/* Tooltip (Right): Streaks Guide */}
          <div
            className="box-border flex flex-col items-center p-4 gap-[22px] w-[463px] h-[192px] bg-white border-[1.6px] border-[#ECECEC] border-b-[4px] shadow-[0px_4px_12px_rgba(0,0,0,0.2)]"
            style={{ borderRadius: "16px 16px 16px 0px" }}
          >
            {/* Header */}
            <div className="flex flex-row items-center w-full h-[36px] relative">
              <button
                onClick={handleFinish}
                className="absolute left-0 box-border flex items-center justify-center p-2 w-8 h-8 bg-[#E2E2E2] border border-[#ECECEC] rounded-[8px] hover:bg-gray-300 transition-colors"
              >
                <X className="w-4 h-4 text-[#454545]" />
              </button>
              <div className="flex flex-row items-center justify-center gap-2 w-full">
                <span className="text-[24px]">✨</span>
                <h3 className="font-almarai font-bold text-[24px] leading-[32px] text-[#282828] me-36">
                  لخط الحالي / أطول خط
                </h3>
              </div>
            </div>

            {/* Description */}
            <p className="ms-3 font-nunito font-semibold text-[16px] leading-[24px] text-[#454545] text-right self-stretch tracking-[-0.0025em]">
              تعلم كل يوم لتحافظ على سلسلتك!
            </p>

            {/* Button */}
            <button
              onClick={handleFinish}
              className="box-border flex flex-row justify-center items-center p-[16px_0px] gap-2 w-full h-[56px] bg-[#35AB4E] border-b-[3px] border-[#20672F] rounded-[12px] hover:bg-[#2f9c46] transition-all"
            >
              <span className="font-nunito font-bold text-[16px] leading-[22px] text-white">
                التالي
              </span>
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Pink Card (Middle): Longest Streak */}
          <div className="box-border flex flex-row justify-center items-center p-[16px_0px] gap-[6px] w-[262.5px] h-[291px] bg-[#FBD4D3] border-b-[4px] border-[#F9BEBE] rounded-[16px] shadow-[0px_2px_8px_rgba(0,0,0,0.1)] relative overflow-hidden">
            <div className="flex flex-col justify-center items-center gap-3">
              <span className="font-nunito font-semibold text-[16px] leading-[22px] text-[#2F0807]">
                أطول خط
              </span>
              <span className="font-nunito font-extrabold text-[56px] leading-[76px] text-[#2F0807]">
                20
              </span>
              <span className="font-nunito font-semibold text-[16px] leading-[22px] text-[#2F0807]">
                أيام
              </span>
            </div>
            {/* Red Star SVG */}
            <div className="absolute -left-[10px] top-[70px] w-[85px] h-[139px] z-10 pointer-events-none">
              <RedStarSVG />
            </div>
          </div>

          {/* Skin Card (Left): Current Streak */}
          <div className="box-border flex flex-row justify-center items-center p-[16px_0px] gap-[17px] w-[262.5px] h-[291px] bg-[#FFF5CE] border-b-[4px] border-[#FFEFB5] rounded-[16px] shadow-[0px_2px_8px_rgba(0,0,0,0.1)] relative overflow-hidden">
            <div className="flex flex-col justify-center items-center gap-3">
              <span className="font-nunito font-semibold text-[16px] leading-[22px] text-[#332902]">
                الخط الحالي
              </span>
              <span className="font-nunito font-extrabold text-[56px] leading-[76px] text-[#332902]">
                7
              </span>
              <span className="font-nunito font-semibold text-[16px] leading-[22px] text-[#332902]">
                أيام
              </span>
            </div>
            {/* Fire Icon Placeholder */}
            <div className="absolute -left-[50px] top-[65px] w-[103px] h-[150px] z-10 -scale-x-200">
              <FireSVG />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
