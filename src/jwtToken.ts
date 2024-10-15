import jwt from 'jsonwebtoken'; // Ensure you have this import

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const accessToken = authHeader && authHeader.split(' ')[1]; // Access token from Authorization header
  const refreshToken = req.headers['refresh-token']; // Refresh token from custom header

  if (!accessToken || !refreshToken) {
    return res.status(401).json({ message: 'Unauthorized: No tokens provided' });
  }

  try {
    // Verify access token
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded; // Attach user information to the request
    return next(); // Proceed if access token is valid

  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      try {
        // Verify the refresh token
        const decodedRefresh = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        
        // Generate new access token
        const newAccessToken = generateAccessToken(decodedRefresh.user); // Assuming user ID is in the payload
        
        // Set both tokens as cookies
        res.cookie('accessToken', newAccessToken, {
          httpOnly: true,
          sameSite: 'strict',
        });

        res.cookie('refreshToken', refreshToken, { // Send back the refresh token as well
          httpOnly: true,
          sameSite: 'strict',
        });

        // Optionally, you can return a response or proceed to the next middleware
        return res.status(200).json({ accessToken: newAccessToken, refreshToken });
      } catch (refreshErr) {
        console.error(refreshErr);
        return res.status(401).json({ message: 'Unauthorized: Invalid refresh token' });
      }
    } else {
      return res.status(403).json({ message: 'Forbidden' });
    }
  }
};

function generateAccessToken(userId) {
  return jwt.sign({ user: userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '2h' });
}

export default verifyToken;



