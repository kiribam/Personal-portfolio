import type { ProjectCategorySlug } from './projectsNav';

export interface Project {
	id: string;
	title: string;
	summary: string;
	category: ProjectCategorySlug;
	/** Shown on the home page in “Featured work”. */
	featured?: boolean;
	tags?: string[];
	links?: {
		repo?: string;
		demo?: string;
	};
	/** Optional hero/cover for detail page + Open Graph (path under /public). */
	coverImage?: string;
	/** Extra paragraphs on the project detail page (`/projects/detail/<id>/`). */
	detailParagraphs?: string[];
}

/**
 * Central list of portfolio entries. Edit this file as you ship new work.
 * Set `featured: true` on a few highlights for the home page.
 */
export const projects: Project[] = [
	{
		id: 'personal-portfolio',
		title: 'Personal portfolio',
		summary:
			'Static Astro site with shared layout, accessible navigation, CI, optional GCS deploy, and deployment notes for Google Cloud.',
		category: 'web',
		featured: true,
		tags: ['Astro', 'TypeScript', 'GCP'],
		coverImage: '/images/portfolio-cover.svg',
		links: {
			repo: 'https://github.com/kiribam/Personal-portfolio',
		},
		detailParagraphs: [
			'This site is intentionally static: every route is plain HTML, which keeps hosting simple on Cloud Storage and avoids SPA rewrite headaches on a bare bucket.',
			'Projects are data-driven from a single TypeScript module so lists, category pages, and detail views stay in sync. GitHub Actions runs `npm ci` and `npm run build` on every pull request.',
			'When you are ready to go live, set `PUBLIC_SITE_URL` for accurate canonical and Open Graph URLs, then follow DEPLOY.md for bucket sync and HTTPS in front of a backend bucket.',
		],
	},
	{
		id: 'web-dashboard-placeholder',
		title: 'Operations dashboard',
		summary:
			'Replace this entry with a real product: who it served, constraints, your role, and measurable outcomes (latency, adoption, revenue).',
		category: 'web',
		tags: ['React', 'API'],
		links: {},
		detailParagraphs: [
			'Use this template to write a short narrative: problem statement, architecture diagram link, and what you would do differently next time.',
		],
	},
	{
		id: 'data-pipeline-placeholder',
		title: 'Analytics pipeline',
		summary:
			'Replace with a pipeline or model you shipped: data sources, orchestration, evaluation metrics, and how you monitored quality in production.',
		category: 'data',
		tags: ['Python', 'SQL'],
		links: {},
	},
	{
		id: 'oss-library-placeholder',
		title: 'Open source contributions',
		summary:
			'Replace with a library you own or upstream work you drove: link the canonical repo and summarize impact (downloads, dependents, merged RFCs).',
		category: 'open-source',
		tags: ['TypeScript'],
		links: {
			repo: 'https://github.com/kiribam',
		},
	},
];

export function getProjectById(id: string): Project | undefined {
	return projects.find((p) => p.id === id);
}

export function getFeaturedProjects(): Project[] {
	return projects.filter((p) => p.featured);
}

export function getProjectsByCategory(slug: ProjectCategorySlug): Project[] {
	return projects.filter((p) => p.category === slug);
}

export function getAllProjectsSorted(): Project[] {
	return [...projects].sort((a, b) => {
		if (Boolean(b.featured) !== Boolean(a.featured)) return b.featured ? 1 : -1;
		return a.title.localeCompare(b.title);
	});
}
