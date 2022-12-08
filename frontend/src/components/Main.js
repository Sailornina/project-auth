import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import user from '../reducers/user';
import { API_URL } from "../utils/urls";


const Main = () => {
  const [secret, setSecret] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const accessToken = useSelector((store) => store.user.accessToken);

  const logout = () => {
    batch(() => {
      dispatch(user.actions.setUsername(null));
      dispatch(user.actions.setAccessToken(null));

      localStorage.removeItem('user');
    });
  };

  useEffect(() => {
    if (!accessToken) {
      navigate('/login')
    }
  }, [accessToken, navigate])

  useEffect(() => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: accessToken,
      },
    }

    fetch(API_URL('secrets'), options)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSecret(data.response)
        }
      })
  }, [accessToken])

  return (
    <div className="secret-page">
      <h1>Do you want here?</h1>
      <div>
        <p>{secret.message}</p>
      </div>
      <button className="button-logout" onClick={logout}>
        Logout
      </button>
    </div>
  );
};

export default Main;
