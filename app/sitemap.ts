import { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://maktabi.app';

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/offices`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/coworking`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/startup-tank`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/map`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/coworking/apply`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${baseUrl}/list-property`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${baseUrl}/login`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/register`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.3,
        },
    ];

    // Fetch approved properties
    const properties = await prisma.property.findMany({
        where: { status: 'APPROVED' },
        select: {
            id: true,
            type: true,
            updatedAt: true,
        },
    });

    // Dynamic property pages
    const propertyPages: MetadataRoute.Sitemap = properties.map((property) => ({
        url: `${baseUrl}/${property.type === 'OFFICE' ? 'offices' : 'coworking'}/${property.id}`,
        lastModified: property.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.8,
    }));

    // Fetch approved startups
    const startups = await prisma.startup.findMany({
        where: { status: 'APPROVED' },
        select: {
            id: true,
            updatedAt: true,
        },
    });

    // Dynamic startup pages (if you have individual startup pages)
    const startupPages: MetadataRoute.Sitemap = startups.map((startup) => ({
        url: `${baseUrl}/startup-tank/${startup.id}`,
        lastModified: startup.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.7,
    }));

    return [...staticPages, ...propertyPages, ...startupPages];
}