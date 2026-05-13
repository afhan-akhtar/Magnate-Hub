import { FaStore, FaHandshake, FaChartLine } from "react-icons/fa";
import Image from "next/image";
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
    icon: <FaStore size={40} color="#631ee5" />,
    title: "Extensive Marketplace",
    desc: "Our platform boasts a diverse range of businesses available for sale and investment opportunities. From small local enterprises to large-scale ventures, you'll find a wide selection of options.",
  },
  {
    id: 2,
    icon: <FaHandshake size={40} color="#631ee5" />,
    title: "User-Friendly Interface",
    desc: "We've designed our platform with simplicity in mind. Easily list your business for sale or search for potential acquisitions. Our intuitive tools ensure a seamless experience.",
  },
  {
    id: 3,
    icon: <FaChartLine size={40} color="#631ee5" />,
    title: "Capital Raising",
    desc: "If you're seeking capital to fuel your business growth, Magnate Hub is the ideal place to connect with investors interested in your industry.",
  },
];

const Choose = () => {
  return (
    <div className="tg-chose-area tg-grey-bg pt-140 pb-70 p-relative z-index-1">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-6 col-lg-7 col-md-9">
            <div className="tg-chose-section-title text-center mb-35">
              <h5
                className="tg-section-subtitle mb-15 wow fadeInUp"
                data-wow-delay=".3s"
                data-wow-duration=".1s"
              >
                Choose us
              </h5>
              <h2
                className="mb-15 wow fadeInUp"
                data-wow-delay=".4s"
                data-wow-duration=".9s"
              >
                Why Choose Magnate Hub?
              </h2>
            </div>
          </div>
        </div>
        <div className="row">
          {choose_data.map((item) => (
            <div key={item.id} className="col-lg-4 col-md-6 mb-30">
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

export default Choose;
