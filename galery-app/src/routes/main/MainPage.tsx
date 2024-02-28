import React from "react";
import customFetch from "../../utils/customFetch";
import { useLoaderData } from "react-router-dom";

export const loader = async () => {
  const acces_key = "6Z2CPDb_LVCZEtxascOrsic-GMSdYzuA8RF5lzSn1CA";

  try {
    const response = customFetch.get("photos", {
      params: { order_by: "popular", client_id: acces_key },
    });
    return response;
  } catch (error) {
    console.error(error);
  }
};

const MainPage = () => {
  const data = useLoaderData() as { data: unknown };
  console.log(data.data);
  return (
    <div>
      <h1>Main Page</h1>
    </div>
  );
};

export default MainPage;
