"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import CartModal from "./CartModal";
import { useCartStore } from "@/hooks/useCartStore";
import { useWixClient } from "@/hooks/useWixClient";

const Menu = () => {
  const [open, setOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { cart, counter, getCart } = useCartStore();
  const wixClient = useWixClient();

  useEffect(() => {
    getCart(wixClient);
  }, [wixClient, getCart]);

  const closeMenu = () => setOpen(false);

  return (
    <div className="relative">
      {isCartOpen && <CartModal />}

      {/* Navbar section */}
      <div className="flex justify-between items-center gap-6 bg-white z-40 relative">
        <div
          className="relative cursor-pointer"
          onClick={() => setIsCartOpen((prev) => !prev)}
        >
          <Image src="/cart.png" alt="Cart" width={22} height={22} />
          <div className="absolute -top-4 -right-4 w-6 h-6 bg-red-500 rounded-full text-white text-sm flex items-center justify-center">
            {counter}
          </div>
        </div>
        <Image
          src="/menu.png"
          alt="Menu"
          width={28}
          height={28}
          className="cursor-pointer"
          onClick={() => setOpen((prev) => !prev)}
        />
      </div>

      {/* Menu section */}
      {open && (
        <div className="fixed left-0 top-16 w-full h-[calc(100vh-64px)] bg-black text-white flex flex-col items-center justify-center gap-8 text-xl z-30">
          {/* Links in the menu */}
          <Link
            href="https://grand-swan-4a6621.netlify.app/"
            onClick={closeMenu}
          >
            Homepage
          </Link>
          <Link
            href="https://grand-swan-4a6621.netlify.app/list?cat=all-products"
            onClick={closeMenu}
          >
            Shop
          </Link>
          <Link href="/" onClick={closeMenu}>
            Deals
          </Link>
          <Link href="/" onClick={closeMenu}>
            About
          </Link>
          <Link href="/" onClick={closeMenu}>
            Contact
          </Link>
          <Link href="/" onClick={closeMenu}>
            Logout
          </Link>
          <Link href="/" onClick={closeMenu}>
            Cart({counter})
          </Link>
        </div>
      )}
    </div>
  );
};

export default Menu;
