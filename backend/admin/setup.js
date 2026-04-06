const { MongoStore } = require("connect-mongo");

const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Cart = require("../models/Cart");

const setupAdmin = async (app) => {
  // Use dynamic imports since AdminJS packages are ESM only
  const { default: AdminJS } = await import("adminjs");
  const AdminJSExpress = await import("@adminjs/express");
  const AdminJSMongoose = await import("@adminjs/mongoose");

  AdminJS.registerAdapter({
    Database: AdminJSMongoose.Database,
    Resource: AdminJSMongoose.Resource,
  });

  const admin = new AdminJS({
    resources: [
      { resource: User, options: { navigation: "Users" } },
      { resource: Product, options: { navigation: "Store" } },
      { resource: Order, options: { navigation: "Store" } },
      { resource: Cart, options: { navigation: "Store" } },
    ],
    rootPath: "/admin",
    branding: {
      companyName: "DevCart Admin",
      softwareBrothers: false,
    },
  });

  admin.watch();

  const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
    admin,
    {
      authenticate: async (email, password) => {
        if (
          email === process.env.ADMIN_EMAIL &&
          password === process.env.ADMIN_PASSWORD
        ) {
          return { email, role: "admin" };
        }
        return false;
      },
      cookieName: "adminjs",
      cookiePassword: process.env.SESSION_SECRET || "fallback_secret_must_be_changed",
    },
    null,
    {
      store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
      resave: false,
      saveUninitialized: true,
      secret: process.env.SESSION_SECRET || "fallback_secret_must_be_changed",
    }
  );

  app.use(admin.options.rootPath, adminRouter);
  
  console.log(`AdminJS started on http://localhost:${process.env.PORT || 5000}${admin.options.rootPath}`);
};

module.exports = setupAdmin;
