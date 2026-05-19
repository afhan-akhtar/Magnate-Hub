export type ListingStatusMode = "default" | "under_offer" | "sold";

export type ListingStatusSource = {
  tag?: string;
  sold?: string | number;
};

const normalize = (value?: string) => value?.trim().toLowerCase() ?? "";

export const isListingSold = (item: ListingStatusSource) => {
  if (String(item.sold) === "1") {
    return true;
  }

  const tag = normalize(item.tag);
  return tag === "sold" || tag.startsWith("sold ");
};

export const isListingUnderOffer = (item: ListingStatusSource) => {
  if (isListingSold(item)) {
    return false;
  }

  const tag = normalize(item.tag);
  return (
    tag === "under offer" ||
    tag === "under_offer" ||
    tag.includes("under offer")
  );
};

export const getListingStatusMode = (
  item: ListingStatusSource,
): ListingStatusMode => {
  if (isListingSold(item)) {
    return "sold";
  }

  if (isListingUnderOffer(item)) {
    return "under_offer";
  }

  return "default";
};

export const getListingStatusLabel = (item: ListingStatusSource) => {
  const mode = getListingStatusMode(item);
  if (mode === "sold") {
    return "Sold";
  }
  if (mode === "under_offer") {
    return item.tag?.trim() || "Under Offer";
  }
  return "";
};
