import { sanityClient } from './client';

// ========================================
// QUERIES
// ========================================

/**
 * Get all services with their details
 */
export async function getAllServices() {
  const query = `*[_type == "service"] | order(name asc) {
    _id,
    name,
    price,
    icon,
    isPopular,
    features,
    ctaText
  }`;

  return await sanityClient.fetch(query);
}

/**
 * Get a specific service by ID
 */
export async function getServiceById(id: string) {
  const query = `*[_type == "service" && _id == $id][0] {
    _id,
    name,
    price,
    icon,
    isPopular,
    features,
    ctaText
  }`;

  return await sanityClient.fetch(query, { id });
}

/**
 * Get all leads (for admin dashboard)
 */
export async function getAllLeads(options?: {
  status?: string;
  limit?: number;
  offset?: number;
}) {
  const { status, limit = 50, offset = 0 } = options || {};

  const statusFilter = status ? `&& status == "${status}"` : '';

  const query = `*[_type == "lead" ${statusFilter}] | order(_createdAt desc) [${offset}...${offset + limit}] {
    _id,
    _createdAt,
    firstName,
    lastName,
    email,
    phone,
    company,
    projectType,
    budget,
    timeline,
    status,
    priority,
    selectedServices[]-> {
      _id,
      name,
      icon
    },
    selectedPack,
    assignedTo,
    estimatedValue
  }`;

  return await sanityClient.fetch(query);
}

/**
 * Get a specific lead by ID
 */
export async function getLeadById(id: string) {
  const query = `*[_type == "lead" && _id == $id][0] {
    _id,
    _createdAt,
    _updatedAt,
    firstName,
    lastName,
    email,
    phone,
    company,
    gdprConsent,
    projectType,
    projectDescription,
    budget,
    timeline,
    attachments,
    selectedServices[]-> {
      _id,
      name,
      icon,
      price
    },
    selectedPack,
    customPackDetails,
    status,
    priority,
    source,
    sessionId,
    utmParams,
    notes,
    assignedTo,
    estimatedValue,
    convertedAt
  }`;

  return await sanityClient.fetch(query, { id });
}

/**
 * Count leads by status
 */
export async function countLeadsByStatus() {
  const query = `{
    "total": count(*[_type == "lead"]),
    "new": count(*[_type == "lead" && status == "new"]),
    "in_progress": count(*[_type == "lead" && status == "in_progress"]),
    "contacted": count(*[_type == "lead" && status == "contacted"]),
    "quoted": count(*[_type == "lead" && status == "quoted"]),
    "converted": count(*[_type == "lead" && status == "converted"]),
    "archived": count(*[_type == "lead" && status == "archived"])
  }`;

  return await sanityClient.fetch(query);
}

/**
 * Search leads by name or email
 */
export async function searchLeads(searchTerm: string) {
  const query = `*[_type == "lead" && (
    firstName match $searchTerm
    || lastName match $searchTerm
    || email match $searchTerm
  )] | order(_createdAt desc) [0...20] {
    _id,
    _createdAt,
    firstName,
    lastName,
    email,
    status,
    projectType
  }`;

  return await sanityClient.fetch(query, { searchTerm: `*${searchTerm}*` });
}
