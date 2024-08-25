import { createClient, OAuthStrategy } from "@wix/sdk";
import { products, collections } from "@wix/stores";
import { orders } from "@wix/ecom";
import { members } from "@wix/members";
import { cookies } from "next/headers";
import Link from "next/link";
import { format } from "timeago.js";

const wixClientServer = async () => {
  let refreshToken;
  let accessToken;

  try {
    const cookieStore = cookies();
    refreshToken = JSON.parse(cookieStore.get("refreshToken")?.value || "{}");
    accessToken = JSON.parse(cookieStore.get("accessToken")?.value || "{}");
  } catch (e) {
    console.error("Error parsing cookies:", e);
  }

  const wixClient = createClient({
    modules: {
      products,
      collections,
      orders,
      members,
    },
    auth: OAuthStrategy({
      clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID!,
      tokens: {
        refreshToken,
        accessToken,
      },
    }),
  });

  return wixClient;
};

const ProfilePage = async () => {
  const wixClient = await wixClientServer();

  if (!wixClient.auth) {
    return (
      <div className="text-center mt-8">Error initializing authentication.</div>
    );
  }

  let isLoggedIn;
  try {
    isLoggedIn = wixClient.auth.loggedIn();
  } catch (e) {
    console.error("Error calling loggedIn:", e);
    return (
      <div className="text-center mt-8">
        Error checking authentication status.
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="text-center mt-8">
        User not logged in or role not available.
      </div>
    );
  }

  const fetchedUser = await wixClient.members
    .getCurrentMember({
      fieldsets: [members.Set.FULL],
    })
    .catch((err) => {
      console.error("Error fetching user:", err);
    });

  const orderRes = await wixClient.orders
    .searchOrders({
      search: {
        filter: {
          "buyerInfo.contactId": { $eq: fetchedUser?.member?.contactId },
        },
      },
    })
    .catch((err) => {
      console.error("Error fetching orders:", err);
    });

  if (!fetchedUser || !orderRes) {
    return (
      <div className="text-center mt-8">
        Error fetching user or orders data.
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-24 md:h-[calc(100vh-180px)] items-center px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
      <div className="w-full md:w-1/2">
        <h1 className="text-2xl">Profile</h1>
        <form className="mt-12 flex flex-col gap-4">
          <label className="text-sm text-gray-700">Username</label>
          <input
            type="text"
            name="username"
            placeholder={fetchedUser.member?.profile?.nickname || "john"}
            className="ring-1 ring-gray-300 rounded-md p-2 max-w-96"
          />
          <label className="text-sm text-gray-700">First Name</label>
          <input
            type="text"
            name="firstName"
            placeholder={fetchedUser.member?.contact?.firstName || "John"}
            className="ring-1 ring-gray-300 rounded-md p-2 max-w-96"
          />
          <label className="text-sm text-gray-700">Surname</label>
          <input
            type="text"
            name="lastName"
            placeholder={fetchedUser.member?.contact?.lastName || "Prezime"}
            className="ring-1 ring-gray-300 rounded-md p-2 max-w-96"
          />
          <label className="text-sm text-gray-700">Phone</label>
          <input
            type="text"
            name="phone"
            placeholder={
              (fetchedUser.member?.contact?.phones &&
                fetchedUser.member?.contact?.phones[0]) ||
              "+381 64 22 22 33 9"
            }
            className="ring-1 ring-gray-300 rounded-md p-2 max-w-96"
          />
          <label className="text-sm text-gray-700">E-mail</label>
          <input
            type="email"
            name="email"
            placeholder={fetchedUser.member?.loginEmail || "ime@gmail.com"}
            className="ring-1 ring-gray-300 rounded-md p-2 max-w-96"
          />
        </form>
      </div>
      <div className="w-full md:w-1/2">
        <h1 className="text-2xl">Orders</h1>
        <div className="mt-12 flex flex-col">
          {orderRes.orders.map((order: any) => (
            <Link
              href={`/orders/${order._id}`}
              key={order._id}
              className="flex justify-between px-2 py-6 rounded-md hover:bg-green-50 even:bg-slate-100"
            >
              <span className="w-1/4">{order._id?.substring(0, 10)}...</span>
              <span className="w-1/4">
                RSD {order.priceSummary?.subtotal?.amount}
              </span>
              {order._createdDate && (
                <span className="w-1/4">{format(order._createdDate)}</span>
              )}
              <span className="w-1/4">{order.status}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
