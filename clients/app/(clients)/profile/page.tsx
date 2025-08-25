"use client";

import React, { useState } from "react";
import Image from "next/image"; // ✅ use Next.js Image

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>({
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    avatarUrl: "https://via.placeholder.com/100",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Profile updated!");
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          {profile.avatarUrl && (
            <Image
              src={profile.avatarUrl}
              alt="Avatar"
              width={80}
              height={80}
              className="w-20 h-20 rounded-full mb-4 object-cover"
            />
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            className="mt-1 w-full border rounded-md px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            className="mt-1 w-full border rounded-md px-3 py-2"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
