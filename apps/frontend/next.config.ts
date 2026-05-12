import type { NextConfig } from "next";
import { createVanillaExtractPlugin } from "@vanilla-extract/next-plugin";

const nextConfig: NextConfig = {};

const withVanillaExtract = createVanillaExtractPlugin();

export default withVanillaExtract(nextConfig);
