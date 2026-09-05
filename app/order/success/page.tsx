import { SuccessPage } from "../../../src/components/commerce/SuccessPage";

export default async function OrderSuccess({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const params = await searchParams;
  return <SuccessPage orderId={params.order ?? ""} />;
}
