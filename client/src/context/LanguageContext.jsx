import { createContext, useMemo, useState } from "react";

export const LanguageContext = createContext(null);

const dictionary = {
  vi: {
    navHome: "Home",
    navPlans: "Gói Tập",
    navTrainers: "HLV",
    navAbout: "About",
    navContact: "Contact",
    login: "Đăng nhập",
    logout: "Thoát",
    account: "Tài khoản",
    cart: "Giỏ hàng",
    heroEyebrow: "IronZone Gym",
    heroTitle: "FORGE YOUR BEST SELF",
    heroText:
      "Tập luyện thông minh hơn với gói tập linh hoạt, HLV chuyên nghiệp, checkout online và dashboard hội viên rõ ràng.",
    viewPlans: "Xem gói tập",
    freeRegister: "Đăng ký miễn phí",
    members: "Hội viên",
    certifiedTrainers: "HLV chứng chỉ",
    classesWeek: "Lớp/tuần",
    yearsExperience: "Năm kinh nghiệm",
    whyChoose: "Vì sao chọn IronZone?",
    featuredPlans: "Gói tập nổi bật",
    viewAll: "Xem tất cả",
    featuredTrainers: "HLV tiêu biểu",
    memberReviews: "Hội viên nói gì",
    promoHeadline: "Nhập NEWBIE10 giảm 10% đơn đầu tiên",
    promoText: "Áp dụng cho tất cả gói tập online.",
    startNow: "Bắt đầu ngay",
    loginTitle: "Đăng nhập",
    loginSubtitle:
      "Chào mừng bạn quay lại IronZone. Đăng nhập để tiếp tục quản lý lịch tập và gói thành viên.",
    email: "Email",
    password: "Mật khẩu",
    noAccount: "Chưa có tài khoản?",
    register: "Đăng ký",
    showPassword: "Hiện mật khẩu",
    hidePassword: "Ẩn mật khẩu",
    footerText:
      "Website quản lý phòng gym với gói tập, PT, giỏ hàng, checkout, dashboard hội viên và trang vận hành admin.",
    contact: "Liên hệ",
    social: "Mạng xã hội",
    aboutTitle: "About IronZone",
    aboutText:
      "IronZone kết hợp phòng tập hiện đại, huấn luyện viên chuyên môn và công cụ quản lý trực tuyến để hội viên theo dõi hành trình tập luyện dễ hơn.",
    contactTitle: "Contact IronZone",
    contactText:
      "Cần tư vấn gói tập, lịch PT hoặc hỗ trợ tài khoản? Liên hệ đội ngũ IronZone qua các kênh bên dưới.",
    plansTitle: "Gói tập",
    plansSubtitle: "Chọn gói phù hợp mục tiêu và lịch tập của bạn.",
    all: "Tất cả",
    oneMonth: "1 tháng",
    threeMonths: "3 tháng",
    sixPlusMonths: "6+ tháng",
    priceAsc: "Giá tăng dần",
    priceDesc: "Giá giảm dần",
    plan: "Gói",
    duration: "Thời hạn",
    price: "Giá",
    freePt: "PT miễn phí",
    sauna: "Xông hơi",
    yes: "Có",
    no: "Không",
    days: "ngày",
  },
  en: {
    navHome: "Home",
    navPlans: "Plans",
    navTrainers: "Trainers",
    navAbout: "About",
    navContact: "Contact",
    login: "Log in",
    logout: "Log out",
    account: "Account",
    cart: "Cart",
    heroEyebrow: "IronZone Gym",
    heroTitle: "FORGE YOUR BEST SELF",
    heroText:
      "Train smarter with flexible plans, professional coaches, online checkout, and a clear member dashboard.",
    viewPlans: "View plans",
    freeRegister: "Join for free",
    members: "Members",
    certifiedTrainers: "Certified trainers",
    classesWeek: "Classes/week",
    yearsExperience: "Years experience",
    whyChoose: "Why choose IronZone?",
    featuredPlans: "Featured plans",
    viewAll: "View all",
    featuredTrainers: "Featured trainers",
    memberReviews: "What members say",
    promoHeadline: "Use NEWBIE10 for 10% off your first order",
    promoText: "Applies to every online training plan.",
    startNow: "Start now",
    loginTitle: "Log in",
    loginSubtitle:
      "Welcome back to IronZone. Sign in to manage your training progress and memberships.",
    email: "Email",
    password: "Password",
    noAccount: "No account yet?",
    register: "Register",
    showPassword: "Show password",
    hidePassword: "Hide password",
    footerText:
      "Gym management website with plans, personal trainers, cart, checkout, member dashboard, and admin operations.",
    contact: "Contact",
    social: "Social",
    aboutTitle: "About IronZone",
    aboutText:
      "IronZone combines a modern gym floor, expert coaching, and online management tools so members can track their fitness journey with confidence.",
    contactTitle: "Contact IronZone",
    contactText:
      "Need help with plans, trainer schedules, or your account? Reach the IronZone team through the channels below.",
    plansTitle: "Plans",
    plansSubtitle: "Choose a plan that fits your goals and training schedule.",
    all: "All",
    oneMonth: "1 month",
    threeMonths: "3 months",
    sixPlusMonths: "6+ months",
    priceAsc: "Price low to high",
    priceDesc: "Price high to low",
    plan: "Plan",
    duration: "Duration",
    price: "Price",
    freePt: "Free PT",
    sauna: "Sauna",
    yes: "Yes",
    no: "No",
    days: "days",
  },
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(
    () => localStorage.getItem("ironzone_language") || "en",
  );

  const value = useMemo(() => {
    const setLang = (next) => {
      localStorage.setItem("ironzone_language", next);
      setLanguage(next);
    };
    return { language, setLanguage: setLang, t: dictionary[language] };
  }, [language]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
