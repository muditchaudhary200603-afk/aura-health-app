export type ServiceRecord = {
  slug: string;
  name: string;
  category: string;
  summary: string;
  description: string;
  featured: boolean;
  accent: string;
  image: string;
};

export type SpecialistRecord = {
  slug: string;
  name: string;
  role: string;
  specialty: string;
  experienceLabel: string;
  bio: string;
  featured: boolean;
  image: string;
};

export const siteCopy = {
  heroTitle: "Unleash your healthiest self with care that feels deeply human.",
  heroBody:
    "Aura Health blends precision medicine, concierge-style attention, and calm spatial design into one modern clinical sanctuary.",
  heroTag: "The Clinical Sanctuary",
  aboutTitle: "Medicine with gravity, warmth, and a sense of place",
  aboutBody:
    "At Aura Health, we believe medicine is as much about human connection as it is about clinical excellence. Every touchpoint is designed to feel composed, reassuring, and meticulously intentional.",
  servicesIntroTitle: "Our medical expertise",
  servicesIntroBody:
    "Experience a new standard of healthcare where clinical precision meets sanctuary-like serenity. Our multidisciplinary approach keeps specialist care coordinated, fast, and deeply personalized.",
  innovationTitle: "The future of precision medicine",
  innovationBody:
    "We invest in advanced diagnostics and real-time clinical insight to eliminate guesswork and provide definitive clarity.",
  specialistsTitle: "World-class specialists, chosen for both expertise and empathy",
  contactTitle: "Get in touch",
  contactBody:
    "We are here to provide the clarity, responsiveness, and care your health journey deserves.",
  ctaTitle: "Begin your path to better health",
  ctaBody:
    "Schedule a consultation with our specialists and experience a premium standard of care that stays thoughtful on every screen."
};

export const contactDetails = {
  hqName: "Aura Heights",
  district: "The Clinical Sanctuary District, Suite 402",
  addressLine1: "1200 Wellness Blvd",
  addressLine2: "Aura Heights",
  city: "Sanctuary City",
  state: "SC",
  postalCode: "90210",
  phoneDisplay: "+1 (800) AURA",
  phoneHref: "tel:+18002872",
  emailDisplay: "care@aurahealth.clinical",
  emailHref: "mailto:care@aurahealth.clinical",
  responseTime: "Typically responds within 1 business hour"
};

export const clinicHours = [
  { dayLabel: "Mon - Fri", open: "08:00 AM", close: "07:00 PM", status: "Open" },
  { dayLabel: "Saturday", open: "09:00 AM", close: "04:00 PM", status: "Open" },
  { dayLabel: "Sunday", open: null, close: null, status: "Emergency Only" }
];

export const stats = [
  { label: "Patients cared for", value: "15k+" },
  { label: "Satisfaction rating", value: "98%" },
  { label: "Years of expertise", value: "20+" },
  { label: "Clinical awards", value: "50+" }
];

export const innovations = [
  {
    title: "AI-assisted lab analysis",
    body: "Processing biomarkers with 99.9% clinical accuracy for faster, more reliable care pathways."
  },
  {
    title: "3D MRI and CT imaging",
    body: "Ultra-high-resolution structural mapping for earlier insights and greater diagnostic confidence."
  },
  {
    title: "Real-time vitals tracking",
    body: "Continuous monitoring through integrated wearable tech and clinician-informed review."
  },
  {
    title: "Genomic profiling",
    body: "Tailoring treatments to your unique genetic blueprint for deeply personalized care."
  }
];

export const plans = [
  {
    name: "Premium Wellness Plan",
    priceLabel: "$150/month",
    badge: "Most Popular",
    summary:
      "Our most comprehensive package for individuals who prioritize long-term preventative health and wellness optimization.",
    features: ["24/7 Virtual Concierge", "Monthly Specialist Consults", "Priority Appointment Booking"],
    featured: true
  },
  {
    name: "Basic Care",
    priceLabel: "$49/month",
    badge: null,
    summary: "Essential coverage for peace of mind.",
    features: ["Annual wellness exam", "Virtual follow-ups", "Care navigation support"],
    featured: false
  },
  {
    name: "Family Elite",
    priceLabel: "$299/month",
    badge: "Recommended for families",
    summary: "Complete protection and coordinated care for your loved ones.",
    features: ["Family scheduling", "Pediatric fast-track", "Priority specialist referrals"],
    featured: false
  }
];

export const servicesSeed: ServiceRecord[] = [
  {
    slug: "cardiology",
    name: "Cardiology",
    category: "Heart and vascular care",
    summary: "Advanced cardiovascular diagnostics and personalized treatment plans for optimal heart health and longevity.",
    description:
      "From prevention to intervention, our cardiology team pairs advanced imaging, biomarker-led diagnostics, and concierge follow-through to keep care precise and calm.",
    featured: true,
    accent: "from-emerald-400/25 to-teal-300/10",
    image:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80"
  },
  {
    slug: "orthopedics",
    name: "Orthopedics",
    category: "Movement and recovery",
    summary: "Precision surgery and regenerative therapies designed to restore movement and enhance your lifestyle.",
    description:
      "We combine surgical excellence, rehabilitation planning, and regenerative medicine to support a faster return to strength and mobility.",
    featured: true,
    accent: "from-cyan-400/20 to-sky-200/10",
    image:
      "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1200&q=80"
  },
  {
    slug: "neurology",
    name: "Neurology",
    category: "Cognitive and neural health",
    summary: "Comprehensive cognitive wellness programs focusing on neurological health and neuro-regenerative care.",
    description:
      "Aura Health neurology supports complex diagnoses with thoughtful longitudinal care, cognitive assessments, and precision imaging workflows.",
    featured: true,
    accent: "from-fuchsia-300/20 to-rose-200/10",
    image:
      "https://images.unsplash.com/photo-1530026186672-2cd00ffc50fe?auto=format&fit=crop&w=1200&q=80"
  },
  {
    slug: "pediatrics",
    name: "Pediatrics",
    category: "Children and family care",
    summary: "A gentle, nurturing environment for our youngest patients to thrive.",
    description:
      "Our pediatric pathways are built for trust, continuity, and a reassuring experience for children and caregivers alike.",
    featured: true,
    accent: "from-amber-200/40 to-orange-200/10",
    image:
      "https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&w=1200&q=80"
  },
  {
    slug: "dermatology",
    name: "Dermatology",
    category: "Aesthetic and medical",
    summary: "Medical dermatology and refined aesthetic care in one discreet, design-led setting.",
    description:
      "From chronic skin concerns to aesthetic interventions, our dermatology service combines clinical rigor with natural-looking outcomes.",
    featured: false,
    accent: "from-stone-300/30 to-white/10",
    image:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=1200&q=80"
  },
  {
    slug: "preventive-care",
    name: "Preventive Care",
    category: "Primary and proactive care",
    summary: "Comprehensive health screenings and proactive lifestyle guidance.",
    description:
      "Designed for early insight and long-range wellbeing, with screenings, reviews, and tailored prevention plans.",
    featured: false,
    accent: "from-lime-200/30 to-emerald-100/10",
    image:
      "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80"
  },
  {
    slug: "advanced-diagnostics",
    name: "Advanced Diagnostics",
    category: "Imaging and analysis",
    summary: "Precision medical imaging and exhaustive laboratory analysis.",
    description:
      "Our diagnostics stack combines imaging, lab intelligence, and clinician review for faster, more confident answers.",
    featured: false,
    accent: "from-slate-300/30 to-cyan-100/10",
    image:
      "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1200&q=80"
  }
];

export const clinicInfo = {
  addressLine1: contactDetails.addressLine1,
  addressLine2: contactDetails.addressLine2,
  cityLine: `${contactDetails.city}, ${contactDetails.state} ${contactDetails.postalCode}`,
  hours: [
    { label: "Mon - Fri", value: "8:00 AM - 7:00 PM" },
    { label: "Saturday", value: "9:00 AM - 4:00 PM" },
    { label: "Sunday", value: "Emergency Only" }
  ]
};

export const specialistsSeed: SpecialistRecord[] = [
  {
    slug: "helena-vancroft",
    name: "Dr. Helena Vancroft",
    role: "Chief Medical Officer",
    specialty: "Regenerative Medicine",
    experienceLabel: "20+ years leading clinical strategy",
    bio: "Pioneering regenerative medicine and clinical governance at Aura Health for over two decades.",
    featured: true,
    image:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=900&q=80"
  },
  {
    slug: "julian-thorne",
    name: "Dr. Julian Thorne",
    role: "Director of Neurology",
    specialty: "Neurology",
    experienceLabel: "18 years in complex neuro-care",
    bio: "Known for calm communication and sharp diagnostic judgment across cognitive and neurovascular cases.",
    featured: true,
    image:
      "https://images.unsplash.com/photo-1612349316228-5942a9b489c2?auto=format&fit=crop&w=900&q=80"
  },
  {
    slug: "marcus-chen",
    name: "Dr. Marcus Chen",
    role: "Lead Cardiologist",
    specialty: "Cardiology",
    experienceLabel: "15+ years clinical experience",
    bio: "Specializes in preventive cardiology, advanced diagnostics, and long-horizon heart health plans.",
    featured: false,
    image:
      "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=900&q=80"
  },
  {
    slug: "sarah-el-baz",
    name: "Dr. Sarah El-Baz",
    role: "Senior Pediatrician",
    specialty: "Pediatrics",
    experienceLabel: "12+ years clinical experience",
    bio: "Leads family-centered pediatric care with a reputation for reassurance, speed, and continuity.",
    featured: false,
    image:
      "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=900&q=80"
  },
  {
    slug: "james-wilson",
    name: "Dr. James Wilson",
    role: "Orthopedic Surgeon",
    specialty: "Orthopedics",
    experienceLabel: "22+ years clinical experience",
    bio: "Focused on surgical precision, regenerative protocols, and recovery planning for high-performance lives.",
    featured: false,
    image:
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=900&q=80"
  }
];
