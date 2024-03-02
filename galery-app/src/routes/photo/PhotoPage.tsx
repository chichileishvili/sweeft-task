import React from "react";
import { useParams } from "react-router-dom";
import customFetch from "../../utils/customFetch";
import { useEffect, useState } from "react";
import { Photo } from "../main/MainPage.interface.";
import { Link } from "react-router-dom";
import { FaFileDownload } from "react-icons/fa";
import { GrLike } from "react-icons/gr";
import { FaEye } from "react-icons/fa";
import "./PhotoPage.style.css";

const fetchPhoto = async (id: string) => {
  const acces_key = "6Z2CPDb_LVCZEtxascOrsic-GMSdYzuA8RF5lzSn1CA";
  const response = await customFetch.get(`photos/${id}`, {
    params: { client_id: acces_key },
  });
  return response.data;
};

const PhotoPage = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<Photo | null>(null);
  console.log(data);

  useEffect(() => {
    if (id) {
      fetchPhoto(id).then((photoData) => {
        setData(photoData);
      });
    }
  }, [id]);

  return (
    <>
      <nav>
        <Link to={"/"}>Home Page</Link>
      </nav>

      <div className="photo-container">
        <h1>{data?.description}</h1>
        <img
          width={500}
          height={500}
          src={data?.urls.small}
          alt={data?.description}
        />
        <span>
          <FaFileDownload />: {data?.downloads}
        </span>
        <span>
          <GrLike />: {data?.likes}
        </span>
        <span>
          <FaEye />: {data?.views}
        </span>
      </div>
    </>
  );
};
export default PhotoPage;
