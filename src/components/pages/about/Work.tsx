import {
  FaRegClipboard,
  FaHandshake,
  FaComments,
  FaUserTie,
} from "react-icons/fa";
import { JSX } from "react";

interface DataType {
  id: number;
  icon: JSX.Element;
  title: string;
  desc: string;
}

const choose_data: DataType[] = [
  {
    id: 1,
    icon: <FaRegClipboard size={40} color="#631ee5" />,
    title: "Listing Your Business",
    desc: "If you're looking to sell your business, create a detailed listing highlighting your company's strengths, financials, and growth potential.",
  },
  {
    id: 2,
    icon: <FaHandshake size={40} color="#631ee5" />,
    title: "Connecting with Buyers",
    desc: "Buyers can easily search for businesses that align with their interests and investment criteria. Our platform offers advanced search filters to narrow down your options.",
  },
  {
    id: 3,
    icon: <FaComments size={40} color="#631ee5" />,
    title: "Discussions",
    desc: "Initiate confidential discussions and negotiations with potential buyers or sellers while protecting your sensitive information. Use our chat feature to communicate securely before sharing any personal details.",
  },
  {
    id: 4,
    icon: <FaUserTie size={40} color="#631ee5" />,
    title: "Professional Support",
    desc: "If you need assistance, our team of experts and agents is available to provide guidance and support at every step of the process.",
  },
];

const Work = () => {
  return (
    <div className="tg-chose-area tg-grey-bg pt-140 pb-70 p-relative z-index-1">
      <div className="container-fluid px-5">
        {/* Section Title */}
        <div className="row justify-content-center">
          <div className="col-xl-6 col-lg-7 col-md-9">
            <div className="tg-chose-section-title text-center mb-35">
              <h5
                className="tg-section-subtitle mb-15 wow fadeInUp"
                data-wow-delay=".3s"
                data-wow-duration=".1s"
              >
                Works
              </h5>
              <h2
                className="mb-15 wow fadeInUp"
                data-wow-delay=".4s"
                data-wow-duration=".9s"
              >
                How It Works
              </h2>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="row">
          {choose_data.map((item) => (
            <div key={item.id} className="col-lg-3 col-md-6 mb-30">
              <div className="tg-chose-6-wrap h-100 text-center">
                <span className="icon mb-20 d-inline-block">{item.icon}</span>
                <h4 className="tg-chose-6-title mb-15">{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Work;
