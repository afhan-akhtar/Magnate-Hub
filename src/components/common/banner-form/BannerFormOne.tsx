import { apiRequest } from "@/api/axiosInstance";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { FaRedo, FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";

type BannerFormProps = {
  setListing: React.Dispatch<React.SetStateAction<any[]>>;
  setLocalPagination?: React.Dispatch<
    React.SetStateAction<{
      totalPage: number;
      currentPage: number;
      perPage: number;
      total: number;
      nextPageUrl?: string | null;
      prevPageUrl?: string | null;
    }>
  >;
  currentPage?: number;
  onPageChange?: (page: number) => void;
};

const BannerFormOne = ({
  setListing,
  setLocalPagination,
  currentPage = 1,
  onPageChange,
}: BannerFormProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isInitialMount = useRef(true);
  const hasLoadedFromUrl = useRef(false);
  const lastFetchUrl = useRef<string>("");
  const shouldNotifyRef = useRef(false);
  const shouldScrollRef = useRef(false);
  type DropDown = { label: string; value: string }[];
  const [activeTab, setActiveTab] = useState<"businesses" | "agencies">("businesses");
  const [formData, setFormData] = useState({
    postcode: "",
    businessId: "",
    category: "",
    state: "",
    region: "",
    minPrice: "",
    maxPrice: "",
    franchise: false,
    premium: false,
    all: false,
    sPostcode: "",
    agency: "",
    state2: "",
    region2: "",
  });

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<DropDown>([]);
  const [locations, setLocations] = useState<DropDown>([]);
  const [businessRegions, setBusinessRegions] = useState<DropDown>([]);
  const [agencyRegions, setAgencyRegions] = useState<DropDown>([]);

  const [businessRegionLoading, setBusinessRegionLoading] = useState(false);
  const [agencyRegionLoading, setAgencyRegionLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    const newForm = {
      ...formData,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    };

    setFormData(newForm);

    if (name === "state") {
      getBusinessRegionsById(value);
    }

    if (name === "state2") {
      getAgencyRegionsById(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();


    if (onPageChange) onPageChange(1);

    // const isMissingRequired =
    //   activeTab === "businesses" && !formData.postcode?.trim();
    // if (isMissingRequired) {
    //   toast.error("Please fill required field: Search by name.", {
    //     position: "top-center",
    //   });
    //   return;
    // }

    shouldNotifyRef.current = true;
    shouldScrollRef.current = true;

    if (pathname === "/") {
      sessionStorage.setItem("mh-listing-search", "1");
      const queryParams = new URLSearchParams();

      if (activeTab === "businesses") {
        if (formData.postcode) queryParams.append("postcode", formData.postcode);
        if (formData.businessId) queryParams.append("businessId", formData.businessId);
        if (formData.category) queryParams.append("category", formData.category);
        if (formData.state) queryParams.append("state", formData.state);
        if (formData.region) queryParams.append("region", formData.region);
        if (formData.minPrice) queryParams.append("minPrice", formData.minPrice);
        if (formData.maxPrice) queryParams.append("maxPrice", formData.maxPrice);
        if (formData.franchise) queryParams.append("franchise", "1");
        if (formData.premium) queryParams.append("premium", "1");
        if (formData.all) queryParams.append("all", "true");
      } else if (activeTab === "agencies") {
        if (formData.sPostcode) queryParams.append("postcode", formData.sPostcode);
        if (formData.agency) queryParams.append("agency", formData.agency);
        if (formData.state2) queryParams.append("state", formData.state2);
        if (formData.region2) queryParams.append("region", formData.region2);
      }

      queryParams.append("tab", activeTab);
      router.push(`/listings?${queryParams.toString()}`);
    } else {
      const url = constructUrl(formData, 1);
      if (url) {
        fetchProductDataAsPerFilter(url);
      }
    }
  };

  const getCategories = async () => {
    return apiRequest({ url: "categories", method: "GET" });
  };

  const getLocations = async () => {
    return apiRequest({ url: "locations", method: "GET" });
  };

  const getBusinessRegionsById = async (id: string) => {
    try {
      setBusinessRegionLoading(true);
      const response = await apiRequest({
        url: `regions?locationId=${id}`,
        method: "GET",
      });

      setBusinessRegions(
        response?.data?.map((r: any) => ({
          label: r.name,
          value: r.id,
        })) || []
      );
    } finally {
      setBusinessRegionLoading(false);
    }
  };

  const getAgencyRegionsById = async (id: string) => {
    try {
      setAgencyRegionLoading(true);
      const response = await apiRequest({
        url: `regions?locationId=${id}`,
        method: "GET",
      });

      setAgencyRegions(
        response?.data?.map((r: any) => ({
          label: r.name,
          value: r.id,
        })) || []
      );
    } finally {
      setAgencyRegionLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([getCategories(), getLocations()])
      .then(([catRes, locRes]) => {
        setCategories(
          catRes?.data?.map((c: any) => ({
            label: c.name,
            value: c.id,
          })) || []
        );

        setLocations(
          locRes?.data?.map((l: any) => ({
            label: l.name,
            value: l.id,
          })) || []
        );
      })
      .finally(() => setLoading(false));
  }, []);

  const constructUrl = (
    filters: any,
    page: number = 1,
    perPage: number = 12,
    tabOverride?: "businesses" | "agencies"
  ) => {
    const tabToUse = tabOverride ?? activeTab;
    let params: any = {};
    if (tabToUse === "businesses") {
      if (filters.postcode) params.postcode = filters.postcode;
      if (filters.businessId) params.businessId = filters.businessId;
      if (filters.category) params.category = filters.category;
      if (filters.region) params.region = filters.region;
      if (filters.state) params.state = filters.state;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;

      if (!filters.all) {
        if (filters.franchise) params.franchise = 1;
        if (filters.premium) params.premium = 1;
      }
      params.per_page = perPage;
      params.page = page;
      return `projects?${Object.keys(params)
        .map((key) => `${key}=${encodeURIComponent(params[key])}`)
        .join("&")}`;
    }

    if (tabToUse === "agencies") {
      if (filters.sPostcode) params.postcode = filters.sPostcode;
      if (filters.agency) params.agency = filters.agency;
      if (filters.state2) params.state = filters.state2;
      if (filters.region2) params.region = filters.region2;
      params.type = 3
      params.per_page = perPage;
      params.page = page;
      return `projects?${Object.keys(params)
        .map((key) => `${key}=${encodeURIComponent(params[key])}`)
        .join("&")}`;
    }
  };

  const minPriceRanges = [
    { value: "0", label: "$0" },
    { value: "25000", label: "$25,000" },
    { value: "50000", label: "$50,000" },
    { value: "75000", label: "$75,000" },
    { value: "100000", label: "$100,000" },
    { value: "200000", label: "$200,000" },
    { value: "300000", label: "$300,000" },
    { value: "400000", label: "$400,000" },
    { value: "500000", label: "$500,000" },
    { value: "600000", label: "$600,000" },
    { value: "700000", label: "$700,000" },
    { value: "800000", label: "$800,000" },
    { value: "900000", label: "$900,000" },
    { value: "1000000", label: "$1,000,000" },
    { value: "2000000", label: "$2,000,000" },
    { value: "3000000", label: "$3,000,000" },
    { value: "4000000", label: "$4,000,000" },
    { value: "5000000", label: "$5,000,000+" },
  ];

  const maxPriceRanges = [
    { value: "25000", label: "$25,000" },
    { value: "50000", label: "$50,000" },
    { value: "75000", label: "$75,000" },
    { value: "100000", label: "$100,000" },
    { value: "200000", label: "$200,000" },
    { value: "300000", label: "$300,000" },
    { value: "400000", label: "$400,000" },
    { value: "500000", label: "$500,000" },
    { value: "600000", label: "$600,000" },
    { value: "700000", label: "$700,000" },
    { value: "800000", label: "$800,000" },
    { value: "900000", label: "$900,000" },
    { value: "1000000", label: "$1,000,000" },
    { value: "2000000", label: "$2,000,000" },
    { value: "3000000", label: "$3,000,000" },
    { value: "4000000", label: "$4,000,000" },
    { value: "5000000", label: "$5,000,000+" },
  ];

  const handleClear = () => {
    const clearedData = {
      postcode: "",
      businessId: "",
      category: "",
      state: "",
      region: "",
      minPrice: "",
      maxPrice: "",
      franchise: false,
      premium: false,
      all: false,
      sPostcode: "",
      agency: "",
      state2: "",
      region2: "",
    };

    setFormData(clearedData);
    shouldNotifyRef.current = false;
    shouldScrollRef.current = false;

    if (onPageChange) {
      onPageChange(1);
    }
    lastFetchUrl.current = "";
    setListing([]);
    getListingData(1, clearedData, activeTab);
  };

  const getListingData = (
    page: number = 1,
    filters?: typeof formData,
    tabOverride?: "businesses" | "agencies"
  ) => {
    const initialUrl = constructUrl(filters || formData, page, 12, tabOverride);
    if (initialUrl) {
      fetchProductDataAsPerFilter(initialUrl);
    }
  };

  const fetchProductDataAsPerFilter = async (finalUrl: string) => {
    if (lastFetchUrl.current === finalUrl) {
      return;
    }
    lastFetchUrl.current = finalUrl;

    try {
      const response = await apiRequest({ url: finalUrl, method: "GET" });
      const results = response?.data?.data || [];
      setListing(results);
      if (setLocalPagination) {
        setLocalPagination({
          totalPage: response?.data?.last_page || 1,
          currentPage: response?.data?.current_page || 1,
          perPage: response?.data?.per_page || 12,
          total: response?.data?.total || 0,
          nextPageUrl: response?.data?.next_page_url,
          prevPageUrl: response?.data?.prev_page_url,
        });
      }
      if (shouldNotifyRef.current) {
        if (results.length > 0) {
          // toast.success("Results loaded successfully.", { position: "top-center" });
        } else {
          toast.error("No results found for your search.", { position: "top-center" });
        }
        shouldNotifyRef.current = false;
      }
      if (shouldScrollRef.current) {
        requestAnimationFrame(() => {
          const target = document.getElementById("listing-results");
          target?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
        shouldScrollRef.current = false;
      }
    } catch (error) {
      console.error(error);
      if (shouldNotifyRef.current) {
        toast.error("Search failed. Please try again.", { position: "top-center" });
        shouldNotifyRef.current = false;
      }
    }
  };

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (setLocalPagination && currentPage && currentPage >= 1) {
      getListingData(currentPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);


  useEffect(() => {
    if (pathname === "/listings" && searchParams && Array.from(searchParams.keys()).length > 0) {
      return;
    }
    getListingData(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (pathname !== "/listings" || !searchParams) return;
    if (hasLoadedFromUrl.current) return;
    hasLoadedFromUrl.current = true;
    const shouldNotify = sessionStorage.getItem("mh-listing-search") === "1";
    if (shouldNotify) {
      sessionStorage.removeItem("mh-listing-search");
      shouldNotifyRef.current = true;
      shouldScrollRef.current = true;
    }

    const tabParam = searchParams.get("tab");
    const tab: "businesses" | "agencies" =
      tabParam === "agencies" ? "agencies" : "businesses";
    setActiveTab(tab);

    const newFormData = {
      postcode: "",
      businessId: "",
      category: "",
      state: "",
      region: "",
      minPrice: "",
      maxPrice: "",
      franchise: false,
      premium: false,
      all: false,
      sPostcode: "",
      agency: "",
      state2: "",
      region2: "",
    };

    if (tab === "businesses") {
      newFormData.postcode = searchParams.get("postcode") || "";
      newFormData.businessId = searchParams.get("businessId") || "";
      newFormData.category = searchParams.get("category") || "";
      newFormData.state = searchParams.get("state") || "";
      newFormData.region = searchParams.get("region") || "";
      newFormData.minPrice = searchParams.get("minPrice") || "";
      newFormData.maxPrice = searchParams.get("maxPrice") || "";
      newFormData.franchise =
        searchParams.get("franchise") === "1" ||
        searchParams.get("franchise") === "true";
      newFormData.premium =
        searchParams.get("premium") === "1" ||
        searchParams.get("premium") === "true";
      newFormData.all = searchParams.get("all") === "true";

      if (newFormData.state) {
        getBusinessRegionsById(newFormData.state);
      }
    }

    if (tab === "agencies") {
      newFormData.sPostcode = searchParams.get("postcode") || "";
      newFormData.agency = searchParams.get("agency") || "";
      newFormData.state2 = searchParams.get("state") || "";
      newFormData.region2 = searchParams.get("region") || "";

      if (newFormData.state2) {
        getAgencyRegionsById(newFormData.state2);
      }
    }

    setFormData(newFormData);
    setTimeout(() => {
      const params: any = {};
      if (tab === "businesses") {
        if (newFormData.postcode) params.postcode = newFormData.postcode;
        if (newFormData.businessId) params.businessId = newFormData.businessId;
        if (newFormData.category) params.category = newFormData.category;
        if (newFormData.region) params.region = newFormData.region;
        if (newFormData.state) params.state = newFormData.state;
        if (newFormData.minPrice) params.minPrice = newFormData.minPrice;
        if (newFormData.maxPrice) params.maxPrice = newFormData.maxPrice;

        if (!newFormData.all) {
          if (newFormData.franchise) params.franchise = 1;
          if (newFormData.premium) params.premium = 1;
        }
        params.per_page = 12;
        params.page = 1;
        const url = `projects?${Object.keys(params)
          .map((key) => `${key}=${encodeURIComponent(params[key])}`)
          .join("&")}`;
        fetchProductDataAsPerFilter(url);
      } else if (tab === "agencies") {
        if (newFormData.sPostcode) params.postcode = newFormData.sPostcode;
        if (newFormData.agency) params.agency = newFormData.agency;
        if (newFormData.state2) params.state = newFormData.state2;
        if (newFormData.region2) params.region = newFormData.region2;
        params.per_page = 12;
        params.page = 1;
        params.type = 3;
        const url = `projects?${Object.keys(params)
          .map((key) => `${key}=${encodeURIComponent(params[key])}`)
          .join("&")}`;
        fetchProductDataAsPerFilter(url);
      }
    }, 50);
  }, [pathname, searchParams]);


  const isListing = pathname.includes("listing");

  return (
    <div className=" py-4">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="glass-card shadow-sm border-0">
              <div className="card-body p-4">
                {/* Header */}
                <div className="text-center mb-4">
                  {/* <h1 className="display-5 fw-bold text-primary mb-2">SESES</h1> */}
                  <h2 className="h4 text-white ">
                    Find Business & Investments
                  </h2>
                </div>

                {/* Tab Navigation */}
                <ul className="nav nav-tabs nav-justified mb-4" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link ${activeTab === "businesses" ? "active" : ""
                        } ${isListing ? "tab-listing-color" : ""}`}
                      onClick={() => {
                        setActiveTab("businesses");
                        getListingData(1, undefined, "businesses");
                      }}
                      type="button"
                      role="tab"
                    >
                      FIND BUSINESSES
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link ${activeTab === "agencies" ? "active" : ""
                        } ${isListing ? "tab-listing-color" : ""}`}
                      onClick={() => {
                        setActiveTab("agencies");
                        getListingData(1, undefined, "agencies");
                      }}
                      type="button"
                      role="tab"
                    >
                      FIND INVESTMENTS
                    </button>
                  </li>
                </ul>
                <form onSubmit={handleSubmit}>
                  {/* Businesses Tab Content */}
                  {activeTab === "businesses" && (
                    <div className="tab-content">
                      {/* Search Row */}
                      <div className="row mb-4">
                        <div className="col-md-12">
                          <div className="input-group">
                            <span className="input-group-text banner-search-addon bg-white border-end-0">
                              <i className="fas fa-search text-muted"></i>
                            </span>
                            <input
                              type="text"
                              className="form-control banner-search-control border-start-0"
                              name="postcode"
                              value={formData.postcode}
                              onChange={handleInputChange}
                              placeholder="Search by name"
                            />
                          </div>
                        </div>
                        {/* <div className="col-md-2">
                          <button
                            type="submit"
                            className="btn btn-primary w-100 h-100"
                          >
                            SEARCH
                          </button>
                        </div> */}
                      </div>

                      {/* Filters Row */}
                      <div className="row g-3 mb-4">
                        <div className="col-md-6">
                          <input
                            type="text"
                            className="form-control banner-search-control"
                            name="businessId"
                            value={formData.businessId}
                            onChange={handleInputChange}
                            placeholder="Keywords or Business ID"
                          />
                        </div>
                        <div className="col-md-6">
                          <select
                            className="form-select banner-search-control"
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            required={false}
                          >
                            <option value="">Select category</option>
                            {categories.map((category, index) => (
                              <option key={index} value={category.value}>
                                {category.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-md-3">
                          <select
                            className="form-select banner-search-control"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            required={false}
                          >
                            <option value="">Select state</option>
                            {locations.map((state, index) => (
                              <option key={index} value={state.value}>
                                {state.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-md-3">
                          <select
                            className="form-select banner-search-control"
                            name="region"
                            value={formData.region}
                            onChange={handleInputChange}
                            required={false}
                          >
                            {businessRegionLoading ? (
                              <option>Loading regions...</option>
                            ) : businessRegions.length === 0 ? (
                              <option value="">Select Region</option>
                            ) : (
                              <>
                                <option value="">Select Region</option>
                                {businessRegions.map((r, index) => (
                                  <option key={index} value={r.value}>
                                    {r.label}
                                  </option>
                                ))}
                              </>
                            )}
                          </select>

                        </div>
                        <div className="col-md-3">
                          <select
                            className="form-select banner-search-control"
                            name="minPrice"
                            value={formData.minPrice}
                            onChange={handleInputChange}
                          >
                            <option value="">Min price</option>
                            {minPriceRanges.map((price, index) => (
                              <option key={index} value={price.value}>
                                {price.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-md-3">
                          <select
                            className="form-select banner-search-control"
                            name="maxPrice"
                            value={formData.maxPrice}
                            onChange={handleInputChange}
                          >
                            <option value="">Max price</option>
                            {maxPriceRanges.map((price, index) => (
                              <option key={index} value={price.value}>
                                {price.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Checkboxes */}
                      <div className="row mb-4">
                        <div className="col-12">
                          <div className="form-check form-check-inline">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="franchise"
                              checked={formData.franchise}
                              onChange={handleInputChange}
                              id="franchiseCheck"
                            />
                            <label
                              className={`form-check-label ${isListing ? "tab-listing-color" : ""
                                }`}
                              htmlFor="franchiseCheck"
                            >
                              Franchise
                            </label>
                          </div>
                          <div className="form-check form-check-inline">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="premium"
                              checked={formData.premium}
                              onChange={handleInputChange}
                              id="premiumCheck"
                            />
                            <label
                              className={`form-check-label ${isListing ? "tab-listing-color" : ""
                                }`}
                              htmlFor="premiumCheck"
                            >
                              Premium Listing
                            </label>
                          </div>
                          <div className="form-check form-check-inline">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="all"
                              checked={formData.all}
                              onChange={handleInputChange}
                              id="allCheck"
                            />
                            <label
                              className={`form-check-label ${isListing ? "tab-listing-color" : ""
                                }`}
                              htmlFor="allCheck"
                            >
                              All
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="row justify-content-end">
                        <div className="col-md-5 d-flex gap-3">
                          <button
                            type="reset"
                            className="btn w-100 d-flex align-items-center banner-action-button btn-clear justify-content-center gap-2"
                            onClick={handleClear}
                          >
                            <FaRedo /> Clear
                          </button>
                          <button
                            type="submit"
                            className="btn w-100 d-flex align-items-center banner-action-button btn-submit justify-content-center gap-2"
                          >
                            <FaSearch /> SEARCH
                          </button>
                        </div>
                      </div>

                      {/* Bottom Link */}
                      <div className="text-center mt-4">
                        <span className="text-decoration-none text-white">
                          <u>
                            Sell your business or advertise your business for
                            sale
                          </u>
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Agencies Tab Content */}
                  {activeTab === "agencies" && (
                    <div className="tab-content">
                      {/* Search Row */}
                      <div className="row mb-4">
                        <div className="col-md-12">
                          <div className="input-group">
                            <span className="input-group-text banner-search-addon bg-white border-end-0">
                              <i className="fas fa-search text-muted"></i>
                            </span>
                            <input
                              type="text"
                              className="form-control banner-search-control border-start-0"
                              name="sPostcode"
                              value={formData.sPostcode}
                              onChange={handleInputChange}
                              placeholder="Search by keywords"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row g-3">
                        {/* <div className="col-md-4">
                          <input
                            type="text"
                            className="form-control"
                            name="agency"
                            value={formData.agency}
                            onChange={handleInputChange}
                            placeholder="Find Investment"
                          />
                        </div> */}
                        <div className="col-md-4">
                          <select
                            className="form-select banner-search-control"
                            name="state2"
                            value={formData.state2}
                            onChange={handleInputChange}
                            required={false}
                          >
                            <option value="">Select state</option>
                            {locations.map((state, index) => (
                              <option key={index} value={state.value}>
                                {state.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-md-4">
                          <select
                            className="form-select banner-search-control"
                            name="region2"
                            value={formData.region2}
                            onChange={handleInputChange}
                            required={false}
                          >
                            {agencyRegionLoading ? (
                              <option>Loading regions...</option>
                            ) : agencyRegions.length === 0 ? (
                              <option value="">Select Region</option>
                            ) : (
                              <>
                                <option value="">Select Regions</option>
                                {agencyRegions.map((r, index) => (
                                  <option key={index} value={r.value}>
                                    {r.label}
                                  </option>
                                ))}
                              </>
                            )}
                          </select>

                        </div>
                      </div>
                      <div className="row justify-content-end mt-4">
                        <div className="col-md-5 d-flex gap-3">
                          <button
                            type="reset"
                            className="btn w-100 d-flex align-items-center banner-action-button btn-clear justify-content-center gap-2"
                            onClick={handleClear}
                          >
                            <FaRedo /> Clear
                          </button>
                          <button
                            type="submit"
                            className="btn w-100 d-flex align-items-center banner-action-button btn-submit justify-content-center gap-2"
                          >
                            <FaSearch /> SEARCH
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
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
        h4 {
          color: white !important;
        }
        .tab-listing-color {
          color: gray !important;
        }
        .form-check label {
          color: white;
        }
          
        .form-check-input:checked {
          background-color: #560ce3;
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 20px;
          transition: all 0.3s ease;
        }

        .glass-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        }
        .btn-clear {
          background-color: #f5f5f5;
        }
        .btn-submit {
          background-color: #560ce3;
          color: white;
        }
        .nav-tabs .nav-link {
          color: #f5f5f5;
          font-weight: 600;
          border: none;
          border-bottom: 3px solid white;
          padding: 1rem 2rem;
        }

        .nav-tabs .nav-link.active {
          color: white;
          background: transparent;
          border-bottom: 3px solid #560ce3;
        }

        .nav-tabs .nav-link:hover {
          border: none;
          border-bottom: 3px solid #560ce3;
        }

        .card {
          border-radius: 15px;
        }

        .form-control,
        .form-select {
          border-radius: 8px;
          padding: 0.75rem 1rem;
        }

        .input-group {
          align-items: stretch;
        }

        .banner-search-control {
          height: 50px;
          min-height: 50px;
          padding: 0 16px;
          font-size: 14px;
          line-height: 1.2;
          border-radius: 12px;
        }

        .banner-search-control.form-select {
          padding-right: 2.5rem;
        }

        .banner-search-addon {
          display: flex;
          align-items: center;
          height: 50px;
          min-height: 50px;
          padding: 0 16px;
          border-radius: 12px 0 0 12px;
        }

        .banner-search-control.border-start-0 {
          border-radius: 0 12px 12px 0;
        }

        .banner-action-button {
          min-height: 50px;
          height: 50px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 700;
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

export default BannerFormOne;
