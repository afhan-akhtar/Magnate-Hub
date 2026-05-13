import pricing_data from "@/data/PricingData";
import PlanClient from "./PlanClient";

export async function generateStaticParams() {
  return pricing_data.map((item: any) => ({
    slug: item.slug,
  }));
}

interface PlanPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function PlanPage({ params }: PlanPageProps) {
  const resolvedParams = await params;
  return <PlanClient slug={resolvedParams.slug} />;
}
