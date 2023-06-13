import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDir = path.join(process.cwd(), 'posts');

export function getSortedPostData() {
  const fileNames = fs.readdirSync(postsDir);
  const allPostsData = fileNames.map((d) => {
    const id = d.replace(/\.md$/, '');

    const fullPath = path.join(postsDir, d);
    const fileContent = fs.readFileSync(fullPath, 'utf8');

    const matterResult = matter(fileContent);

    return {
      id,
      ...matterResult.data,
    };
  });

  return allPostsData.sort((a, b) => {
    if (a.date < b.date) return 1;
    if (a.date > b.date) return -1;
  });
}

export const getAllPostIds = () => {
  const fileNames = fs.readdirSync(postsDir);
  return fileNames.map((d) => {
    return {
      params: {
        id: d.replace(/\.md$/, ''),
      },
    };
  });
};

export const getPostData = async (id) => {
  const fullPath = path.join(postsDir, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  const matterResult = matter(fileContents);

  const processedContent = await remark().use(html).process(matterResult.content);
  const contentHtml = processedContent.toString();

  return {
    id,
    contentHtml,
    ...matterResult.data,
  };
};
