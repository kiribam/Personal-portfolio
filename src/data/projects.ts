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
			'Static Astro site with shared layout, accessible navigation, CI, and GCP-oriented deployment notes.',
		category: 'web',
		featured: true,
		tags: ['Astro', 'TypeScript', 'GCP'],
		links: {
			repo: 'https://github.com/kiribam/Personal-portfolio',
		},
	},
	{
		id: 'web-dashboard-placeholder',
		title: 'Dashboard (sample)',
		summary:
			'Placeholder for a data-heavy UI or admin tool—replace with a real case study: problem, stack, outcome.',
		category: 'web',
		tags: ['React', 'API'],
		links: {},
	},
	{
		id: 'data-pipeline-placeholder',
		title: 'Analytics pipeline (sample)',
		summary:
			'Placeholder for ETL, modeling, or evaluation work. Link notebooks, papers, or production metrics when ready.',
		category: 'data',
		tags: ['Python', 'SQL'],
		links: {},
	},
	{
		id: 'oss-library-placeholder',
		title: 'Open source utility (sample)',
		summary:
			'Placeholder for a library or upstream contributions. Summarize impact: users, downloads, or merged PRs.',
		category: 'open-source',
		tags: ['TypeScript'],
		links: {
			repo: 'https://github.com/kiribam',
		},
	},
];

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
