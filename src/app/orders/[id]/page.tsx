import { wixClientServer } from "@/lib/wixClientServer";
import Link from "next/link";
import { notFound } from "next/navigation";

const OrderPage = async ({ params }: { params: { id: string } }) => {
  const id = params.id;

  const wixClient = await wixClientServer();

  let order;
  try {
    order = await wixClient.orders.getOrder(id);
  } catch (error) {
    return notFound();
  }

  // console.log(order);

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] items-center justify-center">
      <h1 className="text-xl">Detalji Porudzbine</h1>
      <div className="mt-12 flex flex-col gap-6">
        <div className="">
          <span className="font-medium">Id: </span>
          <span>{order._id}</span>
        </div>
        <div className="">
          <span className="font-medium">Ime Primaoca: </span>
          <span>
            {order.billingInfo?.contactDetails?.firstName + " "}
            {order.billingInfo?.contactDetails?.lastName}
          </span>
        </div>
        <div className="">
          <span className="font-medium">E-mail: </span>
          <span>{order.buyerInfo?.email}</span>
        </div>
        <div className="">
          <span className="font-medium">Cena: </span>
          <span>{order.priceSummary?.subtotal?.amount}</span>
        </div>
        <div className="">
          <span className="font-medium">Status Placanja: </span>
          <span>{order.paymentStatus}</span>
        </div>
        <div className="">
          <span className="font-medium">Status Porudzbine: </span>
          <span>{order.status}</span>
        </div>
        <div className="">
          <span className="font-medium">Adresa: </span>
          <span>
            {order.billingInfo?.address?.addressLine1 + " "}
            {order.billingInfo?.address?.city}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
