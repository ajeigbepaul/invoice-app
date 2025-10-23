// src/app/api/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import UserModel from '@/models/User';
import { validateRegistration } from '@/utils/validation';
import { ApiResponse } from '@/types/api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    // Validate input
    const validation = validateRegistration(email, password, name);
    if (!validation.isValid) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: validation.errors[0].message,
        },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'User with this email already exists',
        },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const user = await UserModel.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      name: name.trim(),
    });

    // Return user data without password
    const userData = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    };

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: userData,
        message: 'Registration successful',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: 'An error occurred during registration',
      },
      { status: 500 }
    );
  }
}