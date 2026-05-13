interface DataType {
  id: number;
  slug?: string;
  title: string;
  desc: string;
  price: number;
  list: string[];
  suitable?: string;
}

const pricing_data: DataType[] = [
  {
    id: 5,
    title: "Free Package",
    slug: "free_plan",
    desc: `The Free Package is the perfect starting point for business owners who want to list their business professionally without any upfront cost. It gives sellers the essential tools to market their business, connect with buyers, and manage the sale themselves on Magnate Hub.

With 0% commission, 3 post-publish listing edits, and secure chat with registered users only, this package is designed to help you stay in control, gain valuable exposure, and manage buyer enquiries with more confidence.`,
    price: 0,
    list: [
      "Free listing",
      "0% commission",
      "3-month listing",
      "3 post-publish listing edits",
      "Business sale preparation checklist",
      "Statistics dashboard",
      "Secure chat feature",
      "Registered-user messaging",
      "Email notifications for new messages",
      "1 listing per transaction",
      "Upgrade anytime for more visibility and features",
    ],
    suitable:
      "Business owners wanting an affordable way to test the market and manage their own sale.",
  },
  {
    id: 1,
    title: "Essentials Package",
    slug: "essentials",
    desc: `The Essentials Package is ideal for business owners who want to manage the sale themselves while gaining stronger visibility and access to additional seller tools. It is a cost-effective option for those who want more exposure than the Free Package while still remaining in control of the process.

With 0% commission, unlimited edits, premium positioning, and a 30-day listing refresh option, this package is designed to improve visibility, strengthen your listing presentation, and help attract more serious buyer interest.`,
    price: 149,
    list: [
      "0% commission",
      "6-month listing",
      "Unlimited edits",
      "Free Non-Disclosure Agreement template",
      "Business sale preparation checklist",
      "Premium positioning when listed",
      "30-day listing refresh option",
      "Buyer alerts to users interested in your category or business type",
      "Statistics dashboard",
      "Secure chat feature",
      "Registered-user messaging",
      "Email notifications for new messages",
      "1 listing per transaction",
    ],
    suitable:
      "Business owners who want an affordable way to manage their own sale while gaining stronger exposure, better positioning, and additional tools to support the selling process.",
  },
  {
    id: 4,
    title: "Capital Raise Package",
    slug: "capitai_rise",
    desc: `The Capital Raise Package is designed for startups, established businesses, and founders seeking investment to grow their venture. It is ideal for those who want to present their opportunity professionally, attract investor interest, and gain exposure to a relevant audience on Magnate Hub.

With 0% commission, unlimited edits, and a 12-month listing period, this package is designed to help you present your opportunity professionally, attract investor attention, and give your raise the time it needs to gain traction.`,
    price: 249,
    list: [
      "0% commission",
      "12-month listing",
      "Unlimited edits",
      "Free Non-Disclosure Agreement template",
      "Statistics dashboard",
      "Secure chat feature",
      "Registered-user messaging",
      "Email notifications for new messages",
      "1 listing per transaction",
    ],
    suitable:
      "Startups, established businesses, and pre-revenue ideas seeking capital or investment.",
  },
  {
    id: 3,
    title: "Broker Pro Package",
    slug: "enterprise",
    desc: `The Broker Pro Package is designed for brokers, agents, and franchisors who need a powerful, professional solution for managing multiple listings at scale. It is ideal for businesses that want ongoing exposure, stronger branding, and the flexibility to manage a large portfolio of opportunities across the Magnate Hub platform.

With 0% commission, unlimited listings, 30-day listing refreshes, premium branding features, and support to get your listings live quickly and efficiently, this package is designed to maximise visibility, strengthen credibility, and make portfolio management simple and efficient.`,
    price: 1499,
    list: [
      "0% commission",
      "Unlimited users",
      "Unlimited listings",
      "Listed until sold",
      "Unlimited edits",
      "Australia-wide listing access",
      "Standout listing presentation",
      "Verified partner badge",
      "Broker name displayed on listings",
      "Broker company displayed on listings",
      "Agent image displayed on listings",
      "30-day listing refreshes",
      "Ability to pause, reactivate, or remove listings anytime",
      "Feed integration and listing setup support",
      "Inclusion in the Magnate Premium Directory",
      "Featured in Magnate Hub newsletters",
      "Social media promotional support",
      "Strong backlinks to support SEO",
      "Statistics dashboard",
      "Secure chat feature",
      "Registered-user messaging",
      "Email notifications for new messages",
      "1 flat annual fee",
    ],
    suitable:
      "Brokers, agents, and franchisors who want to market multiple listings professionally while benefiting from stronger branding, flexible control, and ongoing exposure.",
  },
  {
    id: 2,
    title: "Premium Package",
    slug: "premium",
    desc: `The Premium Package is designed for business owners who want a more hands-on, professionally supported approach to selling their business. It is ideal for sellers who want expert help presenting their business, improving buyer confidence, and positioning the opportunity in the strongest possible light.

With 0% commission, unlimited edits, fortnightly listing refreshes, business evaluation, and a professionally prepared Information Memorandum, this package is designed to maximise visibility, enhance buyer confidence, and position your business for the strongest possible outcome.`,
    price: 1999,
    list: [
      "0% commission",
      "Listed until sold",
      "Unlimited edits",
      "Business evaluation",
      "Information Memorandum included",
      "Phone consultation",
      "We professionally prepare and list your advert",
      "Free Non-Disclosure Agreement template",
      "Business sale preparation checklist",
      "Premium positioning when listed",
      "Fortnightly listing refresh",
      "Inclusion in the Magnate Premium Directory",
      "Featured in a Magnate Hub social media post",
      "Featured in the Magnate Hub newsletter",
      "Statistics dashboard",
      "Secure chat feature",
      "Registered-user messaging",
      "Email notifications for new messages",
      "1 listing per transaction",
    ],
    suitable:
      "Business owners who want expert support with valuing, presenting, and marketing their business while improving visibility and buyer confidence throughout the sale process.",
  },
];

export default pricing_data;
