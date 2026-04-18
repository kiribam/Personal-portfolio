/** Subcategories shown under Projects in the site nav and on /projects/. */
export const projectCategories = [
	{ slug: 'web', label: 'Web apps', href: '/projects/web/' },
	{ slug: 'data', label: 'Data & ML', href: '/projects/data/' },
	{ slug: 'open-source', label: 'Open source', href: '/projects/open-source/' },
] as const;

export type ProjectCategorySlug = (typeof projectCategories)[number]['slug'];
