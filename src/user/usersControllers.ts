import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

const SECRET_KEY = "mnbvcxz";

export const signUp = async (req: any, res: any) => {
  const { name, email, password, ...props } = req.body;

  const salt = await bcrypt.genSaltSync(10);

  const hashedPassword = await bcrypt.hashSync(password, salt);

  const result = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      ...props,
    },
  });
  res.json(result);
};

export const signIn = async (req: any, res: any) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid email is invalid!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, SECRET_KEY, {
      expiresIn: "1h",
    });

    const { name, email: userEmail, phone, id, role } = user;

    res.json({
      message: "Login successfull",
      token,
      user: {
        id,
        name,
        userEmail,
        phone,
        role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong!" });
  }
};

export const getUsers = async (req: any, res: any) => {
  const users = await prisma.user.findMany();
  res.json(users);
};

export const getUserById = async (req: any, res: any) => {
  const { id } = req.params;

  const drafts = await prisma.user.findUnique({
    where: {
      id: Number(id),
    },
  });

  res.json(drafts);
};
