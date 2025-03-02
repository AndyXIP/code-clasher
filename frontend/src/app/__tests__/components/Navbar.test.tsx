import React from "react";
import { render, screen, act } from "@testing-library/react";
import Navbar from "../../components/Navbar";
import "@testing-library/jest-dom";

// Mock Supabase client
jest.mock("../../SupabaseClient", () => ({
  supabase: {
    auth: {
      getSession: jest.fn(() => Promise.resolve({ data: { session: null } })), // Simulates logged-out state
      onAuthStateChange: jest.fn(() => ({ data: { session: null } })), // Ensures onAuthStateChange is defined
    },
  },
}));
