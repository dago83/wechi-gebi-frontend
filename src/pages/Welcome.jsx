import { Link } from "react-router-dom";

function Welcome() {
  return (
    <div className="text-center mt-5">
      <h2>Welcome to Wechi Gebi (ወጪ ገቢ)</h2>
      <p className="mt-3">Please login or register to continue.</p>

      <div className="mt-4">
        <Link to="/login" className="btn btn-primary mx-2">
          Login
        </Link>

        <Link to="/register" className="btn btn-success mx-2">
          Register
        </Link>
      </div>
    </div>
  );
}

export default Welcome;
