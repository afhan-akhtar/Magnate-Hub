interface DataType {
  id: number;
  title: string;
  desc: string;
  price: number;
  list: string[];
}

const pricing_data: DataType[] = [
  {
    id: 1,
    title: "Essentials",
    desc: "The Essentials pricing tier is designed for business owners who are comfortable managing the sale of their business on their own. This is the most affordable option, which provides you with exposure to potential buyers. With this tier, you will be able to list your business on our platform and have access to our network of buyers. You will be responsible for all aspects of the sale, including the evaluation of your business, gathering the necessary documents, and communicating with potential buyers.",
    price: 149,
    list: [
      "No commissions or other fees",
      "Unlimited Edits",
      "6-Month Listing",
      "Free Non-Disclosure Document",
      "Statistics Dashboard",
      "Chat feature",
      "Includes 10% GST",
    ],
  },
  {
    id: 2,
    title: "Premium",
    desc: "The Premium pricing tier offers comprehensive support for selling your business. This includes assistance in evaluating your business to determine its value and potential market appeal, as well as help in gathering the necessary documents and paperwork and editing your listing to maximise the chances of a swift sale.You will also be guided through the whole process to make sure that the sale goes smoothly and successfully. With this tier, you can be sure that you'll get the expert help you need to make your business worth as much as possible and find the right buyer.",
    price: 1999,
    list: [
      "No commissions or other fees (if you go via a broker, you may have to pay commissions or fees)",
      "Add your business to the Magnate Premium Directory",
      "Unlimited Edits",
      "Phone consultation",
      "Write, list and manage the Ad for you",
      "Listed until sold",
      "Sell yourself or with a broker",
      "Free Non-Disclosure Document",
      "Statistics Dashboard",
      "Chat feature",
      "Includes 10% GST",
    ],
  },
  {
    id: 3,
    title: "Capital Raise",
    desc: "The ultimate solution to find investors looking to fund the next big thing. Whether you're a startup, an established business, or pre-revenue ideas, our platform connects you with a wide range of opportunities to grow your portfolio and get in front of the right people.",
    price: 249,
    list: [
      "No commissions or other fees",
      "Unlimited Listings",
      "Listed until sold",
      "Unlimited Edits",
      "Unlimited Listings Australia wide",
      "Great backlinks for more robust SEO",
      "Chat feature",
      "Includes 10% GST",
    ],
  },
  {
    id: 4,
    title: "Capital Raise",
    desc: "The ultimate solution for investors looking to fund the next big thing. Suitable for startups, established businesses or pre-revenue ideas.",
    price: 249,
    list: [
      "No commissions or other fees",
      "Unlimited Edits",
      "6-Month Listing",
      "Free Non-Disclosure Document",
      "Statistics Dashboard",
      "Chat feature",
      "Includes 10% GST",
    ],
  },
];

export default pricing_data;
