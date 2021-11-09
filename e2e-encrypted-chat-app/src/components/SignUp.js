import { useRef, useContext } from "react";
import Context from "../context";
import validator from "validator";
import { auth, realTimeDb } from "../firebase";
import { v4 as uuidv4 } from "uuid";

const SignUp = (props) => {
  const { toggleModal } = props;

  const emailRef = useRef(null);
  const fullnameRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const { cometChat, setIsLoading } = useContext(Context);

  const generateAvatar = () => {
    const avatars= [
      'https://data-us.cometchat.io/assets/images/avatars/captainamerica.png',
      'https://data-us.cometchat.io/assets/images/avatars/cyclops.png',
      'https://data-us.cometchat.io/assets/images/avatars/ironman.png',
      'https://data-us.cometchat.io/assets/images/avatars/spiderman.png',
      'https://data-us.cometchat.io/assets/images/avatars/wolverine.png'
    ];
    const avatarPosition = Math.floor(Math.random() * avatars.length);
    return avatars[avatarPosition];
  }

  const isSignupValid = ({ email, fullname, password, confirmPassword }) => {
    if (validator.isEmpty(fullname)) {
      alert("Please input your full name");
      return false;
    }
    if (!validator.isEmail(email)) {
      alert("Please input your email");
      return false;
    }
    if (validator.isEmpty(password) || !validator.isLength(password, {min: 6})) {
      alert("Please input your password. You password must have at least 6 characters");
      return false;
    }
    if (validator.isEmpty(confirmPassword)) {
      alert("Please input your confirm password");
      return false;
    }
    if (password !== confirmPassword) {
      alert("Confirm password and password must be the same");
      return false;
    }
    return true;
  };

  const signup = () => {
    const email = emailRef.current.value;
    const fullname = fullnameRef.current.value;
    const password = passwordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;

    if (isSignupValid({ email, fullname, password, confirmPassword })) {
      setIsLoading(true);
      const userUuid = uuidv4(); 
      const userAvatar = generateAvatar();
      auth.createUserWithEmailAndPassword(email, password).then((userCrendentials) => {
        if (userCrendentials) {
          realTimeDb.ref(`users/${userUuid}`).set({
            id: userUuid,
            email,
            fullname,
            avatar: userAvatar
          }).then(() => {
            alert(`${userCrendentials.user.email} was created successfully! Please sign in with your created account`);
            // cometchat auth key
            const authKey = `${process.env.REACT_APP_COMETCHAT_AUTH_KEY}`;  
            // call cometchat service to register a new account.
            const user = new cometChat.User(userUuid);
            user.setName(fullname);
            user.setAvatar(userAvatar);

            cometChat.createUser(user, authKey).then(
              user => {
                setIsLoading(false);
              },error => {
                setIsLoading(false);
              }
            )
            toggleModal(false);
          });
        }
      }).catch((error) => {
        setIsLoading(false);
        alert(`Cannot create your account, ${email} might be existed, please try again!`);
      }); 
    }
  };

  return (
    <div className="signup">
      <div className="signup__content">
        <div className="signup__container">
          <div className="signup__title">Sign Up</div>
          <div className="signup__close">
            <img
              alt="close"
              onClick={() => toggleModal(false)}
              src="https://static.xx.fbcdn.net/rsrc.php/v3/y2/r/__geKiQnSG-.png"
            />
          </div>
        </div>
        <div className="signup__subtitle"></div>
        <div className="signup__form">
          <input type="text" placeholder="Fullname" ref={fullnameRef} />
          <input type="text" placeholder="Email" ref={emailRef} />
          <input type="password" placeholder="Password" ref={passwordRef} />
          <input
            type="password"
            placeholder="Confirm Password"
            ref={confirmPasswordRef}
          />
          <button className="signup__btn" onClick={signup}>
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
