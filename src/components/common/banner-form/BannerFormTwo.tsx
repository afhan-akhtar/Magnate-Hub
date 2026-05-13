"use client";
import { apiRequest } from "@/api/axiosInstance";
import PriceRange from "@/components/features/feature-one/PriceRange";
import { FaSearch, FaRedo } from "react-icons/fa";
import { useEffect, useState } from "react";

interface BannerFormTwoProps {
  setListing: React.Dispatch<React.SetStateAction<any[]>>;
}

const BannerFormTwo: React.FC<BannerFormTwoProps> = ({ setListing }) => {
  type DropDown = { label: string; value: string }[];
  const [formData, setFormData] = useState({
    category: "",
    itemRange: "",
    sortBy: "",
    referalId: "",
    query: "",
    state: "",
    postcode: "",
    businessId: "",
    region: "",
    minPrice: "",
    maxPrice: "",
    franchise: false,
    premium: false,
    listingType: "",
  });
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<DropDown>([]);
  const [locations, setLocations] = useState<DropDown>([]);
  const [priceValue, setPriceValue] = useState([0, 5000]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const pageItem = [
    { value: 20, label: "20" },
    { value: 50, label: "50" },
    { value: 100, label: "100" },
    { value: 200, label: "200" },
    { value: 400, label: "400" },
    { value: 800, label: "800" },
  ];

 const handleChanges = (val: number[]) => {
    setPriceValue(val); 
    setFormData((prev) => ({
      ...prev,
      minPrice: String(val[0]),
      maxPrice: String(val[1]),
    }));
  };

  const getCategories = async () => {
    return apiRequest({ url: "categories", method: "GET" });
  };

  const getLocations = async () => {
    return apiRequest({ url: "locations", method: "GET" });
  };

  useEffect(() => {
    setLoading(true);

    Promise.all([getCategories(), getLocations()])
      .then(([catRes, locRes]) => {
        setCategories(
          catRes?.data?.map((c: any) => ({
            label: c.name,
            value: c.category_id,
          })) || []
        );

        setLocations(
          locRes?.data?.map((l: any) => ({
            label: l.name,
            value: l.location_id,
          })) || []
        );
      })
      .finally(() => setLoading(false));
  }, []);

  const fetchProductDataAsPerFilter = async (finalUrl: string) => {
    try {
      const response = await apiRequest({ url: finalUrl, method: "GET" });
      setListing(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const constructUrl = (filters: any) => {
    let params: any = {};

    if (filters.postcode) params.postcode = filters.postcode;
    if (filters.businessId) params.businessId = filters.businessId;
    if (filters.category) params.category = filters.category;
    if (filters.region) params.region = filters.region;
    if (filters.state) params.state = filters.state;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;

    if (!filters.all) {
      if (filters.franchise) params.franchise = "";
      if (filters.premium) params.premium = "";
    }

    return `projects?${Object.keys(params)
      .map((key) => (params[key] === "" ? key : `${params[key]}`))
      .join("&")}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const url = constructUrl(formData);
    if (url) fetchProductDataAsPerFilter(url);
  };

  const handleClear = () => {
  setFormData({
    category: "",
    itemRange: "",
    sortBy: "",
    referalId: "",
    query: "",
    state: "",
    postcode: "",
    businessId: "",
    region: "",
    minPrice: "",
    maxPrice: "",
    franchise: false,
    premium: false,
    listingType: "",
  });

  setPriceValue([0, 5000]);
  setListing([]); 
};

  return (
    <div className=" py-4">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-12">
            <div className="card border-0">
              <div className="card-body p-4">
                {/* Header */}
                <div className="text-center mb-4">
                  <h2 className="h4 text-muted">
                    Explore Unique Business Ideas, Find Your Path to Success
                  </h2>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="tab-content">
                    <div className="row g-3 mb-4">
                      <div className="col-md-6">
                        <select
                          className="form-select"
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                        >
                          <option value="">Select categories</option>
                          {categories.map((category, index) => (
                            <option key={index} value={category.value}>
                              {category.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-3">
                        <select
                          className="form-select"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                        >
                          <option value="">Select Item Range </option>
                          {pageItem.map((page, index) => (
                            <option key={index} value={page.value}>
                              {page.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-3">
                        <select
                          className="form-select"
                          name="sortBy"
                          value={formData.sortBy}
                          onChange={handleInputChange}
                        >
                          <option value="">Order By</option>
                          <option value="oldest">Oldest</option>
                          <option value="newest">Newest</option>
                        </select>
                      </div>
                      <div className="col-md-4">
                        <input
                          type="text"
                          className="form-control"
                          name="referalId"
                          value={formData.referalId}
                          onChange={handleInputChange}
                          placeholder="Write Referal Id"
                        />
                      </div>
                      <div className="col-md-4">
                        <input
                          type="text"
                          className="form-control"
                          name="query"
                          value={formData.query}
                          onChange={handleInputChange}
                          placeholder="What are you looking for?"
                        />
                      </div>
                      <div className="col-md-4">
                        <select
                          className="form-select"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                        >
                          <option value="">Select state</option>
                          {locations.map((state, index) => (
                            <option key={index} value={state.value}>
                              {state.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-5">
                        <div className="row align-items-center">
                          <div className="col-8">
                            <PriceRange
                              MAX={5000}
                              MIN={0}
                              STEP={1}
                              values={priceValue}
                              handleChanges={handleChanges}
                            />
                          </div>
                          <div className="col-4">
                            <div className=" ">
                              <span
                                className="input-range"
                                onChange={() => handleChanges}
                              >
                                ${priceValue[0]} - ${priceValue[1]}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="d-flex  justify-center gap-4">
                          <div className="checkbox d-flex">
                            <input
                              className="tg-checkbox"
                              type="checkbox"
                              name="franchise"
                              checked={formData.franchise}
                              onChange={handleInputChange}
                              id="franchiseCheck"
                            />
                            <label
                              htmlFor="franchiseCheck"
                              className="tg-label"
                            >
                              Franchise
                            </label>
                          </div>

                          <div className="checkbox d-flex">
                            <input
                              className="tg-checkbox"
                              type="checkbox"
                              name="premium"
                              checked={formData.premium}
                              onChange={handleInputChange}
                              id="premiumCheck"
                            />
                            <label
                              htmlFor="premiumCheck"
                              className="tg-label ms-2"
                            >
                              Premium Listing
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="tg-tour-about-time d-flex align-items-center mb-10">
                          <div className="form-check me-3">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="listingType"
                              id="allType"
                              value="all"
                              checked={formData.listingType === "all"}
                              onChange={handleInputChange}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="allType"
                            >
                              All
                            </label>
                          </div>

                          <div className="form-check me-3">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="listingType"
                              id="investType"
                              value="invest"
                              checked={formData.listingType === "invest"}
                              onChange={handleInputChange}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="investType"
                            >
                              Invest
                            </label>
                          </div>

                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="listingType"
                              id="buyType"
                              value="buy"
                              checked={formData.listingType === "buy"}
                              onChange={handleInputChange}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="buyType"
                            >
                              Buy
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row justify-content-end">
                      <div className="col-md-5 d-flex gap-3">
                         <button
                          type="reset"
                          onClick={handleClear}
                          className="btn w-100 h-100 d-flex align-items-center btn-clear justify-content-center gap-2"
                        >
                          <FaRedo /> Clear
                        </button>
                        <button
                          type="submit"
                          className="btn w-100 h-100 d-flex align-items-center btn-submit justify-content-center gap-2"
                        >
                          <FaSearch /> SEARCH
                        </button>
                      </div>
                    </div>

                    <div className="row mb-4">
                      <div className="col-12"></div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bootstrap Icons CDN */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
      />
      <style jsx>{`
        .btn-clear {
          background-color: #f5f5f5;
        }
        .btn-submit {
          background-color: #560ce3;
          color: white;
        }
        .nav-tabs .nav-link {
          color: #6c757d;
          font-weight: 600;
          border: none;
          padding: 1rem 2rem;
        }

        .nav-tabs .nav-link.active {
          color: #0d6efd;
          background: transparent;
          border-bottom: 3px solid #0d6efd;
        }

        .nav-tabs .nav-link:hover {
          border: none;
          border-bottom: 3px solid #dee2e6;
        }

        .card {
          border-radius: 15px;
        }

        .form-control,
        .form-select {
          border-radius: 8px;
          padding: 0.75rem 1rem;
        }

        .btn-primary {
          border-radius: 8px;
          font-weight: 600;
        }

        .input-group-text {
          border-radius: 8px 0 0 8px;
        }

        .form-control:focus,
        .form-select:focus {
          box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
        }
      `}</style>
    </div>
  );
};

export default BannerFormTwo;
