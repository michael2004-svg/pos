const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

dotenv.config();

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: Number,
    password: String,
    role: String
}, { timestamps: true });

const tableSchema = new mongoose.Schema({
    tableNo: Number,
    status: String,
    seats: Number,
    currentOrder: { type: mongoose.Schema.Types.ObjectId, ref: "Order" }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
const Table = mongoose.model("Table", tableSchema);

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/rpos");
        console.log("✅ Connected to MongoDB");

        await User.deleteMany({});
        await Table.deleteMany({});
        console.log("✅ Cleared existing data");

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("admin123", salt);

        const adminUser = await User.create({
            name: "Admin",
            email: "admin@rpos.com",
            phone: 1234567890,
            password: hashedPassword,
            role: "admin"
        });
        console.log("✅ Admin created: admin@rpos.com / admin123");

        const tables = [];
        for (let i = 1; i <= 10; i++) {
            tables.push({
                tableNo: i,
                seats: i <= 4 ? 2 : i <= 7 ? 4 : 6,
                status: "Available"
            });
        }
        await Table.insertMany(tables);
        console.log(`✅ Created ${tables.length} tables`);

        console.log("\n🎉 Database seeded successfully!");
        console.log("📋 Default Admin Credentials:");
        console.log("   Email: admin@rpos.com");
        console.log("   Password: admin123");

        process.exit(0);
    } catch (error) {
        console.error("❌ Seeding failed:", error.message);
        process.exit(1);
    }
};

seedDatabase();
