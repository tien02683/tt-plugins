import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const plugins = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/plugins" }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    category: z.string().default("Utilities"),
    summary: z.string(),
    version: z.string().default("1.0.0"),
    compatibility: z.array(z.string()).default(["SketchUp 2023+"]),
    price_type: z.enum(["free", "paid"]).default("free"),
    price_label: z.string().default("Miễn phí"),
    featured_image: z.string().default("/images/plugin-placeholder.svg"),
    gallery: z.array(z.string()).default([]),
    video_url: z.string().optional().default(""),
    video_title: z.string().optional().default("Video demo & Hướng dẫn sử dụng"),
    download_url: z.string().default(""),
    plugin_file: z.string().optional().default(""),
    release_url: z.string().default(""),
    published: z.boolean().default(false),
    featured: z.boolean().default(false),
    updated_at: z.coerce.date().default(new Date("2026-11-09")),
    tags: z.array(z.string()).default([])
  })
});

export const collections = { plugins };
