"use client";

const UpdateButton = () => {
  // change div to button
  return (
    <button className="bg-boja text-white p-2 rounded-md disabled:bg-pink-200 disabled:cursor-not-allowed max-w-96">
      Update
    </button>
  );
};

export default UpdateButton;
