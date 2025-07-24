import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast} from 'react-toastify';

const Dashboard = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const layoutStyle = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    background: '#f7f9fb',
    fontFamily: 'Inter, sans-serif'
  };

  const headerFooterStyle = {
    background: '#5085a5',
    color: '#fff',
    padding: '20px',
    display: 'flex',
    justifyContent: 'space-between', // Aligns title left, buttons right
    alignItems: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
  };

  const mainContentStyle = {
    flex: '1',
    padding: '40px 20px',
    textAlign: 'center',
    color: '#333'
  };

  const profileStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  };



  const contentWrapperStyle = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: '100%',
    marginTop: '40px',
    gap: '40px',
  };

  const profileSectionStyle = {
    width: '40%',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    padding: '0 24px',
  };

  const dividerStyle = {
    width: '1px',
    background: '#e0e7ef',
    minHeight: '420px',
    alignSelf: 'stretch',
    margin: '0 18px',
    borderRadius: '2px',
  };

  const profileContainerStyle = {
    background: '#fff',
    borderRadius: '18px',
    boxShadow: '0 2px 16px rgba(80,133,165,0.10)',
    padding: '36px 32px',
    width: '100%',
    maxWidth: '420px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
  };

  const fieldGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '22px',
    
  };

  const labelStyle = {
    fontWeight: '500',
    color: '#5085a5',
    marginBottom: '8px',
    fontSize: '1.1rem',
    textAlign:'left'
  };

  const inputStyle = {
    padding: '16px 14px',
    borderRadius: '12px',
    border: '1px solid #e0e7ef',
    fontSize: '1.08rem',
    background: '#f7fafd',
    color: '#333',
    outline: 'none',
    marginBottom: '0',
  };

  const buttonRowStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '10px',
  };

  const actionButtonStyle = {
    padding: '12px 28px',
    borderRadius: '8px',
    border: 'none',
    fontWeight: '700',
    fontSize: '1rem',
    cursor: 'pointer',
    background: 'linear-gradient(90deg, #5085A5 60%, #7FC7D9 100%)',
    color: '#fff',
    transition: 'background 0.2s',
  };

  const editButtonStyle = {
    ...actionButtonStyle,
    background: '#e0e7ef',
    color: '#397399',
  };

  const rightSectionStyle = {
    width: '50%',
    minHeight: '300px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#aaa',
    fontSize: '1.2rem',
  };

  // Add avatar style
  const avatarStyle = {
    width: '90px',
    height: '90px',
    borderRadius: '50%',
    objectFit: 'cover',
    margin: '0 auto 18px auto',
    background: '#e0e7ef',
    display: 'block',
  };
 

  const [profile, setProfile] = useState({
    aadhar: '',
    members: '',
    area: '',
    place: '',
    city: '',
    state: '',
    pincode: '',
    ward: '',
  });

  const [editing, setEditing] = useState(false);
  const [location, setLocation] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [geoError, setGeoError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [menuOpen, setMenuOpen] = React.useState(false);

  // Load profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5555/user/${userId}`);
        if (data && data.profile) {
          const { aadhar, members, location } = data.profile;
          setProfile({
            aadhar,
            members,
            area: location.area,
            place: location.place,
            city: location.city,
            state: location.state,
            pincode: location.pincode,
            ward: location.ward,
          });
        }
      } catch (error) {
        toast.error('Failed to fetch profile:', error.message);
      }
    };
    fetchProfile();
  }, [userId]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleEdit = () => setEditing(true);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const { aadhar, members, area, place, city, state, pincode, ward } = profile;

      const response = await axios.post(`http://localhost:5555/user/${userId}`, {
        aadhar,
        members,
        location: { area, place, city, state, pincode, ward },
      });

      if (response.data.message) {
        toast.success(response.data.message);
      }

      setEditing(false);
    } catch (err) {
      if (err.response?.data?.message) {
        setLoginError(err.response.data.message);
      } else {
        toast.error('Save error:', err.message);
      }
    }
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setLocation({ lat, lng });
        setShowMap(true);
        setGeoError(null);

        try {
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyBuSA6XXz7ZmSFonptlXs1ALyNTZfLrf8g`
          );
          const data = await response.json();
          if (data.status === 'OK' && data.results.length > 0) {
            const address = data.results[0].address_components;
            const getComponent = (type) => {
              const comp = address.find((c) => c.types.includes(type));
              return comp ? comp.long_name : '';
            };
            setProfile((prev) => ({
              ...prev,
                area: getComponent('sublocality_level_1') || getComponent('sublocality') || '',
                place: getComponent('route') || getComponent('sublocality') || getComponent('locality'),
                city: getComponent('locality') || getComponent('administrative_area_level_2') || '',
                state: getComponent('administrative_area_level_1') || '',
                pincode: getComponent('postal_code') || '',
              ward: prev.ward, // Keep existing if not updated
            }));
          }
        } catch (err) {
          toast.error('Reverse geocoding error:', err.message);
        }
      },
      (error) => {
        setGeoError('Unable to retrieve your location.');
        setShowMap(false);
      }
    );
  };

  const unifiedButtonStyle = {
    marginTop: '8px',
    padding: '14px 0',
    borderRadius: '10px',
    background: 'linear-gradient(90deg, #687864 0%, #5085A5 100%)',
    color: '#fff',
    fontSize: '1.1rem',
    fontWeight: 600,
    border: 'none',
    cursor: 'pointer',
    transition: 'background 0.2s',
    width: '100%',
    boxSizing: 'border-box',
    display: 'block',
  };

  // For header/logout button, override width and use a red background for active/logout
  const headerButtonStyle = {
    width: '44px',
    height: '44px',
    minWidth: '44px',
    minHeight: '44px',
    borderRadius: '50%',
    background: 'linear-gradient(90deg, #e57373 0%, #d32f2f 100%)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    transition: 'background 0.2s',
    boxShadow: '0 2px 8px rgba(211,47,47,0.10)',
    cursor: 'pointer',
    marginLeft: '12px',
  };

  const menuButtonStyle = {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    background: '#fff',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(80,133,165,0.10)',
    cursor: 'pointer',
    marginRight: '18px',
    marginLeft: '0',
    transition: 'background 0.2s',
  };

  const menuDropdownStyle = {
    position: 'absolute',
    top: '70px',
    left: '30px',
    background: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 16px rgba(80,133,165,0.15)',
    padding: '12px 0',
    zIndex: 100,
    minWidth: '140px',
    display: menuOpen ? 'block' : 'none',
  };

  const menuItemStyle = {
    padding: '12px 24px',
    color: '#5085a5',
    fontWeight: 600,
    fontSize: '1rem',
    background: 'none',
    border: 'none',
    width: '100%',
    textAlign: 'left',
    cursor: 'pointer',
    outline: 'none',
    transition: 'background 0.2s',
  };

  return (
    <div style={layoutStyle}>
      <header style={headerFooterStyle}>
        <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
          <button
            style={menuButtonStyle}
            aria-label="Menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#5085a5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>
          </button>
          <div style={menuDropdownStyle}>
            <button style={menuItemStyle} onClick={() => { setMenuOpen(false); navigate('/dashboard'); }}>Home</button>
            <button style={menuItemStyle} onClick={() => { setMenuOpen(false); navigate('/issues'); }}>Issues</button>
          </div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', letterSpacing: '2px' }}>SAVE SOME</h1>
        </div>
        <div style={profileStyle}>
          <button style={headerButtonStyle} onClick={() => navigate('/auth')}
            aria-label="Logout"
            onMouseOver={e => e.currentTarget.style.background = 'linear-gradient(90deg, #d32f2f 0%, #e57373 100%)'}
            onMouseOut={e => e.currentTarget.style.background = 'linear-gradient(90deg, #e57373 0%, #d32f2f 100%)'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          </button>
        </div>
      </header>


      <main style={mainContentStyle}>
     
        <div style={contentWrapperStyle}>
          
          <form style={profileSectionStyle}>
            <div style={profileContainerStyle}>
              <img
                src="https://api.dicebear.com/7.x/bottts/svg?seed=cartoon"
                alt="Profile Avatar"
                style={avatarStyle}
              />
              <div style={fieldGroupStyle}>
                <label style={labelStyle}>User ID</label>
                <input style={inputStyle} type="text" value={userId} readOnly />
              </div>
              <div style={fieldGroupStyle}>
                <label style={labelStyle}>Aadhar Number</label>
                <input style={inputStyle} type="text" name="aadhar" value={profile.aadhar || ''} onChange={handleChange} disabled={!editing} />
              </div>
              <div style={fieldGroupStyle}>
                <label style={labelStyle}>Members</label>
                <input style={inputStyle} type="number" name="members" value={profile.members || ''} onChange={handleChange} disabled={!editing} />
              </div>

              <div style={fieldGroupStyle}>
                <label style={labelStyle}>Ward Number</label>
                <input style={inputStyle} type="number" name="ward" value={profile.ward || ''} onChange={handleChange} disabled={!editing} />
              </div>
              <div style={fieldGroupStyle}>
                <label style={labelStyle}>Area</label>
                <input style={inputStyle} type="text" name="area" value={profile.area || ''} onChange={handleChange} disabled={!editing} />
              </div>
              <div style={fieldGroupStyle}>
                <label style={labelStyle}>Place</label>
                <input style={inputStyle} type="text" name="place" value={profile.place || ''} onChange={handleChange} disabled={!editing} />
              </div>
              <div style={fieldGroupStyle}>
                <label style={labelStyle}>City</label>
                <input style={inputStyle} type="text" name="city" value={profile.city || ''} onChange={handleChange} disabled={!editing} />
              </div>
              <div style={fieldGroupStyle}>
                <label style={labelStyle}>State</label>
                <input style={inputStyle} type="text" name="state" value={profile.state || ''} onChange={handleChange} disabled={!editing} />
              </div>
              <div style={fieldGroupStyle}>
                <label style={labelStyle}>Pincode</label>
                <input style={inputStyle} type="text" name="pincode" value={profile.pincode || ''} onChange={handleChange} disabled={!editing} />
              </div>
              <div style={buttonRowStyle}>
                {!editing && (
                  <button style={unifiedButtonStyle} onClick={handleEdit} type="button">Edit</button>
                )}
                {editing && (
                  <button style={unifiedButtonStyle} onClick={handleSave} type="submit">Save</button>
                )}
              </div>
            </div>
          </form>
          <div style={dividerStyle}></div>
          <div style={rightSectionStyle}>
            <div style={{ width: '100%', textAlign: 'center' }}>
              <button
                style={unifiedButtonStyle}
                onClick={handleDetectLocation}
              >
                Detect My Location
              </button>
              {geoError && (
                <div style={{ color: 'red', marginBottom: '16px' }}>{geoError}</div>
              )}
              {showMap && location && (
                <iframe
                  title="Google Map"
                  width="100%"
                  height="700"
                  style={{ border: 0, borderRadius: '12px', marginTop: '10px' }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={
                    location
                      ? `https://www.google.com/maps/embed/v1/search?key=AIzaSyBuSA6XXz7ZmSFonptlXs1ALyNTZfLrf8g&q=${location.lat},${location.lng}&zoom=15&maptype=satellite`
                      : `https://www.google.com/maps/embed/v1/view?key=AIzaSyBuSA6XXz7ZmSFonptlXs1ALyNTZfLrf8g&center=20.5937,78.9629&zoom=5&maptype=satellite`
                  }
                ></iframe>
              )}
            </div>
          </div>
        </div>
      </main>
      <footer style={headerFooterStyle}>Save Some</footer>
    </div>
  );
};

export default Dashboard;