import { useContext, useEffect, useState } from "react";
import UserContext from "../store/UserContext";
import { useNavigate } from "react-router-dom";
import type { ProfileData } from "../types";

const ProfilePage = () => {
  const { user } = useContext(UserContext)!;
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:3001/users/${user.id}`);
        const data = await res.json();
        setProfile(data);
      } catch (error) {
        console.error("error loading profile", error);
      }
    };
    fetchData();
  }, [user, navigate]);

  if (!profile) return <p>Loading...</p>;
  return (
    <div>
      <h2>Welcome {user?.name}</h2>
      <section>
        <h4>Spots you have rented</h4>
        {profile.rentals.length === 0 ? (
          <p>You haven't booked any spots yet.</p>
        ) : (
          <ul className="list-group">
            {profile.rentals.map((r) => (
              <li key={r.id} className="list-group-item">
                <strong>{r.location}</strong> – {r.rent_date} at{" "}
                {r.rent_start_time} - {r.rent_end_time} ({r.price} SEK/hour)
              </li>
            ))}
          </ul>
        )}
      </section>
      <section className="mt-4">
        <h4>Your spot</h4>
        {!profile.owner_spot ? (
          <p>You do not own any spots.</p>
        ) : (
          <ul className="list-group">
            <li key={profile.owner_spot.id} className="list-group-item">
              <strong>{profile.owner_spot.location}</strong>
            </li>
          </ul>
        )}
      </section>
    </div>
  );
};

export default ProfilePage;
