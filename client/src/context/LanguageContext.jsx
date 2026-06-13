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
    whyEyebrow: "Trải nghiệm IronZone",
    whyHeading: "Tập luyện tốt hơn",
    whyHeadingAccent: "mỗi ngày.",
    whySubtitle:
      "Không gian, thiết bị và đội ngũ được xây dựng để bạn duy trì tiến bộ lâu dài.",
    featuredPlans: "Gói tập nổi bật",
    plansEyebrow: "Membership",
    plansHeading: "Chọn gói tập",
    plansHeadingAccent: "phù hợp.",
    plansHomeSubtitle:
      "Từ người mới bắt đầu đến vận động viên giàu kinh nghiệm, luôn có một lựa chọn dành cho bạn.",
    viewAll: "Xem tất cả",
    featuredTrainers: "HLV tiêu biểu",
    trainersEyebrow: "Đội ngũ chuyên gia",
    trainersHeading: "Tập cùng những",
    trainersHeadingAccent: "HLV hàng đầu.",
    trainersSubtitle:
      "Nhận hướng dẫn chuyên môn, chương trình cá nhân hóa và động lực đúng lúc.",
    trainersPageEyebrow: "Huấn luyện cá nhân",
    trainersPageHeading: "Gặp gỡ đội ngũ",
    trainersPageHeadingAccent: "chuyên gia.",
    trainersPageSubtitle:
      "Tìm HLV phù hợp với mục tiêu, phong cách tập luyện và lịch trình của riêng bạn.",
    trainersPageCoaches: "HLV chuyên nghiệp",
    trainersPageSkills: "Chuyên môn",
    trainersPageRating: "Đánh giá trung bình",
    trainersSearch: "Tìm theo tên, chuyên môn hoặc chứng chỉ...",
    trainersSearchShort: "Tìm kiếm HLV...",
    trainersFilterEyebrow: "Bộ lọc",
    trainersFilterTitle: "Tìm HLV phù hợp",
    trainersDirectory: "Trainer directory",
    trainersResults: "Chọn người đồng hành của bạn",
    trainersFound: "HLV được tìm thấy",
    trainersEmptyTitle: "Không tìm thấy HLV phù hợp",
    trainersEmptyText: "Hãy thử từ khóa hoặc chuyên môn khác.",
    trainersReset: "Xóa bộ lọc",
    trainerRate: "Mức phí",
    perHour: "giờ",
    viewTrainer: "Xem HLV",
    viewDetails: "Xem chi tiết",
    memberReviews: "Hội viên nói gì",
    reviewsEyebrow: "Câu chuyện hội viên",
    reviewsHeading: "Kết quả tạo nên",
    reviewsHeadingAccent: "niềm tin.",
    reviewsSubtitle:
      "Những trải nghiệm thực tế từ cộng đồng đang tập luyện mỗi ngày tại IronZone.",
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
    contactEyebrow: "Liên hệ IronZone",
    contactHeading: "Ghé thăm và",
    contactHeadingAccent: "tập cùng chúng tôi.",
    contactAddress: "Địa chỉ",
    contactPhone: "Điện thoại",
    contactEmail: "Email",
    locationEyebrow: "Vị trí phòng tập",
    locationTitle: "Tìm đường đến IronZone",
    locationText:
      "IronZone nằm tại vị trí thuận tiện ở trung tâm thành phố, dễ dàng di chuyển bằng xe máy, ô tô hoặc phương tiện công cộng.",
    openingHours: "Giờ mở cửa",
    openingHoursValue: "Hằng ngày, 06:00 - 22:00",
    openMaps: "Mở Google Maps",
    mapTitle: "Bản đồ vị trí IronZone",
    faqTitle: "Câu hỏi thường gặp",
    faqSubtitle:
      "Thông tin nhanh trước khi bạn bắt đầu tập luyện tại IronZone.",
    faqHeading: "Mọi điều bạn",
    faqHeadingAccent: "cần biết.",
    faqContact: "Liên hệ hỗ trợ",
    faqs: [
      {
        question: "Tôi có thể tập thử trước khi mua gói không?",
        answer:
          "Có. Hội viên mới có thể đăng ký một buổi tham quan và trải nghiệm cơ sở vật chất trước khi chọn gói phù hợp.",
      },
      {
        question: "Phòng gym mở cửa vào thời gian nào?",
        answer:
          "IronZone mở cửa từ 6:00 đến 22:00 mỗi ngày. Một số lớp nhóm và lịch PT sẽ có khung giờ riêng.",
      },
      {
        question: "Tôi có thể thay đổi hoặc nâng cấp gói tập không?",
        answer:
          "Có. Bạn có thể liên hệ nhân viên để nâng cấp gói. Giá trị còn lại của gói hiện tại sẽ được kiểm tra khi chuyển đổi.",
      },
      {
        question: "Gói tập có bao gồm huấn luyện viên cá nhân không?",
        answer:
          "Một số gói Premium và VIP có buổi PT miễn phí. Bạn cũng có thể mua PT Package để nhận chương trình tập 1-1 chuyên sâu.",
      },
      {
        question: "IronZone hỗ trợ những phương thức thanh toán nào?",
        answer:
          "Bạn có thể thanh toán bằng chuyển khoản ngân hàng, MoMo, ZaloPay, VNPay hoặc tiền mặt tại quầy.",
      },
      {
        question: "Tôi theo dõi membership và đơn hàng ở đâu?",
        answer:
          "Sau khi đăng nhập, hãy mở trang tài khoản để xem membership đang hoạt động, thời hạn, đơn hàng và thông báo mới.",
      },
    ],
    plansTitle: "Gói tập",
    plansSubtitle: "Chọn gói phù hợp mục tiêu và lịch tập của bạn.",
    plansPageEyebrow: "IronZone Membership",
    plansPageHeading: "Đầu tư cho",
    plansPageHeadingAccent: "phiên bản tốt nhất.",
    plansAvailable: "Gói đang mở",
    plansStartingAt: "Giá khởi điểm",
    plansMaxDays: "Ngày tối đa",
    plansFilterEyebrow: "Bộ lọc",
    plansFilterTitle: "Tìm gói phù hợp",
    plansSortBy: "Sắp xếp theo",
    plansReset: "Xóa bộ lọc",
    plansDirectory: "Membership directory",
    plansResults: "Lựa chọn dành cho bạn",
    plansFound: "gói được tìm thấy",
    plansCompareEyebrow: "So sánh quyền lợi",
    plansCompareTitle: "Chọn lựa với đầy đủ thông tin",
    plansCompareSubtitle: "Đối chiếu nhanh thời hạn, mức phí và các quyền lợi chính trước khi đăng ký.",
    membershipPlan: "Gói thành viên",
    planIncludes: "Quyền lợi bao gồm",
    mostPopular: "Phổ biến nhất",
    addToCart: "Thêm vào giỏ",
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
    whyEyebrow: "The IronZone experience",
    whyHeading: "Train better",
    whyHeadingAccent: "every day.",
    whySubtitle:
      "Our space, equipment, and team are built to help you make lasting progress.",
    featuredPlans: "Featured plans",
    plansEyebrow: "Membership",
    plansHeading: "Choose the plan",
    plansHeadingAccent: "that fits.",
    plansHomeSubtitle:
      "From first-time members to experienced athletes, there is an option designed for you.",
    viewAll: "View all",
    featuredTrainers: "Featured trainers",
    trainersEyebrow: "Expert coaching team",
    trainersHeading: "Train with the",
    trainersHeadingAccent: "very best.",
    trainersSubtitle:
      "Get expert guidance, personalized programming, and the motivation to keep moving.",
    trainersPageEyebrow: "Personal coaching",
    trainersPageHeading: "Meet your next",
    trainersPageHeadingAccent: "expert coach.",
    trainersPageSubtitle:
      "Find the right coach for your goals, preferred training style, and personal schedule.",
    trainersPageCoaches: "Professional coaches",
    trainersPageSkills: "Specialties",
    trainersPageRating: "Average rating",
    trainersSearch: "Search by name, specialty, or certification...",
    trainersSearchShort: "Search coaches...",
    trainersFilterEyebrow: "Filters",
    trainersFilterTitle: "Find your coach",
    trainersDirectory: "Trainer directory",
    trainersResults: "Choose your training partner",
    trainersFound: "coaches found",
    trainersEmptyTitle: "No matching coaches",
    trainersEmptyText: "Try another keyword or specialty.",
    trainersReset: "Clear filters",
    trainerRate: "Session rate",
    perHour: "hour",
    viewTrainer: "View trainer",
    viewDetails: "View details",
    memberReviews: "What members say",
    reviewsEyebrow: "Member stories",
    reviewsHeading: "Results that build",
    reviewsHeadingAccent: "real confidence.",
    reviewsSubtitle:
      "Real experiences from the community training at IronZone every day.",
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
    contactEyebrow: "Contact IronZone",
    contactHeading: "Come visit and",
    contactHeadingAccent: "train with us.",
    contactAddress: "Address",
    contactPhone: "Phone",
    contactEmail: "Email",
    locationEyebrow: "Gym location",
    locationTitle: "Find your way to IronZone",
    locationText:
      "IronZone is conveniently located in the heart of the city and is easy to reach by motorbike, car, or public transport.",
    openingHours: "Opening hours",
    openingHoursValue: "Daily, 6:00 AM - 10:00 PM",
    openMaps: "Open Google Maps",
    mapTitle: "IronZone location map",
    faqTitle: "Common questions",
    faqSubtitle: "Quick answers to help you get started at IronZone.",
    faqHeading: "Everything you",
    faqHeadingAccent: "need to know.",
    faqContact: "Contact support",
    faqs: [
      {
        question: "Can I try the gym before purchasing a plan?",
        answer:
          "Yes. New members can book a tour and experience the facilities before choosing a suitable membership.",
      },
      {
        question: "What are the gym opening hours?",
        answer:
          "IronZone is open daily from 6:00 AM to 10:00 PM. Group classes and personal training sessions may follow separate schedules.",
      },
      {
        question: "Can I change or upgrade my membership?",
        answer:
          "Yes. Contact our staff to upgrade your plan. The remaining value of your current membership will be reviewed during the change.",
      },
      {
        question: "Do memberships include a personal trainer?",
        answer:
          "Selected Premium and VIP plans include complimentary PT sessions. You can also purchase a PT Package for dedicated one-to-one coaching.",
      },
      {
        question: "Which payment methods are supported?",
        answer:
          "You can pay via bank transfer, MoMo, ZaloPay, VNPay, or cash at the front desk.",
      },
      {
        question: "Where can I track my membership and orders?",
        answer:
          "After signing in, open your account page to view active memberships, expiration dates, orders, and notifications.",
      },
    ],
    plansTitle: "Plans",
    plansSubtitle: "Choose a plan that fits your goals and training schedule.",
    plansPageEyebrow: "IronZone Membership",
    plansPageHeading: "Invest in your",
    plansPageHeadingAccent: "strongest self.",
    plansAvailable: "Active plans",
    plansStartingAt: "Starting price",
    plansMaxDays: "Maximum days",
    plansFilterEyebrow: "Filters",
    plansFilterTitle: "Find your plan",
    plansSortBy: "Sort by",
    plansReset: "Clear filters",
    plansDirectory: "Membership directory",
    plansResults: "Options built for you",
    plansFound: "plans found",
    plansCompareEyebrow: "Compare benefits",
    plansCompareTitle: "Choose with confidence",
    plansCompareSubtitle: "Quickly compare duration, pricing, and key membership benefits before joining.",
    membershipPlan: "Membership plan",
    planIncludes: "What is included",
    mostPopular: "Most popular",
    addToCart: "Add to cart",
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
