#!/usr/bin/env node
// scripts/agent-publish.mjs — CLI Cổng Xuất Bản Tự Động Dành Cho Agent
// Ví dụ:
//   node scripts/agent-publish.mjs --title "TT Smart Mesh" --version "1.0.0" --category "Geometry" --summary "Tối ưu lưới 3D" --rbz "D:/TT_SmartMesh.rbz"

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const PLUGINS_DIR = path.join(ROOT_DIR, 'src', 'content', 'plugins');
const UPLOADS_DIR = path.join(ROOT_DIR, 'public', 'uploads');
const IMAGES_DIR = path.join(ROOT_DIR, 'public', 'images');

// Đọc arguments
const args = process.argv.slice(2);
const options = {};

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg.startsWith('--')) {
    const key = arg.slice(2);
    const next = args[i + 1];
    if (next && !next.startsWith('--')) {
      options[key] = next;
      i++;
    } else {
      options[key] = true;
    }
  }
}

// Nếu truyền file config json
if (options.config) {
  try {
    const configData = JSON.parse(fs.readFileSync(options.config, 'utf8'));
    Object.assign(options, configData);
  } catch (err) {
    console.error(JSON.stringify({ success: false, error: `Lỗi đọc file config: ${err.message}` }));
    process.exit(1);
  }
}

// Kiểm tra các trường bắt buộc
const title = options.title || options.name;
if (!title) {
  console.error(JSON.stringify({
    success: false,
    error: 'Thiếu tiêu đề plugin (--title "Tên Plugin")'
  }));
  process.exit(1);
}

// Tự sinh slug
let rawSlug = (options.slug || title.toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, ''))
  .replace(/^tt-/, '');

const slug = `tt-${rawSlug}`;

const category = options.category || 'Utilities';
const summary = options.summary || `${title} dành cho SketchUp.`;
const version = options.version || '1.0.0';
const price_type = options.price_type || (options.price === 'paid' ? 'paid' : 'free');
const price_label = options.price_label || (price_type === 'paid' ? 'Bản Pro' : 'Miễn phí');
const compatibility = options.compatibility ? (Array.isArray(options.compatibility) ? options.compatibility : options.compatibility.split(',').map(s => s.trim())) : ['SketchUp 2023', 'SketchUp 2024', 'SketchUp 2026', 'SketchUp 2027'];
const published = options.published !== false && options.published !== 'false';
const featured = options.featured === true || options.featured === 'true';
const today = new Date().toISOString().split('T')[0];

// Xử lý file .RBZ
let download_url = options.download_url || '';
let plugin_file = '';
if (options.rbz && fs.existsSync(options.rbz)) {
  const rbzFilename = path.basename(options.rbz);
  if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  const destRbz = path.join(UPLOADS_DIR, rbzFilename);
  fs.copyFileSync(options.rbz, destRbz);
  plugin_file = rbzFilename;
  if (!download_url) download_url = `/uploads/${rbzFilename}`;
}

// Xử lý ảnh đại diện
let featured_image = options.featured_image || options.cover || '/images/plugin-placeholder.svg';
if (options.cover && fs.existsSync(options.cover)) {
  const pluginImgDir = path.join(IMAGES_DIR, slug);
  if (!fs.existsSync(pluginImgDir)) fs.mkdirSync(pluginImgDir, { recursive: true });
  const imgFilename = path.basename(options.cover);
  const destImg = path.join(pluginImgDir, imgFilename);
  fs.copyFileSync(options.cover, destImg);
  featured_image = `/images/${slug}/${imgFilename}`;
}

// Gallery
const gallery = options.gallery ? (Array.isArray(options.gallery) ? options.gallery : options.gallery.split(',').map(s => s.trim())) : [];
const tags = options.tags ? (Array.isArray(options.tags) ? options.tags : options.tags.split(',').map(s => s.trim())) : [category, 'SketchUp 2027'];
const video_url = options.video_url || '';
const video_title = options.video_title || 'Video demo & Hướng dẫn sử dụng';
const release_url = options.release_url || '';
const body = options.body || options.content || `## Giới thiệu ${title}\n\nThông tin chi tiết về tính năng và hướng dẫn cài đặt sẽ được cập nhật tại đây.`;

// Sinh Markdown chuẩn
let md = `---\n`;
md += `title: "${title.replace(/"/g, '\\"')}"\n`;
md += `slug: "${slug}"\n`;
md += `category: "${category}"\n`;
md += `summary: "${summary.replace(/"/g, '\\"')}"\n`;
md += `version: "${version}"\n`;
md += `compatibility:\n`;
compatibility.forEach((c) => { md += `  - "${c}"\n`; });
md += `price_type: "${price_type}"\n`;
md += `price_label: "${price_label.replace(/"/g, '\\"')}"\n`;
md += `featured_image: "${featured_image}"\n`;
if (gallery.length > 0) {
  md += `gallery:\n`;
  gallery.forEach((g) => { md += `  - "${g}"\n`; });
} else {
  md += `gallery: []\n`;
}
if (video_url) {
  md += `video_url: "${video_url}"\n`;
  md += `video_title: "${video_title.replace(/"/g, '\\"')}"\n`;
}
md += `download_url: "${download_url}"\n`;
if (plugin_file) {
  md += `plugin_file: "${plugin_file}"\n`;
}
md += `release_url: "${release_url}"\n`;
md += `published: ${published}\n`;
md += `featured: ${featured}\n`;
md += `updated_at: ${today}\n`;
if (tags.length > 0) {
  md += `tags:\n`;
  tags.forEach((t) => { md += `  - "${t.replace(/"/g, '\\"')}"\n`; });
} else {
  md += `tags: []\n`;
}
md += `---\n\n${body}\n`;

if (!fs.existsSync(PLUGINS_DIR)) fs.mkdirSync(PLUGINS_DIR, { recursive: true });
const targetFile = path.join(PLUGINS_DIR, `${slug}.md`);
fs.writeFileSync(targetFile, md, 'utf8');

const result = {
  success: true,
  slug,
  title,
  version,
  category,
  markdown_file: `src/content/plugins/${slug}.md`,
  absolute_path: targetFile,
  download_url,
  featured_image
};

console.log(JSON.stringify(result, null, 2));
