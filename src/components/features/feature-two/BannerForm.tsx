import BannerFormOne from "@/components/common/banner-form/BannerFormOne";

type BannerFormProps = {
  setListing: React.Dispatch<React.SetStateAction<any[]>>;
  setLocalPagination: React.Dispatch<React.SetStateAction<{
    totalPage: number;
    currentPage: number;
    perPage: number;
    total: number;
    nextPageUrl?: string | null;
    prevPageUrl?: string | null;
  }>>;
  currentPage: number;
  onPageChange: (page: number) => void;
};

const BannerForm = ({ setListing, setLocalPagination, currentPage, onPageChange }: BannerFormProps) => {
  return (
    <div className="tg-booking-form-area tg-booking-form-grid-space pb-50">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            {/* <div className="tg-booking-form-item tg-booking-form-grid"> */}
              <BannerFormOne
                setListing={setListing}
                setLocalPagination={setLocalPagination}
                currentPage={currentPage}
                onPageChange={onPageChange}
              />
              {/* <BannerFormTwo setListing={setListing} /> */}
            {/* </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerForm;
