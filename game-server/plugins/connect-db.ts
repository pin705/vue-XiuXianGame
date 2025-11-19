import { defineNitroPlugin } from "nitro/~internal/runtime/plugin"
import { connectDB } from '../utils/db';

export default defineNitroPlugin(async () => {
  try {
    await connectDB();
    console.log('✓ Database plugin loaded');
  } catch (error) {
    console.error('✗ Database plugin error:', error);
  }
})
