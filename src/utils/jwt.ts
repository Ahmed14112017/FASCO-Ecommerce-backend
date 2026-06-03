import jwt from "jsonwebtoken";

type TokenUser = {
  _id: string;
  role: string;
  name: string;
  email: string;
};

export const generateToken = (user: TokenUser) => {
  const token = jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" },
  );
  return token;
};
