import React from "react";
import { CirclePlus } from "lucide-react";
import { Link } from "react-router-dom";

const AddNewCard = ({ listView }) => {
  const containerClass = listView
    ? "flex flex-col items-center justify-center border-2 border-dashed border-gray-200 p-8 text-center mb-4 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
    : "flex flex-col items-center justify-center border-2 border-dashed border-gray-200 text-center rounded-lg cursor-pointer h-[20rem]  hover:bg-gray-50 transition-colors ";

  return (
    <Link to="/new-card" className={containerClass}>
      <p className="sm:text-sm text-gray-600 text-center">
        <CirclePlus size={48} className="text-blue-300" />
      </p>
      <p className="cursor-pointer text-gray-400 mt-2">Add Card</p>
      <p className="cursor-pointer text-blue-400 text-sm px-2">
        Click here to add new card
      </p>
    </Link>
  );
};

export default AddNewCard;
