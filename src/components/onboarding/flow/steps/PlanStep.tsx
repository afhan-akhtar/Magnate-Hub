"use client";

import SimpleBar from "simplebar-react"
import { Swiper, SwiperSlide } from "swiper/react";
import type { PlanStepProps, PricingItem } from "../types";
import styles from "../../OnboardingFlow.module.css";

const PlanStep = ({
  plans,
  selectedPlan,
  selectedRole,
  expandedPlanDescriptions,
  planSwiperRef,
  onSelectPlan,
  onPlanCardKeyDown,
  onToggleDescription,
  onContinue,
}: PlanStepProps) => (
  <>
    {plans.length > 1 && (
      <div className={styles.planToolbar}>
        <p className={styles.planToolbarText}>
          Swipe to compare plans and pick the best fit.
        </p>
        <div className={styles.planNav}>
          <button
            type="button"
            className={styles.planNavButton}
            onClick={() => planSwiperRef.current?.slidePrev()}
            aria-label="Show previous plans"
          >
            <i className="fa-solid fa-arrow-left-long" />
          </button>
          <button
            type="button"
            className={styles.planNavButton}
            onClick={() => planSwiperRef.current?.slideNext()}
            aria-label="Show next plans"
          >
            <i className="fa-solid fa-arrow-right-long" />
          </button>
        </div>
      </div>
    )}

    <div className={styles.planGrid}>
      <Swiper
        className={styles.planSwiper}
        spaceBetween={16}
        slidesPerView={1.18}
        watchOverflow={true}
        breakpoints={{
          576: { slidesPerView: 1.35 },
          768: { slidesPerView: 1.9 },
          1200: { slidesPerView: 2.35 },
        }}
        onSwiper={(swiper) => {
          planSwiperRef.current = swiper;
        }}
      >
        {plans.map((plan: PricingItem) => {
          const planKey = plan.slug || String(plan.id);
          const isActive = plan.slug === selectedPlan.slug;
          const isRecommended = selectedRole?.recommendedPlanSlug === plan.slug;
          const isExpanded = Boolean(expandedPlanDescriptions[planKey]);
          const shouldShowToggle = plan.desc.trim().length > 140;

          return (
            <SwiperSlide key={plan.id} className={styles.planSlide}>
              <div
                role="button"
                tabIndex={0}
                className={`${styles.planCard} ${
                  isActive ? styles.planCardActive : ""
                }`}
                onClick={() => onSelectPlan(plan.slug || "")}
                onKeyDown={(event) =>
                  onPlanCardKeyDown(event, plan.slug || "")
                }
              >
                <div className={styles.planHeader}>
                  <div>
                    <h3 className={styles.planTitle}>{plan.title}</h3>
                    <p className={styles.planPrice}>
                      ${plan.price}
                      <span>{plan.price === 0 ? " / free" : " / once off"}</span>
                    </p>
                  </div>
                  {isRecommended && (
                    <span className={styles.recommendedTag}>Recommended</span>
                  )}
                </div>

                <div className={styles.planDescriptionWrap}>
                  <p
                    className={`${styles.planDescription} ${
                      !isExpanded ? styles.planDescriptionCollapsed : ""
                    }`}
                  >
                    {plan.desc.trim()}
                  </p>
                  {shouldShowToggle && (
                    <button
                      type="button"
                      className={styles.readMoreButton}
                      onClick={(event) => {
                        event.stopPropagation();
                        onToggleDescription(planKey);
                      }}
                    >
                      {isExpanded ? "Read less" : "Read more"}
                    </button>
                  )}
                </div>

                <SimpleBar autoHide={false} className={styles.planListScroll}>
                  <ul className={styles.planList}>
                    {plan.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </SimpleBar>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>

    <div className={styles.actionRow}>
      <button
        type="button"
        className={styles.primaryButton}
        onClick={onContinue}
      >
        Continue to checkout
      </button>
    </div>
  </>
);

export default PlanStep;
