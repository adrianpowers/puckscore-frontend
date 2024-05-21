import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "react-image-crop/dist/ReactCrop.css";
import HomeButton from "./utils/HomeButton";
import Modal from "./utils/Modal";
import { findPlayerById } from "./utils/api";

export default function PlayerProfile() {
  const { playerId } = useParams();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const profilePictureUrl = useRef( 
    "https://static.wixstatic.com/media/76788e_adba916be6f64d93ad5b96724915968b~mv2.png/v1/fill/w_615,h_646,al_c,lg_1,q_90,enc_auto/Air%20Hockey%20Logo_20220923.png"
  );
  const [modalOpen, setModalOpen] = useState(false);

  const updateProfilePicture = (source) => {
    profilePictureUrl.current = source;
  };

  useEffect(() => {
    async function getPlayer() {
      try {
        const data = await findPlayerById(playerId);
        setPlayer(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    }

    getPlayer();
  }, [playerId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-secondary-blue to-tertiary-blue text-white text-2xl font-bold flex flex-col justify-center items-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-secondary-blue to-tertiary-blue text-white text-2xl font-bold flex flex-col justify-center items-center">
        Error: {error}
      </div>
    );
  }

  if (!player) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-secondary-blue to-tertiary-blue text-white text-2xl font-bold flex flex-col justify-center items-center">
        Player not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-secondary-blue to-tertiary-blue text-white text-2xl font-bold flex flex-col">
      <div className="p-6 text-center">
        <HomeButton />
        {player.name.callsign ? (
          <h1 className="text-4xl pt-2">{`${player.name.firstName} "${player.name.callsign}" ${player.name.lastName}`}</h1>
        ) : (
          <h1 className="text-4xl pt-2">
            {`${player.name.firstName} ${player.name.lastName}`}
          </h1>
        )}
        <h1 className="pt-1">{`NC-${player.stateRank} | W-${player.worldRank}`}</h1>
      </div>
      <div
        id="profilePicture"
        className="relative w-[50%] pb-[50%] self-center"
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white pt-3">
          {profilePictureUrl !== "" && (
            <img src={profilePictureUrl.current} alt="Profile Photo" />
          )}
          <button
            title="Change Profile Picture"
            className="w-full p-2 bg-primary-red hover:bg-primary-blue text-white text-sm"
            onClick={() => setModalOpen(true)}
          >
            Change Profile Picture
          </button>
        </div>
      </div>
      {modalOpen && (
        <Modal
          updateProfilePicture={updateProfilePicture}
          closeModal={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
