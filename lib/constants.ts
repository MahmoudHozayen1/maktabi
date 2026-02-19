export const CITIES = [
    { value: 'cairo', label: 'Cairo', labelAr: 'القاهرة' },
    { value: 'giza', label: 'Giza', labelAr: 'الجيزة' },
    { value: 'alexandria', label: 'Alexandria', labelAr: 'الإسكندرية' },
    { value: 'new-cairo', label: 'New Cairo', labelAr: 'القاهرة الجديدة' },
    { value: '6th-october', label: '6th October', labelAr: '٦ أكتوبر' },
];

export const DISTRICTS = {
    cairo: [
        { value: 'maadi', label: 'Maadi', labelAr: 'المعادي' },
        { value: 'nasr-city', label: 'Nasr City', labelAr: 'مدينة نصر' },
        { value: 'heliopolis', label: 'Heliopolis', labelAr: 'مصر الجديدة' },
        { value: 'downtown', label: 'Downtown', labelAr: 'وسط البلد' },
        { value: 'zamalek', label: 'Zamalek', labelAr: 'الزمالك' },
    ],
    'new-cairo': [
        { value: 'fifth-settlement', label: 'Fifth Settlement', labelAr: 'التجمع الخامس' },
        { value: 'first-settlement', label: 'First Settlement', labelAr: 'التجمع الأول' },
        { value: 'rehab', label: 'Rehab City', labelAr: 'الرحاب' },
    ],
    giza: [
        { value: 'dokki', label: 'Dokki', labelAr: 'الدقي' },
        { value: 'mohandessin', label: 'Mohandessin', labelAr: 'المهندسين' },
        { value: 'agouza', label: 'Agouza', labelAr: 'العجوزة' },
    ],
};

export const AMENITIES = [
    { value: 'wifi', label: 'Wi-Fi', icon: 'wifi' },
    { value: 'parking', label: 'Parking', icon: 'car' },
    { value: 'ac', label: 'Air Conditioning', icon: 'thermometer' },
    { value: 'security', label: '24/7 Security', icon: 'shield' },
    { value: 'elevator', label: 'Elevator', icon: 'arrow-up' },
    { value: 'reception', label: 'Reception', icon: 'user' },
    { value: 'meeting-room', label: 'Meeting Room', icon: 'users' },
    { value: 'kitchen', label: 'Kitchen', icon: 'utensils' },
    { value: 'printer', label: 'Printer', icon: 'printer' },
    { value: 'furnished', label: 'Furnished', icon: 'sofa' },
];

export const STARTUP_STAGES = [
    { value: 'idea', label: 'Idea Stage' },
    { value: 'mvp', label: 'MVP' },
    { value: 'early', label: 'Early Traction' },
    { value: 'growth', label: 'Growth' },
    { value: 'scale', label: 'Scale' },
];

export const STARTUP_SECTORS = [
    { value: 'fintech', label: 'FinTech' },
    { value: 'healthtech', label: 'HealthTech' },
    { value: 'edtech', label: 'EdTech' },
    { value: 'ecommerce', label: 'E-Commerce' },
    { value: 'logistics', label: 'Logistics' },
    { value: 'proptech', label: 'PropTech' },
    { value: 'agritech', label: 'AgriTech' },
    { value: 'saas', label: 'SaaS' },
    { value: 'other', label: 'Other' },
];

export const WHATSAPP_NUMBER = '+201554515541';
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER.replace('+', '')}`;

export const RATE_LIMIT = 50; // requests per day
export const DEFAULT_PAGE_SIZE = 12;