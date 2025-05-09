import React from "react";

function DetailItem({ icon, label, value, col = "" }) {
  return (
    <div className={`flex items-start ${col}`}>
      <div className="text-blue-500 mr-2 mt-1">{icon}</div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="font-medium">{value || "N/A"}</p>
      </div>
    </div>
  );
}

export default DetailItem;
