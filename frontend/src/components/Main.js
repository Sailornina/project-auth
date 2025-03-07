import React, { /*useState*/ useEffect } from "react";
import { useDispatch, useSelector, batch } from "react-redux";
import { useNavigate } from "react-router-dom";
import user from "reducers/user";
import { API_URL } from "utils/urls";

const Main = () => {
  // const [secret, setSecret] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const accessToken = useSelector((store) => store.user.accessToken);
	const username = useSelector((store) => store.user.username)
  const logout = () => {
    batch(() => {
      dispatch(user.actions.setUsername(null));
      dispatch(user.actions.setAccessToken(null));
      localStorage.removeItem("user");
    })
  };
  useEffect(() => {
    if (!accessToken) {
      navigate('/login')
    }
  }, [accessToken, navigate])

  // useEffect(() => {
  //   const options = {
  //     method: 'GET',
  //     headers: {
  //       Authorization: accessToken,
  //     },
  //   }

  //   fetch(API_URL('secrets'), options)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       console.log("Response: " + data);
  //       if (data.success) {
  //         setSecret(data.message)
  //       }
  //     })
  // }, [accessToken])

  return (
    <div className="secret-page">
      <h1 className="secret-title">Welcome to your page {username}</h1>
			<p>Here is where magic will happen!</p>
      <div className="secret-container">
        {/* <p className="secret-text">{secret}</p> */}
      </div>
      <button className="secret-button-logout" onClick={logout}>
        Logout
      </button>
    </div>
  );
};

export default Main;
