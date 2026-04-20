require("dotenv").config();
const bcrypt = require("bcryptjs");
const { sequelize, User, Checkpoint, Incident, Report } = require("../models");

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });

    const adminPassword = await bcrypt.hash("Admin123!", 10);

    await User.findOrCreate({
      where: { email: "admin@wasel.local" },
      defaults: {
        fullName: "System Admin",
        email: "admin@wasel.local",
        passwordHash: adminPassword,
        role: "ADMIN",
      },
    });

    const userPassword = await bcrypt.hash("Test123!", 10);

    const [testUser] = await User.findOrCreate({
      where: { email: "test@example.com" },
      defaults: {
        fullName: "Test User",
        email: "test@example.com",
        passwordHash: userPassword,
        role: "USER",
      },
    });

    const [checkpoint] = await Checkpoint.findOrCreate({
      where: { name: "Huwwara Checkpoint", region: "Nablus" },
      defaults: {
        name: "Huwwara Checkpoint",
        latitude: 32.122,
        longitude: 35.287,
        region: "Nablus",
        statusCurrent: "DELAYED",
        description: "Heavy congestion during peak hours",
      },
    });

    await Incident.findOrCreate({
      where: {
        title: "Heavy delay near checkpoint",
        region: "Nablus",
      },
      defaults: {
        title: "Heavy delay near checkpoint",
        description: "Traffic congestion reported by field moderator",
        category: "CHECKPOINT_DELAY",
        severity: "MEDIUM",
        status: "OPEN",
        sourceType: "MANUAL",
        locationLat: 32.123,
        locationLng: 35.288,
        region: "Nablus",
        checkpointId: checkpoint.id,
      },
    });

    await Incident.findOrCreate({
      where: {
        title: "Road closure near checkpoint",
        region: "Nablus",
      },
      defaults: {
        title: "Road closure near checkpoint",
        description: "Temporary road closure near the checkpoint area",
        category: "ROAD_CLOSURE",
        severity: "HIGH",
        status: "OPEN",
        sourceType: "MANUAL",
        locationLat: 32.124,
        locationLng: 35.29,
        region: "Nablus",
        checkpointId: checkpoint.id,
      },
    });

    await Report.findOrCreate({
      where: {
        description: "Long waiting line reported by drivers",
        region: "Nablus",
      },
      defaults: {
        userId: testUser.id,
        category: "CHECKPOINT_DELAY",
        description: "Long waiting line reported by drivers",
        latitude: 32.122,
        longitude: 35.287,
        region: "Nablus",
        reportTime: new Date(),
        moderationStatus: "PENDING",
        duplicateScore: 0.1,
        abuseFlag: false,
        confidenceScore: 0.5,
      },
    });

    console.log("Seed data inserted successfully");
    console.log("Admin login: admin@wasel.local / Admin123!");
    console.log("Test user login: test@example.com / Test123!");

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
