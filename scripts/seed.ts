import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import InvoiceModel from "@/models/Invoice";
import UserModel from "@/models/User";
import invoiceData from "@/data.json";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

async function seed() {
  try {
    console.log("🌱 Starting seed process...");

    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI as string);
    console.log("✅ Connected to MongoDB");

    // Create or find test user
    let testUser = await UserModel.findOne({ email: "seed@test.com" });

    if (!testUser) {
      const hashedPassword = await bcrypt.hash("password123", 10);
      testUser = await UserModel.create({
        name: "Seed User",
        email: "seed@test.com",
        password: hashedPassword,
      });
      console.log("✅ Created test user:", testUser.email);
    } else {
      console.log("✅ Using existing test user:", testUser.email);
    }

    // Clear existing invoices (optional - comment out if you want to keep them)
    await InvoiceModel.deleteMany({ userId: testUser._id.toString() });
    console.log("🗑️  Cleared existing invoices for test user");

    // Transform and seed invoices
    const invoicesToInsert = invoiceData
      .map((invoice: any) => ({
        invoiceId: invoice.id,
        createdAt: invoice.createdAt,
        paymentDue: invoice.paymentDue,
        description: invoice.description,
        paymentTerms: invoice.paymentTerms,
        clientName: invoice.clientName,
        clientEmail: invoice.clientEmail,
        status: invoice.status,
        senderAddress: invoice.senderAddress,
        clientAddress: invoice.clientAddress,
        items: invoice.items,
        total: invoice.total,
        userId: testUser._id.toString(),
      }))
      .filter(
        (invoice) =>
          invoice.clientEmail &&
          invoice.clientAddress.street &&
          invoice.clientAddress.city &&
          invoice.clientAddress.postCode &&
          invoice.clientAddress.country
      );

    const skippedCount = invoiceData.length - invoicesToInsert.length;
    if (skippedCount > 0) {
      console.log(
        `⏭️  Skipped ${skippedCount} invoice(s) with incomplete data`
      );
    }

    const result = await InvoiceModel.insertMany(invoicesToInsert);
    console.log(`✅ Seeded ${result.length} invoice(s)`);

    // Summary
    console.log("\n📋 Seed Summary:");
    console.log(`   User ID: ${testUser._id}`);
    console.log(`   User Email: ${testUser.email}`);
    console.log(`   Invoices Seeded: ${result.length}`);
    console.log("\n✨ Seeding complete!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
}

seed();
